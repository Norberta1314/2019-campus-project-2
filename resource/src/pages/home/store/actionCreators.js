import * as actionTypes from './actionTypes'
import request from '../../../utils/request';
import {queryUserInfo} from "../../../services/user";
import {queryIndexHis} from "../../../services/api";

export const addUser = (user) => ({
  type: actionTypes.ADD_USER,
  user: user
})
export const changeUserPer = () => {
  return async (dispatch) => {
    const user = await queryUserInfo()
    const action = addUser(user)
    dispatch(action)
  }
}


export const updatePage= (page) => ({
  type: actionTypes.UPDATE_PAGE,
  current: page
})

export const updatePageData = (data) => ({
  type: actionTypes.UPDATE_PAGEDATA,
  lastData: data.awards,
  count: data.counts
})

export const changePage = (page) => {
  return async (dispatch) => {
    const pageAction = updatePage(page)
    dispatch(pageAction)
    const pageData = await queryIndexHis({page: page})
    const dataAction = updatePageData(pageData)
    dispatch(dataAction)
  }
}