import * as actionTypes from './actionTypes'

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
  }
  return state
}