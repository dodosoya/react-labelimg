import { Menu, Dropdown, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { useStoreContext } from '../../../contexts/StoreContext';
import actionTypes from '../../../contexts/StoreContext/actionTypes';

function LabelListSetting() {
  const { state, dispatch } = useStoreContext();
  const { selDrawImageIndex, shapes, selShapeIndex } = state;

  const onShowAllClick = visible => {
    if (shapes[selDrawImageIndex].length === 0) return;
    const shapesCopy = cloneDeep(shapes);
    shapesCopy[selDrawImageIndex] = shapesCopy[selDrawImageIndex].map(item => {
      if (item.visible === visible) return item;
      const itemCopy = cloneDeep(item);
      itemCopy.visible = visible;
      return itemCopy;
    });
    dispatch({ type: actionTypes.SET_SHAPES, payload: { shapes: shapesCopy } });
    if (selShapeIndex) {
      dispatch({ type: actionTypes.SET_SEL_SHAPE_INDEX, payload: { selShapeIndex: null } });
    }
  };

  const onClearAllClick = () => {
    if (shapes[selDrawImageIndex].length === 0) return;
    dispatch({ type: actionTypes.DELETE_ALL_SHAPES });
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="text" size="small" onClick={() => onShowAllClick(true)}>Show All</Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" size="small" onClick={() => onShowAllClick(false)}>Hide All</Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" size="small" onClick={onClearAllClick}>Clear All</Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight" arrow>
      <SettingOutlined />
    </Dropdown>
  );
}

export default LabelListSetting;
