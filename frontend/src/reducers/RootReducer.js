import update from 'immutability-helper';

const initState = {
    token: localStorage.getItem('token'),
    sites: [],
}

const rootReducer = (state = initState, action) => {
    if (action.type === 'UPDATE_TOKEN') {
        return {
            ...state,
            token: localStorage.getItem('token'),
        }
    }
    if (action.type === 'UPDATE_SITES') {
        if (state.sites.length === 0 || action.reset) {
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
        let filteredSites = state.sites.filter(site => {
            return parseInt(action.id) !== site.id
        });
        return {
            ...state,
            sites: filteredSites
        }
    }
    if (action.type === 'REFRESH_SITE') {
        const newData = update(state, {
            sites: {
                [action.index]: {
                    'url': { $set: action.data.url },
                    'last_response_time': { $set: action.data.last_response_time },
                    'last_status': { $set: action.data.last_status },
                    'last_check': { $set: action.data.last_check },
                    'error_msg': { $set: action.data.error_msg }
                }
            }
        });
        return newData
    }
    return state;
}

export default rootReducer;