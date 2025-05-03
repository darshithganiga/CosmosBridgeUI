// import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useMsal } from "@azure/msal-react";

// const SignInCallback: React.FC = () => {
//   const { instance } = useMsal();

//   useEffect(() => {
//     // This component will be rendered when Azure AD redirects back to your app
//     // The AuthProvider will handle the redirect promise, so we just need to
//     // make sure we don't interfere with that process

//     console.log("On signin-oidc page, waiting for redirect to be processed...");
//   }, [instance]);

//   return (
//     <div className="text-center mt-5">
//       <div className="spinner-border" role="status">
//         <span className="visually-hidden">Loading...</span>
//       </div>
//       <p className="mt-3">Completing authentication, please wait...</p>
//       <Navigate to="/" replace />
//     </div>
//   );
// };

// export default SignInCallback;
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const SignInCallback: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const processRedirect = async () => {
      try {
        console.log(
          "On signin-oidc page, waiting for redirect to be processed..."
        );

        // Process the redirect response
        const response = await instance.handleRedirectPromise();

        if (response) {
          console.log(
            "Authentication successful, response received:",
            response.account.username
          );

          // Get the stored redirect path or default to root
          const redirectPath = sessionStorage.getItem("redirectPath") || "/";
          sessionStorage.removeItem("redirectPath"); // Clean up

          // Navigate to the intended destination
          navigate(redirectPath, { replace: true });
        } else {
          console.log(
            "No redirect response found, might be processing in AuthProvider"
          );
          // Wait a moment to allow AuthProvider to process
          setTimeout(() => {
            setIsProcessingRedirect(false);
          }, 1500);
        }
      } catch (err) {
        console.error("Error handling redirect:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Unknown error during redirect")
        );
        setIsProcessingRedirect(false);
      }
    };

    processRedirect();
  }, [instance, navigate]);

  // If there was an error, show it
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Authentication Error</h4>
          <p>{error.message}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/", { replace: true })}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // If still processing, show a loading indicator
  if (isProcessingRedirect) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Completing authentication, please wait...</p>
      </div>
    );
  }

  // If processing is complete, redirect to home
  return <Navigate to="/" replace />;
};

export default SignInCallback;
