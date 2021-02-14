import {
  fallbackProfileData,
  generateNumberSequence,
  IntervalTimerWrapper,
  IProfileManagerStatus,
  IRealtimeKeyboardEvent,
} from '~/shared';
import { KeyboardConfigProvider } from '~/shell/services/config/KeyboardConfigProvider';
import { KeyboardDeviceService } from '~/shell/services/device/KeyboardDevice';
import { ProfileManager } from '~/shell/services/profile/ProfileManager';
import { getKeyboardCoreLogicInterface } from './DeviceCoreLogicSimulator2_Dual';
import { makeKeyAssignsConfigStorageData } from './ProfileDataBinaryPacker';

function compareArray(ar0: any[], ar1: any[]): boolean {
  return (
    ar0.length === ar1.length &&
    generateNumberSequence(ar0.length).every((i) => ar0[i] === ar1[i])
  );
}

function createTimeIntervalCounter() {
  let prevTick = Date.now();
  return () => {
    const tick = Date.now();
    const elapsedMs = tick - prevTick;
    prevTick = tick;
    return elapsedMs;
  };
}

function copyBytes(dst: number[], src: number[], len: number) {
  for (let i = 0; i < len; i++) {
    dst[i] = src[i];
  }
}

class ConfigDataStorage {
  readonly StorageBufCapacity = 1024;
  storageBuf: number[] = Array(this.StorageBufCapacity).fill(0);

  writeConfigStorageData(bytes: number[]) {
    const len = bytes.length;
    if (len < this.StorageBufCapacity) {
      this.storageBuf.fill(0);
      copyBytes(this.storageBuf, bytes, len);
    }
  }

  readByte(addr: number) {
    return this.storageBuf[addr];
  }
}

export class InputLogicSimulatorD {
  private CL = getKeyboardCoreLogicInterface();
  private tickerTimer = new IntervalTimerWrapper();
  private isSideBranMode: boolean = false;
  private configDataStorage = new ConfigDataStorage();

  private layerActiveFlags: number = 0;
  private hidReportBytes: number[] = new Array(8).fill(0);

  private tickUpdator = createTimeIntervalCounter();

  constructor(
    private profileManager: ProfileManager,
    private keyboardConfigProvider: KeyboardConfigProvider,
    private deviceService: KeyboardDeviceService,
  ) {}

  private onRealtimeKeyboardEvent = (event: IRealtimeKeyboardEvent) => {
    if (event.type === 'keyStateChanged') {
      const { keyIndex, isDown } = event;
      this.CL.keyboardCoreLogic_issuePhysicalKeyStateChanged(keyIndex, isDown);
    }
  };

  processTicker = () => {
    const elapsedMs = this.tickUpdator();
    this.CL.keyboardCoreLogic_processTicker(elapsedMs);

    if (this.isSideBranMode) {
      const report = this.CL.keyboardCoreLogic_getOutputHidReportBytes();
      if (!compareArray(this.hidReportBytes, report)) {
        this.deviceService.writeSideBrainHidReport(report);
        this.hidReportBytes = report.slice(0);
      }
      const newLayerActiveFlags = this.CL.keyboardCoreLogic_getLayerActiveFlags();
      if (newLayerActiveFlags !== this.layerActiveFlags) {
        this.deviceService.emitRealtimeEventFromSimulator({
          type: 'layerChanged',
          layerActiveFlags: newLayerActiveFlags,
        });
        this.layerActiveFlags = newLayerActiveFlags;
      }
      const assignHitResult = this.CL.keyboardCoreLogic_peekAssignHitResult();
      if (assignHitResult !== 0) {
        const keyIndex = assignHitResult & 0xff;
        const layerIndex = (assignHitResult >> 8) & 0x0f;
        const prioritySpec = (assignHitResult >> 12) & 0x03;
        this.deviceService.emitRealtimeEventFromSimulator({
          type: 'assignHit',
          layerIndex,
          keyIndex,
          prioritySpec,
        });
      }
    }
  };

  private updateSourceSetup = () => {
    const config = this.keyboardConfigProvider.getKeyboardConfig();
    const isSideBrainMode = config.behaviorMode === 'SideBrain';
    if (this.isSideBranMode !== isSideBrainMode) {
      console.log({ isSideBrainMode });
      this.deviceService.setSideBrainMode(isSideBrainMode);
      this.isSideBranMode = isSideBrainMode;
    }

    const prof = this.profileManager.getCurrentProfile() || fallbackProfileData;
    const layout = this.keyboardConfigProvider.getKeyboardConfig()
      .layoutStandard;

    console.log(`updateSourceSetup`, { config, prof, layout });
    const bytes = makeKeyAssignsConfigStorageData(prof, layout);
    this.configDataStorage.writeConfigStorageData(bytes);
    this.CL.keyboardCoreLogic_initialize();
    this.CL.keyboardCoreLogic_setAssignStorageReaderFunc((addr) =>
      this.configDataStorage.readByte(addr),
    );
  };

  private onProfileStatusChanged = (
    changedStatus: Partial<IProfileManagerStatus>,
  ) => {
    if (changedStatus.loadedProfileData) {
      this.updateSourceSetup();
    }
  };

  initialize() {
    this.profileManager.statusEventPort.subscribe(this.onProfileStatusChanged);
    this.keyboardConfigProvider.internal_changedNotifier.subscribe(
      this.updateSourceSetup,
    );
    this.deviceService.realtimeEventPort.subscribe(
      this.onRealtimeKeyboardEvent,
    );
    this.tickerTimer.start(this.processTicker, 5);
    this.updateSourceSetup();
  }

  terminate() {
    this.profileManager.statusEventPort.unsubscribe(
      this.onProfileStatusChanged,
    );
    this.keyboardConfigProvider.internal_changedNotifier.unsubscribe(
      this.updateSourceSetup,
    );
    this.deviceService.realtimeEventPort.unsubscribe(
      this.onRealtimeKeyboardEvent,
    );
    if (this.isSideBranMode) {
      this.deviceService.setSideBrainMode(false);
      this.isSideBranMode = false;
    }
    this.tickerTimer.stop();
  }
}
