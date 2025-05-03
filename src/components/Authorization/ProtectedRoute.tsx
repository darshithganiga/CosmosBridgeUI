// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../hooks/UseAuth";
// import { useSelector } from "react-redux";
// import { useMsal } from "@azure/msal-react";
// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { login, account } = useAuth();
//   const authState = useSelector((state: any) => state.auth);
//   const { inProgress } = useMsal();
//   const [loginAttempted, setLoginAttempted] = useState(false);

//   useEffect(() => {
//     if (
//       !authState.isAuthenticated &&
//       !account &&
//       inProgress === "none" &&
//       !loginAttempted
//     ) {
//       console.log("Authentication needed, triggering login flow");
//       setLoginAttempted(true); // Prevent multiple login attempts
//       login();
//     }
//   }, [authState.isAuthenticated, account, inProgress, loginAttempted, login]);

//   if (!authState.isAuthenticated && !account) {
//     return (
//       <div className="text-center mt-5">
//         <div className="spinner-border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3">Checking authentication status...</p>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/UseAuth"; // Make sure path is correct
import { useSelector } from "react-redux";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { login, account, isAuthenticated: authHookAuthenticated } = useAuth();
  const authState = useSelector((state: any) => state.auth);
  const { inProgress } = useMsal();
  const [loginAttempted, setLoginAttempted] = useState(false);

  // Combine authentication states to ensure we catch all cases
  const isAuthenticated =
    authState.isAuthenticated || authHookAuthenticated || Boolean(account);

  useEffect(() => {
    const attemptLogin = async () => {
      // Only attempt login if all conditions are met
      if (
        !isAuthenticated &&
        inProgress === InteractionStatus.None &&
        !loginAttempted
      ) {
        console.log("Authentication needed, triggering login flow");
        setLoginAttempted(true);
        try {
          await login();
        } catch (error) {
          console.error("Login attempt failed:", error);
          // Reset the login attempted flag after a delay to allow retry
          setTimeout(() => setLoginAttempted(false), 3000);
        }
      }
    };

    // Only run this if not currently handling a redirect
    if (inProgress !== InteractionStatus.HandleRedirect) {
      attemptLogin();
    }
  }, [isAuthenticated, inProgress, loginAttempted, login]);

  // Show loading while authenticting or in the middle of a redirect
  if (!isAuthenticated || inProgress === InteractionStatus.HandleRedirect) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">
          {inProgress === InteractionStatus.HandleRedirect
            ? "Completing authentication..."
            : "Checking authentication status..."}
        </p>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
