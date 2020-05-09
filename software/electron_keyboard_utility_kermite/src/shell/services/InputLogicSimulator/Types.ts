import {
  IAssignEntry_Single,
  IHoldFunctionInvocationMode
} from '~defs/ProfileData';

export type IKeyAssignsSet_Single = {
  [address: string]: IAssignEntry_Single | undefined;
  // [address: string]: IAssignEntry | undefined;
};
export type LayerInvocationMode = IHoldFunctionInvocationMode;

export type TAdhocShift = 'down' | 'up' | undefined;

export interface IVirtualStroke {
  keyCode: number;
  adhocShift?: TAdhocShift;
  attachedModifierKeyCodes?: number[];
}

export type IStrokeEmitterFunction = (ev: {
  keyCode: number;
  isDown: boolean;
}) => void;

export type LogicalKeyAction = { rcode: string } & (
  | {
      type: 'keyInput';
      stroke: IVirtualStroke;
      // immediateRelease: boolean;
    }
  | {
      type: 'holdLayer';
      targetLayerId: string;
      layerInvocationMode: LayerInvocationMode;
    }
  | {
      type: 'holdModifier';
      modifierKeyCode: number;
      isOneShot: boolean;
    }
);

export interface IModelKeyAssignsProvider {
  keyAssigns: IKeyAssignsSet_Single;
  keyUnitIdTable: { [KeyIndex: number]: string };
}

export interface LayerState {
  holdLayerId: string;
  modalLayerId: string;
  oneshotLayerId: string;
  oneshotModifierKeyCode: number | undefined;
}
