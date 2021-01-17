import { IKeyboardShape } from '~/shared';
import { models } from '~/ui-root/models';
import {
  IKeyUnitCardPartViewModel,
  makeKeyUnitCardsPartViewModel,
} from '~/ui-root/viewModels/KeyUnitCard/KeyUnitCardsPartViewModel';

export interface IWidgetKeyboardViewViewModel {
  keyboardShape: IKeyboardShape;
  cardsPartVM: IKeyUnitCardPartViewModel;
}

export interface IWidgetMainPageViewModel {
  isWindowActive: boolean;
  keyboardVM: IWidgetKeyboardViewViewModel;
  onOpenButton(): void;
}

export function makeWidgetMainPageViewModel(): IWidgetMainPageViewModel {
  return {
    isWindowActive: models.siteModel.isWindowActive,
    keyboardVM: {
      keyboardShape: models.editorModel.profileData.keyboardShape,
      cardsPartVM: makeKeyUnitCardsPartViewModel(false, models),
    },
    onOpenButton() {
      models.siteModel.setWidgetMode(false);
    },
  };
}
