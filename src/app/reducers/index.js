import { combineReducers } from 'redux';
import Sidebar from './sidebar'
import SidebarList from './sidebar/sidebarList'
import Menubar from './menu'
import Editor from './editor'



export default combineReducers({
    Sidebar: Sidebar,
    Menubar:Menubar,
    SidebarList:SidebarList,
    Editor: Editor
});

