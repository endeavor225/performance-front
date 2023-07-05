/*
export function someMutation (state) {
}
*/

export function setAuth (state, value) {
    state.auth = value
    state.logged = true
}

export function clearAuth (state) {
    state.auth = null
    state.logged = false
}