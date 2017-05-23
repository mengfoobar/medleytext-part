const INITIAL_STATE = {view:"notes", isVisible:true}

const sidebar = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case "SET_VIEW":
            return {...state, view: action.data.view};
        case "SET_VISIBILITY":
            return {...state, isVisible: action.data.visible};
        default:
            return state;
    }
}


export default sidebar