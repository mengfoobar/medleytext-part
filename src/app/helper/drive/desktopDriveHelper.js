const Promise = require('bluebird');
const ElectronApp = require('electron').remote;
const FileIOManager = ElectronApp.require('./electron/fileIOManager');
var ShortId = require('shortid');
const DeepEqual = require('deep-equal');

import NP from 'nested-property'

import {convertNotesSetToArray} from '../notesHelper'
import {showModal, ModalTypes} from '../modalManager'
import {initializeEditorSettings, getEditorSettings} from '../settingsManager'

module.exports={
    initialize(){

        let editorSettings = getEditorSettings();

        if(!editorSettings) {
            initializeEditorSettings();
        }

        if(!NP.get(editorSettings,"application.workspace")){
            showModal(ModalTypes.GET_WORKSPACE, null, null, false)
            return Promise.resolve(false)
        }

        //TODO: fix up after storing  modal data  into stores
        return Promise.resolve(true);

    },
    getNotebooksList(){
        return FileIOManager.getNotebooks(getEditorSettings().application.workspace)
            .then((results)=>{
                if(results){
                    return Promise.resolve(results)
                }else{
                    throw new Error("Unable to retrieve notebooks meta")
                }
            }).catch((err)=>{
                return Promise.reject(err)
            })
    },
    //TODO: should be a path instead of notebook id
    getNotesList(path){

        return FileIOManager.getNotesInPath(path)
            .then(function(notes){
                if(notes){
                    return Promise.resolve(notes)
                }else{
                    throw new Error("Unable to get notes")
                }
            })
            .catch(function(err){
                return Promise.reject(err)
            })
    },
    insertNote(note, folderPath){
        return FileIOManager.writeJson(note, [folderPath, note._id+".json"].join('/'))
            .then(function(result){
                if(result){
                    return Promise.resolve(true)
                }else{
                    throw new Error("Unable to write note.")
                }
            })
            .catch(function(err){
                return Promise.reject(err)
            })

    },
    deleteNote(notePath){
        return FileIOManager.removeFile(notePath)
            .then(function(result){
                return Promise.resolve(true)
            })
            .catch(function(err){
                return Promise.reject()
            })
    },
    moveNote(note, noteBookPathFrom, noteBookPathTo){
        const notePathFrom = [noteBookPathFrom, note._id+".json"].join('/')
        const notePathTo = [noteBookPathTo, note._id+".json"].join('/')

        return new Promise(function(resolve, reject){
            FileIOManager.moveFile(notePathFrom, notePathTo)
                .then(function(result){
                    if(!result) reject();
                    resolve(true)
                })
                .catch(function(err){
                    reject()
                })
        })

    },
    updateNote(note, filePath){
        return FileIOManager.getFile(filePath)
            .then(function(result){
                if(result){
                    if(!DeepEqual(note.body,result.body)){
                        note.lastUpdated=new Date()
                        return FileIOManager.writeJson(note, filePath)
                    }else{
                        //No need to update. Note the same
                        return Promise.resolve(true)
                    }
                }else{
                    throw new Error("Unable to get file from path")
                }
            })
            .then(function(result){
                return Promise.resolve(result)
            })
            .catch(function(err){
                return Promise.reject(err)
            })
    },
    writeToFile(body, filePath){
        return FileIOManager.writeJson(body, filePath)
    },
    getNote(noteId, folderPath){
        const noteFilePath = [folderPath, noteId+".json"].join('/')

        return FileIOManager.getFile(noteFilePath)
    },
    createNotebook(noteBookName, notes=[], id=ShortId.generate()){
        let self=this;

        const noteBookDirectoryPath=getEditorSettings().application.workspace+'/'+id
        const noteBookMetaFilePath=noteBookDirectoryPath+'/.meta';

        const noteBookEntry ={
            path:noteBookDirectoryPath,
            '_id':id,
            'lastAccessed':new Date(),
            'dateCreated': new Date(),
            title:noteBookName
        }

        return FileIOManager.createDirectory(noteBookDirectoryPath)
            .then(function(result){
                if(!result) {
                    throw new Error("Unable to create directory")
                }
                return FileIOManager.writeJson(noteBookEntry, noteBookMetaFilePath)
            })
            .then(function(result){
                if(!result){
                    throw new Error("unable to create notebook meta file")
                }
                if(notes){
                    return self.batchInsertNotes(notes, noteBookDirectoryPath)
                }else{
                    return Promise.resolve(true)
                }
            })
            .then(function(result){
                if(!result){
                    throw new Error("Failed to batch insert notes")
                }
                return Promise.resolve(noteBookEntry)
            })
            .catch(function(err){
                return Promise.reject(err)
            })

    },
    deleteNotebook(noteBookPath){

        return FileIOManager.removeDirectory(noteBookPath)
            .then(function(result){
                return Promise.resolve(true);
            })
            .catch(function(err){
                return Promise.reject(err)
            })

    },
    updateNotebookMeta(meta, notebookPath){
        const notebookMetaPath=[notebookPath, '.meta'].join('/')
        return FileIOManager.writeJson(meta,notebookMetaPath)
            .then(function(result){
                if(result){
                    return Promise.resolve(meta)
                }else{
                    throw new Error("Unable to update notebook meta file.")
                }
            })
            .catch(function(err){
                return Promise.reject()
            })

    },
    getFile(filePath){
        return FileIOManager.getFile(filePath)
    },
    getAllNotesRecursive(){
        return new Promise(function(resolve, reject){
            FileIOManager.getAllNotesInPathRecursive(getEditorSettings().application.workspace)
                .then(function(result){
                    if(!result){
                        reject();
                    }else{

                        let convertedNotesArr;
                        try{
                            convertedNotesArr = convertNotesSetToArray(result);
                            resolve(convertedNotesArr)
                        }catch(err){
                            console.log("unable to convert notebooks to array");
                            reject()
                        }


                    }
                })
        })
    },
    batchInsertNotes(notesArr, noteBookPath){

        return new Promise(function(resolve, reject){
            Promise.map(notesArr, function (note) {
                const fullFilePath = [noteBookPath, note._id+".json"].join("/")
                return FileIOManager.writeJson(note, fullFilePath)
            }).then(function(results){
                if(results){
                    resolve(true)
                }else{
                    reject()
                }
            })
        })
    }

}