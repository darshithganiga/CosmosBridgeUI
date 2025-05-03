import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Navbar from "./components/NavBar";
import CosmosForm from "./components/CosmosForm";
import { AuthProvider } from "./components/Authorization/AuthProvider";
import ProtectedRoute from "./components/Authorization/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import SignInCallback from "./components/Authorization/SigninCallback";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* <AuthProvider>
          <Routes>
            <Route path="/signin-oidc" element={<SignInCallback />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute> */}
        <div className="app">
          <Navbar />
          <CosmosForm />
        </div>
        {/* </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider> */}
      </BrowserRouter>
    </Provider>
  );
};

export default App;
