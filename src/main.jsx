import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client.js";

createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>
);
