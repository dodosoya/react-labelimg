import {
  Menu, Dropdown, Button, message
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useStoreContext } from '../../../contexts/StoreContext';
import actionTypes from '../../../contexts/StoreContext/actionTypes';
import { drawStatusTypes } from '../../../constants';
import { generateXML, exportZip } from '../../../utils';

function FileListSetting() {
  const { state, dispatch } = useStoreContext();
  const {
    imageFiles, selDrawImageIndex, selImageIndexes, imageSizes, drawStatus, shapes, selShapeIndex
  } = state;

  const onSelectClick = isAll => {
    if (!isAll && selImageIndexes.length === 0) return;
    const indexes = isAll ? imageFiles.map((item, index) => index) : [];
    dispatch({
      type: actionTypes.SET_SEL_IMAGE_INDEXES,
      payload: { selImageIndexes: indexes }
    });
  };

  const onClearSelectClick = () => {
    if (selImageIndexes.length === 0) return;
    const newImageFiles = imageFiles.filter((item, index) => (
      selImageIndexes.indexOf(index) === -1
    ));
    const newShapes = shapes.filter((item, index) => (
      selImageIndexes.indexOf(index) === -1
    ));
    const newImageSizes = imageSizes.filter((item, index) => (
      selImageIndexes.indexOf(index) === -1
    ));
    let newSelDrawImageIndex = selDrawImageIndex;
    if (newImageFiles.length === 0) {
      newSelDrawImageIndex = null;
    } else if (selImageIndexes.indexOf(selDrawImageIndex) !== -1) {
      newSelDrawImageIndex = 0;
    } else {
      selImageIndexes.forEach(item => {
        if (item < selDrawImageIndex) newSelDrawImageIndex--;
      });
    }
    dispatch({
      type: actionTypes.SET_IMAGE_FILES,
      payload: {
        imageFiles: newImageFiles,
        selDrawImageIndex: newSelDrawImageIndex,
        imageSizes: newImageSizes,
        drawStatus: selImageIndexes.indexOf(selDrawImageIndex) === -1
          ? drawStatus : drawStatusTypes.IDLE,
        shapes: newShapes,
        selShapeIndex: selImageIndexes.indexOf(selDrawImageIndex) === -1 ? selShapeIndex : null
      }
    });
  };

  const onClearAllClick = () => {
    dispatch({
      type: actionTypes.SET_IMAGE_FILES,
      payload: {
        imageFiles: [],
        selDrawImageIndex: null,
        imageSizes: [],
        drawStatus: drawStatusTypes.IDLE,
        shapes: [],
        selShapeIndex: null
      }
    });
  };

  const onSaveSelectClick = () => {
    if (selImageIndexes.length === 0) {
      message.info('No images are selected.');
      return;
    }
    const files = [];
    const xmls = [];
    imageFiles.forEach((file, index) => {
      if (selImageIndexes.indexOf(index) === -1) return;
      files.push(file);
      const xml = generateXML(
        file,
        imageSizes[index],
        shapes[index]
      );
      xmls.push(xml);
    });
    exportZip(files, xmls);
  };

  const onSaveAllClick = () => {
    if (imageFiles.length === 0) {
      message.info('No images are loaded.');
      return;
    }
    const xmls = imageFiles.map((file, index) => (
      generateXML(file, imageSizes[index], shapes[index])
    ));
    exportZip(imageFiles, xmls);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="text" size="small" onClick={() => onSelectClick(true)}>Select All</Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" size="small" onClick={() => onSelectClick(false)}>Select None</Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" size="small" onClick={onClearSelectClick}>Clear Select</Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" size="small" onClick={onClearAllClick}>Clear All</Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" size="small" onClick={onSaveSelectClick}>Save Select</Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" size="small" onClick={onSaveAllClick}>Save All</Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight" arrow>
      <SettingOutlined />
    </Dropdown>
  );
}

export default FileListSetting;
