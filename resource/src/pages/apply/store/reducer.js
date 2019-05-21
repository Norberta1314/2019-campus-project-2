import * as actionTypes from './actionTypes'
import { deepClone } from '../../../utils/utils';

const defaultState = {
  currentPage: 1,
  count: 0,
  applyList: []
}

export default (state = defaultState, action) => {
  if ( action.type === actionTypes.ADD_AWARD_LIST) {
    const newState = JSON.parse(JSON.stringify(state));
    Object.keys(newState).forEach((item) => {
      newState[item] = action[item]
    })
    return newState
  } else if (action.type === actionTypes.SET_APALY_LIST) {
    const newState = deepClone(state)
    console.log(newState.applyList)
    console.log(action)
    newState.applyList = action.newApplyList.my_applys
    return newState
  }
  return state
}
