import { useState, useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Alert from "../../../components/ui/alert/Alert";
import axios from "axios";

// ---------------- TYPES ----------------
interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "info";
  title: string;
  message: string;
}

interface AssetReport {
  _id?: string;
  subAdminId: string;
  stockNo?: string;
  rt?: string;
  duplicate?: string;
  status?: string;
  cStatus?: string;
  can?: number | string;
  lid?: number | string;
  pvc?: number | string;
  keyboard?: number | string;
  printer?: number | string;
  charger?: number | string;
  stripper?: number | string;
  solar?: number | string;
  controller?: number | string;
  ews?: number | string;
  display?: number | string;
  battery?: number | string;
  bond?: string;
  vspSign?: string;
  dps?: string;
}

// ---------------- COMPONENT ----------------
export default function AssetsInInventory() {
  const API_URL = import.meta.env.VITE_API_URL;
  const subAdminId = localStorage.getItem("sub-admin-id") || "";

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false,
    variant: "info",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState<AssetReport>({ subAdminId });
  const [loading, setLoading] = useState(false);

  // Load sub-admin asset report on mount
  useEffect(() => {
    const fetchAssetReport = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/api/sub-admin/get-issued-assets-report`,
          {
            headers: { Authorization: localStorage.getItem("sub-admin-token") },
          }
        );

        if (res.data?.data) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching asset report:", error);
        setAlert({
          isEnable: true,
          variant: "error",
          title: "Error",
          message: "Failed to load asset report.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssetReport();
  }, [subAdminId, API_URL]);

  // Render loading state
  if (loading && !formData.stockNo)
    return <p className="p-4 text-gray-500">Loading asset data...</p>;

  return (
    <ComponentCard title="Your Issued Assets" className="mt-4 relative">
      {alert.isEnable && (
        <Alert
          variant={alert.variant as any}
          title={alert.title}
          message={alert.message}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* <div className="md:col-span-2">
          <Label>SubAdmin ID</Label>
          <Input
            type="text"
            value={subAdminId}
            disabled
            className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
          />
        </div> */}

        {/* Dynamic asset fields */}
        {[
          "stockNo",
          "rt",
          "duplicate",
          "status",
          "cStatus",
          "can",
          "lid",
          "pvc",
          "keyboard",
          "printer",
          "charger",
          "stripper",
          "solar",
          "controller",
          "ews",
          "display",
          "battery",
          "bond",
          "vspSign",
          "dps",
        ].map((field) => (
          <div key={field}>
            <Label>{field.toUpperCase()}</Label>
            <Input
              type={
                [
                  "can",
                  "lid",
                  "pvc",
                  "keyboard",
                  "printer",
                  "charger",
                  "stripper",
                  "solar",
                  "controller",
                  "ews",
                  "display",
                  "battery",
                ].includes(field)
                  ? "number"
                  : "text"
              }
              value={formData[field as keyof AssetReport] || ""}
              //   min={0}
            
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
      </div>
    </ComponentCard>
  );
}
