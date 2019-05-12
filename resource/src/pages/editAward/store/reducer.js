import * as actionTypes from "./actionTypes";
import {deepClone} from "../../../utils/utils";

const defaultState = {
    'organizations': [],
  award: {}
}


export default (state = defaultState, action) => {
  if ( action.type === actionTypes.ADD_ORGANIZATIONS) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.organizations = action.organizations
    return newState
  }

  if (action.type === actionTypes.GET_AWARD) {
    const newState = deepClone(state)
    newState.award = action.award
    return newState
  }

  if (action.type === actionTypes.RESET) {
    return defaultState
  }
  return state
}