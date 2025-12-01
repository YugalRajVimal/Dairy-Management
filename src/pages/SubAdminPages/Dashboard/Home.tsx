import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";

export default function SubAdminHome() {
  const [dashboardData, setDashboardData] = useState<{
    allSupervisorCount: number;
    allVendorsCount: number;
    allRoutesCount: number;
    milkWeightSum: number;
    totalmilkWeightSum: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("sub-admin-token");
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL || ""
          }/api/sub-admin/get-dashboard-details`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(
            errData.message || "Failed to fetch dashboard details."
          );
        }
        const data = await res.json();
        setDashboardData({
          allSupervisorCount: data.allSupervisorCount || 0,
          allVendorsCount: data.allVendorsCount || 0,
          allRoutesCount: data.allRoutesCount || 0,
          milkWeightSum: data.milkWeightSum || 0,
          totalmilkWeightSum: data.totalmilkWeightSum || 0,
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardDetails();
  }, []);

  return (
    <>
      <PageMeta
        title="Dairy Management"
        description="Admin and Sub-Admin Panel for Dairy Management"
      />
      <div className="max-w-6xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Sub-Admin Dashboard
        </h1>
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="w-10 h-10 border-4 border-t-brand-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded-md mb-6">
            {error}
          </div>
        ) : (
          dashboardData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-4 mb-10">
              <div className="rounded-lg shadow bg-white p-5 flex flex-col items-center">
                <span className="text-3xl font-bold text-violet-700">
                  {dashboardData.allSupervisorCount}
                </span>
                <span className="text-gray-600 mt-2">Supervisors</span>
              </div>
              <div className="rounded-lg shadow bg-white p-5 flex flex-col items-center">
                <span className="text-3xl font-bold text-green-700">
                  {dashboardData.allVendorsCount}
                </span>
                <span className="text-gray-600 mt-2">Vendors</span>
              </div>
              <div className="rounded-lg shadow bg-white p-5 flex flex-col items-center">
                <span className="text-3xl font-bold text-blue-700">
                  {dashboardData.allRoutesCount}
                </span>
                <span className="text-gray-600 mt-2">Routes</span>
              </div>
              <div className="rounded-lg shadow bg-white p-5 flex flex-col items-center">
                <span className="text-3xl font-bold text-yellow-700">
                  {dashboardData.milkWeightSum}
                </span>
                <span className="text-gray-600 mt-2">
                  Total Milk Weight Vendors (Ltr)
                </span>
              </div>
              <div className="rounded-lg shadow bg-white p-5 flex flex-col items-center">
                <span className="text-3xl font-bold text-yellow-700">
                  {dashboardData.totalmilkWeightSum}
                </span>
                <span className="text-gray-600 mt-2">
                  Total Milk Weight Uploaded (Ltr)
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
