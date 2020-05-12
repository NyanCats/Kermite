import { css } from 'goober';
import { hx } from '~ui2/views/basis/qx';
import { createModal } from '~ui2/views/basis/ForegroundModalLayer';
import { getAvailableBreedNames } from '~defs/keyboardShapes';
import { ClosableOverlay } from '~ui2/views/common/basicModals';
import { reflectFieldValue } from '~ui2/views/common/FormHelpers';
import {
  CommonDialogFrame,
  DialogContentRow,
  DialogButton,
  DialogButtonsRow
} from '~ui2/views/common/CommonDialogParts';
import {
  cssCommonPropertiesTable,
  cssCommonInput
} from '~ui2/views/common/commonStyles';

interface ICreateProfileDialogEditValues {
  profileName: string;
  breedName: string;
}

const ProfileSetupModalContent = (props: {
  editValues: ICreateProfileDialogEditValues;
  breedNames: string[];
  submit(): void;
  close(): void;
}) => {
  const { editValues, submit, close, breedNames } = props;

  return (
    <ClosableOverlay close={close}>
      <CommonDialogFrame caption="Profiler Properties">
        <DialogContentRow>
          <table css={cssCommonPropertiesTable}>
            <tbody>
              <tr>
                <td>Profile Name</td>
                <td>
                  <input
                    type="text"
                    css={cssCommonInput}
                    value={editValues.profileName}
                    onChange={reflectFieldValue(editValues, 'profileName')}
                  />
                </td>
              </tr>
              <tr>
                <td>Target Keyboard</td>
                <td>
                  <select
                    value={editValues.breedName}
                    onChange={reflectFieldValue(editValues, 'breedName')}
                  >
                    {breedNames.map((breedName) => (
                      <option value={breedName} key={breedName}>
                        {breedName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </DialogContentRow>
        <DialogButtonsRow>
          <DialogButton onClick={submit}>OK</DialogButton>
        </DialogButtonsRow>
      </CommonDialogFrame>
    </ClosableOverlay>
  );
};

export const callProfileSetupModal = createModal(() => {
  const breedNames = getAvailableBreedNames();
  const editValues: ICreateProfileDialogEditValues = {
    profileName: '',
    breedName: breedNames[0]
  };
  return (props: {
    close: (result: ICreateProfileDialogEditValues | undefined) => void;
  }) => {
    const submit = () => props.close(editValues);
    const close = () => props.close(undefined);
    return (
      <ProfileSetupModalContent
        editValues={editValues}
        submit={submit}
        close={close}
        breedNames={breedNames}
      />
    );
  };
});
