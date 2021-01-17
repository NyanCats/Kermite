import { degToRad } from '@ui-layouter/base/utils';
import { IEditKeyboardDesign, IKeySizeUnit } from './DataSchema';
import {
  getCoordUnitFromUnitSpec,
  getStdKeySize,
  ICoordUnit,
} from './PlacementUnitHelper';

function getKeySize(
  shapeSpec: string,
  coordUnit: ICoordUnit,
  keySizeUnit: IKeySizeUnit,
) {
  if (shapeSpec === 'ext circle') {
    return [18, 18];
  } else if (shapeSpec === 'ext isoEnter') {
    return [27, 37];
  }
  return getStdKeySize(shapeSpec, coordUnit, keySizeUnit);
}

export function getKeyboardDesignBoundingBox(design: IEditKeyboardDesign) {
  const coordUnit = getCoordUnitFromUnitSpec(design.placementUnit);
  const xs: number[] = [];
  const ys: number[] = [];
  Object.values(design.keyEntities).forEach((ke) => {
    let { x, y, angle } = ke;
    if (coordUnit.mode === 'KP') {
      x *= coordUnit.x;
      y *= coordUnit.y;
    }
    const [w, h] = getKeySize(ke.shape, coordUnit, design.keySizeUnit);
    const dx = w / 2;
    const dy = h / 2;
    const theta = degToRad(angle);

    const points = [
      [-dx, -dy],
      [-dx, dy],
      [dx, -dy],
      [dx, dy],
    ];
    if (design.placementAnchor === 'topLeft') {
      points.forEach((p) => {
        p[0] += w / 2 + 0.5;
        p[1] += h / 2 + 0.5;
      });
    }
    points.forEach(([px, py]) => {
      const ax = px * Math.cos(theta) - py * Math.sin(theta);
      const ay = px * Math.sin(theta) + py * Math.cos(theta);
      xs.push(x + ax);
      ys.push(y + ay);
    });
  });

  Object.values(design.outlineShapes).forEach((shape) =>
    shape.points.forEach(({ x, y }) => {
      xs.push(x);
      ys.push(y);
    }),
  );

  if (xs.length === 0 || ys.length === 0) {
    return {
      left: -80,
      right: 80,
      top: -60,
      bottom: 60,
    };
  }

  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);

  return { top, left, bottom, right };
}
