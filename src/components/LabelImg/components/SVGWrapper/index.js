import { useEffect, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import SVGImage from './SVGImage';
import { useStoreContext } from '../../contexts/StoreContext';
import { useMouseContext } from '../../contexts/MouseContext';
import actionTypes from '../../contexts/StoreContext/actionTypes';
import mouseActionTypes from '../../contexts/MouseContext/actionTypes';
import {
  getImageSize, coordinateFactory, getSVGPathD, getShapeXYMaxMin,
  drawStyleFactory, shapeFactory, imageSizeFactory
} from '../../utils';
import {
  drawStatusTypes, labelStatusTypes, shapeTypes
} from '../../constants';

function SVGWrapper() {
  const svgRef = useRef(null);
  const { state, dispatch } = useStoreContext();
  const { state: mouseState, dispatch: mouseDispatch } = useMouseContext();
  const {
    imageFiles, selDrawImageIndex, imageSizes, currentShape,
    drawStyle, drawStatus, selShapeType, selShapeIndex, shapes,
    selLabelType, closePointRegion
  } = state;
  const {
    shapeStyle, selShapeStyle, drawingShapePathStyle, drawingShapePointStyle, labelStyle
  } = drawStyle;
  const { mouseCoordinate } = mouseState;

  useEffect(async () => {
    if (selDrawImageIndex === null || imageFiles.length === 0) return;

    const objURL = window.URL.createObjectURL(imageFiles[selDrawImageIndex]);
    try {
      const size = await getImageSize(objURL);
      const { width, height } = size;
      dispatch({
        type: actionTypes.SET_IMAGE_SIZES,
        payload: {
          imageSizes: imageSizes.map((item, index) => (
            index === selDrawImageIndex ? imageSizeFactory({ width, height }) : item
          )),
          drawStyle: drawStyleFactory(width > height ? width : height)
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, [imageFiles, selDrawImageIndex]);

  const isValidCoordinate = ({ x, y }) => (
    x >= 0 && x <= imageSizes[selDrawImageIndex].width
    && y >= 0 && y <= imageSizes[selDrawImageIndex].height
  );

  useEffect(() => {
    if (imageFiles.length === 0) return;
    if (isValidCoordinate({ ...mouseCoordinate })) {
      svgRef.current.style.cursor = 'crosshair';
      if (currentShape && currentShape.paths.length > 0) {
        // change cursor when the current point is equal to the first point
        if (selShapeType === shapeTypes.POLYGON
          && Math.abs(currentShape.paths[0].x - mouseCoordinate.x) <= closePointRegion
          && Math.abs(currentShape.paths[0].y - mouseCoordinate.y) <= closePointRegion
        ) {
          svgRef.current.style.cursor = 'pointer';
        } else {
          svgRef.current.style.cursor = 'crosshair';
        }
      }
    } else {
      svgRef.current.style.cursor = 'not-allowed';
    }
  }, [imageFiles, currentShape, mouseCoordinate]);

  const imageProps = useMemo(() => {
    if (selDrawImageIndex === null) {
      return { href: '', width: 0, height: 0 };
    }
    return {
      href: window.URL.createObjectURL(imageFiles[selDrawImageIndex]),
      width: imageSizes[selDrawImageIndex].width,
      height: imageSizes[selDrawImageIndex].height
    };
  }, [imageFiles, selDrawImageIndex, imageSizes]);

  const getMouseCoordinate = event => {
    if (!event) return coordinateFactory({ x: 0, y: 0 });

    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return coordinateFactory({ x: 0, y: 0 });
    return coordinateFactory({
      x: parseInt((event.clientX - CTM.e) / CTM.a, 10),
      y: parseInt((event.clientY - CTM.f) / CTM.d, 10)
    });
  };

  // reset draw status
  const resetDrawStatus = () => {
    dispatch({
      type: actionTypes.SET_DRAW_STATUS,
      payload: { drawStatus: drawStatusTypes.IDLE }
    });
    svgRef.current.style.cursor = 'crosshair';
  };

  const movingRectangle = coordinate => {
    const currentShapeCopy = cloneDeep(currentShape);
    const point1 = currentShapeCopy.paths[0];
    const point3 = coordinate;
    const point2 = { x: point1.x, y: point3.y };
    const point4 = { x: point3.x, y: point1.y };
    currentShapeCopy.paths = [point1, point2, point3, point4, point1];
    currentShapeCopy.exactPathCount = currentShapeCopy.paths.length - 1;
    currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, false);
    dispatch({
      type: actionTypes.SET_CURRENT_SHAPE,
      payload: { currentShape: currentShapeCopy }
    });
  };

  const movingPolygon = coordinate => {
    const currentShapeCopy = cloneDeep(currentShape);
    if (currentShapeCopy.exactPathCount === currentShapeCopy.paths.length) {
      currentShapeCopy.paths.push(coordinate);
    } else {
      currentShapeCopy.paths[currentShapeCopy.paths.length - 1] = coordinate;
    }
    currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, false);
    dispatch({
      type: actionTypes.SET_CURRENT_SHAPE,
      payload: { currentShape: currentShapeCopy }
    });
  };

  // 畫矩形的點
  const drawRectanglePoint = () => {
    // finish drawing
    // 若只有一個點則不能結束該圖形
    if (currentShape.exactPathCount === 1) return;
    dispatch({
      type: actionTypes.SET_LABELBOX_STATUS,
      payload: {
        selLabelType,
        labelBoxVisible: true,
        labelBoxStatus: labelStatusTypes.CREATE
      }
    });
    resetDrawStatus();
  };

  // 畫多邊形的點
  const drawPolygonPoint = () => {
    if (currentShape.paths.length > 0
      && Math.abs(currentShape.paths[0].x - mouseCoordinate.x) <= closePointRegion
      && Math.abs(currentShape.paths[0].y - mouseCoordinate.y) <= closePointRegion
    ) {
      // finish drawing
      // 若只有一個點則不能結束該圖形
      if (currentShape.exactPathCount === 1) return;
      dispatch({
        type: actionTypes.SET_LABELBOX_STATUS,
        payload: {
          selLabelType,
          labelBoxVisible: true,
          labelBoxStatus: labelStatusTypes.CREATE
        }
      });
      resetDrawStatus();
    } else {
      // keep drawing
      // 若連續點擊相同的位置則不作任何動作
      if (currentShape.exactPathCount === currentShape.paths.length) return;
      const currentShapeCopy = cloneDeep(currentShape);
      currentShapeCopy.paths[currentShapeCopy.paths.length - 1] = { ...mouseCoordinate };
      currentShapeCopy.exactPathCount += 1;
      currentShapeCopy.d = getSVGPathD(currentShapeCopy.paths, false);
      dispatch({
        type: actionTypes.SET_CURRENT_SHAPE,
        payload: { currentShape: currentShapeCopy }
      });
    }
  };

  const isLeftMouseClick = event => event.button === 0;

  const onSVGMouseMove = event => {
    const coordinate = getMouseCoordinate(event);
    mouseDispatch({
      type: mouseActionTypes.SET_MOUSE_COORDINATE,
      payload: { mouseCoordinate: coordinate }
    });

    if (drawStatus !== drawStatusTypes.DRAWING && !currentShape) return;
    switch (selShapeType) {
      case shapeTypes.RECTANGLE:
        movingRectangle(coordinate);
        break;
      case shapeTypes.POLYGON:
        movingPolygon(coordinate);
        break;
      default:
    }
  };

  const onSVGMouseUp = event => {
    // 若非滑鼠左鍵則不做任何動作
    if (!isLeftMouseClick(event)) return;
    // 若滑鼠的座標在圖片外則不做任何動作
    if (!isValidCoordinate({ ...mouseCoordinate })) return;
    // 如果有圖形已被選擇則清除被選擇圖形
    if (drawStatus === drawStatusTypes.SELECT) {
      dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
      return;
    }

    if (drawStatus === drawStatusTypes.IDLE) {
      // start drawing
      const newShape = shapeFactory(mouseCoordinate);
      dispatch({
        type: actionTypes.SET_CURRENT_SHAPE,
        payload: { currentShape: newShape }
      });
      dispatch({
        type: actionTypes.SET_DRAW_STATUS,
        payload: { drawStatus: drawStatusTypes.DRAWING }
      });
    } else if (drawStatus === drawStatusTypes.DRAWING && currentShape) {
      switch (selShapeType) {
        case shapeTypes.RECTANGLE:
          drawRectanglePoint();
          break;
        case shapeTypes.POLYGON:
          drawPolygonPoint();
          break;
        default:
      }
    }
  };

  const onShapeMouseUp = (event, index) => {
    if (!isLeftMouseClick(event)) return;
    // can not select shape when drawing
    if (drawStatus === drawStatusTypes.DRAWING) return;

    event.stopPropagation();
    dispatch({
      type: actionTypes.SET_SEL_SHAPE_INDEX,
      payload: { selShapeIndex: index === selShapeIndex ? null : index }
    });
  };

  return (
    <div className="svg-wrapper">
      {imageFiles[selDrawImageIndex] && (
        <svg
          className="svg-container"
          ref={svgRef}
          viewBox={`0 0 ${imageSizes[selDrawImageIndex].width} ${imageSizes[selDrawImageIndex].height}`}
          onMouseMove={onSVGMouseMove}
          onMouseUp={onSVGMouseUp}
        >
          <SVGImage {...imageProps} />

          {currentShape && (
            <g>
              <path
                d={currentShape.d}
                style={{ ...drawingShapePathStyle }}
              />
              {currentShape.paths.map(point => (
                <circle
                  key={uuidv4()}
                  cx={point.x}
                  cy={point.y}
                  style={{ ...drawingShapePointStyle }}
                  r={drawingShapePointStyle.strokeWidth}
                />
              ))}
            </g>
          )}

          {shapes[selDrawImageIndex] && shapes[selDrawImageIndex].map((shape, index) => (
            !shape.visible ? null : (
              <g key={shape.d}>
                <path
                  d={shape.d}
                  style={shape.isSelect ? { ...selShapeStyle } : { ...shapeStyle }}
                  onMouseUp={event => onShapeMouseUp(event, index)}
                />
                {shape.label && (
                  <text
                    x={getShapeXYMaxMin(shape.paths).xmin}
                    y={getShapeXYMaxMin(shape.paths).ymin}
                    style={{ ...labelStyle }}
                  >
                    {shape.label}
                  </text>
                )}
              </g>
            )
          ))}
        </svg>
      )}
    </div>
  );
}

export default SVGWrapper;
