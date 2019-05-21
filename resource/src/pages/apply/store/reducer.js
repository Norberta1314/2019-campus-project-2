import * as actionTypes from './actionTypes'
import {deepClone} from '../../../utils/utils';

const defaultState = {
    currentPage: 1,
    count: 0,
    applyList: []
}

export default (state = defaultState, action) => {
    if (action.type === actionTypes.ADD_AWARD_LIST) {
        const newState = JSON.parse(JSON.stringify(state));
        Object.keys(newState).forEach((item) => {
            newState[item] = action[item]
        })
        return newState
    } else if (action.type === actionTypes.SET_APALY_LIST) {
        const newState = deepClone(state)
        newState.applyList = action.newApplyList.my_applys
        newState.count = action.newApplyList.counts
        newState.currentPage = 1
        return newState
    }
    return state
}
