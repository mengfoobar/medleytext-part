const INITIAL_STATE = {loading:false, error:false}

const Editor = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case "LOADING":
            return {...state, error:null, loading:true};
        case "ERROR":
            return {...state, error:action.data.error, loading:false};
        default:
            return state;
    }
}

export default Editor;
