// actions.js

// Action types
export const GET_DATA = 'GET_DATA';
export const SET_DATA = 'SET_DATA';
export const DELETE_DATA = 'DELETE_DATA';

// Action creators
export const getData = () => ({
  type: GET_DATA
});

export const setData = (data) => ({
  type: SET_DATA,
  payload: data
});

export const deleteData = () => ({
  type: DELETE_DATA
});
