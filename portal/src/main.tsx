import * as React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import LoginPage from "./pages/login/Login";
import App from "./App";
import Dashboard from "./pages/home/Dashboard";
import Notifications from './pages/pings/Notifications';
import Transactions from "./pages/tx/Transactions";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to='/Dashboard' />} />
          <Route path="*" element={<App />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Dashboard />} />
            <Route path="hosts" element={<Dashboard />} />
            <Route path="pings" element={<Notifications />} />
            <Route path="Transactions" element={<Transactions/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
