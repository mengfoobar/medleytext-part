let App=null;


export const initModalManager=(instance)=>{
    App=instance;
}

//TODO: handle scenario for if modal already open
export const showModal=(modalType, onSubmit, params=null, allowClose=true)=>{
    App.setState({
        modal:{
            show:true,
            type: modalType,
            onSubmit: onSubmit,
            params:params,
            allowClose:allowClose
        }
    })
}


export const hideModal=()=>{
    App.setState({
        modal:{
            show:false,
            type:""
        }
    })
}

export const ModalTypes={
    SETTINGS:"settings",
    SHORTCUTS:"shortcuts",
    GET_WORKSPACE:"get_workspace",
    NEW_NOTEBOOK:"new_notebook",
    CONFIRM_DELETE_NOTEBOOK:"confirm_delete_notebook",
    EDIT_NOTEBOOK:"edit_notebook",
    EDIT_NOTE:"edit_note"
}