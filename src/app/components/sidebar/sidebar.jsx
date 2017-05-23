import React from 'react'
import style from './styles/sidebarWrapper.css'
import {getTheme} from '../../helper/themeHelper'

import SidebarList from '../../containers/sidebar/sidebarList'


export default class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = 'SidebarWrapper'
    }


    render() {
        const {isVisible, view} = this.props;
        let childView = (<SidebarList  />);


        return (
            <div className={`${style.sidebar} ${getTheme().sidebar} ${isVisible?"":style.sidebar_hidden}`} >
                {childView}
            </div>
        );
    }
}
