import * as actionTypes from './actionTypes'

const defaultState = {
  choose: 1
}

export default (state = defaultState, action) => {
  if (action.type === actionTypes.TEST) {
    return state.set('choose', 2)
  }
  return state
}