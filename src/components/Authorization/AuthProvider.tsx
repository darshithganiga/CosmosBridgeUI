import React, { useEffect, useState } from "react";
import {
  PublicClientApplication,
  EventType,
  AuthenticationResult,
  InteractionRequiredAuthError,
  BrowserAuthError,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/AuthSlice";
import { msalConfig } from "../../services/AuthConfig";

// Create the MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Global initialization state
let isMsalInitialized = false;

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isHandlingRedirect, setIsHandlingRedirect] = useState(true);

  // Handle initial session check and redirect processing
  useEffect(() => {
    // Initialize MSAL and handle redirects
    const handleMsalInit = async () => {
      try {
        // First, ensure MSAL is initialized
        if (!isMsalInitialized) {
          console.log("Initializing MSAL instance");
          await msalInstance.initialize();
          isMsalInitialized = true;
          console.log("MSAL instance initialized successfully");
        }

        console.log("Handling MSAL redirect");
        setIsHandlingRedirect(true);

        // Now handle redirect - it's safe to call this after initializing
        const response = await msalInstance.handleRedirectPromise();

        // If we got a response, we've just returned from a redirect
        if (response) {
          console.log("Redirect response received:", response);
          msalInstance.setActiveAccount(response.account);

          dispatch(
            loginSuccess({
              accessToken: response.accessToken,
              account: response.account,
            })
          );
        } else {
          console.log("No redirect response");

          // Check for existing accounts
          const currentAccounts = msalInstance.getAllAccounts();

          if (currentAccounts.length > 0) {
            console.log("Existing account found:", currentAccounts[0].username);
            msalInstance.setActiveAccount(currentAccounts[0]);

            // Try to get token silently
            try {
              const silentRequest = {
                scopes: ["api://1a4a5a33-e339-416f-846e-89d66dd933f4/Sherlock"],
                account: currentAccounts[0],
              };

              const silentResult = await msalInstance.acquireTokenSilent(
                silentRequest
              );

              dispatch(
                loginSuccess({
                  accessToken: silentResult.accessToken,
                  account: silentResult.account,
                })
              );

              console.log("Silent token acquisition successful");
            } catch (e) {
              if (e instanceof InteractionRequiredAuthError) {
                console.log("Interaction required for authentication");
              } else {
                console.warn("Silent token acquisition failed:", e);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof BrowserAuthError) {
          if (error.errorCode === "interaction_in_progress") {
            console.log(
              "Interaction already in progress, waiting for completion"
            );
            // No need to handle this error as it's a normal part of the flow
            // when multiple components might be trying to handle redirects
          } else {
            console.error(
              "MSAL browser error:",
              error.errorCode,
              error.errorMessage
            );
          }
        } else {
          console.error("Error in MSAL initialization:", error);
        }
      } finally {
        setIsHandlingRedirect(false);
        setIsInitialized(true);
      }
    };

    // Register event callbacks
    const callbackId = msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const payload = event.payload as AuthenticationResult;
        console.log("Login success event captured");
        msalInstance.setActiveAccount(payload.account);
      }

      if (event.eventType === EventType.HANDLE_REDIRECT_START) {
        console.log("Redirect handling started");
        setIsHandlingRedirect(true);
      }

      if (event.eventType === EventType.HANDLE_REDIRECT_END) {
        console.log("Redirect handling ended");
        setIsHandlingRedirect(false);
      }
    });

    // Initialize MSAL and handle any redirects
    handleMsalInit();

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId);
      }
    };
  }, [dispatch]);

  // Show a loading state while MSAL is initializing or handling redirect
  if (!isInitialized || isHandlingRedirect) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Initializing authentication...</p>
      </div>
    );
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

// import React, { useEffect, useState } from "react";
// import {
//   PublicClientApplication,
//   EventType,
//   AuthenticationResult,
//   InteractionRequiredAuthError,
// } from "@azure/msal-browser";
// import { MsalProvider } from "@azure/msal-react";
// import { useDispatch } from "react-redux";
// import { loginSuccess } from "../../store/AuthSlice";
// import { msalConfig } from "../../services/AuthConfig";

// Create the instance with modified config
// const modifiedConfig = {
//   ...msalConfig,
//   auth: {
//     ...msalConfig.auth,
//     // redirectUri: "http://localhost:3000/signin-oidc",
//   },
//   cache: {
//     cacheLocation: "localStorage",
//     storeAuthStateInCookie: true,
//   },
//   // system: {
//   //   navigateFrameWait: 0,
//   //   allowRedirectInIframe: false,
//   // },
// };

// Create the instance
// const msalInstance = new PublicClientApplication(msalConfig);

// // Global flag to prevent duplicate redirect processing
// let redirectPromiseResolved = false;

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const dispatch = useDispatch();
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [isHandlingRedirect, setIsHandlingRedirect] = useState(true);

//   // Handle initial session check and redirect processing
//   useEffect(() => {
//     // This helps avoid race conditions by ensuring the handleRedirectPromise is only called once
//     if (redirectPromiseResolved) {
//       setIsHandlingRedirect(false);
//       setIsInitialized(true);
//       return;
//     }

//     const handleMsalInit = async () => {
//       try {
//         console.log("Handling MSAL initialization");
//         setIsHandlingRedirect(true);

//         // Handle redirect first
//         const response = await msalInstance.handleRedirectPromise();
//         redirectPromiseResolved = true;

//         // If we got a response, we've just returned from a redirect
//         if (response) {
//           console.log("Redirect response received:", response);
//           msalInstance.setActiveAccount(response.account);

//           dispatch(
//             loginSuccess({
//               accessToken: response.accessToken,
//               account: response.account,
//             })
//           );
//         } else {
//           console.log("No redirect response");

//           // Check for existing accounts
//           const currentAccounts = msalInstance.getAllAccounts();

//           if (currentAccounts.length > 0) {
//             console.log("Existing account found:", currentAccounts[0].username);
//             msalInstance.setActiveAccount(currentAccounts[0]);

//             // Try to get token silently
//             try {
//               const silentRequest = {
//                 scopes: ["api://1a4a5a33-e339-416f-846e-89d66dd933f4/Sherlock"],
//                 account: currentAccounts[0],
//               };

//               const silentResult = await msalInstance.acquireTokenSilent(
//                 silentRequest
//               );

//               dispatch(
//                 loginSuccess({
//                   accessToken: silentResult.accessToken,
//                   account: silentResult.account,
//                 })
//               );

//               console.log("Silent token acquisition successful");
//             } catch (e) {
//               if (e instanceof InteractionRequiredAuthError) {
//                 console.log("Interaction required for authentication");
//               } else {
//                 console.warn("Silent token acquisition failed:", e);
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error in MSAL initialization:", error);
//       } finally {
//         setIsHandlingRedirect(false);
//         setIsInitialized(true);
//       }
//     };

//     // Register event callbacks
//     const callbackId = msalInstance.addEventCallback((event) => {
//       if (event.eventType === EventType.LOGIN_SUCCESS) {
//         const payload = event.payload as AuthenticationResult;
//         console.log("Login success event captured");
//         msalInstance.setActiveAccount(payload.account);
//       }

//       if (event.eventType === EventType.HANDLE_REDIRECT_START) {
//         console.log("Redirect handling started");
//         setIsHandlingRedirect(true);
//       }

//       if (event.eventType === EventType.HANDLE_REDIRECT_END) {
//         console.log("Redirect handling ended");
//         setIsHandlingRedirect(false);
//       }
//     });

//     handleMsalInit();

//     return () => {
//       if (callbackId) {
//         msalInstance.removeEventCallback(callbackId);
//       }
//     };
//   }, [dispatch]);

//   // Show a loading state while MSAL is initializing or handling redirect
//   if (!isInitialized || isHandlingRedirect) {
//     return (
//       <div className="text-center mt-5">
//         <div className="spinner-border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3">Initializing authentication...</p>
//       </div>
//     );
//   }

//   return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
// };
