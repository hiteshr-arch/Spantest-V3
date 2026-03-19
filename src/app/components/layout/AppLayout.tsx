import { Outlet } from "react-router";
import { Header } from "./Header";
import { ErrorBoundary } from "../ErrorBoundary";

export function AppLayout() {
  return (
    <div className="app flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex-1 min-h-0 flex flex-col">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}