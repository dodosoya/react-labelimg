import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import './index.css';
import LeftToolbar from './components/LeftToolbar';
import SVGWrapper from './components/SVGWrapper';
import RightToolbar from './components/RightToolbar';
import StatusInfo from './components/StatusInfo';
import LabelBox from './components/LabelBox';
import XMLPreviewBox from './components/XMLPreviewBox';
import ImageURLBox from './components/ImageURLBox';
import { StoreContextProvider } from './contexts/StoreContext';
import { MouseContextProvider } from './contexts/MouseContext';
import { drawStyleFactory } from './utils';
import { drawStatusTypes, labelStatusTypes, shapeTypes } from './constants';

function LabelImg(props) {
  const { labelTypes, closePointRegion } = props;

  const initialStoreState = {
    imageFiles: [],
    selDrawImageIndex: null,
    selImageIndexes: [],
    imageSizes: [],
    drawStyle: drawStyleFactory(0),
    drawStatus: drawStatusTypes.IDLE,   // 畫圖狀態
    selShapeType: shapeTypes.RECTANGLE, // 已選擇的圖形種類
    currentShape: null,                 // 目前畫圖的圖形資訊
    shapes: [],                         // 已畫完的圖形陣列
    selShapeIndex: null,                // 已選擇圖形的編號
    labelTypes,
    selLabelType: null,                 // 已選擇的標籤
    labelBoxStatus: labelStatusTypes.IDLE,
    labelBoxVisible: false,
    selPreviewIndex: null,
    xmlPreviewBoxVisible: false,
    urlBoxVisible: false,
    closePointRegion
  };
  const initialMouseState = {
    mouseCoordinate: { x: 0, y: 0 }
  };

  const onContextMenu = event => {
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('contextmenu', onContextMenu);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
    };
  }, []);

  return (
    <StoreContextProvider initialState={initialStoreState}>
      <MouseContextProvider initialState={initialMouseState}>
        <Row
          type="flex"
          justify="center"
          style={{ height: '100%' }}
        >
          <Col xs={24} style={{ height: '100%' }}>
            <Row
              type="flex"
              justify="center"
              style={{ height: '100%' }}
            >
              <Col xs={24} md={3} style={{ maxHeight: '100%', overflow: 'auto' }}>
                <LeftToolbar />
              </Col>
              <Col xs={24} md={16} style={{ height: '100%' }}>
                <Row
                  type="flex"
                  justify="center"
                  style={{ height: '100%' }}
                >
                  <Col xs={24} style={{ height: 'calc(100% - 30px)' }}>
                    <SVGWrapper />
                  </Col>
                  <Col xs={24} style={{ height: '30px' }}>
                    <StatusInfo />
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={5} style={{ maxHeight: '100%', overflow: 'auto' }}>
                <RightToolbar />
              </Col>
              <LabelBox />
              <XMLPreviewBox />
              <ImageURLBox />
            </Row>
          </Col>
        </Row>
      </MouseContextProvider>
    </StoreContextProvider>
  );
}

LabelImg.defaultProps = {
  labelTypes: [],
  closePointRegion: 4
};

LabelImg.propTypes = {
  labelTypes: PropTypes.arrayOf(PropTypes.string),
  closePointRegion: PropTypes.number
};

export default LabelImg;
