
import * as actionTypes from './actionTypes'
import {queryUserInfo} from "../../../services/user";
import {addUser} from "../../home/store/actionCreators";
import {queryAward, queryOrganizationsEdit} from "../../../services/api";

export const addOrganizations = (organizations) => ({
  type: actionTypes.ADD_ORGANIZATIONS,
  organizations: organizations
})



export const changeOrganizations = () => {
  return async (dispatch) => {
    const organizations = await queryOrganizationsEdit()
    const action = addOrganizations(organizations.message)
    dispatch(action)
  }
}


export const getAward = (award) => ({
  type: actionTypes.GET_AWARD,
  award: award
})

export const getAwardOp = (id) => {
  return async (dispatch) => {
    const award = await queryAward(id)
    const action = getAward(award)
    dispatch(action)
  }
}

export const reset = () => ({
  type: actionTypes.RESET
})

