import {
  Row, Col, Space, Button
} from 'antd';
import {
  EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { useStoreContext } from '../../../contexts/StoreContext';
import actionTypes from '../../../contexts/StoreContext/actionTypes';
import { labelStatusTypes } from '../../../constants';

function LabelItem(props) {
  const { index, label, visible } = props;
  const { state, dispatch } = useStoreContext();
  const { selDrawImageIndex, shapes, selShapeIndex } = state;

  const onItemClick = () => {
    dispatch({
      type: actionTypes.SET_SEL_SHAPE_INDEX,
      payload: { selShapeIndex: index === selShapeIndex ? null : index }
    });
  };

  const onItemVisibleClick = () => {
    const shapesCopy = cloneDeep(shapes);
    shapesCopy[selDrawImageIndex][index].visible = !shapesCopy[selDrawImageIndex][index].visible;
    dispatch({ type: actionTypes.SET_SHAPES, payload: { shapes: shapesCopy } });
    if (index === selShapeIndex) {
      dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
    }
  };

  const onItemEditClick = () => {
    dispatch({ type: actionTypes.SET_CURRENT_SHAPE, payload: { currentShape: null } });
    dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: index } });
    dispatch({
      type: actionTypes.SET_LABELBOX_STATUS,
      payload: {
        selLabelType: label,
        labelBoxVisible: true,
        labelBoxStatus: labelStatusTypes.UPDATE
      }
    });
  };

  const onItemDeleteClick = () => {
    const shapesCopy = cloneDeep(shapes);
    shapesCopy[selDrawImageIndex].splice(index, 1);
    dispatch({
      type: actionTypes.SET_SHAPES,
      payload: { shapes: shapesCopy }
    });
    if (index === selShapeIndex) {
      dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
    } else if (index < selShapeIndex) {
      dispatch({
        type: actionTypes.SET_SEL_SHAPE_INDEX,
        payload: { selShapeIndex: selShapeIndex - 1 }
      });
    }
  };

  return (
    <Row type="flex" justify="space-between" style={{ padding: '8px 16px' }}>
      <Col xs={14}>
        <div
          title={label}
          onClick={onItemClick}
          className="label-item-name"
          style={{
            color: (index === selShapeIndex) ? '#ff4d4f' : '#000000d9'
          }}
        >
          {label}
        </div>
      </Col>
      <Col xs={10} style={{ textAlign: 'end' }}>
        <Space>
          <Button
            size="small"
            shape="circle"
            title={visible ? 'Hide label' : 'Show label'}
            icon={visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={onItemVisibleClick}
          />
          <Button
            type="primary"
            size="small"
            shape="circle"
            title="Edit label"
            icon={<EditOutlined />}
            onClick={onItemEditClick}
          />
          <Button
            type="primary"
            danger
            size="small"
            shape="circle"
            title="Delete label"
            icon={<DeleteOutlined />}
            onClick={onItemDeleteClick}
          />
        </Space>
      </Col>
    </Row>
  );
}

LabelItem.propTypes = {
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired
};

export default LabelItem;
