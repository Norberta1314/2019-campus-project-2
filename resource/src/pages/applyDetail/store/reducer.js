import * as actionTypes from './actionTypes'
import {deepClone} from "../../../utils/utils";

const defaultState = {
    awardDetail: {},
    type: 0,
    apply: {}
}

export default (state = defaultState, action) => {
  if ( action.type === actionTypes.GET_DETAIL) {
    const newState = deepClone(state);
    newState.awardDetail = action.awardDetail
    newState.type = 0
    return newState
  }

  if (action.type === actionTypes.GET_APPLY) {
    const newState = deepClone(state)
    newState.awardDetail = action.awardDetail
    newState.apply = action.apply
    newState.type = action._type
    return newState
  }
  return state
}
