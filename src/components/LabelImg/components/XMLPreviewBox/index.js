import { Modal, Input } from 'antd';
import { useStoreContext } from '../../contexts/StoreContext';
import actionTypes from '../../contexts/StoreContext/actionTypes';
import { generateXML, exportXML } from '../../utils';

const { TextArea } = Input;

function XMLPreviewBox() {
  const { state, dispatch } = useStoreContext();
  const {
    imageFiles, imageSizes, shapes, selPreviewIndex, xmlPreviewBoxVisible
  } = state;

  const onOk = () => {
    const xml = generateXML(
      imageFiles[selPreviewIndex],
      imageSizes[selPreviewIndex],
      shapes[selPreviewIndex]
    );
    exportXML(xml, `${imageFiles[selPreviewIndex].name.split('.')[0]}.xml`);
  };

  const onCancel = () => {
    dispatch({
      type: actionTypes.SET_XML_PREVIEW_BOX_STATUS,
      payload: {
        selPreviewIndex: null,
        xmlPreviewBoxVisible: false
      }
    });
  };

  return (
    <Modal
      width="400px"
      maskClosable={false}
      title="XML Previw Box"
      visible={xmlPreviewBoxVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
    >
      {xmlPreviewBoxVisible && (
        <TextArea
          rows={10}
          value={generateXML(
            imageFiles[selPreviewIndex],
            imageSizes[selPreviewIndex],
            shapes[selPreviewIndex]
          )}
        />
      )}
    </Modal>
  );
}

export default XMLPreviewBox;
