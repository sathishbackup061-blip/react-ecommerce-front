export const userReducer = (state = null, action) => {
  switch (action.type) {
    case "LOGGED_IN_USER":
      return {
        ...state,
        ...action.payload, // merge instead of replace
      };

    case "LOGOUT":
      return null;

    default:
      return state;
  }
};