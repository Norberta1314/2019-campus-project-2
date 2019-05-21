import * as actionTypes from "./actionTypes";
import {deepClone} from "../../../utils/utils";

const defaultState = {
  data: [],
  currentPage: 1,
  count: 0
}

export default (state = defaultState, action) => {
  if ( action.type === actionTypes.CHANGE_PAGE ) {
    const newState = deepClone(state);
    Object.keys(newState).map((value) => {
      newState[value] = action[value]
    })
    return newState
  } else if (action.type === actionTypes.SET_AWARD_LIST) {
    const newState = deepClone(state)
    newState.data = action.awards
    return newState
  }
  return state
}
