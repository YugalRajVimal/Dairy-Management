
import { useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Button from "../../../components/ui/button/Button";
import ExcelSheetsDetailedList from "./ExcelSheetDetailedList";

// ---- NEW: Bulk Delete Modal state
type BulkDeleteState = {
  open: boolean;
  date: string; // "YYYY-MM-DD"
  shift: "" | "Morning" | "Evening";
  error: string;
  confirm: boolean;
  loading: boolean;
  success: string;
};

const SubAdminExcelSheetView = () => {
    // ---- New filters ----
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [shiftFilter, setShiftFilter] = useState<"" | "All" | "Morning" | "Evening">("All");

      // NEW: Bulk Delete state
  const [bulkDelete, setBulkDelete] = useState<BulkDeleteState>({
    open: false,
    date: "",
    shift: "",
    error: "",
    confirm: false,
    loading: false,
    success: "",
  });

      // Bulk delete modal handlers
  const openBulkDeleteModal = () => {
    setBulkDelete({
      open: true,
      date: "",
      shift: "",
      error: "",
      confirm: false,
      loading: false,
      success: "",
    });
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Uploaded Milk Report" />

          {/* Filters - Date Range & Shift */}
          <div>
          <div className="flex flex-col md:flex-row md:items-center px-5 py-4 gap-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="font-medium text-xs text-gray-600 dark:text-gray-200">
                Start Date
              </label>
              <input
                type="date"
                className="px-2 py-1 border rounded"
                value={startDate}
                onChange={e => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
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
                onChange={e => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                min={startDate || undefined}
                max={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="font-medium text-xs text-gray-600 dark:text-gray-200">
                Shift
              </label>
              <select
                className="px-2 py-1 border rounded"
                value={shiftFilter}
                onChange={e => {
                  setShiftFilter(e.target.value as typeof shiftFilter);
                  setPage(1);
                }}
              >
                <option value="All">All</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <Button
              className="px-4 py-2 bg-red-700"
              onClick={openBulkDeleteModal}
            >
              Bulk Delete
            </Button>
          </div>
        </div>
      <div className="space-y-6">
        {/* <ComponentCard title="Excel Sheet View"> */}
        <ExcelSheetsDetailedList


          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          shiftFilter={shiftFilter}
          setShiftFilter={setShiftFilter}
          openBulkDeleteModal={openBulkDeleteModal}
          page={page}
          setPage={setPage}
        bulkDelete={bulkDelete}
        setBulkDelete={setBulkDelete}

       
        BulkDeleteState={{
          open: bulkDelete.open,
          date: bulkDelete.date,
          shift: bulkDelete.shift,
          error: bulkDelete.error,
          confirm: bulkDelete.confirm,
          loading: bulkDelete.loading,
          success: bulkDelete.success,
        }}
        
        />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
};

export default SubAdminExcelSheetView;
