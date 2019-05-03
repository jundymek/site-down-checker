const initState = {
    token: ''
}

const authReducer = (state = initState, action) => {
    if (action.type === 'UPDATE_TOKEN') {
        return {
            token: localStorage.getItem('token')
        }
    }
    return state;
}

export default authReducer;