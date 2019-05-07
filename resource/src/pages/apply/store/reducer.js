import * as actionTypes from './actionTypes'

const defaultState = {
  applyList: [{
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: -1,
    apply_time: '2014-12-31 18:20:1',
  }, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 0,
    apply_time: '2014-12-31 18:20:1',
  }, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 1,
    apply_time: '2014-12-31 18:20:1',
  }, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 2,
    apply_time: '2014-12-31 18:20:1',
  }, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 3,
    apply_time: '2014-12-31 18:20:1',
  }, {
    apply_id: '1',
    organization: '蓝鲸产品中心',
    apply_award: '季度之星',
    award_state: '生效中',
    apply_info: '黄树华',
    state: 4,
    apply_time: '2014-12-31 18:20:1',
  }]
}

export default (state = defaultState, action) => {
  if ( action.type === actionTypes.ADD_AWARD_LIST) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.applyList = action.applyList
    return newState
  }
  return state
}