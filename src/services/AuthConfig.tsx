// src/services/authConfig.ts
export const msalConfig = {
  auth: {
    clientId: "1a4a5a33-e339-416f-846e-89d66dd933f4",
    authority:
      "https://login.microsoftonline.com/185e7ed4-24c7-4904-a70c-4d1b7fa32214",
    redirectUri: "http://localhost:3000/signin-oidc",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: ["api://1a4a5a33-e339-416f-846e-89d66dd933f4/Sherlock"],
};
