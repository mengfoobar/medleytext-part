const INITIAL_STATE = {loading:false, error:false, notebooks:[], activeNotebookIndex:0, notes:[], activeNoteIndex:0, activeFolderPath:""};

import Immutable from 'immutable'

const SidebarList = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case "LOADING":
            return {...state, listData:[], error:null, loading:true};
        case "ERROR":
            return {...state, listData:[], error:action.data.error, loading:false};
        case "SET_NOTEBOOKS":
            return {...state, notebooks:action.data.list, error:null, loading:false};
        case "SET_ACTIVE_NOTEBOOK":
            return {...state, activeNotebookIndex:action.data.index};
        case "SET_ACTIVE_FOLDER_PATH":
            return {...state, activeFolderPath:action.data.path}
        case "SET_NOTES":
            return {...state, notes:action.data.list, error:null, loading:false};
        case "SET_NOTE":
            let curNotes = Immutable.List(state.notes);
            const setNoteUpdated = curNotes.set(action.data.index, action.data.note);
            return {...state, notes:setNoteUpdated.toArray()};
        case "SET_ACTIVE_NOTE":
            return {...state, activeNoteIndex:action.data.index};
        case "INSERT_NOTE":
            let newNotes = Immutable.List(state.notes);
            return {...state, notes:newNotes.unshift(action.data.note).toArray(), activeNoteIndex:0};
        case "DELETE_NOTE":
            const noteIndex = action.data.index;
            const newNotesArr = Immutable.List(state.notes).splice(noteIndex, 1).toArray()
            return {...state, notes:newNotesArr,
                activeNoteIndex:newNotesArr.length <= noteIndex ? noteIndex-1:noteIndex
            };
            break;
        case "INSERT_NOTEBOOK":
            const notebook = action.data.notebook
            let newNotebooks = Immutable.List(state.notebooks);
            return {...state, notebooks:newNotebooks.unshift(notebook).toArray(), activeNotebookIndex:0, notes:[], activeNoteIndex:0};
        case "DELETE_NOTEBOOK":
            const notebooks = Immutable.List(state.notebooks);
            const newNotebooksArr = notebooks.splice(action.data.index, 1).toArray()

            return {...state,  notebooks:newNotebooksArr, activeNotebookIndex:action.data.index};
            break;
        case "EDIT_NOTEBOOK":
            const {meta, index} = action.data
            let newNBArr = Immutable.List(state.notebooks).toArray();
            newNBArr[index] = meta;

            return {...state, notebooks:newNBArr};
        default:
            return state;
    }
}

export default SidebarList;
