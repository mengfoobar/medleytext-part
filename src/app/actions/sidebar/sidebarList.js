export const setLoading = () => {
    return {
        type: 'LOADING'
    }
}

export const setError = (error) => {
    return {
        type: 'ERROR',
        data:{
            error:error
        }
    }
}

export const setNotebooks=(notebooks)=>{
    return {
        type: 'SET_NOTEBOOKS',
        data:{
            list:notebooks
        }
    }
}

export const setActiveNotebook=(index)=>{
    return {
        type: 'SET_ACTIVE_NOTEBOOK',
        data:{
            index:index
        }
    }
}

export const setActiveFolderPath=(path)=>{
    return {
        type: 'SET_ACTIVE_FOLDER_PATH',
        data:{path}
    }
}

export const setNotes=(notes)=>{
    return {
        type: 'SET_NOTES',
        data:{
            list:notes
        }
    }
}

export const setNote=(note, index)=>{
    return {
        type: 'SET_NOTE',
        data:{
            note, index
        }
    }
}


export const setActiveNote=(index)=>{
    return {
        type: 'SET_ACTIVE_NOTE',
        data:{
            index:index
        }
    }
}

export const insertNote=(newNote)=>{
    return {
        type: 'INSERT_NOTE',
        data:{
            note: newNote
        }
    }
}

export const deleteNote=(index)=>{
    return {
        type: 'DELETE_NOTE',
        data:{index}
    }
}


export const insertNotebook=(notebook)=>{
    return {
        type: 'INSERT_NOTEBOOK',
        data:{notebook}
    }
}

export const deleteNotebook=(index)=>{
    return {
        type: 'DELETE_NOTEBOOK',
        data:{index}
    }
}

export const editNotebook=(meta, index)=>{
    return {
        type: 'EDIT_NOTEBOOK',
        data:{meta, index}
    }
}