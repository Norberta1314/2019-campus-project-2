import * as actionTypes from './actionTypes'
import request from '../../../utils/request';
import {queryAward} from "../../../services/api";



export const addDetail = (detail) => ({
    type: actionTypes.GET_DETAIL,
    detail: detail
})


export const getDetail = (id, cb) => {
    return async (dispatch) => {
        const result = await queryAward(id)
        const action = addDetail(result)
        dispatch(action)
        if (cb) cb()
    }
}