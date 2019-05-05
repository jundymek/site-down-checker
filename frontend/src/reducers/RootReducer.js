import update from 'immutability-helper';

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
            return action.id != site.id
        });
        return {
            ...state,
            sites: filteredSites
        }
    }
    if (action.type === 'REFRESH_SITE') {
        console.log(action)
        console.log(action.data)
        const newData = update(state, {
            sites: {
                [action.index]: { 
                    'url': { $set: action.data.url },
                    'last_response_time': { $set: action.data.last_response_time},
                    'last_status': { $set: action.data.last_status},
                    'last_check': { $set: action.data.last_check },
                }
            }
        });
        return newData
    }
    return state;
}

export default rootReducer;