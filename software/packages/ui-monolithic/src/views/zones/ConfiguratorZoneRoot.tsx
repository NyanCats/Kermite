import { css } from 'goober';
import { uiTheme } from '~ui/core';
import { models } from '~ui/models';
import { CustomWindowFrame } from '~ui/views/base/window/CustomWindowFrame';
import { HeatmapPage } from '~ui/views/pages/HeatmapPage';
import { NavigationColumn } from '../base/navigation/NavigationColumn';
import { WindowTitleBarSection } from '../base/titleBar/WindowTitleBarSection';
import { EditorPage } from '../pages/EditorPage';
import { FirmwareUpdationPage } from '../pages/FirmwareUpdationPage';
import { PresetBrowserPage } from '../pages/PresetBrowserPage';
import { KeyboardShapePreviewPage } from '../pages/ShapePreviewPage';
import { h } from '~qx';

const styles = {
  cssContentRow: css`
    background: ${uiTheme.colors.clPageBackground};
    color: ${uiTheme.colors.clMainText};
    display: flex;
  `,

  cssMainColumn: css`
    flex-grow: 1;
  `,
};

export const ConfiguratorZoneRoot = () => {
  const { page } = models.uiStatusModel.settings;

  return (
    <CustomWindowFrame renderTitleBar={() => <WindowTitleBarSection />}>
      <div css={styles.cssContentRow}>
        <NavigationColumn />
        <div css={styles.cssMainColumn}>
          {page === 'editor' && <EditorPage />}
          {page === 'shapePreview' && <KeyboardShapePreviewPage />}
          {page === 'firmwareUpdation' && <FirmwareUpdationPage />}
          {page === 'presetBrowser' && <PresetBrowserPage />}
          {page === 'heatmap' && <HeatmapPage />}
        </div>
      </div>
    </CustomWindowFrame>
  );
};
