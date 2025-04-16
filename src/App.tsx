import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import Navbar from "./components/NavBar";
import CosmosForm from "./components/CosmosForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <Navbar />
        <CosmosForm />
      </div>
    </Provider>
  );
};

export default App;
