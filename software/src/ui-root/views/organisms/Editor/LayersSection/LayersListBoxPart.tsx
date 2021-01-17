import { uiTheme } from '~/ui-common';
import { css } from 'goober';
import { h } from 'qx';
import {
  ILayerListViewModel,
  ILayerListBoxPartViewModel,
} from '~/ui-root/viewModels/Editor/LayersListBoxPartViewModel';

const LayerCard = (props: { layerModel: ILayerListViewModel }) => {
  const cssLayerCard = css`
    &[data-current] {
      background: ${uiTheme.colors.clSelectHighlight};
    }
    padding: 4px;
    cursor: pointer;
    user-select: none;
    color: ${uiTheme.colors.clMainText};
  `;

  const { layerId, layerName, isCurrent, setCurrent } = props.layerModel;
  return (
    <div
      css={cssLayerCard}
      key={layerId}
      data-current={isCurrent}
      onClick={setCurrent}
    >
      {layerName}
    </div>
  );
};

export function LayersListBoxPart(props: { vm: ILayerListBoxPartViewModel }) {
  const cssLayersListBox = css`
    height: 240px;
    overflow-y: scroll;
    border: solid 1px ${uiTheme.colors.clCommonFrame};
    margin: 0 5px;
  `;

  return (
    <div css={cssLayersListBox}>
      {props.vm.layers.map((la) => (
        <LayerCard layerModel={la} key={la.layerId} />
      ))}
    </div>
  );
}
