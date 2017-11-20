import { combineReducers } from 'redux';
import userReducer from './user';
import fileroom from './fileroom';
import uploadReducer from './upload';
import network from './network';
import notification from './notification';
const rootReducer = combineReducers({
  user: userReducer,
  upload: uploadReducer,
  location: fileroom,
  network,
  notification
});

export default rootReducer;
