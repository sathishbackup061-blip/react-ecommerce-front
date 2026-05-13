import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import "antd/dist/reset.css"; // Import Ant Design styles


import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from './reducers';

const store = createStore(rootReducer, composeWithDevTools());

// load cart from localStorage
if (typeof window !== "undefined") {
  if (localStorage.getItem("cart")) {
    store.dispatch({
      type: "ADD_TO_CART",
      payload: JSON.parse(localStorage.getItem("cart")),
    });
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>
);
reportWebVitals();
