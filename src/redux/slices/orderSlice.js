import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customer: {
        name: '',
        phone: '',
        address: '',
    },
    details: [], // {product, quantity}
    totalPrice: 0,
    intoMoney: 0,
    priceDiscounted: 0,
};

function updateTotalPrice(state) {
    state.totalPrice = state.details.reduce((prevPrice, currDetail) => {
        return prevPrice + currDetail.quantity * currDetail.price;
    }, 0);
}
function updateIntoPrice(state) {
    state.intoMoney = state.details.reduce((prevPrice, currDetail) => {
        return prevPrice + currDetail.quantity * currDetail.priceDiscounted;
    }, 0);
}
function updatePriceDiscounted(state) {
    state.priceDiscounted = state.details.reduce((prevPrice, currDetail) => {
        return prevPrice + currDetail.quantity * (currDetail.price - currDetail.priceDiscounted);
    }, 0);
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        // payload {product, price}
        add: (state, action) => {
            //add
            const indexDetail = state.details.findIndex((detail) => detail.product._id === action.payload.product._id);
            if (indexDetail !== -1) {
                state.details[indexDetail].quantity += 1;
            } else {
                state.details.push({
                    product: action.payload.product,
                    price: action.payload.price,
                    discount: action.payload.discount,
                    priceDiscounted: action.payload.priceDiscounted,
                    quantity: 1,
                });
            }
            updateTotalPrice(state);
            updateIntoPrice(state);
            updatePriceDiscounted(state);
        },

        // payload: {_id}
        remove: (state, action) => {
            state.details = state.details.filter((detail) => detail.product._id !== action.payload);
            updateTotalPrice(state);
            updateIntoPrice(state);
            updatePriceDiscounted(state);
        },

        // payload: {_id, quantity}
        updateQuantity: (state, action) => {
            const indexDetail = state.details.findIndex((detail) => detail.product._id === action.payload._id);
            if (indexDetail !== -1) {
                if (state.details[indexDetail].product.quantity < Number(action.payload.quantity)) {
                    state.details[indexDetail].quantity = state.details[indexDetail].product.quantity;
                    return;
                }
                if (Number(action.payload.quantity) <= 0) {
                    return state;
                }
                state.details[indexDetail].quantity = Number(action.payload.quantity);
            }
            updateTotalPrice(state);
            updateIntoPrice(state);
            updatePriceDiscounted(state);
        },

        updateCustomer: (state, action) => {
            state.customer = action.payload;
        },
        reset: () => initialState,
    },
});

// Action creators are generated for each case reducer function
const orderReducer = orderSlice.reducer;
const orderActions = orderSlice.actions;

export default orderReducer;
export { orderActions };
