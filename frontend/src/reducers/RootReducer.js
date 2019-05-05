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
    if (action.type === 'DELETE_SITE') {
        console.log(action)
        let filteredSites = state.sites.filter(site => {
            console.log(action.id)
            console.log(site.id)
            return action.id != site.id
        });
        return {
            ...state,
            sites: filteredSites
        }
    }
    return state;
}

export default rootReducer;