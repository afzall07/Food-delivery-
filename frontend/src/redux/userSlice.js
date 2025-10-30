import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        currentCity: null,
        currentState: null,
        currentAddress: null,
        shopsInMyCity: [],
        itemsInMyCity: null,
        cartItems: []
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload
        },
        setCurrentState: (state, action) => {
            state.currentState = action.payload
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload
        },
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload
        },
        setItemsInMyCity: (state, action) => {
            state.itemsInMyCity = action.payload
        },
        addToCart: (state, action) => {
            const cartItem = action.payload
            const existItem = state.cartItems.find(item => item.id == cartItem.id)
            if (existItem) {
                existItem.quantity += cartItem.quantity
            } else {
                state.cartItems.push(cartItem)
            }

        }
    }
})
export const { setUserData, setCurrentCity, setCurrentState, setCurrentAddress, setShopsInMyCity, setItemsInMyCity, addToCart } = userSlice.actions
export default userSlice.reducer