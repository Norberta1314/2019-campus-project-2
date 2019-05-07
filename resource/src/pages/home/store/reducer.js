import * as actionTypes from './actionTypes'

const defaultState = {
  user:'',
}

export default (state = defaultState, action) => {
  if (action.type === actionTypes.ADD_USER) {
    console.log("reducer")
    console.log(action.user)
    return state.set('user', action.user)
  }
  return state
}