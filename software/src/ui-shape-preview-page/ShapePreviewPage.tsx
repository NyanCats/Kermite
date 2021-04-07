import { jsx, css } from 'qx';
import { uiTheme } from '~/ui-common';
import { PreviewKeyboardShapeView } from '~/ui-common-svg/panels/PreviewKeyboardShapeView';
import { GeneralSelector } from '~/ui-common/components';
import { ShapePreviewOptionsBox } from '~/ui-shape-preview-page/ShapePreviewOptionsBox';
import { useShapePreviewPageModel } from '~/ui-shape-preview-page/models/ShapePreviewPageModel';

const cssShapePreviewPage = css`
  background: ${uiTheme.colors.clBackground};
  color: ${uiTheme.colors.clMainText};
  height: 100%;
  padding: 10px;
  > * + * {
    margin-top: 5px;
  }

  display: flex;
  flex-direction: column;

  > * {
    flex-shrink: 0;
  }

  > .topRow {
    display: flex;

    > * + * {
      margin-left: 40px;
    }

    > .spacer {
      flex-grow: 1;
    }
  }

  > .keyboardRow {
    flex-shrink: 1;
    flex-grow: 1;
    height: 50%;
  }

  > .restRow {
    flex-shrink: 1;
    flex-grow: 1;
    height: 50%;
  }
`;

export const KeyboardShapePreviewPage = () => {
  const vm = useShapePreviewPageModel();
  const {
    loadedDesign,
    settings,
    projectSelectorSource,
    layoutSelectorSource,
    holdKeyIndices,
  } = vm;
  return (
    <div css={cssShapePreviewPage}>
      <div>keyboard shape preview</div>
      <div class="topRow">
        <GeneralSelector {...projectSelectorSource} width={160} />
        <GeneralSelector {...layoutSelectorSource} width={160} />
        <div class="spacer" />
        <ShapePreviewOptionsBox settings={settings} />
      </div>
      <div class="keyboardRow">
        {loadedDesign && (
          <PreviewKeyboardShapeView
            keyboardDesign={loadedDesign}
            settings={settings}
          />
        )}
      </div>
      <div class="restRow">
        hold key indices: {JSON.stringify(holdKeyIndices)}
      </div>
    </div>
  );
};
