export const setView = (view) => {
    return {
        type: 'SET_VIEW',
        data:{
            view: view
        }
    }
}

export const setVisibility = (visible) => {
    return {
        type: 'SET_VISIBILITY',
        data:{
            visible:visible
        }
    }
}
