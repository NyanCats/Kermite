import { css } from 'goober';
import { h } from 'qx';
import { IKeyboardShapeDisplayArea } from '~/shared';

function getViewBox(da: IKeyboardShapeDisplayArea) {
  const left = da.centerX - da.width / 2;
  const top = da.centerY - da.height / 2;
  const { width, height } = da;
  return `${left} ${top} ${width} ${height}`;
}

export const KeyboardSvgFrame = (props: {
  displayArea: IKeyboardShapeDisplayArea;
  dpiScale: number;
  children: JSX.Element[];
  baseStrokeWidth: number;
}) => {
  const cssSvgFrame = css`
    user-select: none;
  `;

  const { displayArea, dpiScale, children, baseStrokeWidth } = props;
  const viewBox = getViewBox(displayArea);

  return (
    <svg
      width={displayArea.width * dpiScale}
      height={displayArea.height * dpiScale}
      viewBox={viewBox}
      css={cssSvgFrame}
    >
      <g strokeWidth={baseStrokeWidth} strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
};
