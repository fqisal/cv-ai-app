import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./mock/store.js";
import { ToastProvider } from "./ui/Toast.jsx";
import { AppShell } from "./layout/AppShell.jsx";
import { PlantMascot } from "./ui/PlantMascot.jsx";

import { CustomerHome } from "./pages/customer/CustomerHome.jsx";
import { CustomerRequests } from "./pages/customer/CustomerRequests.jsx";
import { CustomerRequestDetail } from "./pages/customer/CustomerRequestDetail.jsx";
import { CustomerJobs } from "./pages/customer/CustomerJobs.jsx";
import { CreateRequest } from "./pages/customer/CreateRequest.jsx";

import { ProviderDashboard } from "./pages/provider/ProviderDashboard.jsx";
import { ProviderInbox } from "./pages/provider/ProviderInbox.jsx";
import { ProviderJobs } from "./pages/provider/ProviderJobs.jsx";
import { ProviderSubmitQuotation } from "./pages/provider/ProviderSubmitQuotation.jsx";

import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AdminProviders } from "./pages/admin/AdminProviders.jsx";
import { AdminRequests } from "./pages/admin/AdminRequests.jsx";
import { AdminJobs } from "./pages/admin/AdminJobs.jsx";
import { AdminRatings } from "./pages/admin/AdminRatings.jsx";
import { AdminCategories } from "./pages/admin/AdminCategories.jsx";

import { ChatPage } from "./pages/shared/ChatPage.jsx";
import { WalletPage } from "./pages/shared/WalletPage.jsx";
import { SettingsPage } from "./pages/shared/SettingsPage.jsx";
import { NotFound } from "./pages/shared/NotFound.jsx";

function RoleGate({ allow, children }) {
  const { state } = useStore();
  const loc = useLocation();
  if (!allow.includes(state.ui.role)) {
    const fallback = state.ui.role === "admin" ? "/admin" : state.ui.role === "provider" ? "/provider" : "/";
    return <Navigate to={fallback} replace state={{ from: loc.pathname }} />;
  }
  return children;
}

export function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <AppShell>
          <Routes>
            {/* Customer */}
            <Route
              path="/"
              element={
                <RoleGate allow={["customer"]}>
                  <CustomerHome />
                </RoleGate>
              }
            />
            <Route
              path="/requests"
              element={
                <RoleGate allow={["customer"]}>
                  <CustomerRequests />
                </RoleGate>
              }
            />
            <Route
              path="/create-request"
              element={
                <RoleGate allow={["customer"]}>
                  <CreateRequest />
                </RoleGate>
              }
            />
            <Route
              path="/requests/:id"
              element={
                <RoleGate allow={["customer"]}>
                  <CustomerRequestDetail />
                </RoleGate>
              }
            />
            <Route
              path="/jobs"
              element={
                <RoleGate allow={["customer"]}>
                  <CustomerJobs />
                </RoleGate>
              }
            />

            {/* Provider */}
            <Route
              path="/provider"
              element={
                <RoleGate allow={["provider"]}>
                  <ProviderDashboard />
                </RoleGate>
              }
            />
            <Route
              path="/provider/inbox"
              element={
                <RoleGate allow={["provider"]}>
                  <ProviderInbox />
                </RoleGate>
              }
            />
            <Route
              path="/provider/requests/:id/quote"
              element={
                <RoleGate allow={["provider"]}>
                  <ProviderSubmitQuotation />
                </RoleGate>
              }
            />
            <Route
              path="/provider/jobs"
              element={
                <RoleGate allow={["provider"]}>
                  <ProviderJobs />
                </RoleGate>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <RoleGate allow={["admin"]}>
                  <AdminDashboard />
                </RoleGate>
              }
            />
            <Route
              path="/admin/providers"
              element={
                <RoleGate allow={["admin"]}>
                  <AdminProviders />
                </RoleGate>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <RoleGate allow={["admin"]}>
                  <AdminRequests />
                </RoleGate>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <RoleGate allow={["admin"]}>
                  <AdminJobs />
                </RoleGate>
              }
            />
            <Route
              path="/admin/ratings"
              element={
                <RoleGate allow={["admin"]}>
                  <AdminRatings />
                </RoleGate>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <RoleGate allow={["admin"]}>
                  <AdminCategories />
                </RoleGate>
              }
            />

            {/* Shared */}
            <Route path="/chat/:conversationId" element={<ChatPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>

          <PlantMascot />
        </AppShell>
      </ToastProvider>
    </StoreProvider>
  );
}

