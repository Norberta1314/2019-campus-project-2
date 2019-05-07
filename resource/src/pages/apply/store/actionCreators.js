import * as actionTypes from './actionTypes'
import request from '../../../utils/request';

export const addAwardList = (awardList) => ({
  type: actionTypes.ADD_AWARD_LIST,
  awardList: awardList
})

export const getAwardList = () => {
  return async (dispatch) => {
    const awardList = await request('my/applys')
    const action = addAwardList(awardList)
    dispatch(action)
  }
}