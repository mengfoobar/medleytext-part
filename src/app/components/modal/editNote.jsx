var React = require('react');
var ReactDOM = require('react-dom');
import {ControlLabel, Button, FormGroup, FormControl} from 'react-bootstrap'


var MoveNote=React.createClass({
    getInitialState: function(){
        return {}
    },
    _handleConfirmNoteBook:function(){
        const targetNoteBookId = ReactDOM.findDOMNode(this.refs.noteBookTo).value;
        this.props.onSubmit(targetNoteBookId);
    },
    render: function(){

        return (
            <div>
                <FormGroup controlId="formControlsSelect" style={{textAlign:"left"}}>
                    <ControlLabel style={ {fontSize: 14, color: '#595959', paddingBottom:5}}>Select Notebook to move to: </ControlLabel>
                    <FormControl ref="noteBookTo" componentClass="select" placeholder="select">
                        {computeListItems(this.props.params.notebooks)}
                    </FormControl>
                </FormGroup>
                <div style={{paddingTop:15, textAlign:'right'}}>
                    <Button onClick={()=>{this.props.hide()}} style={{width:120, marginRight:10}}>
                        Cancel
                    </Button>
                    <Button bsStyle="success" onClick={this._handleConfirmNoteBook} style={{width:120}}>
                        Confirm
                    </Button>

                </div>
            </div>
        )
    }
});


const computeListItems=(notebooks)=>{

    return notebooks.map(
        (noteBook, i)=>{
            return <option  key={i} value={noteBook._id} >
                {noteBook.title}
            </option>
        });
}

module.exports=MoveNote;