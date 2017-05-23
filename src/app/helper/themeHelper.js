import '!style!css!../styles/themes/darkCherry.css'
import '!style!css!../styles/themes/lightCitrus.css'

import {getEditorSettings } from './settingsManager.js'

import DarkCherry from '../styles/themes/darkCherry.css'
import LightCitrus from '../styles/themes/lightCitrus.css'

const ThemeMap={
    "DarkCherry":DarkCherry,
    "LightCitrus":LightCitrus
}

let selectedTheme;

export const getTheme = ()=>{
    if(!selectedTheme){
        selectedTheme = getEditorSettings().application.theme;
    }

    return ThemeMap[selectedTheme]
}