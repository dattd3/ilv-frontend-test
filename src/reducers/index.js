import { combineReducers } from 'redux'
import requestDetail from './requestDetail'
import globalStatuses from './GlobalStatuses'

export default combineReducers({ requestDetail, globalStatuses });