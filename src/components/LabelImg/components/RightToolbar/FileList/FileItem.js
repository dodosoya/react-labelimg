import {
  Row, Col, Checkbox, Space, Button
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useStoreContext } from '../../../contexts/StoreContext';
import actionTypes from '../../../contexts/StoreContext/actionTypes';
import { drawStatusTypes } from '../../../constants';

function FileItem(props) {
  const { index: fileIndex, name } = props;
  const { state, dispatch } = useStoreContext();
  const {
    imageFiles, selDrawImageIndex, selImageIndexes, imageSizes, drawStatus, shapes, selShapeIndex
  } = state;

  const onCheckChange = event => {
    const set = new Set([...selImageIndexes]);
    if (event.target.checked) set.add(fileIndex);
    else set.delete(fileIndex);
    dispatch({ type: actionTypes.SET_SEL_IMAGE_INDEXES, payload: { selImageIndexes: [...set] } });
  };

  const onItemClick = () => {
    dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
    dispatch({
      type: actionTypes.SET_SEL_DRAW_IMAGE_INDEX,
      payload: { selDrawImageIndex: fileIndex }
    });
  };

  const onXMLPreviewClick = () => {
    dispatch({
      type: actionTypes.SET_XML_PREVIEW_BOX_STATUS,
      payload: {
        selPreviewIndex: fileIndex,
        xmlPreviewBoxVisible: true
      }
    });
  };

  const onItemDeleteClick = () => {
    const newImageFiles = imageFiles.filter((item, index) => index !== fileIndex);
    let newSelDrawImageIndex = selDrawImageIndex;
    if (newImageFiles.length === 0) {
      newSelDrawImageIndex = null;
    } else if (fileIndex <= selDrawImageIndex && selDrawImageIndex !== 0) {
      newSelDrawImageIndex = selDrawImageIndex - 1;
    }
    dispatch({
      type: actionTypes.SET_IMAGE_FILES,
      payload: {
        imageFiles: newImageFiles,
        selDrawImageIndex: newSelDrawImageIndex,
        imageSizes: imageSizes.filter((item, index) => index !== fileIndex),
        drawStatus: fileIndex === selDrawImageIndex ? drawStatusTypes.IDLE : drawStatus,
        shapes: shapes.filter((item, index) => index !== fileIndex),
        selShapeIndex: fileIndex === selDrawImageIndex ? null : selShapeIndex
      }
    });
  };

  return (
    <Row type="flex" justify="space-between" style={{ padding: '8px 16px' }}>
      <Col xs={3}>
        <Checkbox
          checked={selImageIndexes.indexOf(fileIndex) !== -1}
          onChange={onCheckChange}
        />
      </Col>
      <Col xs={15}>
        <div
          title={name}
          onClick={onItemClick}
          className="file-item-name"
          style={{
            color: (fileIndex === selDrawImageIndex) ? '#ff4d4f' : '#000000d9'
          }}
        >
          {name}
        </div>
      </Col>
      <Col xs={6} style={{ textAlign: 'end' }}>
        <Space>
          <Button
            size="small"
            shape="circle"
            title={shapes[fileIndex] ? `Total labels: ${shapes[fileIndex].length}` : ''}
            onClick={onXMLPreviewClick}
          >
            {shapes[fileIndex] ? shapes[fileIndex].length : ''}
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            shape="circle"
            title="Delete file"
            icon={<DeleteOutlined />}
            onClick={onItemDeleteClick}
          />
        </Space>
      </Col>
    </Row>
  );
}

FileItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

export default FileItem;
