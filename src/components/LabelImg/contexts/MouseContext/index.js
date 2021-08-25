import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import reducer from './reducer';
import { coordinatePropTypes } from '../../propTypes';

const MouseContext = createContext({
  state: null,
  dispatch: () => null
});

const MouseContextProvider = ({ initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MouseContext.Provider value={{ state, dispatch }}>{children}</MouseContext.Provider>
  );
};

const useMouseContext = () => {
  const store = useContext(MouseContext);
  if (!store) {
    throw new Error('Cannot use `useMouseContextContext` outside of MouseContextProvider');
  }
  return store;
};

MouseContextProvider.propTypes = {
  initialState: PropTypes.shape({
    mouseCoordinate: PropTypes.shape(coordinatePropTypes)
  }).isRequired
};

export {
  MouseContextProvider, useMouseContext
};
