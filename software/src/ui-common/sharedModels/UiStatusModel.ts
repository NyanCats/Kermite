import { copyObjectProps } from '~/shared';
import { appUi } from '~/ui-common';

export type PageSignature =
  | 'editor'
  | 'layouter'
  | 'shapePreview'
  | 'firmwareUpdation'
  | 'presetBrowser'
  | 'heatmap'
  | 'settings';

export interface IUiSettings {
  showTestInputArea: boolean;
  page: PageSignature;
  shapeViewProjectSig: string;
  shapeViewLayoutName: string;
  shapeViewShowKeyId: boolean;
  shapeViewShowKeyIndex: boolean;
  shapeViewShowBoundingBox: boolean;
  showLayersDynamic: boolean;
  showLayerDefaultAssign: boolean;
}

const defaultUiSettings: IUiSettings = {
  showTestInputArea: false,
  page: 'editor',
  shapeViewProjectSig: '',
  shapeViewLayoutName: '',
  shapeViewShowKeyId: false,
  shapeViewShowKeyIndex: false,
  shapeViewShowBoundingBox: false,
  showLayersDynamic: false,
  showLayerDefaultAssign: false,
};

export interface IUiStatus {
  profileConfigModalVisible: boolean;
}

const defaultUiStatus: IUiStatus = {
  profileConfigModalVisible: false,
};

export class UiStatusModel {
  readonly settings: IUiSettings = defaultUiSettings;

  readonly status: IUiStatus = defaultUiStatus;

  initialize() {
    const settingsText = localStorage.getItem('uiSettings');
    if (settingsText) {
      const settings = JSON.parse(settingsText);
      copyObjectProps(this.settings, settings);
    }
    if (!appUi.isDevelopment || !this.settings.page) {
      this.settings.page = 'editor';
    }
  }

  navigateTo(page: PageSignature) {
    this.settings.page = page;
  }

  save() {
    const settingsText = JSON.stringify(this.settings);
    localStorage.setItem('uiSettings', settingsText);
  }

  finalize() {
    this.save();
  }
}

export const uiStatusModel = new UiStatusModel();
