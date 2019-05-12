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
    state.currentPage = action.page
    return newState
  }
  if (action.type === actionTypes.UPDATE_PAGEDATA) {
    const newState = deepClone(state)
    state.lastData = action.lastData
    state.count = action.count
    return newState
  }
  return state
}