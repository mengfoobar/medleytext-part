import React from 'react';
import ReactDOM from 'react-dom'
import {FormGroup, Radio, Nav, NavItem, InputGroup, FormControl, ControlLabel, Button, Col, Form, DropdownButton, MenuItem} from 'react-bootstrap'

const ElectronApi = require('electron').remote;

import {getEditorSettings, setEditorSettings} from '../../helper/settingsManager'

import style from './styles/shortcutsModal.css'


var Shortcuts=React.createClass({
    getInitialState: function(){
        return {}
    },
    _handleUpdateSettings: function (event) {

        const settings = getEditorSettings();
        settings.shortcuts = getSettingsFromForm(this)

        var errorMsg=setEditorSettings(settings);

        if(errorMsg.length>0){
            // self.props.notify("error", '', errorMsg);
        }else{
            ElectronApi.BrowserWindow.getFocusedWindow().reload();
        }
    },
    render: function(){
        const {shortcuts } = getEditorSettings()

        return (
            <div id="shortcutsModal">
                <div style={{textAlign:"left"}}>
                    <Form horizontal>

                        <FormGroup >
                            <Col className={style.sectionHeader} componentClass={ControlLabel} sm={11}>
                                Editor Shortcuts
                            </Col>
                        </FormGroup>
                        <FormGroup >
                            <Col sm={5} />
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={3} style={{marginLeft:-15}}>
                                Keyboard Shortcut
                            </Col>
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={3} style={{marginLeft:12}}>
                                Inline Shortcut
                            </Col>
                        </FormGroup>

                        <FormGroup className="shortcuts" >
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={3}>
                                Insert Unstyled Line
                            </Col>
                            <Col className={style.prefixCol} sm={3} >
                                ctrl | cmd +
                            </Col>
                            <Col className={style.prefixCol}  style={{marginLeft:-32}} sm={2} >
                                Enter
                            </Col>
                        </FormGroup>
                        {getShortCutFormRow("bold", "Bold",shortcuts["bold"] )}
                        {getShortCutFormRow("italic", "Italicize",shortcuts["italic"] )}
                        {getShortCutFormRow("toggleBlock", "Toggle Block Style",shortcuts["toggle-block"] )}
                        {getShortCutFormRow("selectedCodeblock", "Active Codeblock",shortcuts["selected-codeblock"] )}
                        {getShortCutFormRow("todo", "To Do",shortcuts["todo"] )}
                        {getShortCutFormRow("orderedList", "Ordered List",shortcuts["ordered-list"] )}
                        {getShortCutFormRow("unorderedList", "Un-ordered List",shortcuts["unordered-list"] )}
                        {getShortCutFormRow("blockquote", "Block Quote",shortcuts["blockquote"] )}
                        {getShortCutFormRow("headerOne", "Header One",shortcuts["header-one"] )}
                        {getShortCutFormRow("headerTwo", "Header Two",shortcuts["header-two"])}
                        {getShortCutFormRow("headerThree", "Header Three",shortcuts["header-three"])}

                        <FormGroup >
                            <Col className={style.sectionHeader} componentClass={ControlLabel} sm={11}>
                                App Shortcuts
                            </Col>
                        </FormGroup>
                        <FormGroup >
                            <Col sm={4} />
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={4} style={{textAlign:"center",marginLeft: 8}}>
                                Win/Linux
                            </Col>
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={4} style={{textAlign:"center", marginLeft: -20}}>
                                Mac OSX
                            </Col>
                        </FormGroup>

                        <FormGroup className="shortcuts" >
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={3}>
                                New Note
                            </Col>
                            <Col className={style.prefixCol} sm={4} >
                                ctrl + shift + n
                            </Col>
                            <Col className={style.prefixCol} sm={4} >
                                cmd + shift + n
                            </Col>
                        </FormGroup>

                        <FormGroup className="shortcuts" >
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={3}>
                                Delete Note
                            </Col>
                            <Col className={style.prefixCol} sm={4} >
                                ctrl + shift + d
                            </Col>
                            <Col className={style.prefixCol} sm={4} >
                                cmd + shift + d
                            </Col>
                        </FormGroup>

                        <FormGroup className="shortcuts" >
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={3}>
                                Nav to Note Above
                            </Col>
                            <Col className={style.prefixCol} sm={4} >
                                ctrl + shift + &uarr;
                            </Col>
                            <Col className={style.prefixCol} sm={4} >
                                cmd + shift + &uarr;
                            </Col>
                        </FormGroup>

                        <FormGroup className="shortcuts" >
                            <Col className={style.labelCol} componentClass={ControlLabel} sm={3}>
                                Nav to Note Below
                            </Col>
                            <Col className={style.prefixCol} sm={4} >
                                ctrl + shift + &darr;
                            </Col>
                            <Col className={style.prefixCol} sm={4} >
                                cmd + shift + &darr;
                            </Col>
                        </FormGroup>

                    </Form>

                </div>
                <div style={{paddingTop:45}}>
                    <Button bsStyle="success" onClick={this._handleUpdateSettings} style={{width:220}}>
                        Apply Shortcuts
                    </Button>
                </div>
            </div>
        )
    }
});


const getShortCutFormRow = (refPrefix, label, shortCutObj)=>{
    return (
        <FormGroup className="shortcuts" >
            <Col className={style.labelCol} componentClass={ControlLabel} sm={3}>
                {label}
            </Col>
            {
                shortCutObj.keyboard?
                (<Col className={style.prefixCol} sm={3} >
                    ctrl | cmd +
                </Col>):null
            }
            {   shortCutObj.keyboard?
                (<Col sm={2}>
                    <FormControl ref={`${refPrefix}Keyboard`} type="text"
                                 defaultValue={shortCutObj.keyboard}/>
                </Col>):null
            }

            {shortCutObj.inline? ( <Col className={style.prefixCol} sm={1} >&lt;</Col>):null}
            {
                shortCutObj.inline? (
                    <Col sm={2}>
                        <FormControl ref={`${refPrefix}Inline`} type="text" defaultValue={shortCutObj.inline} />
                    </Col>):null
            }
            {shortCutObj.inline? (<Col className={style.suffixCol} sm={1}>&gt;</Col>):null}
        </FormGroup>
    )
}

module.exports=Shortcuts;


const getSettingsFromForm=(SettingsInstance)=>{

    if(SettingsInstance){
        return {
                "bold":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.boldKeyboard).value,
                },
                "italic":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.italicKeyboard).value,
                },
                "selected-codeblock":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.selectedCodeblockKeyboard).value,
                    inline:ReactDOM.findDOMNode(SettingsInstance.refs.selectedCodeblockInline).value,
                },
                "toggle-block":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.toggleBlockKeyboard).value,
                },
                "todo":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.todoKeyboard).value,
                    inline:ReactDOM.findDOMNode(SettingsInstance.refs.todoInline).value,
                },
                "ordered-list":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.orderedListKeyboard).value,
                    inline:ReactDOM.findDOMNode(SettingsInstance.refs.orderedListInline).value
                },
                "unordered-list":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.unorderedListKeyboard).value,
                    inline:ReactDOM.findDOMNode(SettingsInstance.refs.unorderedListInline).value
                },
                "blockquote":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.blockquoteKeyboard).value,
                    inline:ReactDOM.findDOMNode(SettingsInstance.refs.blockquoteInline).value
                },
                "header-one":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.headerOneKeyboard).value,
                    inline:ReactDOM.findDOMNode(SettingsInstance.refs.headerOneInline).value
                },
                "header-two":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.headerTwoKeyboard).value,
                    inline:ReactDOM.findDOMNode(SettingsInstance.refs.headerTwoInline).value
                },
                "header-three":{
                    keyboard:ReactDOM.findDOMNode(SettingsInstance.refs.headerThreeKeyboard).value,
                    inline:ReactDOM.findDOMNode(SettingsInstance.refs.headerThreeInline).value
                }
        }
    }
}