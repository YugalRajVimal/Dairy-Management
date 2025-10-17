import { useState, useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import axios from "axios";
import { useLocation } from "react-router";

// ---------------- TYPES ----------------
interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

interface AssetReport {
  _id?: string;
  subAdminId: string; // Made non-optional as it will be passed via props
  // subAdminName and subAdminEmail removed as per instructions
  stockNo?: string;
  rt?: string;
  duplicate?: string;
  status?: string;
  cStatus?: string;

  // Numeric fields
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
  bond?: number | string;
  vspSign?: number | string;

  dps?: string;
}

// ---------------- COMPONENT ----------------
// Component now accepts subAdminId as a prop
export default function IssueAssetsToSubAdmin() {
  const location = useLocation();
  const subAdminId = location.state?.subAdminId;

  const API_URL = import.meta.env.VITE_API_URL;

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false,
    variant: "info",
    title: "",
    message: "",
  });

  // Initialize formData with the subAdminId from props
  const [formData, setFormData] = useState<AssetReport>({ subAdminId });
  const [selectedAsset, setSelectedAsset] = useState<AssetReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Effect to load existing asset report for the given subAdminId on component mount
  useEffect(() => {
    const fetchAssetReport = async () => {
      if (!subAdminId) {
        console.warn("subAdminId is not provided. Cannot fetch asset report.");
        return;
      }

      setLoading(true);

      try {
        // Fetch existing asset report for this specific subAdminId
        const res = await axios.get(
          `${API_URL}/api/admin/get-issued-assets-report`,
          {
            params: { subAdminId }, // ✅ no need for 'limit' since backend returns one
            headers: { Authorization: localStorage.getItem("admin-token") },
          }
        );

        const existingAsset = res.data?.data;

        if (existingAsset) {
          // ✅ We got one report object (not an array)
          setSelectedAsset(existingAsset);
          setFormData(existingAsset);
        } else {
          // No report found → prepare for a new one
          setSelectedAsset(null);
          setFormData({ subAdminId });
        }
      } catch (error) {
        console.error("Error fetching asset report for sub-admin:", error);

        setAlert({
          isEnable: true,
          variant: "error",
          title: "Error",
          message: "Failed to load existing asset report.",
        });

        // Reset form data but preserve subAdminId
        setSelectedAsset(null);
        setFormData({ subAdminId });
      } finally {
        setLoading(false);
      }
    };

    fetchAssetReport();
  }, [subAdminId, API_URL]); // Re-run effect if subAdminId or API_URL changes

  // ---------------- HANDLERS ----------------
  const handleChange = (field: keyof AssetReport, value: string) => {
    setFormData((prev) => {
      const numericFields = [
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
      ];

      if (numericFields.includes(field as string)) {
        return { ...prev, [field]: value === "" ? "" : Number(value) };
      }

      return { ...prev, [field]: value };
    });
  };

  // handleSearch, handleSelectAsset, and handleNewRecord functions are removed
  // as the search feature and dynamic record selection are no longer needed.

  const handleSaveEntry = async () => {
    setLoading(true); // Set loading state for the save operation
    try {
      let res;
      // Ensure subAdminId is always included in the data sent to the API
      const dataToSend = { ...formData, subAdminId };

      if (selectedAsset && selectedAsset._id) {
        // Update mode: if an existing asset is selected (has an _id)
        res = await axios.post(
          `${API_URL}/api/admin/update-issued-assets`,
          dataToSend,
          {
            headers: { Authorization: localStorage.getItem("admin-token") },
          }
        );
        setAlert({
          isEnable: true,
          variant: "success",
          title: "Success",
          message: "Issued Asset updated successfully ✅",
        });
      } else {
        // Add mode: if no existing asset is selected
        res = await axios.post(
          `${API_URL}/api/admin/add-issued-assets`,
          dataToSend,
          {
            headers: { Authorization: localStorage.getItem("admin-token") },
          }
        );
        setAlert({
          isEnable: true,
          variant: "success",
          title: "Success",
          message: "Assets Issued successfully ✅",
        });
      }
      setSelectedAsset(res.data.data); // Update selectedAsset with the latest data from the server
      setFormData(res.data.data); // Update formData with the latest data from the server
    } catch (error: any) {
      console.error("Save error:", error);
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Error",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to save asset",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // ---------------- RENDER ----------------
  // Show loading message only during initial data fetch if no asset is loaded yet
  if (loading && !selectedAsset && !formData.stockNo) {
    return <p className="p-4 text-gray-500">Loading asset data...</p>;
  }

  return (
    <>
      <ComponentCard title="Manage Issued Assets" className="mt-4 relative">
        {/* Alerts */}
        {alert.isEnable && (
          <Alert
            variant={alert.variant as any}
            title={alert.title}
            message={alert.message}
            // onClose={() => setAlert({ ...alert, isEnable: false })} // Added onClose for dismissible alert
          />
        )}

        {/* Search and New Record button sections removed as per instructions */}

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {" "}
          {/* Adjusted margin-top */}
          {/* SubAdmin ID field (read-only) */}
          <div className="md:col-span-2">
            <Label>SubAdmin ID</Label>
            <Input
              type="text"
              value={subAdminId}
              disabled
              className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>
          {/* Stock No */}
          <div>
            <Label>Stock No.</Label>
            <Input
              placeholder="e.g., 1001"
              type="text"
              value={formData.stockNo || ""}
              onChange={(e) => handleChange("stockNo", e.target.value)}
            />
          </div>
          {/* RT and Duplicate */}
          <div>
            <Label>RT</Label>
            <Input
              placeholder="e.g., 1"
              type="text"
              value={formData.rt || ""}
              onChange={(e) => handleChange("rt", e.target.value)}
            />
          </div>
          <div>
            <Label>Duplicate</Label>
            <Input
              placeholder="e.g., 0"
              type="text"
              value={formData.duplicate || ""}
              onChange={(e) => handleChange("duplicate", e.target.value)}
            />
          </div>
          {/* Status and C Status */}
          <div>
            <Label>Status</Label>
            <Input
              placeholder="e.g., Running"
              type="text"
              value={formData.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
            />
          </div>
          <div>
            <Label>C Status</Label>
            <Input
              placeholder=""
              type="text"
              value={formData.cStatus || ""}
              onChange={(e) => handleChange("cStatus", e.target.value)}
            />
          </div>
          {/* Remaining Asset Fields */}
          {[
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
          ].map((field) => (
            <div key={field}>
              <Label>{field.toUpperCase()}</Label>
              <Input
                placeholder={`e.g., ${field === "can" ? "123" : "0"}`}
                type="number"
                min="0"
                value={formData[field as keyof AssetReport] || ""}
                onChange={(e) =>
                  handleChange(field as keyof AssetReport, e.target.value)
                }
              />
            </div>
          ))}
          <div>
            <Label>BOND</Label>
            <Input
              placeholder="e.g., BOND001"
              type="text"
              value={formData.bond || ""}
              onChange={(e) => handleChange("bond", e.target.value)}
            />
          </div>
          <div>
            <Label>Vsp Sign</Label>
            <Input
              placeholder="e.g., Signed"
              type="text"
              value={formData.vspSign || ""}
              onChange={(e) => handleChange("vspSign", e.target.value)}
            />
          </div>
          <div>
            <Label>DPS</Label>
            <Input
              placeholder="e.g., DPS001"
              type="text"
              value={formData.dps || ""}
              onChange={(e) => handleChange("dps", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Button
              className="my-8 w-full sm:w-40"
              onClick={handleSaveEntry}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : selectedAsset
                ? "Update Entry"
                : "Save Entry"}
            </Button>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
