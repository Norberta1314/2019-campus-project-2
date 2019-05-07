import * as actionTypes from './actionTypes'

const defaultState = {
  user:'',
}

export default (state = defaultState, action) => {
  if (action.type === actionTypes.ADD_USER) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.user = action.user
    console.log("reducer")
    console.log(action.user)
    return newState
  }
  return state
}