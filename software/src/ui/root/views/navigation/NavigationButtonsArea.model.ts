import { router, PagePaths, texts } from '~/ui/common';

export interface NavigationEntryViewModel {
  pagePath: PagePaths;
  pageName: string;
  iconSpec: string;
  isCurrent: boolean;
  onClick: () => void;
}

interface NavigationEntrySource {
  pagePath: PagePaths;
  pageName: string;
  iconSpec: string;
}

const entrySources: NavigationEntrySource[] = [
  {
    pagePath: '/editor',
    pageName: texts.label_sideMenu_app_assigner,
    iconSpec: 'fa fa-keyboard',
  },
  {
    pagePath: '/layouter',
    pageName: texts.label_sideMenu_app_layouter,
    iconSpec: 'fa fa-drafting-compass',
  },
  {
    pagePath: '/presetBrowser',
    pageName: texts.label_sideMenu_app_presetBrowser,
    iconSpec: 'fa fa-book',
  },
  {
    pagePath: '/shapePreview',
    pageName: texts.label_sideMenu_app_shapePreview,
    iconSpec: 'fa fa-file-code',
  },
  {
    pagePath: '/heatmap',
    pageName: texts.label_sideMenu_app_heatmap,
    iconSpec: 'fa fa-chart-bar',
  },
  {
    pagePath: '/firmwareUpdation',
    pageName: texts.label_sideMenu_app_firmwareUpdation,
    iconSpec: 'fa fa-microchip',
  },
  {
    pagePath: '/settings',
    pageName: texts.label_sideMenu_app_settings,
    iconSpec: 'fa fa-cog',
  },
];

// const entrySources: NavigationEntrySource[] = [
//   { pagePath: '/editor', pageName: 'Assigner', iconSpec: 'keyboard' },
//   {
//     pagePath: '/layouter',
//     pageName: 'Drafter',
//     iconSpec: 'architecture',
//   },
//   { pagePath: '/presetBrowser', pageName: 'Presets', iconSpec: 'menu_book' },
//   { pagePath: '/shapePreview', pageName: 'Preview', iconSpec: 'format_shapes' },
//   { pagePath: '/heatmap', pageName: 'Heatmap', iconSpec: 'analytics' },
//   {
//     pagePath: '/firmwareUpdation',
//     pageName: 'Firmware',
//     iconSpec: 'memory',
//   },
//   { pagePath: '/settings', pageName: 'Settings', iconSpec: 'settings' },
// ];

export interface INavigationViewModel {
  entries: NavigationEntryViewModel[];
}

export function makeNavigationViewModel(): INavigationViewModel {
  const currentPagePath = router.getPagePath();
  return {
    entries: entrySources.map((it) => ({
      pagePath: it.pagePath,
      pageName: it.pageName,
      iconSpec: it.iconSpec,
      isCurrent: it.pagePath === currentPagePath,
      onClick: () => router.navigateTo(it.pagePath),
    })),
  };
}
