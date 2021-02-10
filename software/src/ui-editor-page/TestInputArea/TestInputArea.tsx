import { css } from 'goober';
import { Hook, h } from 'qx';
import { GeneralButton, GeneralInput } from '~/ui-common/components';
import { makeTestInputAreaViewModel } from '~/ui-editor-page/TestInputArea/TestInputAreaViweModel';

const cssTestInputArea = css`
  margin: 5px;
  display: flex;
`;

export const TestInputArea = () => {
  const vm = Hook.useMemo(makeTestInputAreaViewModel, []);
  return (
    <div css={cssTestInputArea}>
      <GeneralInput value={vm.text} setValue={vm.setText} width={300} />
      <GeneralButton text="clear" handler={vm.clearText} />
    </div>
  );
};
