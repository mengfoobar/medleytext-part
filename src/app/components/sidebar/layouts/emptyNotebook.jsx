import React from 'react'

import {Grid, Row} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import {getTheme} from '../../../helper/themeHelper'


import style from '../styles/empty.css'

export default class EmptyNotes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={style.list}>
                <Grid className={`${style.container} ${getTheme().sidebarList_notebooks_empty}`}>
                    <Row className={`${style.icon} ${style.row}`}>
                        <FontAwesome name="book"/>
                    </Row>
                    <Row  className={`${style.msg} ${style.row}`}>
                        <span>Click on  </span>
                        <FontAwesome className={`${style.icon_small}`} name="plus-square-o"/>
                        <span>  to add notebook</span>
                    </Row>

                </Grid>
            </div>)
    }

}

