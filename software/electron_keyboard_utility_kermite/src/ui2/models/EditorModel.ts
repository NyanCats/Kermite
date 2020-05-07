import {
  fallbackProfileData,
  IProfileData,
  IAssignEntry,
  IAssignOperation,
  IProfileAssignType
} from '~/defs/ProfileData';
import {
  duplicateObjectByJsonStringifyParse,
  compareObjectByJsonStringify
} from '~funcs/Utils';
import { changeProfileDataAssignType } from './ProfileDataHelper';

export type IDualModeEditTargetOperationSig = 'pri' | 'sec';
export type IDualModeOperationPath = 'primaryOp' | 'secondaryOp';

export class EditorModel {
  //state

  loadedPorfileData: IProfileData = fallbackProfileData;
  profileData: IProfileData = fallbackProfileData;
  currentLayerId: string = '';
  currentKeyUnitId: string = '';
  slotAddress: string = '';
  dualModeEditTargetOperationSig: IDualModeEditTargetOperationSig = 'pri';

  //getters

  private get profileAssignType(): IProfileAssignType {
    return this.profileData.assignType;
  }

  get isDualMode() {
    return this.profileAssignType === 'dual';
  }

  get isSlotSelected() {
    const { currentLayerId, currentKeyUnitId } = this;
    return !!(currentLayerId && currentKeyUnitId);
  }

  private get assignEntry() {
    return this.profileData.assigns[this.slotAddress];
  }

  get layers() {
    return this.profileData.layers;
  }

  get keyPositions() {
    return this.profileData.keyboardShape.keyUnits;
  }

  get bodyPathMarkupText() {
    return this.profileData.keyboardShape.bodyPathMarkupText;
  }

  isLayerCurrent = (layerId: string) => {
    return this.currentLayerId === layerId;
  };

  isKeyUnitCurrent = (keyUnitId: string) => {
    return this.currentKeyUnitId === keyUnitId;
  };

  getAssignForKeyUnit = (keyUnitId: string) => {
    const curLayerId = this.currentLayerId;
    return this.profileData.assigns[`${curLayerId}.${keyUnitId}`];
  };

  private get dualModeOperationPath(): IDualModeOperationPath {
    if (this.dualModeEditTargetOperationSig === 'pri') {
      return 'primaryOp';
    } else {
      return 'secondaryOp';
    }
  }

  get editOperation(): IAssignOperation | undefined {
    const assign = this.assignEntry;
    if (assign?.type === 'single') {
      return assign.op;
    }
    if (assign?.type === 'dual') {
      return assign[this.dualModeOperationPath];
    }
    return undefined;
  }

  checkDirty(): boolean {
    return !compareObjectByJsonStringify(
      this.loadedPorfileData,
      this.profileData
    );
  }

  //mutations

  loadProfileData = (profileData: IProfileData) => {
    this.loadedPorfileData = profileData;
    this.profileData = duplicateObjectByJsonStringifyParse(profileData);
    this.currentLayerId = profileData.layers[0].layerId;
  };

  private updateEditAssignSlot = () => {
    const { currentLayerId, currentKeyUnitId } = this;
    this.slotAddress = `${currentLayerId}.${currentKeyUnitId}`;
  };

  setCurrentLayerId = (layerId: string) => {
    this.currentLayerId = layerId;
    this.updateEditAssignSlot();
  };

  setCurrentKeyUnitId = (keyUnitId: string) => {
    this.currentKeyUnitId = keyUnitId;
    this.updateEditAssignSlot();
  };

  setDualModeEditTargetOperationSig = (
    sig: IDualModeEditTargetOperationSig
  ) => {
    this.dualModeEditTargetOperationSig = sig;
  };

  clearAssignSlotSelection = () => {
    this.setCurrentKeyUnitId('');
  };

  writeAssignEntry = (assign: IAssignEntry) => {
    this.profileData.assigns[this.slotAddress] = assign;
  };

  writeEditOperation = (op: IAssignOperation) => {
    const assign = this.assignEntry;
    if (this.profileAssignType === 'single') {
      if (assign?.type === 'single') {
        assign.op = op;
      } else {
        this.writeAssignEntry({ type: 'single', op });
      }
    }
    if (this.profileAssignType === 'dual') {
      if (assign?.type === 'dual') {
        assign[this.dualModeOperationPath] = op;
      } else {
        this.writeAssignEntry({
          type: 'dual',
          [this.dualModeOperationPath]: op
        });
      }
    }
  };

  changeProfileAssignType = (dstAssignType: IProfileAssignType) => {
    this.profileData = changeProfileDataAssignType(
      this.profileData,
      dstAssignType
    );
  };
}
