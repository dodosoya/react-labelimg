import { Divider } from 'antd';
import FileTool from './FileTool';
import DrawTool from './DrawTool';

const LeftToolbar = () => (
  <>
    <FileTool />
    <Divider style={{ margin: '0 0 16px 0' }} />
    <DrawTool />
  </>
);

export default LeftToolbar;
