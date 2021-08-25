import { Row, Col } from 'antd';
import LabelItem from './LabelItem';
import { useStoreContext } from '../../../contexts/StoreContext';

function LabelList() {
  const { state } = useStoreContext();
  const { selDrawImageIndex, shapes } = state;

  return (
    <Row type="flex" justify="start" style={{ overflow: 'auto' }}>
      {shapes[selDrawImageIndex]
      && shapes[selDrawImageIndex].map((item, index) => (
        <Col key={item.d} xs={24}>
          <LabelItem index={index} label={item.label} visible={item.visible} />
        </Col>
      ))}
    </Row>
  );
}

export default LabelList;
