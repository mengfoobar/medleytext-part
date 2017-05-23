import React from 'react'

import {Grid, Row} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import {getTheme} from '../../../helper/themeHelper'


import style from '../styles/loading.css'

export default class EmptyNotes extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`${style.list}`}>
                <Grid className={`${style.container} ${getTheme().sidebarList_loading}`}>
                    <Row className={`${style.icon} ${style.row}`}>
                        <FontAwesome name="spinner" spin/>
                    </Row>
                    <Row  className={`${style.msg} ${style.row}`}>
                        <span>Loading...  </span>
                    </Row>

                </Grid>
            </div>)
    }

}
