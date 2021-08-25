import { cloneDeep } from 'lodash';
import actionTypes from './actionTypes';
import { drawStatusTypes } from '../../constants';

export default (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.SET_IMAGE_FILES:
      return {
        ...state,
        imageFiles: payload.imageFiles,
        selDrawImageIndex: payload.selDrawImageIndex,
        selImageIndexes: [],
        imageSizes: payload.imageSizes,
        drawStatus: payload.drawStatus,
        currentShape: null,
        shapes: payload.shapes,
        selShapeIndex: payload.selShapeIndex
      };
    case actionTypes.SET_SEL_DRAW_IMAGE_INDEX:
      return {
        ...state,
        selDrawImageIndex: payload.selDrawImageIndex,
        drawStatus: drawStatusTypes.IDLE,
        currentShape: null,
        selShapeIndex: null
      };
    case actionTypes.SET_IMAGE_SIZES:
      return {
        ...state,
        imageSizes: payload.imageSizes,
        drawStyle: payload.drawStyle
      };
    case actionTypes.SET_SEL_IMAGE_INDEXES:
      return {
        ...state,
        selImageIndexes: payload.selImageIndexes
      };
    case actionTypes.SET_DRAW_STATUS:
      return {
        ...state,
        drawStatus: payload.drawStatus
      };
    case actionTypes.SET_SEL_SHPAE_TYPE:
      return {
        ...state,
        selShapeType: payload.selShapeType
      };
    case actionTypes.SET_LABELBOX_STATUS:
      return {
        ...state,
        selLabelType: payload.selLabelType,
        labelBoxVisible: payload.labelBoxVisible,
        labelBoxStatus: payload.labelBoxStatus
      };
    case actionTypes.SET_XML_PREVIEW_BOX_STATUS:
      return {
        ...state,
        selPreviewIndex: payload.selPreviewIndex,
        xmlPreviewBoxVisible: payload.xmlPreviewBoxVisible
      };
    case actionTypes.SET_URL_BOX_STATUS:
      return {
        ...state,
        urlBoxVisible: payload.urlBoxVisible
      };
    case actionTypes.SET_CURRENT_SHAPE:
      return {
        ...state,
        currentShape: payload.currentShape
      };
    case actionTypes.SET_SHAPES:
      return {
        ...state,
        currentShape: null,
        shapes: payload.shapes
      };
    case actionTypes.SET_SEL_SHAPE_INDEX:
      return {
        ...state,
        drawStatus: payload.selShapeIndex === null
          ? drawStatusTypes.IDLE : drawStatusTypes.SELECT,
        shapes: state.shapes.map((item, index) => {
          if (index !== state.selDrawImageIndex) return item;
          return item.map((subItem, subIndex) => {
            const newSubItem = cloneDeep(subItem);
            newSubItem.isSelect = (subIndex === payload.selShapeIndex);
            return newSubItem;
          });
        }),
        selShapeIndex: payload.selShapeIndex
      };
    case actionTypes.SET_LABEL_TYPES:
      return {
        ...state,
        labelTypes: payload.labelTypes
      };
    case actionTypes.SET_SEL_LABEL_TYPE:
      return {
        ...state,
        selLabelType: payload.selLabelType
      };
    case actionTypes.DELETE_SEL_SHAPE:
      return {
        ...state,
        drawStatus: drawStatusTypes.IDLE,
        shapes: state.shapes.map((item, index) => (
          index === state.selDrawImageIndex
            ? item.filter((subItem, subIndex) => subIndex !== state.selShapeIndex)
            : item
        )),
        selShapeIndex: null
      };
    case actionTypes.DELETE_ALL_SHAPES:
      return {
        ...state,
        drawStatus: drawStatusTypes.IDLE,
        currentShape: null,
        shapes: state.shapes.map((item, index) => (
          index === state.selDrawImageIndex ? [] : item
        )),
        selShapeIndex: null
      };
    default:
      return state;
  }
};
