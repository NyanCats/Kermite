import { css, FC, jsx } from 'qx';
import { KmsPresetKeyboardView } from '~/ex_profileViewer/KmsPresetKeyboardView';
import { KmsPresetLayersBox } from '~/ex_profileViewer/KmsPresetLayersBox';
import { IPresetKeyboardSectionViewModel } from '~/ui/preset-browser-page/viewModels/PresetKeyboardSectionViewModel';

type Props = {
  className?: string;
  viewModel: IPresetKeyboardSectionViewModel;
};

const style = css`
  height: 300px;
  display: flex;
  > .keyboardPart {
    flex-grow: 1;
  }

  > .layersPart {
    flex-shrink: 0;
    width: 100px;
    margin-right: 10px;
    height: 100%;
  }
`;

export const KmsPresetKeyboardSection: FC<Props> = ({
  className,
  viewModel: { keyboard, layerList },
}) => (
  <div css={style} className={className}>
    <div class="keyboardPart">
      <KmsPresetKeyboardView {...keyboard} />
    </div>
    <div class="layersPart">
      <KmsPresetLayersBox {...layerList} />
    </div>
  </div>
);
