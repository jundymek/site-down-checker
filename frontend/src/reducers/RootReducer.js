const initState = {
    token: localStorage.getItem('token'),
    sites: []
}

const rootReducer = (state = initState, action) => {
    if (action.type === 'UPDATE_TOKEN') {
        return {
            ...state,
            token: localStorage.getItem('token'),
            
        }
    }
    if (action.type === 'UPDATE_SITES') {
        console.log(action.data)
        if (state.sites.length === 0) {
            return {
                ...state,
                sites: action.data
            }
        }
        return {
            ...state,
            sites: [...state.sites, action.data]
        }
    }
    return state;
}

export default rootReducer;