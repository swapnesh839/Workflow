// reducer.js

import { GET_DATA, SET_DATA, DELETE_DATA } from './Actions';

// Initial state
const initialState = {
  data: null
};

// Reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      // Handle get data action
      return { ...state }; // Example: return unchanged state for now
    case SET_DATA:
      // Handle set data action
      return { ...state, data: action.payload };
    case DELETE_DATA:
      // Handle delete data action
      return { ...state, data: null };
    default:
      return state;
  }
};

export default reducer;