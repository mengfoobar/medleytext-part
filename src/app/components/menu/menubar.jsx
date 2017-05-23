import React from 'react'

import {Grid, Row, OverlayTrigger, Tooltip} from 'react-bootstrap'

import EA from 'electron-analytics'
import FontAwesome from 'react-fontawesome'
import {remote} from 'electron'
const {app, dialog} = remote

import style from './styles/menubar.css'

import {getTheme} from '../../helper/themeHelper'
import {showModal} from '../../helper/modalManager'

import {NotificationManager} from 'react-notifications'


export default class Menubar extends React.Component {

    constructor(props) {
        super(props);
        this.displayName = 'Menubar';
    }


    render(){

        const {isVisible, view} = this.props.sidebar;
        const {setSidebarVisibility, setSidebarView, activeFolderPath} = this.props;
        const theme = getTheme()

        return (
            <Grid className={`${style.menubar} ${theme.menubar}`}>
                <Row className={`${style.menubar_row}`}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">notes</Tooltip>} delayShow={700}>

                        <FontAwesome className={
                            `${style.menubar_icon} ${theme.menubar_icon} ${view==="notes"?theme.menubar_icon_active:""}`
                        }
                                     name='file-text-o'
                                     onClick={()=>{
                                         if(!isVisible){
                                             setSidebarVisibility(true);
                                             setSidebarView("notes")
                                         }else if(view==="notes" && isVisible){
                                             setSidebarVisibility(false);
                                         } else{
                                             setSidebarView("notes")
                                         }
                                     }}
                        />
                    </OverlayTrigger>
                </Row>

                <Row className={`${style.menubar_row}`}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">notebooks</Tooltip>} delayShow={700}>

                        <FontAwesome className={
                            `${style.menubar_icon} ${getTheme().menubar_icon} ${view==="notebooks"?theme.menubar_icon_active:""}`
                        }
                                     name='book'
                                     onClick={()=>{
                                         if( !isVisible){
                                             setSidebarVisibility(true);
                                             setSidebarView("notebooks")
                                         } else if(view==="notebooks" && isVisible){
                                             setSidebarVisibility(false);
                                         }else{
                                             setSidebarView("notebooks")
                                         }
                                     }}
                        />
                    </OverlayTrigger>

                </Row>

                <Row className={`${style.menubar_row}`}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">favorites</Tooltip>} delayShow={700}>

                        <FontAwesome className={
                            `${style.menubar_icon} ${getTheme().menubar_icon} ${view==="favorites"?theme.menubar_icon_active:""}`
                        }
                                     name='star'
                                     onClick={()=>{

                                         if( !isVisible){
                                             setSidebarVisibility(true);
                                         } else if(view==="favorites" && isVisible){
                                             setSidebarVisibility(false);
                                         }
                                         setSidebarView("favorites")
                                     }}
                        />
                    </OverlayTrigger>

                </Row>

                <Row className={`${style.menubar_row}`}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">Import Markdown</Tooltip>} delayShow={700} >
                        <FontAwesome name='upload'
                                     className={`${style.menubar_icon} ${getTheme().menubar_icon}`}
                                     onClick={()=>{
                                         EA.send("IMPORTED_MARKDOWN")
                                         const {importMarkdown} = this.props;

                                         dialog.showOpenDialog({
                                                 title:"Select Markdown File",
                                                 defaultPath:app.getPath('downloads'),
                                                 properties: ['openFile'],
                                                 filters: [
                                                     {name: 'Markdown', extensions: ['md']},
                                                     {name: 'All Files', extensions: ['*']}
                                                 ]
                                             }, (filePaths)=>{
                                                 const filePath = filePaths[0];
                                                 if(!filePath || !filePath.includes(".md")){
                                                     NotificationManager.error('Please ensure it is a valid .md file')
                                                 }else{
                                                     importMarkdown(filePath, activeFolderPath)
                                                         .then((result)=>{
                                                             NotificationManager.success('Markdown file successfully imported')
                                                         })
                                                         .catch((err)=>{
                                                             NotificationManager.error('Was unable to import the file')

                                                         })
                                                 }
                                             }
                                         )
                                     }}
                        />
                    </OverlayTrigger>
                </Row>

                <Row className={`${style.menubar_row}`}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">Export to Markdown</Tooltip>} delayShow={700} >
                        <FontAwesome
                            className={`${style.menubar_icon} ${getTheme().menubar_icon}`} name='download'
                            onClick={()=>{
                                const {activeNote, exportMarkdown} = this.props;

                                EA.send("EXPORTED_MARKDOWN")

                                dialog.showOpenDialog({
                                    title:"Select folder to export Markdown file",
                                    defaultPath:app.getPath('documents'),
                                    properties: ['openDirectory']
                                }, (folderPath)=>{
                                    if(folderPath){
                                        if(exportMarkdown(folderPath, activeNote)){
                                            NotificationManager.success('Markdown file successfully exported')
                                        }else{
                                            NotificationManager.error('Was unable to export the file')
                                        }
                                    }
                                })

                            }}
                        />
                    </OverlayTrigger>
                </Row>


                <Row className={`${style.menubar_row}`}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">shortcuts</Tooltip>} delayShow={700} >
                        <FontAwesome
                            name='bolt'
                            style={{paddingLeft:14, paddingRight:14}}
                            onClick={()=>{
                                showModal("shortcuts")
                            }}
                            className={`${style.menubar_icon} ${getTheme().menubar_icon}`}

                        />
                    </OverlayTrigger>
                </Row>

                <Row className={`${style.menubar_row}`}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip">settings</Tooltip>} delayShow={700} >
                        <FontAwesome
                            name='cog'
                            onClick={()=>{
                                showModal("settings")
                            }}
                            className={`${style.menubar_icon} ${getTheme().menubar_icon}`}

                        />
                    </OverlayTrigger>
                </Row>
            </Grid>
        )
    }
}
