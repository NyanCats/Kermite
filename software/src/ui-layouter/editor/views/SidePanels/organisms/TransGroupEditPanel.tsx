import { h } from 'qx';
import { CheckBox, HFlex } from '~/ui-common/components';
import {
  ConfigContent,
  ConfigHeader,
  ConfigPanel,
  ConfigSubContent,
  ConfigSubHeader,
  ConfigVStack,
} from '~/ui-layouter/editor/views/SidePanels/atoms';
import { GeneralConfigTextEditRow } from '~/ui-layouter/editor/views/SidePanels/controls/GeneralConfigTextEditRow';
import { useTransGroupEditPanelModel } from '~/ui-layouter/editor/views/SidePanels/models/TransGroupEditPanel.model';
import { TransGroupListPart } from '~/ui-layouter/editor/views/SidePanels/organisms/TransGroupListPart';

export const TransGroupEditPanel = () => {
  const {
    vmX,
    vmY,
    vmAngle,
    currentGroupId,
    vmMirror,
  } = useTransGroupEditPanelModel();
  return (
    <ConfigPanel>
      <ConfigHeader>transformation groups</ConfigHeader>
      <ConfigContent>
        <div>
          <ConfigSubHeader>group {currentGroupId} properties</ConfigSubHeader>
          <ConfigSubContent>
            <ConfigVStack>
              <GeneralConfigTextEditRow
                {...vmX}
                label={'x'}
                labelWidth={70}
                inputWidth={60}
                unit="mm"
              />
              <GeneralConfigTextEditRow
                {...vmY}
                label={'y'}
                labelWidth={70}
                inputWidth={60}
                unit="mm"
              />
              <GeneralConfigTextEditRow
                {...vmAngle}
                label={'angle'}
                labelWidth={70}
                inputWidth={60}
                unit="deg"
              />
              <HFlex>
                <span style={{ width: '70px' }}>mirror</span>
                <CheckBox
                  checked={vmMirror.value}
                  setChecked={vmMirror.setValue}
                  disabled={vmMirror.disabled}
                />
              </HFlex>
            </ConfigVStack>
          </ConfigSubContent>
        </div>
        <TransGroupListPart />
      </ConfigContent>
    </ConfigPanel>
  );
};
