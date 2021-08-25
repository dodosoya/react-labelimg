import { Row, Col } from 'antd';
import { useStoreContext } from '../../contexts/StoreContext';
import { useMouseContext } from '../../contexts/MouseContext';

function StatusInfo() {
  const { state } = useStoreContext();
  const { state: mouseState } = useMouseContext();
  const {
    imageFiles, selDrawImageIndex, drawStatus, imageSizes
  } = state;
  const { mouseCoordinate } = mouseState;

  return (
    <Row
      type="flex"
      justify="space-between"
      align="middle"
      gutter={[4, 4]}
      style={{ height: '100%', width: '100%', padding: '0 4px' }}
    >
      <Col>
        {`Status: ${drawStatus}`}
      </Col>
      {imageFiles[selDrawImageIndex] && (
        <Col>
          {`${mouseCoordinate.x} x ${mouseCoordinate.y} px / ${imageSizes[selDrawImageIndex].width} x ${imageSizes[selDrawImageIndex].height} px`}
        </Col>
      )}
    </Row>
  );
}

export default StatusInfo;
