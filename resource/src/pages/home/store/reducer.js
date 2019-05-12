import * as actionTypes from './actionTypes'
import {deepClone} from "../../../utils/utils";

const defaultState = {
  user: {
    'nick': '用户昵称',
    'avatar': '用户头像',
    'permission': [
      'apply'
    ]
  },
  lastData: [],
  applys: [],
  currentPage: 1,
  count: 0
}

export default (state = defaultState, action) => {
  if ( action.type === actionTypes.ADD_USER ) {
    const newState = deepClone(state);
    newState.user = action.user
    return newState
  }
  if (action.type === actionTypes.UPDATE_PAGE) {
    const newState = deepClone(state)
    state.currentPage = action.current
    return newState
  }
  if (action.type === actionTypes.UPDATE_PAGEDATA) {
    const newState = deepClone(state)
    newState.lastData = action.lastData
    newState.count = action.count
    return newState
  }

  if (action.type === actionTypes.GET_APPLYS) {
    const newState = deepClone(state)
    newState.applys = action.applys
    return newState
  }
  return state
}