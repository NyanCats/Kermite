import { copyObjectProps } from '~/shared';

export type PagePaths =
  | '/'
  | '/editor'
  | '/layouter'
  | '/shapePreview'
  | '/firmwareUpdation'
  | '/presetBrowser'
  | '/presetBrowser2'
  | '/settings'
  | '/widget';

export interface IUiSettings {
  showTestInputArea: boolean;
  showLayersDynamic: boolean;
  showLayerDefaultAssign: boolean;
  siteDpiScale: number;
  showGlobalHint: boolean;
  integrateUserPresetHub: boolean;
}

const defaultUiSettings: IUiSettings = {
  showTestInputArea: false,
  showLayersDynamic: false,
  showLayerDefaultAssign: false,
  siteDpiScale: 1.0,
  showGlobalHint: true,
  integrateUserPresetHub: false,
};

export interface IUiStatus {
  profileConfigModalVisible: boolean;
  isLoading: boolean;
}

const defaultUiStatus: IUiStatus = {
  profileConfigModalVisible: false,
  isLoading: false,
};

export class UiStatusModel {
  settings: IUiSettings = defaultUiSettings;

  readonly status: IUiStatus = defaultUiStatus;

  initialize() {
    const settingsText = localStorage.getItem('uiSettings');
    if (settingsText) {
      const obj = JSON.parse(settingsText);
      copyObjectProps(this.settings, obj);
    }
  }

  save() {
    const settingsText = JSON.stringify(this.settings);
    localStorage.setItem('uiSettings', settingsText);
  }

  stopLiveMode() {
    this.settings.showLayersDynamic = false;
  }

  setLoading() {
    this.status.isLoading = true;
  }

  clearLoading() {
    this.status.isLoading = false;
  }

  finalize() {
    this.save();
  }
}

export const uiStatusModel = new UiStatusModel();
