var React = require('react');
var ReactDOM = require('react-dom');
import NP from 'nested-property'

var ReactBootStrap = require('react-bootstrap');
var Button = ReactBootStrap.Button


var FormGroup = ReactBootStrap.FormGroup;
var FormControl = ReactBootStrap.FormControl;


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
            this.notify("error", "", "Error: notebook name can not be empty" )
        }else{
            // var metaData = Immutable.fromJS(this.props.params);
            // var updateMetaData = metaData.set("title", noteBookName)

            // this.props.updateNoteBookMeta(this.props.selectedNoteBookIndex, updateMetaData.toJS());
            this.props.onSubmit(noteBookName)
        }

    },
    render: function(){

        const {params, hide} = this.props;
        console.log(`params ${params}`)

        const title = NP.get(params, "item.title")

        return (
            <div>
                <FormGroup id="updateNoteBookTitle">
                    <FormControl ref="noteBookNameInput" type="text" defaultValue={title||""} />
                </FormGroup>
                <div style={{paddingTop:15, textAlign:'right'}}>
                    <Button onClick={()=>{hide()}} style={{width:120, marginRight:10}}>
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