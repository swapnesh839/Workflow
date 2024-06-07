import { combineReducers } from "redux";
import UpdataeData from "./Actions";

const rootReducer = combineReducers({
  data: UpdataeData
});

export default rootReducer;
