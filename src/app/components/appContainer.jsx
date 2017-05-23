import React from 'react';

import Menubar from '../containers/menubar/menubar'
import Sidebar from '../containers/sidebar/sidebar'
import Editor from '../containers/editor/editor'
import ModalConductor from '../components/modal/modalConductor.jsx'


import {getTheme} from '../helper/themeHelper'
import style from './styles/appContainer.css'
import {initialize} from '../helper/drive/driveHelper'
import {initModalManager} from '../helper/modalManager'
import {NotificationContainer} from 'react-notifications'
import {getEditorSettings} from '../helper/settingsManager'

const theme = getTheme();

//TODO: possibly turn this into a container
export default class AppContainer extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = 'AppContainer';
        this.state={
            initialized:false,
            modal: {
                show: false,
                type: "",
                onSubmit: () => {},
                params: null,
                allowClose:true
            }
        }
    }

    componentDidMount (){
        const self=this;
        initModalManager(this);

        initialize("desktop")
            .then((result)=>{
                if(result) self.setState({initialized:true})
            })
    }

    render(){
        const {modal} = this.state;
        let body=(<div />);

        if(this.state.initialized){
            body=(<div className={`${style.container} ${getEditorSettings().application.theme} ${theme.app}`}>
                    <Menubar />
                    <Sidebar />
                    <Editor />
                    <NotificationContainer />
                </div>)
        }

        return (
            <div className={style.app}>
                <ModalConductor show={modal.show} type={modal.type} allowClose={modal.allowClose} onSubmit={modal.onSubmit} params={modal.params}/>
                {body}
            </div>
        );
    }

}