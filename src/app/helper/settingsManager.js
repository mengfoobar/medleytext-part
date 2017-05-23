import NP  from 'nested-property'

import {Map} from 'immutable'

const DefaultSettings={
    application:{
        theme: "LightCitrus",
        workspace:"" //TODO: add the default value
    },
    sidebar:{
        notes:{
            sort:"lastUpdated",
            order:"asc"
        }
    },
    editorStyle:{
        paragraph:{
            fontSize:14,
            lineHeight:22
        },
        codeBlock:{
            fontSize:14,
            lineHeight:22
        }
    },
    shortcuts:{
        "bold":{
            keyboard:"b"
        },
        "italic":{
            keyboard:"e"
        },
        "toggle-block":{
            keyboard:"i"
        },
        "selected-codeblock":{
            keyboard:"/",
            inline:"/"
        },
        "todo":{
            keyboard:"t",
            inline:"t"
        },
        "ordered-list":{
            keyboard:"0",
            inline:"0"
        },
        "unordered-list":{
            keyboard:".",
            inline:"."
        },
        "header-one":{
            keyboard:"1",
            inline:"h1"
        },
        "header-two":{
            keyboard:"2",
            inline:"h2"
        },
        "header-three":{
            keyboard:"3",
            inline:"h3"
        },
        "blockquote":{
            keyboard:"'",
            inline:"'"
        }
    }
}


export const initializeEditorSettings=()=> {
    setEditorSettings(DefaultSettings)
}


export const getEditorSettings=()=> {
    try{
        let settingsMap = Map(JSON.parse(localStorage.getItem("medleySettings")));

        let defaultSettingsMap = Map(DefaultSettings)

        let mergedSettingsMap = defaultSettingsMap.mergeDeep(settingsMap)

        return mergedSettingsMap.toJS()
    }catch(err){
        return null
    }
}

export const setEditorSettings=(settingsJson=DefaultSettings)=>{
    const existingSettingsMap = Map(getEditorSettings());

    const updateSettings = existingSettingsMap.merge(settingsJson).toJS()

    let errorMsg = "";
    errorMsg += editorSettingsChecks(updateSettings)

    if(errorMsg==="") {
        localStorage.setItem("medleySettings", JSON.stringify(updateSettings))
    }

    return errorMsg;

}

export const setEditorSetting=(keyPath, value)=>{
    let editorSetting = getEditorSettings();
    NP.set(editorSetting, keyPath, value);
    setEditorSettings(editorSetting)
}

export const getEditorSetting=(keyPath)=>{
    let editorSetting = getEditorSettings();
    return NP.get(editorSetting, keyPath);
}


const editorSettingsChecks=(settingsJson)=>{

    /**
     * check 1 - no duplicates for inline
     * check 2 - no duplicates for keyboard
     * check 3 - one char for keyboard
     * check 4 - can not be empty
     */


    let keyboardShortcuts={};
    let inlineShortcuts={};

    const {shortcuts} = settingsJson;
    const shortcutsJsonKeys=Object.keys(shortcuts);

    let msg="";

    for (let s of shortcutsJsonKeys) {

        if(shortcuts[s].keyboard==="" || shortcuts[s].inline===""){
            msg+="Shortcuts can not be empty.";
            break;
        }

        if(shortcuts[s].keyboard ){
            if(shortcuts[s].keyboard.length>1){
                msg+="Keyboard shortcut can only be one char";
                break;
            } else if(keyboardShortcuts[shortcuts[s].keyboard]){
                msg+="Can not have duplicate keyboard shortcuts.";
                break;
            }else{
                keyboardShortcuts[shortcuts[s].keyboard]=true;
            }
        }

        if(shortcuts[s].inline ){
            if(inlineShortcuts[shortcuts[s].inline]){
                msg+="Can not have duplicate inline shortcuts.";
                break;
            }else{
                inlineShortcuts[shortcuts[s].inline]=true;
            }
        }
    }

    return msg;
}
