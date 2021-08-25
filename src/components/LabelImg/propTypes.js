import PropTypes from 'prop-types';

export const imageSizePropTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  depth: PropTypes.number
};

export const coordinatePropTypes = {
  x: PropTypes.number,
  y: PropTypes.number
};

export const shapePropTypes = {
  label: PropTypes.string,
  visible: PropTypes.bool,
  isSelect: PropTypes.bool,
  exactPathCount: PropTypes.number,
  paths: PropTypes.arrayOf(PropTypes.shape(coordinatePropTypes)),
  d: PropTypes.string
};

export const shapeStylePropTypes = {
  cursor: PropTypes.string,
  fill: PropTypes.string,
  fillOpacity: PropTypes.number,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number
};

export const drawingShapePathStylePropTypes = {
  ...shapeStylePropTypes,
  strokeLinecap: PropTypes.oneOf(['butt', 'round', 'square']),
  strokeLinejoin: PropTypes.oneOf(['butt', 'round', 'square']),
  strokeDasharray: PropTypes.string
};

export const drawingShapePointStylePropTypes = {
  fill: PropTypes.string,
  fillOpacity: PropTypes.number,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number
};

export const labelStylePropTypes = {
  fill: PropTypes.string,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.string
};

export const drawStylePropTypes = {
  shapeStyle: PropTypes.shape(shapeStylePropTypes),
  selShapeStyle: PropTypes.shape(shapeStylePropTypes),
  drawingShapePathStyle: PropTypes.shape(drawingShapePathStylePropTypes),
  drawingShapePointStyle: PropTypes.shape(drawingShapePointStylePropTypes),
  labelStyle: PropTypes.shape(labelStylePropTypes)
};
