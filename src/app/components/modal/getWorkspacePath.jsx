var React = require('react');


import {Button, FormControl,FormGroup, InputGroup} from 'react-bootstrap'

const ElectronApi = require('electron').remote;
const Dialog = ElectronApi.dialog;
const ElectronApp = ElectronApi.app


import {setEditorSetting} from '../../helper/settingsManager'


var GetWorkspacePath=React.createClass({
    getInitialState: function(){
        return {
            path:`${ElectronApp.getPath('documents')}/medley`
        }
    },
    _handleBrowseClick: function (event) {
        var self=this;
        Dialog.showOpenDialog(
            {
                defaultPath:ElectronApp.getPath('documents'),
                properties: ['openDirectory']
            },
            (filePaths)=>{
                self.setState({
                    path:`${filePaths[0]}/${(filePaths[0].toLowerCase().includes("medley")?'':'medley')}`
                })
            }
        )
    },
    _handleConfirmPath:function(){
        setEditorSetting("application.workspace", this.state.path)
        ElectronApi.BrowserWindow.getFocusedWindow().reload();

    },
    render: function(){

        return (
            <div>
                <FormGroup>
                    <InputGroup>
                        <FormControl type="text" defaultValue={this.state.path} value={this.state.path}/>
                        <InputGroup.Addon onClick={this._handleBrowseClick} style={{cursor:'pointer', padding:"5px 25px"}}>
                            Browse
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <div style={{paddingTop:15}}>
                    <Button bsStyle="success" onClick={this._handleConfirmPath} style={{width:120}}>
                        Confirm
                    </Button>
                </div>
            </div>
        )
    }
});

module.exports=GetWorkspacePath;