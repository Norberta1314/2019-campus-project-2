import * as actionTypes from "./actionTypes";
import {queryOrganizations} from "../../../services/api";


const changePage = (payload) => ({
    type: actionTypes.CHANGE_PAGE,
    data: payload.organizations,
    currentPage: payload.page,
    count: payload.counts
})

export const changePageData = (page) => {
    return async (dispatch) => {
        const result = await queryOrganizations({page: page})
        const action = changePage(Object.assign(result, {page: page}))
        dispatch(action)
    }
}
