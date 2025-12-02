import { useState } from "react";
import axios from "axios";
import ComponentCard from "../../../components/common/ComponentCard";
import FileInput from "../../../components/form/input/FileInput";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/ui/alert/Alert";

// Milk Report fields from milk.report.schema.js (1-38):
// uploadedOn: Date (filled by backend)
// uploadedBy: ObjectId (filled by backend)
// docDate: Date
// shift: String
// vlcUploaderCode: String
// vlcName: String
// milkWeightLtr: Number
// fatPercentage: Number
// snfPercentage: Number

interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

const initialManualForm = {
  docDate: "",
  shift: "",
  vlcUploaderCode: "",
  vlcName: "",
  milkWeightLtr: "",
  fatPercentage: "",
  snfPercentage: "",
};

export default function UploadExcelSheet() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false,
    variant: "info",
    title: "",
    message: "",
  });

  const [manualForm, setManualForm] = useState<typeof initialManualForm>(initialManualForm);

  // File upload handlers (Excel)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setAlert({ isEnable: false, variant: "info", title: "", message: "" });
      } else {
        setFile(null);
        setAlert({
          isEnable: true,
          variant: "error",
          title: "Invalid File Type",
          message: "Only Excel files (.xls, .xlsx) are allowed.",
        });
      }
    } else {
      setFile(null);
      setAlert({ isEnable: false, variant: "info", title: "", message: "" });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setAlert({
        isEnable: true,
        variant: "warning",
        title: "No file selected",
        message: "Please select an Excel file to upload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setAlert({ isEnable: false, variant: "info", title: "", message: "" });

      const token = localStorage.getItem("sub-admin-token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/sub-admin/upload-excel-file`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAlert({
        isEnable: true,
        variant: "success",
        title: "Upload Successful",
        message: `${res.data.message} (${res.data.rowsLength} rows saved)`,
      });
    } catch (err: any) {
      console.error("Upload failed:", err);
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Upload Failed",
        message: err.response?.data?.error || "Failed to upload Excel file.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manual entry handlers
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearManualForm = () => setManualForm(initialManualForm);

  const handleManualSubmit = async () => {
    // Validate required fields
    if (
      !manualForm.docDate ||
      !manualForm.shift ||
      !manualForm.vlcUploaderCode ||
      !manualForm.vlcName ||
      !manualForm.milkWeightLtr ||
      !manualForm.fatPercentage ||
      !manualForm.snfPercentage
    ) {
      setAlert({
        isEnable: true,
        variant: "warning",
        title: "Missing Fields",
        message: "Please fill all required fields in the form.",
      });
      return;
    }

    try {
      setManualLoading(true);
      setAlert({ isEnable: false, variant: "info", title: "", message: "" });

      const token = localStorage.getItem("sub-admin-token");

      // API expects docDate as ISO date string
      const payload = {
        docDate: manualForm.docDate, // expect "YYYY-MM-DD"
        shift: manualForm.shift,
        vlcUploaderCode: manualForm.vlcUploaderCode.trim(),
        vlcName: manualForm.vlcName.trim(),
        milkWeightLtr: Number(manualForm.milkWeightLtr),
        fatPercentage: Number(manualForm.fatPercentage),
        snfPercentage: Number(manualForm.snfPercentage),
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/sub-admin/manual-milk-report-entry`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setAlert({
        isEnable: true,
        variant: "success",
        title: "Entry Successful",
        message: "Milk report entry saved successfully.",
      });
      clearManualForm();
    } catch (err: any) {
      console.error("Manual save failed:", err);
      setAlert({
        isEnable: true,
        variant: "error",
        title: "Save Failed",
        message: err.response?.data?.error || "Failed to save entry.",
      });
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <>
      <ComponentCard title="Upload Milk Register Report">
        <div>
          {alert.isEnable && (
            <Alert
              variant={alert.variant as any}
              title={alert.title}
              message={alert.message}
            />
          )}
          <Label className="mt-4">Upload Excel file</Label>
          <FileInput onChange={handleFileChange} className="custom-class" />

          <div className="mt-2">
            <a
              href="/sample-reports/Milk_Sample_Report.xlsx"
              download
              className="text-blue-600 underline hover:text-blue-800 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Milk Sample Report
            </a>
          </div>

          <Button
            className="my-8 w-40"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </ComponentCard>
      <div className="w-full my-4 text-center">----- OR -----</div>
      {/* Manual Entry Section */}
      <ComponentCard title="Record Entry">
        <div className="flex gap-4 flex-col">
          <div className="flex w-full gap-4">
            <div className="w-1/2">
              <Label>Document Date</Label>
              <Input
                name="docDate"
                placeholder="DD-MM-YYYY"
                type="date"
                value={manualForm.docDate}
                onChange={handleManualChange}
              />
            </div>
            <div className="w-1/2">
              <Label>Shift</Label>
              <Input
                name="shift"
                placeholder="Morning/Evening"
                type="text"
                value={manualForm.shift}
                onChange={handleManualChange}
              />
            </div>
          </div>

          <div className="flex w-full gap-4">
            <div className="w-1/2">
              <Label>Vendor Code</Label>
              <Input
                name="vlcUploaderCode"
                placeholder="123456"
                type="text"
                value={manualForm.vlcUploaderCode}
                onChange={handleManualChange}
              />
            </div>
            <div className="w-1/2">
              <Label>Vendor Name</Label>
              <Input
                name="vlcName"
                placeholder="VLC Name"
                type="text"
                value={manualForm.vlcName}
                onChange={handleManualChange}
              />
            </div>
          </div>

          <div className="flex w-full gap-4">
            <div className="w-1/3">
              <Label>Milk Weight (litres)</Label>
              <Input
                name="milkWeightLtr"
                placeholder="100"
                type="number"
                min="0"
                value={manualForm.milkWeightLtr}
                onChange={handleManualChange}
              />
            </div>
            <div className="w-1/3">
              <Label>Fat %</Label>
              <Input
                name="fatPercentage"
                placeholder="8.0"
                type="number"
                min="0"
                value={manualForm.fatPercentage}
                onChange={handleManualChange}
              />
            </div>
            <div className="w-1/3">
              <Label>SNF %</Label>
              <Input
                name="snfPercentage"
                placeholder="8.6"
                type="number"
                min="0"
                value={manualForm.snfPercentage}
                onChange={handleManualChange}
              />
            </div>
          </div>

          <Button
            className="my-8 w-40"
            onClick={handleManualSubmit}
            disabled={manualLoading}
          >
            {manualLoading ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </ComponentCard>
    </>
  );
}
