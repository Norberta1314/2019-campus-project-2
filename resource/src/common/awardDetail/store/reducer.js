import * as actionTypes from './actionTypes'
import {deepClone} from "../../../utils/utils";

const defaultState = {
    detail: {}
}

export default (state = defaultState, action) => {
  if ( action.type === actionTypes.GET_DETAIL) {
    const newState = deepClone(state);
    newState.detail = action.detail
    return newState
  }
  return state
}
