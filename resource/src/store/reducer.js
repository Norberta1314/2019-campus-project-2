import {combineReducers} from 'redux';
import {reducer as headerReducer} from '../common/header/store'
import {reducer as homeReducer} from '../pages/home/store'
import {reducer as applyReducer} from '../pages/apply/store'
import {reducer as editAwardReducer} from '../pages/editAward/store'
import {reducer as organizationReducer} from '../pages/organization/store'
import {reducer as awardReducer} from '../pages/award/store'
import {reducer as checkReducer} from '../pages/check/store'
import {reducer as awardDetailReducer} from '../common/awardDetail/store'
import {reducer as applyDetailReducer} from '../pages/applyDetail/store'

export default combineReducers({
  header: headerReducer,
  home: homeReducer,
  apply: applyReducer,
  editAward: editAwardReducer,
  organization: organizationReducer,
  award: awardReducer,
  awardDetail: awardDetailReducer,
  check: checkReducer,
  applyDetail: applyDetailReducer
})