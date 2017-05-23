import Menubar from '../../components/menu/menubar.jsx'
import {setVisibility, setView} from '../../actions/sidebar/sidebar.js'
import {insertNote} from '../../actions/sidebar/sidebarList'
import FileIOUtils from '../../helper/fileIOUtils'
import {getInstance} from '../../helper/drive/driveHelper'
import Promise from 'bluebird'

import {EditorState, ContentState, convertFromRaw} from 'draft-js'

import DraftMD from 'draft-to-md'
import {getNewNote} from '../../helper/notesHelper'

import {DECORATOR} from '../../components/editor/entities/editorEnums';
import {get} from 'nested-property'

import { connect } from 'react-redux'

const mapStateToProps = (state) => {
    const { notes, activeNoteIndex, activeFolderPath} = state.SidebarList;
    let activeNote = get(notes, `${activeNoteIndex}`);

    return {
        ...state.Menubar,
        activeNote:activeNote,
        activeFolderPath:activeFolderPath
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSidebarVisibility:(visible)=>{
            dispatch(setVisibility(visible))
        },
        setSidebarView:(view)=>{
            dispatch(setView(view))
        },
        exportMarkdown: (folderPath, activeNote)=>{

            try{
                let contentState=convertFromRaw(activeNote.body);
                let editorState=EditorState.createWithContent(contentState, DECORATOR);
                const markdownStr = DraftMD.draftToMD(activeNote.body, editorState);

                return FileIOUtils.writeMDToFile(folderPath, activeNote.title, markdownStr);

            }catch(err){
                return Promise.reject(err)
            }

        },
        importMarkdown: (filePath, folderPath)=>{
            try{
                const markDownStr = FileIOUtils.readMarkdownFile(filePath)
                let editorState=EditorState.createWithContent(ContentState.createFromText(markDownStr))
                let newNote= getNewNote();
                newNote.body=DraftMD.MDToDraft(editorState);
                newNote.title=newNote.body.blocks[0].text || "untitled"
                return getInstance().insertNote(newNote, folderPath)
                    .then((result)=>{
                        if(!result) throw new Error()
                        dispatch(insertNote(newNote))
                        return Promise.resolve(true)
                    })
                    .catch((err)=>{
                        return Promise.reject(err)
                    })


            }catch(err){
                return Promise.reject(err)
            }


        }
    }
}

const Menu = connect(
    mapStateToProps,
    mapDispatchToProps
)(Menubar)

export default Menu;