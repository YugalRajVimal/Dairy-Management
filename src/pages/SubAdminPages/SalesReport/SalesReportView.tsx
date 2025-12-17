import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UploadedSalesDataTable from "./UploadedSalesDataTable";

const SubAdminSalesSheetView = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Uploaded Sales Report" />
      <div className="space-y-6">
        {/* Date Range Filter - no shift selector */}
        <div className="flex flex-col md:flex-row md:items-center px-5 py-4 gap-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="font-medium text-xs text-gray-600 dark:text-gray-200">
              Start Date
            </label>
            <input
              type="date"
              className="px-2 py-1 border rounded"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              max={endDate || undefined}
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <label className="font-medium text-xs text-gray-600 dark:text-gray-200">
              End Date
            </label>
            <input
              type="date"
              className="px-2 py-1 border rounded"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={startDate || undefined}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>

        {/* <ComponentCard title="Excel Sheet View"> */}
        <UploadedSalesDataTable startDate={startDate} endDate={endDate} />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
};

export default SubAdminSalesSheetView;
