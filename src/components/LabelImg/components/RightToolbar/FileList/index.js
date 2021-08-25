import { Row, Col } from 'antd';
import FileItem from './FileItem';
import { useStoreContext } from '../../../contexts/StoreContext';

function FileList() {
  const { state } = useStoreContext();
  const { imageFiles } = state;

  return (
    <Row type="flex" justify="start" style={{ overflow: 'auto' }}>
      {imageFiles.map((item, index) => (
        <Col key={item.name} xs={24}>
          <FileItem index={index} name={item.name} />
        </Col>
      ))}
    </Row>
  );
}

export default FileList;
