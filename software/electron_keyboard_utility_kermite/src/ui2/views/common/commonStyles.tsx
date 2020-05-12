import { css } from 'goober';

export const cssCommonPropertiesTable = css`
  tr {
    > td {
      padding: 4px 0;
    }
    > td + td {
      padding-left: 10px;
    }
  }
`;

export const cssCommonInput = css`
  width: 100%;
  height: 26px;
  font-size: 14px;
  padding-left: 4px;
`;
