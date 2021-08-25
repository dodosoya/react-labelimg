import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import reducer from './reducer';
import {
  imageSizePropTypes, shapePropTypes, drawStylePropTypes
} from '../../propTypes';

const StoreContext = createContext({
  dispatch: () => null,
  state: null
});

const StoreContextProvider = ({ initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
  );
};

const useStoreContext = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('Cannot use `useStoreContextContext` outside of StoreContextProvider');
  }
  return store;
};

StoreContextProvider.propTypes = {
  initialState: PropTypes.shape({
    imageFiles: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
    selDrawImageIndex: PropTypes.number,
    selImageIndexes: PropTypes.arrayOf(PropTypes.number),
    imageSize: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape(imageSizePropTypes))),
    drawStyle: PropTypes.shape(drawStylePropTypes),
    drawSatus: PropTypes.string,
    selShapeType: PropTypes.string,
    currentShape: PropTypes.shape(shapePropTypes),
    shapes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape(shapePropTypes))),
    selShapeIndex: PropTypes.number,
    labelTypes: PropTypes.arrayOf(PropTypes.string),
    selLabelType: PropTypes.string,
    labelBoxStatus: PropTypes.string,
    labelBoxVisible: PropTypes.bool,
    selPreviewIndex: PropTypes.number,
    xmlPreviewBoxVisible: PropTypes.bool,
    urlBoxVisible: PropTypes.bool,
    closePointRegion: PropTypes.number
  }).isRequired
};

export {
  StoreContextProvider, useStoreContext
};
