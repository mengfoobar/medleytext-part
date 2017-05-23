import React from 'react';
import ReactDOM from 'react-dom'
import {FormGroup, Radio, InputGroup, FormControl, ControlLabel, Button, Col, Form} from 'react-bootstrap'
import NP from 'nested-property'

import {getEditorSettings, setEditorSettings} from '../../helper/settingsManager'

import style from './styles/settingsModal.css'

const ElectronApi = require('electron').remote;
const Dialog = ElectronApi.dialog;
const ElectronApp = ElectronApi.app

import {NotificationManager} from 'react-notifications'



var Settings=React.createClass({
    getInitialState: function(){
        return {
            settings: {}
        }

    },
    _handleBrowseWorkspacePathClick: function (event) {
        var self=this;
        Dialog.showOpenDialog(
            {
                defaultPath:ElectronApp.getPath('documents'),
                properties: ['openDirectory']
            },
            (filePaths)=>{
                if(NP.get(filePaths, "0")){
                    ReactDOM.findDOMNode(self.refs.workspace).value = filePaths[0]+(filePaths[0].toLowerCase().includes("medley")?'':'/medley')
                }
            }
        )
    },
    _handleUpdateSettings: function (event) {
        var errorMsg=""

        const savedSettings = getEditorSettings();
        const formSettings = getSettingsFromForm(this);

        savedSettings.application = formSettings.application;
        savedSettings.editorStyle = formSettings.editorStyle;


        errorMsg += setEditorSettings(savedSettings)


        if(errorMsg.length>0){
            NotificationManager.error('', errorMsg);
            return;
        }

        ElectronApi.BrowserWindow.getFocusedWindow().reload();

    },
    render: function(){
        const {editorStyle, application } = getEditorSettings()

        return (
            <div className={style.settingsModal}>
                <div style={{textAlign:"left"}}>
                    <Form horizontal>
                        <FormGroup >
                            <Col className={style.sectionHeader} componentClass={ControlLabel} sm={11}>
                                Application Settings
                            </Col>
                        </FormGroup>
                        <FormGroup >
                            <Col className={style.labelCol}  componentClass={ControlLabel} sm={2}>
                                Workspace
                            </Col>
                            <Col sm={10}>
                                <InputGroup>
                                    <FormControl ref="workspace" type="text" defaultValue={application.workspace}
                                                 style={{textAlign:"left"}}
                                                 value={this.state.workspace}/>
                                    <InputGroup.Button>
                                        <Button  onClick={this._handleBrowseWorkspacePathClick}>Browse</Button>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </FormGroup>

                        <FormGroup >
                            <Col className={style.labelCol}  componentClass={ControlLabel} sm={2}>
                                Theme
                            </Col>
                            <Col sm={10}>
                                <Radio name="theme"
                                       ref="themeDarkCherry"
                                       value="DarkCherry"
                                       defaultChecked={application.theme==="DarkCherry"}
                                       inline
                                       inputRef={ref => { this.refs.themeDarkCherryInput = ref; }} >
                                    Cherry Night
                                </Radio>
                                {' '}
                                <Radio name="theme"
                                       ref="themeLightCitrus"
                                       value="LightCitrus"
                                       defaultChecked={application.theme==="LightCitrus"}
                                       inline
                                       inputRef={ref => { this.refs.themeLightCitrusInput = ref; }} >
                                    Citrus Day
                                </Radio>
                            </Col>
                        </FormGroup>

                        <FormGroup >
                            <Col className={style.sectionHeader} componentClass={ControlLabel} sm={11}>
                                Paragraph Styling
                            </Col>
                        </FormGroup>

                        <FormGroup >
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={2}>
                                Font Size
                            </Col>
                            <Col sm={2}>
                                <FormControl ref="paragraphFontSize" componentClass="select" defaultValue={editorStyle.paragraph.fontSize}>
                                    <option value="8">8</option>
                                    <option value="10">10</option>
                                    <option value="12">12</option>
                                    <option value="14">14</option>
                                    <option value="16">16</option>
                                    <option value="18">18</option>
                                    <option value="20">20</option>
                                    <option value="22">22</option>
                                    <option value="24">24</option>
                                </FormControl>
                            </Col>
                            <Col className={style.suffixCol} sm={1} >
                                px
                            </Col>
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={2}>
                                Line Height
                            </Col>
                            <Col sm={2}>
                                <FormControl ref="paragraphLineHeight" componentClass="select" defaultValue={editorStyle.paragraph.lineHeight}>
                                    <option value="8">8</option>
                                    <option value="10">10</option>
                                    <option value="12">12</option>
                                    <option value="14">14</option>
                                    <option value="18">18</option>
                                    <option value="22">22</option>
                                    <option value="26">26</option>
                                    <option value="30">30</option>
                                    <option value="34">34</option>
                                </FormControl>
                            </Col>
                            <Col className={style.suffixCol} sm={1}>
                                px
                            </Col>
                        </FormGroup>

                        <FormGroup >
                            <Col className={style.sectionHeader} componentClass={ControlLabel} sm={11}>
                                Code Block Styling
                            </Col>
                        </FormGroup>

                        <FormGroup >
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={2}>
                                Font Size
                            </Col>
                            <Col sm={2}>
                                <FormControl ref="codeBlockFontSize" componentClass="select" defaultValue={editorStyle.codeBlock.fontSize}>
                                    <option value="8">8</option>
                                    <option value="10">10</option>
                                    <option value="12">12</option>
                                    <option value="14">14</option>
                                    <option value="16">16</option>
                                    <option value="18">18</option>
                                    <option value="20">20</option>
                                    <option value="22">22</option>
                                    <option value="24">24</option>

                                </FormControl>
                            </Col>
                            <Col className={style.suffixCol} sm={1} >
                                px
                            </Col>
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={2}>
                                Line Height
                            </Col>
                            <Col sm={2}>
                                <FormControl ref="codeBlockLineHeight" componentClass="select" defaultValue={editorStyle.codeBlock.lineHeight}>
                                    <option value="8">8</option>
                                    <option value="10">10</option>
                                    <option value="12">12</option>
                                    <option value="14">14</option>
                                    <option value="18">18</option>
                                    <option value="22">22</option>
                                    <option value="26">26</option>
                                    <option value="30">30</option>
                                    <option value="34">34</option>
                                </FormControl>
                            </Col>
                            <Col className={style.suffixCol} sm={1}>
                                px
                            </Col>
                        </FormGroup>
                    </Form>

                </div>
                <div style={{paddingTop:45}}>
                    <Button bsStyle="success" onClick={this._handleUpdateSettings} style={{width:150}}>
                        Update Settings
                    </Button>
                </div>
            </div>
        )
    }
});



module.exports=Settings;


const getSettingsFromForm=(SettingsInstance)=>{

    if(SettingsInstance){
        const {themeLightCitrusInput} = SettingsInstance.refs;

        return {
            application:{
                theme:  `${SettingsInstance.refs.themeLightCitrusInput.checked ? "LightCitrus":""}`+
                        `${SettingsInstance.refs.themeDarkCherryInput.checked ? "DarkCherry":""}`,
                workspace: ReactDOM.findDOMNode(SettingsInstance.refs.workspace).value
            },
            editorStyle:{
                paragraph:{
                    fontSize:ReactDOM.findDOMNode(SettingsInstance.refs.paragraphFontSize).value,
                    lineHeight:ReactDOM.findDOMNode(SettingsInstance.refs.paragraphLineHeight).value
                },
                codeBlock:{
                    fontSize:ReactDOM.findDOMNode(SettingsInstance.refs.codeBlockFontSize).value,
                    lineHeight:ReactDOM.findDOMNode(SettingsInstance.refs.codeBlockLineHeight).value
                }
            }
        }
    }
}