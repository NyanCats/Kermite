import { backendAgent } from '../core/ipc';
import { IAppWindowEvent } from '~defs/IpcContract';
import { appUi } from '../core/appUi';

export class SiteModel {
  private _isWidgetMode: boolean = false;
  private _isWindowActive: boolean = true;
  // private _isDevelopment: boolean = false;

  get isWidgetMode() {
    return this._isWidgetMode;
  }

  get isWindowActive() {
    return this._isWindowActive;
  }

  // get isDevelopment() {
  //   //バックエンドから環境変数を取得する場合、グローバルスコープで参照したり、
  //   //バックエンドから値が帰ってくる前に参照すると正しい値が得られない問題がある
  //   // return this._isDevelopment;
  //   //代替としてlocation.protocolでデバッグ実行中かを判定
  //   return location.protocol === 'http:';
  //   //todo: preload.jsでBE-->FEに環境変数を受け渡す?
  // }
  //-->appUiに移動

  setWidgetMode = (isWidgetMode: boolean) => {
    this._isWidgetMode = isWidgetMode;
    backendAgent.widgetModeChanged(isWidgetMode);
  };

  private onAppWindowEvents = (ev: IAppWindowEvent) => {
    if (ev.activeChanged !== undefined) {
      this._isWindowActive = ev.activeChanged;
      appUi.rerender();
    }
  };

  // private async loadEnvironmenConfig() {
  //   const env = await backendAgent.getEnvironmentConfig();
  //   // this._isDevelopment = env.isDevelopment;
  // }

  initialize() {
    backendAgent.appWindowEvents.subscribe(this.onAppWindowEvents);
    //await this.loadEnvironmenConfig();
  }

  finalize() {
    backendAgent.appWindowEvents.unsubscribe(this.onAppWindowEvents);
  }
}
