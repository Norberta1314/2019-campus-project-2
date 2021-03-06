import * as actionTypes from './actionTypes'
import request from '../../../utils/request';
import { queryApplyDetail, queryApplyWard } from '../../../services/api';


export const addDetail = (detail) => ({
  type: actionTypes.GET_DETAIL,
  awardDetail: detail
})


export const getDetail = (id, cb) => {
  return async (dispatch) => {
    const result = await queryApplyWard(id)
    const action = addDetail(result)
    dispatch(action)
    if ( cb ) cb()
  }
}


export const addApply = (detail) => ({
  type: actionTypes.GET_APPLY,
  awardDetail: detail.award,
  apply: detail.myapply,
  _type: detail.type
})


export const getApply = (id, type, cb) => {
  return async (dispatch) => {
    const result = await queryApplyDetail(id)
    const action = addApply(Object.assign(result, {type: type}))
    dispatch(action)
    if ( cb ) cb()
  }
}