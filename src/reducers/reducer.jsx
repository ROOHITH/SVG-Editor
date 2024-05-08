// reducer.js
import { combineReducers } from 'redux';
import { importSvgSlice } from '../features/importSvg/importSvgSlice';

const rootReducer = combineReducers({
  importSvg: importSvgSlice.reducer,
});

export default rootReducer;
