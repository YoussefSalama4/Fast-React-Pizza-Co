import { configureStore } from '@reduxjs/toolkit';
import userReudcer from './features/user/userSlice';
import cartReducer from './features/cart/cartSlice';
const store = configureStore({
  reducer: {
    user: userReudcer,
    cart: cartReducer,
  },
});

export default store;
