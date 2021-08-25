import { useState } from 'react';
import {
  Modal, Row, Col, Input, Select, message
} from 'antd';
import { useStoreContext } from '../../contexts/StoreContext';
import actionTypes from '../../contexts/StoreContext/actionTypes';
import { getImage } from '../../utils';
import { imageTypes } from '../../constants';

const { Option } = Select;

function ImageURLBox() {
  const { state, dispatch } = useStoreContext();
  const {
    imageFiles, selDrawImageIndex, imageSizes, drawStatus,
    shapes, selShapeIndex, urlBoxVisible
  } = state;
  const [imageUrl, setImageUrl] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [loading, setLoading] = useState(false);

  const onImageUrlChange = event => {
    setImageUrl(event.target.value);
  };

  const onImageNameChange = event => {
    setImageName(event.target.value);
  };

  const onImageTypeChange = value => {
    setImageType(value);
  };

  const onOk = async () => {
    if (!imageUrl || !imageName || !imageType) return;
    setLoading(true);
    try {
      const { file, size } = await getImage(imageUrl, `${imageName}.${imageType}`);
      dispatch({
        type: actionTypes.SET_IMAGE_FILES,
        payload: {
          imageFiles: [...imageFiles, file],
          selDrawImageIndex: imageFiles.length ? selDrawImageIndex : 0,
          imageSizes: [...imageSizes, size],
          drawStatus,
          shapes: [...shapes, []],
          selShapeIndex
        }
      });
      message.success(`Success to load ${imageName}.${imageType}.`);
      setImageUrl(null);
      setImageName(null);
      setImageType(null);
    } catch (error) {
      message.error(`Failure to load ${imageName}.${imageType}.`);
      console.error(error);
    }
    setLoading(false);
  };

  const onCancel = () => {
    dispatch({
      type: actionTypes.SET_URL_BOX_STATUS,
      payload: { urlBoxVisible: false }
    });
  };

  return (
    <Modal
      width="320px"
      title="Image URL Box"
      maskClosable={false}
      visible={urlBoxVisible}
      confirmLoading={loading}
      onOk={onOk}
      onCancel={onCancel}
      okText="Load"
      okButtonProps={{
        disabled: !(imageUrl && imageName && imageType)
      }}
    >
      {urlBoxVisible && (
        <Row type="flex" justify="center" gutter={[8, 8]}>
          <Col xs={24}>
            <Input
              allowClear
              value={imageUrl}
              onChange={onImageUrlChange}
              placeholder="Image URL"
            />
          </Col>
          <Col xs={24}>
            <Input
              allowClear
              value={imageName}
              onChange={onImageNameChange}
              placeholder="Image Name"
            />
          </Col>
          <Col xs={24}>
            <Select
              value={imageType}
              onChange={onImageTypeChange}
              placeholder="Image Type"
              style={{ width: '100%' }}
            >
              {imageTypes.map(type => (
                <Option key={type} value={type}>{type.toUpperCase()}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      )}
    </Modal>
  );
}

export default ImageURLBox;
