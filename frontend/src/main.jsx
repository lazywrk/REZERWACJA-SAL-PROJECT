import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "sonner";

import App from "./App";
import "./index.css";

import { AuthProvider }
from "./features/auth/context/AuthProvider";

ReactDOM.createRoot(
 document.getElementById("root")
).render(
 <React.StrictMode>

   <AuthProvider>

      <App />

      <Toaster
        richColors
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
          },
        }}
      />

   </AuthProvider>

 </React.StrictMode>
);