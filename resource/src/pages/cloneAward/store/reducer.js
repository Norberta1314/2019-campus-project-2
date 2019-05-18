import * as actionTypes from './actionTypes'
import {deepClone} from "../../../utils/utils";

const defaultState = {
  organizationList:[],
}

export default (state = defaultState, action) => {
  if (action.type === actionTypes.GET_ORGANIZATION_List) {
    const newState = deepClone(state)
    console.log(action.organList)
    newState.organizationList = action.organList
    return newState
  }
  return state
}