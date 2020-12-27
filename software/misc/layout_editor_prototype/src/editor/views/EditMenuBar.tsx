import { css } from 'goober';
import { ExclusiveButtonGroup, ToggleButton } from '~/controls';
import { GeneralSelector } from '~/controls/GeneralSelector';
import { makeEditMenuBarViewModel } from '~/editor/views/EditMenuBar.model';
import { h } from '~/qx';

const cssEditMenuBar = css`
  width: 800px;
  display: flex;
  > * + * {
    margin-left: 40px;
  }

  > .buttonsBox {
    display: flex;
    > * + * {
      margin-left: 5px;
    }
  }

  button {
    width: 50px;
    padding: 5px;
    cursor: pointer;
  }
`;

export const EditMenuBar = () => {
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    editorTargetVm,
    editModeVm,
    vmShowAxis,
    vmShowGrid,
    vmSnapToGrid,
    vmSnapDivision,
  } = makeEditMenuBarViewModel();

  return (
    <div class={cssEditMenuBar}>
      <ExclusiveButtonGroup
        options={editorTargetVm.options}
        choiceId={editorTargetVm.choiceId}
        setChoiceId={editorTargetVm.setChoiceId}
        buttonWidth={55}
      />

      <ExclusiveButtonGroup
        options={editModeVm.options}
        choiceId={editModeVm.choiceId}
        setChoiceId={editModeVm.setChoiceId}
        buttonWidth={55}
      />

      <div class="buttonsBox">
        <button disabled={!canUndo} onClick={undo}>
          undo
        </button>
        <button disabled={!canRedo} onClick={redo}>
          redo
        </button>
      </div>

      <div class="buttonsBox">
        <ToggleButton
          text="axis"
          width={45}
          active={vmShowAxis.active}
          setActive={vmShowAxis.setActive}
        />
        <ToggleButton
          text="grid"
          width={45}
          active={vmShowGrid.active}
          setActive={vmShowGrid.setActive}
        />
        <ToggleButton
          text="snap"
          width={45}
          active={vmSnapToGrid.active}
          setActive={vmSnapToGrid.setActive}
        />

        <GeneralSelector
          options={vmSnapDivision.options}
          choiceId={vmSnapDivision.choiceId}
          setChoiceId={vmSnapDivision.setChoiceId}
        />
      </div>
    </div>
  );
};
