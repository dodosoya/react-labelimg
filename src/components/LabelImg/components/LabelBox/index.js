import { useRef, useState } from 'react';
import {
  Modal, Row, Col, Input, Card, Button
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import { cloneDeep } from 'lodash';
import { useStoreContext } from '../../contexts/StoreContext';
import actionTypes from '../../contexts/StoreContext/actionTypes';
import { getSVGPathD } from '../../utils';
import { labelStatusTypes } from '../../constants';

function LabelBox() {
  const { state, dispatch } = useStoreContext();
  const {
    selDrawImageIndex, currentShape, shapes, selShapeIndex,
    selLabelType, labelBoxStatus, labelBoxVisible, labelTypes
  } = state;
  const draggleRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0, top: 0, bottom: 0, right: 0
  });

  const onOk = () => {
    if (!selLabelType) return;
    const shapesCopy = cloneDeep(shapes);
    if (labelBoxStatus === labelStatusTypes.CREATE) {
      const currentShapeCopy = cloneDeep(currentShape);
      currentShapeCopy.paths.pop();
      currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, true);
      currentShapeCopy.label = selLabelType;
      shapesCopy[selDrawImageIndex] = [...shapesCopy[selDrawImageIndex], currentShapeCopy];
    } else if (labelBoxStatus === labelStatusTypes.UPDATE) {
      shapesCopy[selDrawImageIndex][selShapeIndex].label = selLabelType;
    }
    dispatch({ type: actionTypes.SET_SHAPES, payload: { shapes: shapesCopy } });
    dispatch({
      type: actionTypes.SET_LABELBOX_STATUS,
      payload: {
        selLabelType,
        labelBoxVisible: false,
        labelBoxStatus: labelStatusTypes.IDLE
      }
    });
    dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
    if (!new Set(labelTypes).has(selLabelType)) {
      dispatch({
        type: actionTypes.SET_LABEL_TYPES,
        payload: { labelTypes: [selLabelType, ...labelTypes]  }
      });
    }
  };

  const onCancel = () => {
    dispatch({ type: actionTypes.SET_CURRENT_SHAPE, payload: { currentShape: null } });
    dispatch({
      type: actionTypes.SET_LABELBOX_STATUS,
      payload: {
        selLabelType,
        labelBoxVisible: false,
        labelBoxStatus: labelStatusTypes.IDLE
      }
    });
    dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
  };

  const onMouseOver = () => {
    setDisabled(prev => !prev);
  };

  const onMouseOut = () => {
    setDisabled(true);
  };

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y)
    });
  };

  const onInputLabelChange = event => {
    dispatch({
      type: actionTypes.SET_SEL_LABEL_TYPE,
      payload: { selLabelType: event.target.value }
    });
  };

  const onDeleteLableClick = value => {
    dispatch({
      type: actionTypes.SET_LABEL_TYPES,
      payload: { labelTypes: labelTypes.filter(item => item !== value) }
    });
  };

  const onLableItemClick = value => {
    dispatch({ type: actionTypes.SET_SEL_LABEL_TYPE, payload: { selLabelType: value } });
  };

  return (
    <Modal
      width="300px"
      maskClosable={false}
      title={(
        <div
          style={{ width: '100%', cursor: 'move' }}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => {}}
          onBlur={() => {}}
          // end
        >
          Label Box
        </div>
      )}
      visible={labelBoxVisible}
      onOk={onOk}
      onCancel={onCancel}
      modalRender={modal => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      okButtonProps={{
        disabled: !selLabelType
      }}
    >
      <Row type="flex" justify="center" gutter={[8, 12]}>
        <Col xs={24}>
          <Input value={selLabelType} onChange={onInputLabelChange} allowClear />
        </Col>
        <Col xs={24}>
          <Card size="small" style={{ maxHeight: '170px', overflow: 'auto' }}>
            <Row
              type="flex"
              justify="center"
              gutter={[8, 8]}
            >
              {labelTypes.map(item => (
                <Col key={item} xs={24} className="label-item">
                  <Row type="flex" justify="space-between" gutter={[8, 8]}>
                    <Col xs={20}>
                      <div
                        title={item}
                        onClick={() => onLableItemClick(item)}
                        className="label-item-name"
                        style={{ width: '100%' }}
                      >
                        {item}
                      </div>
                    </Col>
                    <Col xs={4}>
                      <Button
                        danger
                        type="primary"
                        size="small"
                        shape="circle"
                        title="Delete label"
                        icon={<DeleteOutlined />}
                        onClick={() => onDeleteLableClick(item)}
                      />
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}

export default LabelBox;
