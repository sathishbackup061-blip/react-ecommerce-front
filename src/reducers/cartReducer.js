const initialState = {
  cart: [],
  coupon: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {

    case "ADD_TO_CART":
      return {
        ...state,
        cart: action.payload,
      };

    case "COUPON_APPLIED":
      return {
        ...state,
        coupon: action.payload,
      };

    default:
      return state;
  }
};