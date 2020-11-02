import { css } from 'goober';
import { h } from '~lib/qx';
import { ShapePreviewPageViewModel } from '~ui/viewModels/ShapePreviewPageViewModel';
import { BreedSelector } from './Controls/BreedSelector';
import { PreviewOptionsBox } from './Controls/PreviewOptionsBox';
import { KeyboardShapeView } from './ShapeView/KeyboardShapeView';

const cssShapePreviewPage = css`
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
    justify-content: space-between;
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

export const KeyboardShapePreviewPage = (props: {
  vm: ShapePreviewPageViewModel;
}) => {
  const { loadedShape, settings, breedSelectorVM, holdKeyIndices } = props.vm;
  return (
    <div css={cssShapePreviewPage}>
      <div>keyboard shape preview</div>
      <div class="topRow">
        <BreedSelector vm={breedSelectorVM} />
        <PreviewOptionsBox settings={settings} />
      </div>
      <div class="keyboardRow">
        {loadedShape && (
          <KeyboardShapeView shape={loadedShape} settings={settings} />
        )}
      </div>
      <div class="restRow">
        hold key indices: {JSON.stringify(holdKeyIndices)}
      </div>
    </div>
  );
};
