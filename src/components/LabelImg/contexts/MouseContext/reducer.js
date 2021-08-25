import actionTypes from './actionTypes';

export default (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.SET_MOUSE_COORDINATE:
      return {
        ...state,
        mouseCoordinate: payload.mouseCoordinate
      };
    default:
      return state;
  }
};
