import {
  Row, Col, Button, Radio, Space
} from 'antd';
import { cloneDeep } from 'lodash';
import { useStoreContext } from '../../contexts/StoreContext';
import actionTypes from '../../contexts/StoreContext/actionTypes';
import { drawStatusTypes, shapeTypeOptions } from '../../constants';

function DrawTool() {
  const { state, dispatch } = useStoreContext();
  const {
    selDrawImageIndex, selShapeType, selShapeIndex, currentShape, shapes
  } = state;

  const onResetClick = () => {
    const shapesCopy = cloneDeep(shapes);
    shapesCopy[selDrawImageIndex] = shapesCopy[selDrawImageIndex].map(item => {
      if (!item.isSelect) return item;
      const itemCopy = cloneDeep(item);
      itemCopy.isSelect = false;
      return itemCopy;
    });
    dispatch({ type: actionTypes.SET_SHAPES, payload: { shapes: shapesCopy } });
    dispatch({
      type: actionTypes.SET_DRAW_STATUS,
      payload: { drawStatus: drawStatusTypes.IDLE }
    });
  };

  const onSelShapeTypeChange = event => {
    if (event.target.value === selShapeType) return;
    dispatch({
      type: actionTypes.SET_SEL_SHPAE_TYPE,
      payload: { selShapeType: event.target.value }
    });
    onResetClick();
  };

  const onClearSelShapeClick = () => {
    dispatch({ type: actionTypes.DELETE_SEL_SHAPE });
  };

  const onClearAllClick = () => {
    dispatch({ type: actionTypes.DELETE_ALL_SHAPES });
  };

  return (
    <Row type="flex" justify="center" gutter={[0, 12]}>
      <Col xs={24} style={{ textAlign: 'center' }}>
        <Radio.Group
          value={selShapeType}
          onChange={onSelShapeTypeChange}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {shapeTypeOptions.map(item => (
              <Radio.Button
                key={item.value}
                value={item.value}
                style={{ width: '100%' }}
              >
                {item.label}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
      </Col>
      <Col xs={24}>
        <Button
          type="text"
          onClick={onResetClick}
          disabled={currentShape === null}
          style={{ width: '100%' }}
        >
          Reset
        </Button>
      </Col>
      <Col xs={24}>
        <Button
          type="text"
          onClick={onClearSelShapeClick}
          disabled={selShapeIndex === null}
          style={{ width: '100%' }}
        >
          Clear Select
        </Button>
      </Col>
      <Col xs={24}>
        <Button
          type="text"
          onClick={onClearAllClick}
          disabled={!shapes[selDrawImageIndex] || shapes[selDrawImageIndex].length === 0}
          style={{ width: '100%' }}
        >
          Clear All
        </Button>
      </Col>
    </Row>
  );
}

export default DrawTool;
