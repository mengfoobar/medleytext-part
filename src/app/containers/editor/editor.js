import { connect } from 'react-redux'
import NP from 'nested-property'

import EditorComponent from '../../components/editor/editor.jsx'
import {getInstance} from '../../helper/drive/driveHelper'
import Promise from 'bluebird'

const mapStateToProps = (state) => {
    const {notes, activeNoteIndex, activeFolderPath} = state.SidebarList;
    let activeNote = NP.get(notes, `${activeNoteIndex}`);
    const activeNotePath = activeNote ? `${activeFolderPath}/${activeNote._id}.json` :""
    return {
        ...state.Editor,
        activeNote: activeNote,
        activeNotePath:   activeNotePath,
        isExpanded: !state.Sidebar.isVisible
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateNoteOnServer(note, path){
            if(note && path){
                return getInstance().updateNote(note, path)
            }else{
                return Promise.resolve(false)
            }

        }
    }
}

const EditorContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditorComponent)

export default EditorContainer