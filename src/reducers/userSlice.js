import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        users: []
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        resetUser: (state) => {
            state.user = null
        },
        setUsers: (state, action) => {
            state.users = action.payload
        }
    }
})

export const { resetUser, setUser, setUsers } = userSlice.actions
export const selectUser = (state) => state.user.user
export const selectUsers = (state) => state.user.users
export default userSlice.reducer