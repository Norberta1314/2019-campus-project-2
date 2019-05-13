import * as actionTypes from './actionTypes'
import request from '../../../utils/request';
import {queryMyApplys} from "../../../services/api";

export const addAwardList = (payload) => ({
  type: actionTypes.ADD_AWARD_LIST,
  applyList: payload.my_applys,
  count: payload.counts,
  currentPage: payload.page

})

export const getAwardList = (page, cb) => {
  return async (dispatch) => {
    const applyList = await queryMyApplys({page: page})
    const action = addAwardList(Object.assign(applyList, {page: page}))
    dispatch(action)
    if(cb) cb()
  }
}