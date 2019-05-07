import {combineReducers} from 'redux';
import {reducer as headerReducer} from '../common/header/store'
import {reducer as homeReducer} from '../pages/home/store'
import {reducer as applyReducer} from '../pages/apply/store'

export default combineReducers({
  header: headerReducer,
  home: homeReducer,
  apply: applyReducer
})