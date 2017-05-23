var React = require('react');

var ReactBootStrap = require('react-bootstrap');
var Button = ReactBootStrap.Button;
var ControlLabel = ReactBootStrap.ControlLabel




var ConfirmationWarning=React.createClass({
    getInitialState: function(){
        return {
        }
    },
    _handleConfirm:function(){
        this.props.onSubmit();
    },
    render: function(){

        return (
            <div>
                <ControlLabel style={ {fontSize: 16, color: '#595959', padding: '25px 0px'}}>
                    {`Are you sure you want to delete "${this.props.params.notebook.title}"?`}
                </ControlLabel>
                <div style={{paddingTop:15, textAlign:'center'}}>
                    <Button onClick={()=>{this.props.hide()}} style={{width:120, marginRight:10}}>
                        Cancel
                    </Button>
                    <Button bsStyle="success" onClick={this._handleConfirm} style={{width:120}}>
                        Confirm
                    </Button>

                </div>
            </div>
        )
    }
});

module.exports=ConfirmationWarning;