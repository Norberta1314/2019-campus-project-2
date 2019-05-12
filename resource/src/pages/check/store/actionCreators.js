import * as actionTypes from "./actionTypes";


import {queryChecks} from "../../../services/api";

const changePage = (payload) => ({
    type: actionTypes.CHANGE_PAGE,
    data: payload.my_checks,
    currentPage: payload.page,
    count: payload.counts
})

export const changePageData = (page, cb) => {
    return async (dispatch) => {
        const result = await queryChecks({page: page})
        const action = changePage(Object.assign(result, {page: page}))
        dispatch(action)
        if (cb) cb()
    }
}