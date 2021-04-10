import { appUi, useLocal } from '~/ui-common';
import { uiStatusModel } from '~/ui-common/sharedModels/UiStatusModel';
import { useLanguageSelectionModel } from '~/ui-root/models/LanguageSelectionModel';
import { useThemeSelectionModel } from '~/ui-root/models/ThemeSelectionModel';

export interface IGlobalMenuItem {
  key: string;
  text: string;
  handler: () => void;
  active: boolean;
}

function createMenuItems(): IGlobalMenuItem[] {
  const { settings } = uiStatusModel;
  const themeSelectionModel = useThemeSelectionModel();
  const languageSelectionModel = useLanguageSelectionModel();

  const menuItems: IGlobalMenuItem[] = [
    {
      key: 'miShowInputArea',
      text: 'Show test input area',
      handler() {
        settings.showTestInputArea = !settings.showTestInputArea;
      },
      active: settings.showTestInputArea,
    },
    {
      key: 'miThemeLight',
      text: 'Light Theme',
      handler() {
        themeSelectionModel.changeTheme('light');
      },
      active: themeSelectionModel.currentThemeKey === 'light',
    },
    {
      key: 'miThemeDark',
      text: 'Dark Theme',
      handler() {
        themeSelectionModel.changeTheme('dark');
      },
      active: themeSelectionModel.currentThemeKey === 'dark',
    },

    {
      key: 'miLanguageEnglish',
      text: 'English',
      handler() {
        languageSelectionModel.changeLanguage('english');
      },
      active: languageSelectionModel.currrentLanguage === 'english',
    },
    {
      key: 'miLanguageJapanese',
      text: 'Japanese',
      handler() {
        languageSelectionModel.changeLanguage('japanese');
      },
      active: languageSelectionModel.currrentLanguage === 'japanese',
    },
  ];

  if (appUi.isDevelopment) {
    return menuItems;
  } else {
    return menuItems.filter((mi) => mi.key !== 'miShowShapePreview');
  }
}

export interface IGlobalMenuViewModel {
  isOpen: boolean;
  openMenu(): void;
  closeMenu(): void;
  menuItems: IGlobalMenuItem[];
}

export function makeGlobalMenuViewModel(): IGlobalMenuViewModel {
  const state = useLocal({ isOpen: false });
  return {
    isOpen: state.isOpen,
    openMenu: () => (state.isOpen = true),
    closeMenu: () => (state.isOpen = false),
    menuItems: createMenuItems(),
  };
}
