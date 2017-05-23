import NestedProperty from 'nested-property';
import {Map} from 'immutable'
import  ShortId from 'shortid';
import ArraySort from 'array-sort'
import Moment from 'moment'
import {convertToRaw} from 'draft-js'


import {getQuickStartNote, getShortCutsNote} from './entities/presetNotes'

export const updateNoteContent=(note, editorState)=>{
    if(!note || !editorState){
        return;
    }

    var rawJson=convertToRaw(editorState.getCurrentContent());
    note.title = rawJson.blocks[0].text;
    note.body = rawJson;
}


export const getInitialStartupArray=()=>{

    var arr=[];
    arr.push(randomlyAssignNoteId(getQuickStartNote()));
    arr.push(randomlyAssignNoteId(getShortCutsNote()))
    return arr;
}

export const getNewNote = () => {
    const date = new Date();

    return {
        "_id":ShortId.generate(),
        "title":"untitled",
        "body": { entityMap: {}, blocks: [ { key: 'ag6qs', text: 'untitled', type: 'header-one', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }, { key: '59kd9', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} } ] },
        "dateCreated": date,
        "lastUpdated": date
    };
}

export const sortListItems=(notes, prop, order)=>{

    const orderNum = order ==="desc" ? 1:-1
    notes.sort((a, b)=>{
        return a[prop] < b[prop] ? orderNum : orderNum*-1
    })
}


export const convertNotesSetToArray=(notesSet)=>{
    return Object.keys(notesSet).map(
        function (key) {

            var notes=NestedProperty.get(notesSet, [key, 'notes'].join('.'));
            if(notes && notes.length>=0){

                notes=ArraySort(notes, function (a, b) {
                    return Moment(a.lastUpdated).toDate()<Moment(b.lastUpdated).toDate()
                })
            }

            return {
                "_id": key,
                "notes": notes,
                "path": notesSet[key].path,
                "meta": notesSet[key].meta
            }
        });
}


function randomlyAssignNoteId(note){
    var immutableNote=Map(note);
    var newNote=immutableNote.set("_id", ShortId.generate())
    return newNote.toJS();
}