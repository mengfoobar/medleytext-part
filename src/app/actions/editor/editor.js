export const setLoading = (view) => {
    return {
        type: 'LOADING',
        data:{
            view: view
        }
    }
}

export const setError = (error) => {
    return {
        type: 'ERROR',
        data:{
            error:error
        }
    }
}