import React from "react";
import ReactDOM from "react-dom/client";
import { StyledEngineProvider, CssBaseline } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import App from "./App";
import "./index.css";
import "./lib/firebase";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <CssBaseline />
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);