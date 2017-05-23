import { combineReducers } from 'redux'

import sidebar from '../sidebar'

const menubar = combineReducers({
    sidebar:sidebar
})

export default menubar