export const deleteSite = (id) => {
    return {
        type: 'DELETE_SITE',
        id: id
    }
}

export const refreshSite = (id, index, data) => {
    return {
        type: 'REFRESH_SITE',
        id: id,
        index: index,
        data: data
    }
}

export const updateSites = (data) => {
    return {
        type: 'UPDATE_SITES',
        data: data
    }
}
