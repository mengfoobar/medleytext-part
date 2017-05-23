var DraftJsApi=require('draft-js');
import {RichUtils} from 'draft-js'
var BlockUtils=require('../components/editor/utils/blockUtils');
var EditorState= DraftJsApi.EditorState;
var Modifier = DraftJsApi.Modifier;
import {insertNote, deleteNote, getActiveNoteIndex, setActiveNoteIndex, getActiveNotesList} from './notesHelper'
import {getEditorSettings} from './settingsManager'

var REGEX_SAME_CHAR=/^(.)\1+$/;

const NativeEditorShortcuts={
    "bold":{
        command:'toggle-inline-bold',
        blockType:null
    },
    "italic":{
        command:'toggle-inline-italic',
        blockType:null
    },
    "selected-codeblock":{
        command:'toggle-selected-codeblock',
        blockType:null
    },
    "header-one":{
        command:'toggle-header-one',
        blockType:"header-one"
    },
    "header-two": {
        command:'toggle-header-two',
        blockType:"header-two"
    },
    "header-three": {
        command:'toggle-header-three',
        blockType:"header-three"
    },
    "blockquote":{
        command:'toggle-quote',
        blockType:"blockquote"
    },
    "toggle-block": {
        command: 'toggle-block-style',
        blockType:null
    },
    "ordered-list": {
        command: 'toggle-ordered-list',
        blockType:"ordered-list-item"
    },
    "unordered-list": {
        command: 'toggle-unordered-list',
        blockType: "unordered-list-item"
    },
    "todo": {
        command: 'toggle-todo',
        blockType:"todo"
    }

}

export let NATIVE_EDITOR_KEY_CMD_MAP={
    "Enter": {
        command:'insert-line',
        blockType:null
    }
}

export let INLINE_SHORTCUT_MAP={}

export const initShortcutHelper=()=>{
    computeShortCutsFromSettings();
}

export const  NON_NATIVE_EDITOR_KEY_CMD_MAP={

    "ArrowUp":function(e, editorState){
        var selection    = editorState.getSelection();
        let contentBlock = editorState.getCurrentContent();
        var blockCurrent = contentBlock.getBlockForKey(selection.getStartKey())
        var blockBefore = contentBlock.getBlockBefore(selection.getStartKey());
        if(e.shiftKey || !(blockCurrent.getType()==='todo' && blockBefore.getType()==='todo') ){
            return;
        }
        e.preventDefault();
        e.stopPropagation();

        var updatedSelection = selection.merge({
            focusKey: blockBefore.getKey(),
            focusOffset: 0,
            anchorKey: blockBefore.getKey(),
            anchorOffset: 0
        });
        return EditorState.forceSelection(editorState, updatedSelection)
    },
    "ArrowDown":function(e, editorState){
        var selection = editorState.getSelection();
        var blockCurrent = editorState.getCurrentContent().getBlockForKey(selection.getStartKey())
        var blockAfter = editorState.getCurrentContent().getBlockAfter(selection.getStartKey());
        if (!blockAfter || !(blockCurrent.getType() === 'todo' && blockAfter.getType() === 'todo') || e.shiftKey) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();

        var updatedSelection = selection.merge({
            focusKey: blockAfter.getKey(),
            focusOffset: 0,
            anchorKey: blockAfter.getKey(),
            anchorOffset: 0
        });
        return EditorState.forceSelection(editorState, updatedSelection)
    }
}

export const COMMAND_FUNCTION_MAP={
    'insert-line':function(editorState){
        return BlockUtils.insertNewBlockAt(editorState,editorState.getSelection().getStartKey() )
    },
    'backspace':function(editorState, editorComponent){
        var selection = editorState.getSelection();
        var block=editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
        var activeBlockType=block.getType();
        var blockBefore=editorState.getCurrentContent().getBlockBefore(selection.getStartKey());

        if(!blockBefore) return null;

        var blockBeforeType=blockBefore.getType();
        if(!selection.isCollapsed()){
            return null;
        }

        if(activeBlockType==="image"){
            return  RichUtils.onBackspace(editorState);
        }
        else if (selection.focusOffset===0 && activeBlockType!=='unstyled' && blockBeforeType!=activeBlockType){
            return editorComponent.props.resetBlockType();
        }
        else if(selection.focusOffset===0 && blockBeforeType===activeBlockType){

            var updatedSelection = selection.merge({
                focusKey: selection.getStartKey(),
                focusOffset: 0,
                anchorKey: blockBefore.getKey(),
                anchorOffset: blockBefore.getLength()
            });
            var es=EditorState.forceSelection(editorState, updatedSelection)

            const contentState = es.getCurrentContent();

            const ncs = Modifier.removeRange(contentState, updatedSelection, 'backward');
            return EditorState.push(es, ncs, 'remove-range');

        }
        //used for removing 4 spaces at once when there are lots of spaces between focus and beginning
        else if( block.getText()[0]===' ' && REGEX_SAME_CHAR.test(block.getText().substring(0, selection.anchorOffset))){
            var indent = block.getText().substring(0, selection.focusOffset)
            var contentState=editorState.getCurrentContent();

            var rangeToRemove      = selection.merge({
                anchorKey:    selection.focusKey,
                anchorOffset: selection.focusOffset,
                focusKey:     selection.focusKey,
                focusOffset:  selection.focusOffset-(indent.length>=4?4:indent.length),
                isBackward:   true
            });

            var newContentState = DraftJsApi.Modifier.removeRange(contentState, rangeToRemove, 'backward');
            return DraftJsApi.EditorState.push(editorState, newContentState, 'remove-range');;
        }
        else{
            return  RichUtils.onBackspace(editorState);
        }
    },
    "toggle-inline-bold":function(editorState){
        return DraftJsApi.RichUtils.toggleInlineStyle(editorState, "BOLD")
    },
    "toggle-inline-italic":function(editorState){
        return DraftJsApi.RichUtils.toggleInlineStyle(editorState, "ITALIC")
    },
    "toggle-selected-codeblock":function(editorState){
        const selectedCodeBlockType = localStorage.getItem("codeBlockType");
        if(selectedCodeBlockType){
            return DraftJsApi.RichUtils.toggleBlockType(editorState, selectedCodeBlockType);
        }
    },
    'toggle-header-one':function(editorState){
        return DraftJsApi.RichUtils.toggleBlockType(editorState, 'header-one');
    },
    'toggle-header-two':function(editorState){
        return DraftJsApi.RichUtils.toggleBlockType(editorState, 'header-two');
    },
    'toggle-header-three':function(editorState){
        return DraftJsApi.RichUtils.toggleBlockType(editorState, 'header-three');
    },
    'toggle-block-style':function(editorState, editorComponent){
        var selection = editorState.getSelection();
        var block=editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
        var activeBlockType=block.getType()
        var lastUsedStyle = editorComponent.props.lastStyleUsed.style;
        if(!lastUsedStyle && activeBlockType==='unstyled' || !activeBlockType){
            return;
        } else if(activeBlockType!=='unstyled'){
            editorComponent.props.setLastStyleUsed()
            return DraftJsApi.RichUtils.toggleBlockType(editorState, activeBlockType);
        }else{
            return DraftJsApi.RichUtils.toggleBlockType(editorState, lastUsedStyle);
        }
    },
    'toggle-ordered-list':function(editorState){
        return DraftJsApi.RichUtils.toggleBlockType(editorState, 'ordered-list-item');
    },
    'toggle-quote':function(editorState){
        return DraftJsApi.RichUtils.toggleBlockType(editorState, 'blockquote');
    },
    'toggle-unordered-list':function(editorState){
        return DraftJsApi.RichUtils.toggleBlockType(editorState, 'unordered-list-item');
    },
    'toggle-todo':function(editorState){
        return DraftJsApi.RichUtils.toggleBlockType(editorState, 'todo');
    }

}

const computeShortCutsFromSettings=()=>{
    const shortCuts = getEditorSettings().shortcuts;
    const shortCutKeys = Object.keys(shortCuts);
    for(let i=0; i<shortCutKeys.length; i++){
        const shortCut = shortCutKeys[i];

        if(shortCuts[shortCut].keyboard){
            NATIVE_EDITOR_KEY_CMD_MAP[shortCuts[shortCut].keyboard]=NativeEditorShortcuts[shortCut]
        }
        if(shortCuts[shortCut].inline){
            INLINE_SHORTCUT_MAP[shortCuts[shortCut].inline]=NativeEditorShortcuts[shortCut]
        }
    }
}