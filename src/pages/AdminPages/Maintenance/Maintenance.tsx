import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

// This component implements fetching and toggling maintenance mode
// according to the backend endpoints defined in @file_context_0 (lines 10-24):
// - POST /api/admin/enable-maintenance-mode   (enable maintenance mode)
// - POST /api/admin/disable-maintenance-mode  (disable maintenance mode)
// - GET  /api/admin/get-maintenance-status    (get current maintenance mode status)

export default function Maintenance() {
  const [isMaintenance, setIsMaintenance] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetches current maintenance status
  const fetchMaintenanceStatus = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        setError("No admin token found.");
        setIsMaintenance(null);
        setLoading(false);
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/get-maintenance-status`,
        { headers: { Authorization: token } }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch status.");
      }
      setIsMaintenance(data.isMaintenanceMode);
    } catch (err: any) {
      setError(err.message || "Failed to fetch maintenance status.");
      setIsMaintenance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceStatus();
    // eslint-disable-next-line
  }, []);

  // Toggles maintenance mode on or off using backend endpoints
  const handleMaintenanceToggle = async (enable: boolean) => {
    setActionLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("admin-token");
      if (!token) {
        setError("No admin token found.");
        setActionLoading(false);
        return;
      }
      // API endpoints strictly matching @file_context_0 (lines 10-24)
      const apiRoute = enable
        ? "/api/admin/enable-maintenance-mode"
        : "/api/admin/disable-maintenance-mode";
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}${apiRoute}`,
        { method: "POST", headers: { Authorization: token } }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update maintenance mode.");
      }
      setSuccessMessage(data.message || "Operation successful.");
      setIsMaintenance(enable);
    } catch (err: any) {
      setError(err.message || "Failed to update maintenance mode.");
    } finally {
      setActionLoading(false);
    }
  };

  const ModePill = ({ mode }: { mode: boolean }) => (
    <span
      className={`inline-block px-4 py-1 rounded-full text-white text-xs font-semibold ${
        mode ? "bg-red-500" : "bg-green-500"
      }`}
    >
      {mode ? "Maintenance Mode Enabled" : "Normal Mode"}
    </span>
  );

  return (
    <>
      <PageMeta
        title="Maintenance Mode"
        description="Maintenance Mode for Dairy Management Admin Panel"
      />
      <PageBreadcrumb pageTitle="Maintenance Mode" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 max-w-xl mx-auto">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Maintenance Mode
        </h3>
        {loading ? (
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="w-8 h-8 border-4 border-t-brand-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 mb-6 text-red-600 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col items-center gap-2">
              <ModePill mode={!!isMaintenance} />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {isMaintenance
                  ? "The application is currently in MAINTENANCE MODE. Users cannot access the system."
                  : "The application is running in NORMAL MODE. Users can access the system."}
              </span>
            </div>
            {successMessage && (
              <div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-300 rounded-md">
                {successMessage}
              </div>
            )}
            <div className="flex justify-center gap-4">
              {isMaintenance ? (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 font-semibold rounded-lg transition"
                  onClick={() => handleMaintenanceToggle(false)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Disabling..." : "Disable Maintenance Mode"}
                </button>
              ) : (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 font-semibold rounded-lg transition"
                  onClick={() => handleMaintenanceToggle(true)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Enabling..." : "Enable Maintenance Mode"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
