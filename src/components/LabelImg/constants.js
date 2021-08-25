export const drawStatusTypes = {
  IDLE: 'IDLE',
  DRAWING: 'DRAWING',
  SELECT: 'SELECT'
};

export const labelStatusTypes = {
  IDLE: 'IDLE',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE'
};

export const shapeTypes = {
  RECTANGLE: 'rectangle',
  POLYGON: 'polygon'
};
export const shapeTypeOptions = [
  { value: shapeTypes.RECTANGLE, label: 'Rectangle' },
  { value: shapeTypes.POLYGON, label: 'Polygon' }
];

export const defaultSaveFolder = 'labels';

export const imageTypes = ['jpg', 'jpeg', 'png'];
