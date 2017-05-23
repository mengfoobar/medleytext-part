import React from 'react';
import {Modal} from 'react-bootstrap'

import '!style!css!./styles/baseModal.css';

import {hideModal} from '../../helper/modalManager.js'

import Settings from './settings.jsx'
import Shortcuts from './shortcuts.jsx'
import GetWorkspace from './getWorkspacePath.jsx'
import CreateNotebook from './createNotebook.jsx'
import DeleteNotebook from './confirmDeleteNoteBook.jsx'
import EditNotebook from './editNotebook.jsx'
import EditNote from './editNote.jsx'






class ModalContainer extends React.Component  {

    constructor() {
        super();
        this.getModalLayout = this.getModalLayout.bind(this);
    }

    getModalLayout=(type)=>{
        const {onSubmit, params} = this.props;

        switch (type){
            case "settings":
                return {title:"Settings", body:(<Settings hide={hideModal} />), customClass:"modal-large"}
            case "shortcuts":
                return {title:"Shortcuts", body:(<Shortcuts hide={hideModal} />), customClass:"modal-large"}
            case "get_workspace":
                return {title:"Select path for workspace", body:(<GetWorkspace hide={hideModal} onSubmit={onSubmit} />), customClass:"modal-small"}
            case "new_notebook":
                return {title:"New Notebook", body:(<CreateNotebook onSubmit={onSubmit}  hide={hideModal} />), customClass:"modal-small"}
            case "confirm_delete_notebook":
                return {title:"Delete Notebook", body:(<DeleteNotebook  onSubmit={onSubmit} hide={hideModal} params={params} />), customClass:"modal-small"}
            case "edit_notebook":
                return {title:"Edit Notebook", body:(<EditNotebook  onSubmit={onSubmit} hide={hideModal} params={params} />),customClass:"modal-small"}
            case "edit_note":
                return {title:"Move Note", body:(<EditNote onSubmit={onSubmit} hide={hideModal} params={params} />), customClass:"modal-small"}
            default:
                return {title:"", body:(<div/>)};
        }
    }


    render(){
        const {allowClose=true,  show, type} = this.props;
        const {title, body, customClass} = this.getModalLayout(type)

        return (
            <Modal
                show={show}
                onHide={hideModal}
                dialogClassName={`modalWindow ${customClass}`}
                keyboard={allowClose}
                backdrop={allowClose?true:'static'}
                autoFocus={true}>

                <Modal.Header closeButton={allowClose}>
                    <Modal.Title style={{
                        margin: '0 auto', textAlign: 'center',padding: 0, paddingTop:15,
                        fontSize: 22, fontFamily: "'Roboto', sans-serif", color: '#595959'}}>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{margin: '0 auto', textAlign: 'center', padding:30}}>
                    {body}
                </Modal.Body>
            </Modal>
        )
    }
}


export default ModalContainer;