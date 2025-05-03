// import { useDispatch, useSelector } from "react-redux";
// import { useMsal } from "@azure/msal-react";
// import { loginSuccess, logoutSuccess } from "../store/AuthSlice";
// import { InteractionStatus } from "@azure/msal-browser";
// // Default login request
// const loginRequest = {
//   scopes: ["api://1a4a5a33-e339-416f-846e-89d66dd933f4/Sherlock"],
// };

// export const useAuth = () => {
//   const { instance, accounts, inProgress } = useMsal();
//   const dispatch = useDispatch();
//   const authState = useSelector((state: any) => state.auth);

//   const login = async () => {
//     if (inProgress !== InteractionStatus.None) {
//       console.log("Login already in progress, skipping new login attempt");
//       return;
//     }
//     console.log("Login function called");

//     try {
//       // Try silent token acquisition first if we have an account
//       if (accounts.length > 0) {
//         console.log("Attempting silent token acquisition");
//         const response = await instance.acquireTokenSilent({
//           ...loginRequest,
//           account: accounts[0],
//         });

//         dispatch(
//           loginSuccess({
//             accessToken: response.accessToken,
//             account: response.account,
//           })
//         );
//         return;
//       }
//     } catch (error) {
//       console.log("Silent token acquisition failed:", error);
//     }

//     // Fall back to redirect login
//     console.log("Redirecting to login");
//     try {
//       await instance.loginRedirect({
//         ...loginRequest,
//         redirectStartPage: window.location.href,
//       });
//     } catch (error) {
//       console.error("error during login redirect", error);
//     }
//   };
//   const logout = () => {
//     instance
//       .logoutRedirect()
//       .then(() => {
//         dispatch(logoutSuccess());
//       })
//       .catch((error) => {
//         console.error("Logout failed:", error);
//       });
//   };

//   // Get current account
//   const account = accounts.length > 0 ? accounts[0] : null;

//   // Check if user is authenticated (from both redux and msal)
//   const isAuthenticated = authState.isAuthenticated || accounts.length > 0;

//   return { login, logout, account, isAuthenticated, inProgress };
// };
import { useDispatch, useSelector } from "react-redux";
import { useMsal } from "@azure/msal-react";
import { loginSuccess, logoutSuccess } from "../store/AuthSlice";
import { InteractionStatus } from "@azure/msal-browser";

// Default login request - outside the hook to prevent recreations
const loginRequest = {
  scopes: ["api://1a4a5a33-e339-416f-846e-89d66dd933f4/Sherlock"],
};

export const useAuth = () => {
  const { instance, accounts, inProgress } = useMsal();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);

  // Use a function that returns a promise for better control
  const login = async () => {
    // Prevent login attempts if already in progress or handling redirect
    if (inProgress !== InteractionStatus.None) {
      console.log(
        `Login already in progress (${inProgress}), skipping new login attempt`
      );
      return Promise.resolve();
    }

    console.log("Login function called");

    try {
      // Try silent token acquisition first if we have an account
      if (accounts.length > 0) {
        console.log("Attempting silent token acquisition");
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        dispatch(
          loginSuccess({
            accessToken: response.accessToken,
            account: response.account,
          })
        );
        return Promise.resolve();
      }
    } catch (error) {
      console.log("Silent token acquisition failed:", error);
    }

    // Fall back to redirect login
    console.log("Redirecting to login");
    try {
      // Don't await the redirect - it won't resolve until after the redirect happens
      return instance.loginRedirect({
        ...loginRequest,
        redirectStartPage: window.location.origin, // Simplified to just use origin
      });
    } catch (error) {
      console.error("Error during loginRedirect:", error);
      return Promise.reject(error);
    }
  };

  const logout = () => {
    instance
      .logoutRedirect()
      .then(() => {
        dispatch(logoutSuccess());
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  // Get current account
  const account = accounts.length > 0 ? accounts[0] : null;

  // Check if user is authenticated (from both redux and msal)
  const isAuthenticated = authState.isAuthenticated || accounts.length > 0;

  return { login, logout, account, isAuthenticated, inProgress };
};
