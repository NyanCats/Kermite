import {
  clamp,
  IKeyIdMode,
  IKeyPlacementAnchor,
  removeArrayItems,
} from '~/shared';
import { getNextEntityInstanceId } from '~/ui/layouter/models/DomainRelatedHelpers';
import { editManager } from '~/ui/layouter/models/EditManager';
import {
  applyCoordSnapping,
  draftGetEditPoint,
} from '~/ui/layouter/models/EditorHelper';
import { IGridSpecKey } from '~/ui/layouter/models/GridDefinitions';
import {
  changeKeySizeUnit,
  changePlacementCoordUnit,
  mmToUnitValue,
} from '~/ui/layouter/models/PlacementUnitHelperEx';
import {
  appState,
  createFallbackEditKeyboardDesign,
  IEditMode,
  IEnvBoolPropKey,
} from './AppState';
import {
  IEditKeyboardDesign,
  IEditKeyEntity,
  IEditPropKey,
} from './DataSchema';
import { editReader } from './EditReader';
import { editUpdator } from './EditUpdator';

class EditMutations {
  startEdit = () => {
    editUpdator.startEditSession();
  };

  endEdit = () => {
    editUpdator.endEditSession();
  };

  cancelEdit = () => {
    editUpdator.cancelEditSession();
  };

  startKeyEdit = (useGhost: boolean = true) => {
    editUpdator.startEditSession();
    if (useGhost) {
      editUpdator.patchEnvState((env) => {
        const ke = editReader.currentKeyEntity;
        env.ghost = (ke && { ...ke }) || undefined;
      });
    }
  };

  endKeyEdit = () => {
    editUpdator.endEditSession();
    if (editReader.ghost) {
      editUpdator.patchEnvState((env) => {
        env.ghost = undefined;
      });
    }
  };

  addKeyEntity(px: number, py: number) {
    const {
      coordUnit,
      sizeUnit,
      allKeyEntities,
      placementAnchor,
      currentTransGroupId,
      snapToGrid,
      snapPitches,
    } = editReader;

    const keySize = sizeUnit.mode === 'KP' ? 1 : 18;
    if (placementAnchor === 'topLeft') {
      if (sizeUnit.mode === 'KP') {
        px -= sizeUnit.x / 2;
        py -= sizeUnit.y / 2;
      } else {
        px -= keySize / 2;
        py -= keySize / 2;
      }
    }
    if (snapToGrid) {
      [px, py] = applyCoordSnapping(px, py, snapPitches);
    }

    const [kx, ky] = mmToUnitValue(px, py, coordUnit);
    const id = getNextEntityInstanceId('key', allKeyEntities);
    const editKeyId = `ke${(Math.random() * 1000) >> 0}`;
    const keyEntity: IEditKeyEntity = {
      id,
      editKeyId,
      mirrorEditKeyId: editKeyId + 'm',
      x: kx,
      y: ky,
      angle: 0,
      shape: `std ${keySize}`,
      keyIndex: -1,
      mirrorKeyIndex: -1,
      groupId: currentTransGroupId || '',
    };
    editUpdator.patchEditor((editor) => {
      editor.design.keyEntities[id] = keyEntity;
      editor.currentkeyEntityId = id;
    });
  }

  deleteCurrentKeyEntity() {
    const { currentkeyEntityId } = appState.editor;
    if (currentkeyEntityId) {
      editUpdator.commitEditor((editor) => {
        delete editor.design.keyEntities[currentkeyEntityId];
        editor.currentkeyEntityId = undefined;
      });
    }
  }

  deleteCurrentOutlinePoint() {
    const shapeId = editReader.currentShapeId;
    const idx = editReader.currentPointIndex;
    if (!shapeId || idx === -1) {
      return;
    }
    editUpdator.commitEditor((editor) => {
      const shape = editor.design.outlineShapes[shapeId];
      shape.points.splice(idx, 1);
      if (shape.points.length === 0) {
        delete editor.design.outlineShapes[shapeId];
      }
    });
  }

  splitOutlineLine(dstPointIndex: number, x: number, y: number) {
    const shapeId = editReader.currentShapeId;
    if (!shapeId) {
      return;
    }
    editUpdator.patchEditor((editor) => {
      const shape = editor.design.outlineShapes[shapeId];
      shape.points.splice(dstPointIndex, 0, { x, y });
    });
  }

  addOutlinePoint(x: number, y: number) {
    const { snapToGrid, snapPitches } = editReader;
    if (snapToGrid) {
      [x, y] = applyCoordSnapping(x, y, snapPitches);
    }
    editUpdator.patchEditor((editor) => {
      const shape = editor.drawingShape;
      if (shape) {
        shape.points.push({ x, y });
        editor.currentPointIndex = shape.points.length - 1;
      }
    });
  }

  setPlacementUnit(unitSpec: string) {
    editUpdator.commitEditor((editor) => {
      changePlacementCoordUnit(editor.design, unitSpec);
    });
    if (editReader.gridSpecKey.startsWith('kp')) {
      this.setGridSpecKey('mm_pitch10');
    }
  }

  setPlacementAnchor(anchor: IKeyPlacementAnchor) {
    editUpdator.commitEditor((editor) => {
      editor.design.setup.placementAnchor = anchor;
    });
  }

  setKeyIdMode(mode: IKeyIdMode) {
    editUpdator.commitEditor((editor) => {
      editor.design.setup.keyIdMode = mode;
    });
  }

  setKeySizeUnit(unitSpec: string) {
    editUpdator.commitEditor((editor) => {
      changeKeySizeUnit(editor.design, unitSpec);
    });
  }

  setGridSpecKey(gs: IGridSpecKey) {
    editUpdator.patchEnvState((env) => {
      env.gridSpecKey = gs;
    });
  }

  startShapeDrawing() {
    if (!editReader.drawingShape) {
      editMutations.startEdit();
      const newId = getNextEntityInstanceId(
        'shape',
        editReader.allOutlineShapes,
      );
      editUpdator.patchEditor((editor) => {
        editor.drawingShape = {
          id: newId,
          points: [],
          groupId: editReader.currentTransGroupId || '',
        };
        editor.currentShapeId = newId;
        editor.currentPointIndex = -1;
      });
    }
  }

  completeShapeDrawing() {
    const { drawingShape } = editReader;
    if (drawingShape && drawingShape.points.length >= 3) {
      editUpdator.patchEditor((state) => {
        state.design.outlineShapes[drawingShape.id] = drawingShape;
        state.drawingShape = undefined;
      });
      editMutations.endEdit();
    }
  }

  cancelShapeDrawing() {
    if (editReader.drawingShape) {
      editUpdator.patchEditor((editor) => {
        editor.drawingShape = undefined;
      });
      editMutations.cancelEdit();
    }
  }

  setEditMode(mode: IEditMode) {
    this.cancelShapeDrawing();
    editUpdator.patchEditor((editor) => {
      editor.editMode = mode;
    });
  }

  setMode(mode: IEditMode) {
    const currentMode = editReader.editMode;
    if (currentMode === mode) {
      return;
    }
    this.cancelShapeDrawing();

    editUpdator.patchEditor((state) => {
      state.currentkeyEntityId = undefined;
      state.isCurrentKeyMirror = false;
      state.currentShapeId = undefined;
      state.currentPointIndex = -1;
      state.editMode = mode;
    });
  }

  setBoolOption<K extends IEnvBoolPropKey>(fieldKey: K, value: boolean) {
    editUpdator.patchEnvState((env) => {
      env[fieldKey] = value;
    });
  }

  setCurrentKeyEntity(keyEntityId: string, isMirror: boolean) {
    editUpdator.patchEditor((editor) => {
      editor.currentkeyEntityId = keyEntityId;
      editor.isCurrentKeyMirror = isMirror;
    });
    const ke = editReader.currentKeyEntity;
    this.setCurrentTransGroupById(ke?.groupId);
  }

  unsetCurrentKeyEntity() {
    editUpdator.patchEditor((editor) => {
      editor.currentkeyEntityId = undefined;
      editor.isCurrentKeyMirror = false;
    });
  }

  setCurrentShapeId(shapeId: string | undefined) {
    editUpdator.patchEditor((editor) => {
      editor.currentShapeId = shapeId;
    });
    const shape = editReader.currentOutlineShape;
    this.setCurrentTransGroupById(shape?.groupId);
  }

  setCurrentPointIndex(index: number) {
    editUpdator.patchEditor((editor) => {
      editor.currentPointIndex = index;
    });
  }

  setCurrentTransGroupById(id: string | undefined) {
    editUpdator.patchEditor((editor) => {
      editor.currentTransGroupId = id;
    });
  }

  moveKeyDelta(deltaX: number, deltaY: number) {
    editUpdator.patchEditKeyEntity((ke) => {
      ke.x += deltaX;
      ke.y += deltaY;
    });
  }

  setKeyPosition(px: number, py: number) {
    const { coordUnit, snapToGrid, snapPitches } = editReader;
    editUpdator.patchEditKeyEntity((ke) => {
      if (snapToGrid) {
        const [kx, ky] = applyCoordSnapping(px, py, snapPitches);
        [ke.x, ke.y] = mmToUnitValue(kx, ky, coordUnit);
      } else {
        [ke.x, ke.y] = mmToUnitValue(px, py, coordUnit);
      }
    });
  }

  setOutlinePointProp(propKey: 'x' | 'y', value: number) {
    editUpdator.patchEditor((editor) => {
      const point = draftGetEditPoint(editor);
      if (point) {
        point[propKey] = value;
      }
    });
  }

  setOutlinePointPosition(px: number, py: number) {
    const { snapPitches, snapToGrid } = editReader;
    if (snapToGrid) {
      [px, py] = applyCoordSnapping(px, py, snapPitches);
    }
    editUpdator.patchEditor((editor) => {
      const point = draftGetEditPoint(editor);
      if (point) {
        point.x = px;
        point.y = py;
      }
    });
  }

  setTransGroupProp(propKey: 'x' | 'y' | 'angle', value: number) {
    const { currentTransGroupId } = editReader;
    if (!currentTransGroupId) {
      return;
    }
    editUpdator.patchEditor((editor) => {
      const group = editor.design.transGroups[currentTransGroupId];
      group[propKey] = value;
    });
  }

  setTransGroupMirror(mirror: boolean) {
    const { currentTransGroupId } = editReader;
    if (!currentTransGroupId) {
      return;
    }
    editUpdator.commitEditor((editor) => {
      const group = editor.design.transGroups[currentTransGroupId];
      group.mirror = mirror;
    });
  }

  addTransGroup() {
    const numGroups = editReader.allTransGroups.length;
    const newGroupId = numGroups.toString();

    editUpdator.commitEditor((editor) => {
      editor.design.transGroups[newGroupId] = {
        id: newGroupId,
        x: 0,
        y: 0,
        angle: 0,
        mirror: false,
      };
      editor.currentTransGroupId = newGroupId;
    });
  }

  deleteLastTransGroup() {
    const numGroups = editReader.allTransGroups.length;
    if (numGroups === 1) {
      return;
    }
    const deletingGroupId = (numGroups - 1).toString();
    editUpdator.commitEditor((editor) => {
      delete editor.design.transGroups[deletingGroupId];
      editor.currentTransGroupId = undefined;
    });
  }

  changeKeyProperty = <K extends IEditPropKey>(
    propKey: K,
    value: IEditKeyEntity[K],
  ) => {
    editUpdator.patchEditKeyEntity((ke) => {
      ke[propKey] = value;
    });
  };

  setEditScreenSize(w: number, h: number) {
    editUpdator.patchEnvState((env) => {
      env.sight.screenW = w;
      env.sight.screenH = h;
    });
  }

  moveSight(deltaX: number, deltaY: number) {
    editUpdator.patchEnvState((env) => {
      env.sight.pos.x += deltaX;
      env.sight.pos.y += deltaY;
    });
  }

  scaleSight(dir: number, px: number, py: number) {
    editUpdator.patchEnvState((env) => {
      const { sight } = env;
      const sza = 1 + dir * 0.05;
      const oldScale = sight.scale;
      const newScale = clamp(sight.scale * sza, 0.02, 2);
      sight.scale = newScale;
      const scaleDiff = newScale - oldScale;
      sight.pos.x -= px * scaleDiff;
      sight.pos.y -= py * scaleDiff;
    });
  }

  resetKeyboardDesign() {
    editUpdator.patchEditor((editor) => {
      const design = createFallbackEditKeyboardDesign();
      editor.loadedDesign = design;
      editor.design = design;
    });
  }

  loadKeyboardDesign(design: IEditKeyboardDesign) {
    editUpdator.patchEditor((editor) => {
      editor.loadedDesign = design;
      editor.design = design;
    });
    this.resetSitePosition();
    editManager.reset();
  }

  resetSitePosition() {
    const bb = editReader.dispalyArea;
    const cx = (bb.left + bb.right) / 2;
    const cy = (bb.top + bb.bottom) / 2;
    editUpdator.patchEnvState((env) => {
      env.sight.pos.x = cx;
      env.sight.pos.y = cy;
    });
  }

  setCurrentShapeGroupId(groupId: string) {
    const { currentShapeId } = editReader;
    if (!currentShapeId) {
      return;
    }
    editUpdator.commitEditor((editor) => {
      const shape = editor.design.outlineShapes[currentShapeId];
      shape.groupId = groupId;
    });
  }

  addPressedKey(keyIndex: number) {
    editUpdator.patchEnvState((env) => {
      env.pressedKeyIndices.push(keyIndex);
    });
  }

  removePressedKey(keyIndex: number) {
    editUpdator.patchEnvState((env) => {
      removeArrayItems(env.pressedKeyIndices, keyIndex);
    });
  }

  setWorldMousePos(x: number, y: number) {
    editUpdator.patchEnvState((env) => {
      const mp = env.worldMousePos;
      mp.x = x;
      mp.y = y;
    });
  }

  get canUndo() {
    return editManager.canUndo || !!editReader.drawingShape;
  }

  get canRedo() {
    return editManager.canRedo;
  }

  undo() {
    if (editReader.drawingShape) {
      this.cancelShapeDrawing();
      return;
    }
    editManager.undo();
  }

  redo() {
    editManager.redo();
  }
}
export const editMutations = new EditMutations();
