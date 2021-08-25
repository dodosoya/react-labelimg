import { Collapse } from 'antd';
import FileList from './FileList';
import FileListSetting from './FileList/FileListSetting';
import LabelList from './LabelList';
import LabelListSetting from './LabelList/LabelListSetting';
import { useStoreContext } from '../../contexts/StoreContext';

const { Panel } = Collapse;

function RightToolbar() {
  const { state } = useStoreContext();
  const {
    imageFiles, selDrawImageIndex, shapes
  } = state;

  return (
    <Collapse
      bordered={false}
      expandIconPosition="left"
      defaultActiveKey={['file', 'label']}
    >
      <Panel
        key="file"
        header={`File List (${imageFiles.length})`}
        collapsible="header"
        extra={<FileListSetting />}
      >
        <FileList />
      </Panel>
      <Panel
        key="label"
        header={selDrawImageIndex !== null
          ? `Label List (${shapes[selDrawImageIndex].length})` : 'Label List (0)'}
        collapsible="header"
        extra={<LabelListSetting />}
      >
        <LabelList />
      </Panel>
    </Collapse>
  );
}

export default RightToolbar;
