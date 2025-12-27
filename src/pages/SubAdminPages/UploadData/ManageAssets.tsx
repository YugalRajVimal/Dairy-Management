import { useState, useRef } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";
import axios from "axios";

// ---------------- TYPES ----------------
interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  detailedErrors?: (string | object)[];
}

interface AssetReport {
  _id?: string;
  vlcCode: string;
  srNo?: string;
  stockNo?: string;
  rt?: number | string;
  duplicate?: number | string;
  vlcName?: string;
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
  vspSign?: number | string;
  dps?: string;
}

type UploadResultType =
  | null
  | {
      variant: "success" | "error";
      msg: string;
      detailedErrors?: (string | object)[];
    };

// ----------------- USER FRIENDLY ERROR FORMATTER --------------------
function formatDetailedError(detail: any): string {
  // If it's a JSON string, try to parse
  if (typeof detail === "string") {
    try {
      const obj = JSON.parse(detail);
      // DPS Bulk error support
      if (isBulkDpsError(obj)) {
        return renderBulkDpsRow(obj);
      }
      if (typeof obj === "object" && obj.error && obj.field && obj.asked !== undefined && obj.available !== undefined) {
        return `For <b>${obj.field.toUpperCase()}</b>: <b>Asked</b> ${obj.asked}, <b>but only</b> ${obj.available} <b>available</b>`;
      } else if (typeof obj === "object" && obj.error) {
        return obj.error;
      }
    } catch {
      return detail;
    }
  }
  if (
    typeof detail === "object" &&
    detail !== null
  ) {
    // Handle new bulk error {row, vlcCode, details: [...]}
    if (isBulkDpsError(detail)) {
      return renderBulkDpsRow(detail);
    }
    if (detail.error && detail.field && detail.asked !== undefined && detail.available !== undefined) {
      return `For <b>${detail.field.toUpperCase()}</b>: <b>Asked</b> ${detail.asked}, <b>but only</b> ${detail.available} <b>available</b>`;
    }
    if (detail.error) {
      return detail.error;
    }
  }
  // Fallback
  return typeof detail === "string" ? detail : JSON.stringify(detail);
}

// Helper to check if detail matches bulk DPS error format
function isBulkDpsError(obj: any): boolean {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.row === "number" &&
    ("vlcCode" in obj) &&
    Array.isArray(obj.details)
  );
}

// Render the custom bulk DPS row error into a string
function renderBulkDpsRow(obj: any): string {
  let header = `<b>Row ${obj.row} (VLC Code: ${obj.vlcCode}):</b>`;
  let detailsHtml = "";
  if (Array.isArray(obj.details)) {
    detailsHtml =
      `<ul class="ml-4 mb-1">` +
      obj.details
        .map((item: any) => {
          let msg = "";
          if (item.error) {
            msg += item.error;
          }
          if (item.details) {
            msg += "<br/>" + item.details;
          }
          // If missingDps exists (array)
          if (item.missingDps && Array.isArray(item.missingDps)) {
            msg += `<br/>Missing DPS: <b>${item.missingDps.join(", ")}</b>`;
          }
          return `<li>${msg}</li>`;
        })
        .join("") +
      `</ul>`;
  }
  return header + "<br/>" + detailsHtml;
}

// ---------------- COMPONENT ----------------
export default function ManageAssets() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false,
    variant: "info",
    title: "",
    message: "",
    detailedErrors: undefined,
  });

  const [formData, setFormData] = useState<AssetReport>({
    vlcCode: "",
  });

  const [vlcSearch, setVlcSearch] = useState("");
  const [vlcOptions, setVlcOptions] = useState<AssetReport[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Bulk upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResultType>(null);

  // Ref for file input (hidden file input)
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        "vspSign",
        "rt",
        "duplicate",
      ];
      if (numericFields.includes(field as string)) {
        return { ...prev, [field]: value === "" ? "" : Number(value) };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSearch = async (query: string) => {
    setVlcSearch(query);
    if (query.length < 2) {
      setVlcOptions([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/sub-admin/get-assets-report`,
        {
          params: { search: query, limit: 5 },
          headers: { Authorization: localStorage.getItem("sub-admin-token") },
        }
      );
      setVlcOptions(res.data.data || []);
    } catch (error) {
      console.error("Error searching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAsset = (asset: AssetReport) => {
    setSelectedAsset(asset);
    setFormData(asset);
    setVlcOptions([]);
    setVlcSearch(asset.vlcCode);
  };

  const handleNewRecord = () => {
    setSelectedAsset(null);
    setFormData({ vlcCode: "" });
    setVlcSearch("");
  };

  const handleSaveEntry = async () => {
    try {
      let res;
      if (selectedAsset) {
        res = await axios.post(
          `${API_URL}/api/sub-admin/update-assets-report`,
          formData,
          {
            headers: { Authorization: localStorage.getItem("sub-admin-token") },
          }
        );
        setAlert({
          isEnable: true,
          variant: "success",
          title: "Success",
          message: "Asset updated successfully ✅",
        });
      } else {
        res = await axios.post(
          `${API_URL}/api/sub-admin/add-assets-report`,
          formData,
          {
            headers: { Authorization: localStorage.getItem("sub-admin-token") },
          }
        );
        setAlert({
          isEnable: true,
          variant: "success",
          title: "Success",
          message: "New asset added successfully ✅",
        });
      }
      setSelectedAsset(res.data.data);
    } catch (error: any) {
      let detailedErrors: (string | object)[] | undefined = undefined;
      if (Array.isArray(error?.response?.data?.detailedErrors)) {
        detailedErrors = error.response.data.detailedErrors.map((detail: any) => {
          if (typeof detail === "string") {
            try {
              const obj = JSON.parse(detail);
              // Try bulk DPS error case
              if (isBulkDpsError(obj)) return obj;
              return obj;
            } catch {
              return detail;
            }
          }
          // handle new DPS error directly
          if (isBulkDpsError(detail)) return detail;
          return detail;
        });
      } else if (
        error?.response?.data?.detailedErrors &&
        typeof error.response.data.detailedErrors === "object"
      ) {
        detailedErrors = Object.values(error.response.data.detailedErrors)
          .flat()
          .map((detail: any) => {
            if (typeof detail === "string") {
              try {
                const obj = JSON.parse(detail);
                if (isBulkDpsError(obj)) return obj;
                return obj;
              } catch {
                return detail;
              }
            }
            if (isBulkDpsError(detail)) return detail;
            return detail;
          });
      }
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Error",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to save asset",
        detailedErrors,
      });
    }
  };

  // ------------ Bulk Excel Upload (with explicit upload button) ---------------
  // Store selected file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // On file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadResult(null);

    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];
    const isExcel = allowedTypes.includes(file.type) || /\.xlsx?$/.test(file.name);

    if (!isExcel) {
      setUploadResult({ variant: "error", msg: "Please upload a valid Excel file (.xlsx, .xls)" });
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // On upload button click
  const handleUploadButtonClick = async () => {
    if (!selectedFile) {
      setUploadResult({ variant: "error", msg: "Please select an Excel file to upload." });
      return;
    }

    setIsUploading(true);
    try {
      const upForm = new FormData();
      upForm.append("file", selectedFile);

      const res = await axios.post(
        `${API_URL}/api/sub-admin/upload-assets-excel`,
        upForm,
        {
          headers: {
            Authorization: localStorage.getItem("sub-admin-token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadResult({
        variant: "success",
        msg: res?.data?.message || "Bulk asset upload was successful.",
        detailedErrors: undefined,
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      let detailedErrors: (string | object)[] | undefined = undefined;
      if (Array.isArray(err?.response?.data?.detailedErrors)) {
        detailedErrors = err.response.data.detailedErrors.map(
          (detail: any) => {
            if (typeof detail === "string") {
              try {
                const obj = JSON.parse(detail);
                if (isBulkDpsError(obj)) return obj;
                return obj;
              } catch { return detail }
            }
            if (isBulkDpsError(detail)) return detail;
            return detail;
          }
        );
      } else if (err?.response?.data?.detailedErrors && typeof err.response.data.detailedErrors === "object") {
        // flatten object of arrays, map & parse
        detailedErrors = Object.values(err.response.data.detailedErrors).flat().map((detail: any) => {
          if (typeof detail === "string") {
            try {
              const obj = JSON.parse(detail);
              if (isBulkDpsError(obj)) return obj;
              return obj;
            } catch { return detail }
          }
          if (isBulkDpsError(detail)) return detail;
          return detail;
        });
      }
      setUploadResult({
        variant: "error",
        msg:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to upload the Excel sheet",
        detailedErrors,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <>

<ComponentCard title="Bulk Assets Upload" className="mt-6 border-t pt-6">
        <div>
          {uploadResult && (
            <Alert
              variant={uploadResult.variant as any}
              title={uploadResult.variant === "success" ? "Success" : "Error"}
              message={
                String(uploadResult.msg) +
                  (
                    uploadResult.detailedErrors && uploadResult.detailedErrors.length > 0
                      ? "\n" + uploadResult.detailedErrors.map((errMsg) => {
                          const formattedError = formatDetailedError(errMsg);
                          return `- ${formattedError.replace(/<[^>]+>/g, "")}`;
                        }).join("\n")
                      : ""
                  )
              }
            />
          )}
          <Label className="mt-4">Upload Excel file</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <div className="flex items-center gap-2">
            <Button
              className="w-auto"
              onClick={() => {
                if (!isUploading && fileInputRef.current) fileInputRef.current.click();
              }}
              disabled={isUploading}

            >
              Select File
            </Button>
            <span>
              {selectedFile ? selectedFile.name : "No file selected"}
            </span>
            <Button
              className="w-auto"
              onClick={handleUploadButtonClick}
              disabled={isUploading || !selectedFile}

            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          <div className="mt-2">
            <a
              href="/sample-reports/sample-assets-report.xlsx"

              download
              className="text-blue-600 underline hover:text-blue-800 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Sample Excel Template
            </a>
          </div>
        </div>
      </ComponentCard>
      <div className="w-full my-4 text-center">----- OR -----</div>

      <ComponentCard title="Manage Assets" className="mt-4 relative">
        {/* Alerts */}
        {alert.isEnable && (
          <Alert
            variant={alert.variant as any}
            title={alert.title}
            message={
              String(alert.message) +
                (
                  alert.detailedErrors && alert.detailedErrors.length > 0
                    ? "\n" + alert.detailedErrors.map((errMsg) => {
                        const formattedError = formatDetailedError(errMsg);
                        // Strip HTML tags if present to keep it as string
                        return `- ${formattedError.replace(/<[^>]+>/g, "")}`;
                      }).join("\n")
                    : ""
                )
            }
          />
        )}
        <div className="hidden md:flex absolute right-2 top-2 flex-row items-center gap-2 w-auto z-10">
          {selectedAsset && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded w-full sm:w-auto"
              onClick={handleNewRecord}
            >
              New Record
            </Button>
          )}
          <div className="w-full sm:w-64 relative">
            <Input
              placeholder="Search VLC Code..."
              type="text"
              value={vlcSearch}
              className="bg-zinc-200"
              onChange={(e) => handleSearch(e.target.value)}
            />
            {loading && (
              <div className="bg-white border p-2 shadow rounded absolute w-full z-20">
                Loading...
              </div>
            )}
            {vlcOptions.length > 0 && (
              <div className="bg-white border shadow rounded max-h-40 overflow-y-auto absolute w-full z-20">
                {vlcOptions.map((asset) => (
                  <div
                    key={asset._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectAsset(asset)}
                  >
                    {asset.vlcCode} - {asset.vlcName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden flex flex-col-reverse sm:flex-row items-end sm:items-center gap-2 w-full sm:w-auto z-10">
          {selectedAsset && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded w-full sm:w-auto"
              onClick={handleNewRecord}
            >
              New Record
            </Button>
          )}
          <div className="w-full sm:w-64 relative">
            <Input
              placeholder="Search VLC Code..."
              type="text"
              value={vlcSearch}
              className="bg-zinc-200"
              onChange={(e) => handleSearch(e.target.value)}
            />
            {loading && (
              <div className="bg-white border p-2 shadow rounded absolute w-full z-20">
                Loading...
              </div>
            )}
            {vlcOptions.length > 0 && (
              <div className="bg-white border shadow rounded max-h-40 overflow-y-auto absolute w-full z-20">
                {vlcOptions.map((asset) => (
                  <div
                    key={asset._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectAsset(asset)}
                  >
                    {asset.vlcCode} - {asset.vlcName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          {/* VLC Code and VLC Name */}
          <div>
            <Label>VLC Code</Label>
            <Input
              placeholder="e.g., 123456"
              type="text"
              value={formData.vlcCode !== undefined ? formData.vlcCode : ""}
              onChange={(e) => handleChange("vlcCode", e.target.value)}
            />
          </div>
          <div>
            <Label>VLC Name</Label>
            <Input
              placeholder="e.g., Vendor A"
              type="text"
              value={formData.vlcName !== undefined ? formData.vlcName : ""}
              onChange={(e) => handleChange("vlcName", e.target.value)}
            />
          </div>

          {/* Sr.No. and Stock No. */}
          <div>
            <Label>Sr.No.</Label>
            <Input
              placeholder="e.g., 1"
              type="text"
              min="0"
              value={formData.srNo !== undefined ? formData.srNo : ""}
              onChange={(e) => handleChange("srNo", e.target.value)}
            />
          </div>
          <div>
            <Label>Stock No.</Label>
            <Input
              placeholder="e.g., 1001"
              type="text"
              min="0"
              value={formData.stockNo !== undefined ? formData.stockNo : ""}
              onChange={(e) => handleChange("stockNo", e.target.value)}
            />
          </div>

          {/* RT and Duplicate */}
          <div>
            <Label>RT</Label>
            <Input
              placeholder="e.g., 1"
              type="number"
              min="0"
              value={formData.rt !== undefined ? formData.rt : ""}
              onChange={(e) => handleChange("rt", e.target.value)}
            />
          </div>
          <div>
            <Label>Duplicate</Label>
            <Input
              placeholder="e.g., 0"
              type="number"
              min="0"
              value={formData.duplicate !== undefined ? formData.duplicate : ""}
              onChange={(e) => handleChange("duplicate", e.target.value)}
            />
          </div>

          {/* Status and C Status */}
          <div>
            <Label>Status</Label>
            <Input
              placeholder="e.g., Running"
              type="text"
              value={formData.status !== undefined ? formData.status : ""}
              onChange={(e) => handleChange("status", e.target.value)}
            />
          </div>
          <div>
            <Label>C Status</Label>
            <Input
              placeholder=""
              type="text"
              value={formData.cStatus !== undefined ? formData.cStatus : ""}
              onChange={(e) => handleChange("cStatus", e.target.value)}
            />
          </div>

          {/* CAN (single field in a row) */}
          <div>
            <Label>CAN</Label>
            <Input
              placeholder="e.g., 123"
              type="number"
              min="0"
              value={formData.can !== undefined ? formData.can : ""}
              onChange={(e) => handleChange("can", e.target.value)}
            />
          </div>
          <div className="hidden md:block"></div>

          {/* LID and PVC */}
          <div>
            <Label>LID</Label>
            <Input
              placeholder="e.g., 456"
              type="number"
              min="0"
              value={formData.lid !== undefined ? formData.lid : ""}
              onChange={(e) => handleChange("lid", e.target.value)}
            />
          </div>
          <div>
            <Label>PVC</Label>
            <Input
              placeholder="e.g., 789"
              type="number"
              min="0"
              value={formData.pvc !== undefined ? formData.pvc : ""}
              onChange={(e) => handleChange("pvc", e.target.value)}
            />
          </div>

          {/* DPS and Keyboard */}
          <div>
            <Label>DPS</Label>
            <Input
              placeholder="e.g., DPS001"
              type="text"
              value={formData.dps !== undefined ? formData.dps : ""}
              onChange={(e) => handleChange("dps", e.target.value)}
            />
          </div>
          <div>
            <Label>Keyboard</Label>
            <Input
              placeholder="e.g., 0"
              type="number"
              min="0"
              value={formData.keyboard !== undefined ? formData.keyboard : ""}
              onChange={(e) => handleChange("keyboard", e.target.value)}
            />
          </div>

          {/* Printer and Charger */}
          <div>
            <Label>Printer</Label>
            <Input
              placeholder="e.g., 0"
              type="number"
              min="0"
              value={formData.printer !== undefined ? formData.printer : ""}
              onChange={(e) => handleChange("printer", e.target.value)}
            />
          </div>
          <div>
            <Label>Charger</Label>
            <Input
              placeholder="e.g., 0"
              type="number"
              min="0"
              value={formData.charger !== undefined ? formData.charger : ""}
              onChange={(e) => handleChange("charger", e.target.value)}
            />
          </div>

          {/* Stripper and Solar */}
          <div>
            <Label>Stripper</Label>
            <Input
              placeholder="e.g., 0"
              type="number"
              min="0"
              value={formData.stripper !== undefined ? formData.stripper : ""}
              onChange={(e) => handleChange("stripper", e.target.value)}
            />
          </div>
          <div>
            <Label>Solar</Label>
            <Input
              placeholder="e.g., 0"
              type="number"
              min="0"
              value={formData.solar !== undefined ? formData.solar : ""}
              onChange={(e) => handleChange("solar", e.target.value)}
            />
          </div>

          {/* Controller and EWS */}
          <div>
            <Label>Controler</Label>
            <Input
              placeholder="e.g., 1"
              type="number"
              min="0"
              value={
                formData.controller !== undefined ? formData.controller : ""
              }
              onChange={(e) => handleChange("controller", e.target.value)}
            />
          </div>
          <div>
            <Label>EWS</Label>
            <Input
              placeholder="e.g., 1"
              type="number"
              min="0"
              value={formData.ews !== undefined ? formData.ews : ""}
              onChange={(e) => handleChange("ews", e.target.value)}
            />
          </div>

          {/* Display and Battery */}
          <div>
            <Label>Display</Label>
            <Input
              placeholder="e.g., 1"
              type="number"
              min="0"
              value={formData.display !== undefined ? formData.display : ""}
              onChange={(e) => handleChange("display", e.target.value)}
            />
          </div>
          <div>
            <Label>Battery</Label>
            <Input
              placeholder="e.g., 12"
              type="number"
              min="0"
              value={formData.battery !== undefined ? formData.battery : ""}
              onChange={(e) => handleChange("battery", e.target.value)}
            />
          </div>

          {/* BOND and Vsp Sign */}
          <div>
            <Label>BOND</Label>
            <Input
              placeholder="e.g., BOND001"
              type="text"
              value={formData.bond !== undefined ? formData.bond : ""}
              onChange={(e) => handleChange("bond", e.target.value)}
            />
          </div>
          <div>
            <Label>Vsp Sign</Label>
            <Input
              placeholder="e.g., Signed"
              type="text"
              value={formData.vspSign !== undefined ? formData.vspSign : ""}
              onChange={(e) => handleChange("vspSign", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Button className="my-8 w-full sm:w-40" onClick={handleSaveEntry}>
              {selectedAsset ? "Update Entry" : "Save Entry"}
            </Button>
          </div>
        </div>
      </ComponentCard>
   
    </>
  );
}
