import { connect } from 'react-redux'
import Promise from 'bluebird'
import SidebarListComponent from '../../components/sidebar/sidebarList.jsx'
import {setLoading, setNotebooks, setError,
    setActiveNotebook, insertNotebook, deleteNotebook, editNotebook, setActiveFolderPath,
    setNotes, setActiveNote, insertNote, deleteNote} from '../../actions/sidebar/sidebarList'


import {getEditorSettings} from '../../helper/settingsManager'

import {setView} from '../../actions/sidebar/sidebar'
import {getInstance} from '../../helper/drive/driveHelper'
import {getNewNote, sortListItems} from '../../helper/notesHelper'
import {get} from 'nested-property'

import FavoritesManager from '../../helper/favoritesManager'

const mapStateToProps = (state) => {
    return {
        ...state.SidebarList,
        view:state.Sidebar.view
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadNotebooksList(){
            dispatch(setLoading());

            return getInstance().getNotebooksList()
                .then(function(results){
                    if(results){
                        sortListItems(results, "lastAccessed", "desc")
                        dispatch(setNotebooks(results));
                        return Promise.resolve(results);
                    }else{
                        throw new Error("Unable to retrieve notebooks")
                    }
                })
                .catch(function(err){
                    dispatch(setError(err));
                    return Promise.reject(err)
                })
        },
        loadNotesList(path){
            console.log("loaded notes list")

            const {sort, order} = get(getEditorSettings(), "sidebar.notes")
            dispatch(setLoading());

            return getInstance().getNotesList(path)
                .then(function(results){
                    if(results){
                        dispatch(setActiveFolderPath(path));
                        sortListItems(results, sort, order)
                        dispatch(setNotes(results));
                        dispatch(setActiveNote(0));
                        return Promise.resolve(results);
                    }else{
                        throw new Error("Unable to retrieve notes from notebook")
                    }
                })
                .catch(function(err){
                    dispatch(setError(err));
                    return Promise.reject(err)
                })
        },
        loadFavoriteNotes(){
            const {sort, order} = get(getEditorSettings(), "sidebar.notes")
            dispatch(setLoading());

            return FavoritesManager.getNotes()
                .then((results)=>{
                    if(results){
                        results=results.filter((note)=>{
                            return note !== null
                        })

                        sortListItems(results, sort, order)
                        dispatch(setNotes(results));
                        dispatch(setActiveNote(0));
                        dispatch(setActiveFolderPath(get(results, '0.folderPath')))
                        return Promise.resolve(true)
                    }
                    else{
                        throw new Error("Unable to retrieve notes from file")
                    }
                })
                .catch((err)=>{
                    return Promise.reject(err)
                })
        },
        setActiveNotebook(index){
            dispatch(setActiveNotebook(index));
        },
        setActiveFolderPath(path){
            dispatch(setActiveFolderPath(path))
        },
        setActiveNote(index){
            dispatch(setActiveNote(index));
        },
        insertNote(path, newNote=getNewNote()){

            return getInstance().insertNote(newNote, path)
                .then(function(result){
                    if(!result) throw new Error()
                    dispatch(insertNote(newNote))
                    return Promise.resolve(true)
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
        },
        deleteNote(index, path=""){
            if(!path){
                dispatch(deleteNote(index));
                return Promise.resolve(true)
            }else{
                return getInstance().deleteNote(path)
                    .then(function(result){
                        if(!result) throw new Error();
                        dispatch(deleteNote(index))
                        return Promise.resolve(true)
                    })
                    .catch(function(err){
                        return Promise.reject(err)
                    })
            }

        },
        moveNote(note, noteIndex, curNotebookId, newNotebookId){

            if(curNotebookId===newNotebookId){
                return;
            }

            const pathFrom = `${getEditorSettings().application.workspace}/${curNotebookId}`
            const pathTo = `${getEditorSettings().application.workspace}/${newNotebookId}`

            return getInstance().moveNote(note, pathFrom, pathTo)
                .then((result)=>{
                    result && dispatch(deleteNote(noteIndex))
                    return Promise.resolve(true)
                })
                .catch((err)=>{
                    return Promise.reject(err)
                })
        },
        insertNotebook(name){
            return getInstance().createNotebook(name)
                .then((result)=>{
                    result && dispatch(insertNotebook(result))
                    return Promise.resolve(result)
                })
                .catch((err)=>{
                    return Promise.reject(err)
                })
        },
        deleteNotebook(index, path){
            return getInstance().deleteNotebook(path)
                .then((result)=>{
                    if(result){
                        dispatch(deleteNotebook(index))
                        return Promise.resolve(true)
                    }
                    else{
                        throw new Error("Was unable to delete notebook")
                    }
                })
                .catch((err)=>{
                    return Promise.reject(err)
                })
        },
        editNotebook(meta, index){
            const path = `${getEditorSettings().application.workspace}/${meta._id}`
            return getInstance().updateNotebookMeta(meta, path)
                .then(function(result){
                    if(result){
                        dispatch(editNotebook(result, index))
                        return Promise.resolve(true)
                    }else{
                        throw new Error("Was unable to edit notebook")
                    }
                })
                .catch(function(err){
                    return Promise.reject(err)
                })

        },
        setView(view){
            dispatch(setView(view))
        }
    }
}

const SidebarListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SidebarListComponent)

export default SidebarListContainer