import { message } from 'antd';
import { useStoreContext } from '../../contexts/StoreContext';
import actionTypes from '../../contexts/StoreContext/actionTypes';
import { imageTypes } from '../../constants';
import {
  getURLExtension, imageSizeFactory, generateXML, exportZip
} from '../../utils';

function FileTool() {
  const { state, dispatch } = useStoreContext();
  const {
    imageFiles, selDrawImageIndex, imageSizes, drawStatus, shapes, selShapeIndex
  } = state;

  const onFilesChange = event => {
    // only allow image file
    const files = [...event.target.files].filter(file => (
      imageTypes.indexOf(getURLExtension(file.name).toLowerCase()) !== -1
    ));
    if (files.length === 0) return;
    const newImageFiles = [...imageFiles, ...files];
    const newImageSizes = newImageFiles.map((item, index) => (
      imageSizes[index] ? imageSizes[index] : imageSizeFactory({})
    ));
    const newShapes = newImageFiles.map((item, index) => (shapes[index] ? shapes[index] : []));
    dispatch({
      type: actionTypes.SET_IMAGE_FILES,
      payload: {
        imageFiles: newImageFiles,
        selDrawImageIndex: imageFiles.length ? selDrawImageIndex : 0,
        imageSizes: newImageSizes,
        drawStatus,
        shapes: newShapes,
        selShapeIndex
      }
    });
    const msg = files.length > 1 ? `${files.length} images` : `${files.length} image`;
    message.success(`Success to load ${msg}.`);
  };

  const onUrlClick = async () => {
    dispatch({
      type: actionTypes.SET_URL_BOX_STATUS,
      payload: { urlBoxVisible: true }
    });
  };

  const onNextImageClick = () => {
    if (!imageFiles.length || imageFiles.length < 2) return;
    let index = selDrawImageIndex + 1;
    if (index >= imageFiles.length) index = 0;
    dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
    dispatch({ type: actionTypes.SET_SEL_DRAW_IMAGE_INDEX, payload: { selDrawImageIndex: index } });
  };

  const onPrevImageClick = () => {
    if (!imageFiles.length || imageFiles.length < 2) return;
    let index = selDrawImageIndex - 1;
    if (index < 0) index = imageFiles.length - 1;
    dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
    dispatch({ type: actionTypes.SET_SEL_DRAW_IMAGE_INDEX, payload: { selDrawImageIndex: index } });
  };

  const onSaveClick = () => {
    if (imageFiles.length === 0) {
      message.info('No images are loaded.');
      return;
    }
    const xmls = imageFiles.map((file, index) => (
      generateXML(file, imageSizes[index], shapes[index])
    ));
    exportZip(imageFiles, xmls);
  };

  return (
    <ul className="file-tool-container">
      <li>
        <label>
          <span>Open</span>
          <input
            type="file"
            accept={imageTypes.map(type => `.${type}`).join(',')}
            multiple
            onChange={onFilesChange}
            style={{ display: 'none' }}
          />
        </label>
      </li>
      <li>
        <label>
          <span>Open Dir</span>
          <input
            type="file"
            accept={imageTypes.map(type => `.${type}`).join(',')}
            webkitdirectory="true"
            directory="true"
            multiple
            onChange={onFilesChange}
            style={{ display: 'none' }}
          />
        </label>
      </li>
      <li>
        <span onClick={onUrlClick}>Open URL</span>
      </li>
      <li>
        <span onClick={onNextImageClick}>Next Image</span>
      </li>
      <li>
        <span onClick={onPrevImageClick}>Prev Image</span>
      </li>
      <li>
        <span onClick={onSaveClick}>Save</span>
      </li>
    </ul>
  );
}

export default FileTool;
