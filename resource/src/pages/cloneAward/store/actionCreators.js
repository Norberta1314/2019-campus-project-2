import * as actionTypes from './actionTypes'
import request from '../../../utils/request';
import { queryApplyDetail, queryApplyWard, queryOrganizationsEdit } from '../../../services/api';

export const addOrganList = (detail) => ({
  type: actionTypes.GET_ORGANIZATION_List,
  organList: detail
})


export const getOrganList = () => {
  return async (dispatch) => {
    const result = await queryOrganizationsEdit()
    // console.log(result.message)
    const action = addOrganList(result.message)
    dispatch(action)
  }
}

export const postCloneAward = (data) => {
  return
}