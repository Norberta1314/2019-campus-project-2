
import * as actionTypes from './actionTypes'
import request from '../../../utils/request';

export const addUser = (user) => ({
  type: actionTypes.ADD_USER,
  user: user
})
export const changeUserPer = () => {
  return(dispatch) => {
    const user = request('/user')
    console.log("actionCreators")
    console.log(user)
    const action = addUser(user)
    dispatch(action)
  }
}