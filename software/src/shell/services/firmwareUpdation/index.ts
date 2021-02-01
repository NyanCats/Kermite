import { projectResourceInfoProvider } from '~/shell/projects';
import { ComPortsMonitor } from './ComPortsMonitor';
import { FlashCommander } from './FlashCommander';

// 仮想COMポートでProMicroのブートローダ(Caterina)と通信しファームウェアを書き込む
// 仮想COMポートの列挙や出現監視も行う
export class FirmwareUpdationService {
  private comPortsMonitor = new ComPortsMonitor();

  readonly comPortPlugEvents = this.comPortsMonitor.comPortPlugEvents;

  async writeFirmware(
    projectId: string,
    comPortName: string,
  ): Promise<'ok' | string> {
    const hexFilePath = await projectResourceInfoProvider.loadProjectFirmwareFile(
      projectId,
    );

    if (!hexFilePath) {
      return `cannot find firmware`;
    }

    const flashResult = await FlashCommander.uploadFirmware(
      hexFilePath,
      comPortName,
    );
    if (flashResult !== 'ok') {
      console.log(`firmwre upload error`);
    }
    console.log(flashResult);
    return flashResult;
  }

  initialize() {
    this.comPortsMonitor.initializeTicker();
  }

  terminate() {
    this.comPortsMonitor.terminateTicker();
  }
}
