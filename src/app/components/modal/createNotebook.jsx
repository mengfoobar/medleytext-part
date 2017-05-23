var React = require('react');
var ReactDOM = require('react-dom');

import {Button, FormControl, FormGroup} from 'react-bootstrap'

import {insertNoteBook} from '../../helper/notesHelper'
import {hideModal} from '../../helper/modalManager'



var CreateNewNoteBook=React.createClass({
    getInitialState: function(){
        return {
        }
    },
    componentDidMount:function(){
        window.addEventListener("keydown", this._handleKeyDown);
        ReactDOM.findDOMNode(this.refs.noteBookNameInput).focus()

    },
    componentWillUnmount: function() {
        window.removeEventListener("keydown", this._handleKeyDown,);
    },
    _handleKeyDown:function(e){
        if(e.key==="Enter"){
            this._handleConfirmNoteBookName()
        }

    },
    _handleConfirmNoteBookName:function(){
        const noteBookName=ReactDOM.findDOMNode(this.refs.noteBookNameInput).value;
        if(!noteBookName || noteBookName.trim().length<=0){
            //TODO: handle error
            //this.notify("error", "", "Error: notebook name can not be empty" )
        }else{
            this.props.onSubmit(noteBookName)
        }

    },
    render: function(){

        return (
            <div>
                <FormGroup id="getNewNoteBookName">
                    <FormControl ref="noteBookNameInput" type="text" placeholder="Type in name for new notebook" defaultValue="" />
                </FormGroup>
                <div style={{paddingTop:15, textAlign:'right'}}>
                    <Button onClick={()=>{this.props.hide()}} style={{width:120, marginRight:10}}>
                        Cancel
                    </Button>
                    <Button bsStyle="success" onClick={this._handleConfirmNoteBookName} style={{width:120}}>
                        Confirm
                    </Button>

                </div>
            </div>
        )
    }
});

module.exports=CreateNewNoteBook;