
import {  useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useSidebar } from "../../../context/SidebarContext";

interface History {
  [key: string]: any;
}

interface MilkReport {
  history?: History[];
  edited?: boolean;
  [key: string]: any;
}

// Helper function to check if value is a valid date string (or object)
function isDateLike(val: any) {
  if (typeof val === "string" || val instanceof Date) {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d.getFullYear() > 1970 && d.getFullYear() < 2100;
  }
  return false;
}

function formatAnyDate(val: any, withTime = false) {
  // Only attempt date formatting if it's date-like
  if (isDateLike(val)) {
    const date = new Date(val);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(withTime && { hour: "2-digit", minute: "2-digit" }),
    }).format(date);
  }
  return val;
}

// ---- NEW: "Delete" modal state ----
type DeleteState = { open: boolean; report: MilkReport | null; loading: boolean; err: string };

export default function SubAdminExcelDataTable() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [reports, setReports] = useState<MilkReport[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<MilkReport | null>(null);

  const [deleteState, setDeleteState] = useState<DeleteState>({
    open: false,
    report: null,
    loading: false,
    err: "",
  });

  // Use searchText/setSearchText from SidebarContext
  const { searchText, setSearchText } = useSidebar();

  const openEditModal = (report: MilkReport) => {
    setEditData({ ...report });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (report: MilkReport) => {
    setDeleteState({ open: true, report, loading: false, err: "" });
  };

  const handleDeleteReport = async () => {
    if (!deleteState.report || !deleteState.report._id) return;
    setDeleteState((prev) => ({ ...prev, loading: true, err: "" }));
    try {
      await axios.delete(
        `${API_URL}/api/sub-admin/delete-milk-report/${deleteState.report._id}`,
        {
          headers: {
            // Fix: getItem can return string | null. Force to undefined if null
            Authorization: localStorage.getItem("sub-admin-token") ?? undefined,
          },
        }
      );
      // After delete, close modal, refresh
      setDeleteState({ open: false, report: null, loading: false, err: "" });
      fetchReports(page, searchText);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Error deleting milk report";
      setDeleteState((prev) => ({ ...prev, loading: false, err: msg }));
      // Optionally show error in modal
    }
  };

  const handleUpdateReport = async () => {
    try {
      const id = editData?._id;
      if (!id) return;

      const body = {
        docDate: editData.docDate,
        shift: editData.shift,
        vlcName: editData.vlcName,
        milkWeightLtr: editData.milkWeightLtr,
        fatPercentage: editData.fatPercentage,
        snfPercentage: editData.snfPercentage,
      };

      await axios.put(
        `${API_URL}/api/sub-admin/update-milk-report/${id}`,
        body,
        {
          headers: {
            // Fix: getItem can return string | null. Force to undefined if null
            Authorization: localStorage.getItem("sub-admin-token") ?? undefined,
          },
        }
      );

      setIsEditModalOpen(false);
      fetchReports(page, searchText); // refresh table
    } catch (err) {
      console.error("Error updating milk report:", err);
    }
  };

  // NEW: Selected row history
  const [selectedHistory, setSelectedHistory] = useState<History[] | null>(
    null
  );

  const hiddenColumns = [
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "uploadedBy",
    "history",
  ];

  const fetchReports = async (pageNumber: number, searchText = "") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/sub-admin/get-uploaded-milk-report`,
        {
          params: { 
            page: pageNumber,
            limit,
            search: searchText,
          },
          headers: { Authorization: localStorage.getItem("sub-admin-token") ?? undefined },
        }
      );

      setReports(res.data.data || []);
      setColumns(
        res.data.data.length > 0
          ? Object.keys(res.data.data[0]).filter((col) => !hiddenColumns.includes(col))
          : []
      );
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);

    } catch (err) {
      console.error("Error fetching milk reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value: string | Date | null, withTime = false) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(withTime && { hour: "2-digit", minute: "2-digit" }),
    }).format(date);
  };

  // Fetch when page or search text changes
  useEffect(() => {
    fetchReports(page, searchText);
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {

console.log(searchText);
  }, [searchText]);

  // Debounced fetch on searchText change (always reset to page 1)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchReports(1, searchText);
      setPage(1);
    }, 400); // 400ms debounce

    return () => clearTimeout(delay);
    // eslint-disable-next-line
  }, [searchText]);

  // Use searchText for filter
  const filterText = searchText.trim().toLowerCase();
  const filteredReports = filterText
    ? reports.filter((row) => {
        const rowStr = columns
          .map((col) => {
            // For search, attempt to format as date if value is date-like, else as string
            if (col === "uploadedOn") return formatDate(row[col], true);
            if (col === "docDate") return formatDate(row[col]);
            if (isDateLike(row[col])) return formatAnyDate(row[col], true);
            return row[col] ? String(row[col]) : "";
          })
          .join(" ")
          .toLowerCase();
        return rowStr.includes(filterText);
      })
    : reports;

  if (loading) return <p className="p-4 text-gray-500">Loading reports...</p>;
  if (!filteredReports.length)
    return (
      <p className="p-4 text-gray-500">
        <input
          type="text"
          placeholder="Search..."
          // value={searchText}
          value={searchText ?? ""}

          onChange={e => setSearchText(e.target.value)}
          className="..."
        />
        <br />
        No data available
      </p>
    );

  return (
    <div className="w-full space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Milk Report Records
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          View, filter, edit & track history of uploaded milk reports.
        </p>
      </div>


      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-xl border bg-white dark:bg-gray-900 shadow">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* HEADER */}
            <TableHeader className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <TableRow>
                {columns
                  .filter((c) => c !== "edited")
                  .map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="px-5 py-3 font-semibold uppercase text-xs text-gray-600 dark:text-gray-300"
                    >
                      {col}
                    </TableCell>
                  ))}

                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold uppercase text-xs"
                >
                  Action
                </TableCell>

                {columns.includes("edited") && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-semibold uppercase text-xs"
                  >
                    History
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* BODY */}
            <TableBody>
              {filteredReports.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:text-white transition"
                >
                  {columns
                    .filter((c) => c !== "edited")
                    .map((col) => (
                      <TableCell key={col} className="px-4 py-3">
                        {
                          // Format any date found, or else show as string
                          (col === "uploadedOn" || col === "createdAt" || col.toLowerCase().includes("date") || isDateLike(row[col]))
                            ? formatAnyDate(row[col], col === "uploadedOn" || col.toLowerCase() === "createdat" || col === "createdAt" || col === "uploadedOn" ? true : false)
                            : row[col] ?? ""
                        }
                      </TableCell>
                    ))}

                  <TableCell className="px-4 py-3 flex flex-col gap-1 py-auto">
                    <Button
                      className="!px-3 !py-1"
                      onClick={() => openEditModal(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="!px-3 !py-1 !bg-red-600 hover:!bg-red-700 text-white"
                      onClick={() => openDeleteModal(row)}
                    >
                      Delete
                    </Button>
                  </TableCell>

                  {columns.includes("edited") && (
                    <TableCell className="px-4 py-3 text-center">
                      {row.edited ? (
                        <Button
                          className="!px-3 !py-1"
                          onClick={() => setSelectedHistory(row.history || [])}
                        >
                          View
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800">
          <Button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full px-4"
          >
            Previous
          </Button>

          <span className="text-gray-600 dark:text-gray-300 text-sm">
            Page <strong>{page}</strong> of {totalPages}
          </span>

          <Button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-full px-4"
          >
            Next
          </Button>
        </div>
      </div>

      {/* ------------------- HISTORY MODAL ------------------- */}
      <Modal
        isOpen={!!selectedHistory}
        onClose={() => setSelectedHistory(null)}
        className="p-6 max-w-7xl rounded-xl bg-white dark:bg-gray-900  shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Change History</h2>

        {selectedHistory && selectedHistory.length > 0 ? (
          <div className="max-w-full overflow-x-auto border rounded-lg dark:text-black ">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-100">
                <TableRow>
                  {Object.keys(selectedHistory[0]).map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="px-5 py-3 font-semibold uppercase text-xs"
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="dark:text-white">
                {selectedHistory.map((h, idx) => (
                  <TableRow key={idx}>
                    {Object.keys(h).map((col) => (
                      <TableCell key={col} className="px-4 py-3">
                        {
                          // For every cell in history, format date if value is date-like or col name is a date (changedOn etc)
                          (col.toLowerCase().includes("date") || col.toLowerCase().includes("time") || isDateLike(h[col]))
                            ? formatAnyDate(h[col], col === "changedOn" || col.toLowerCase().includes("time"))
                            : typeof h[col] === "object"
                            ? JSON.stringify(h[col])
                            : String(h[col] ?? "")
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500">No history available.</p>
        )}
      </Modal>

      {/* ------------------- DELETE MODAL ------------------- */}
      <Modal
        isOpen={deleteState.open}
        onClose={() => setDeleteState({ open: false, report: null, loading: false, err: "" })}
        className="p-6 max-w-lg bg-white dark:bg-gray-100 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-700">
            Delete Milk Report
          </h2>
          <p className="mb-4">
            Are you sure you want to permanently <span className="font-bold text-red-600">delete</span> this milk report?
          </p>
          {deleteState.report && (
            <div className="mb-4 text-xs rounded border bg-gray-50 px-3 py-2 text-gray-700">
              <div><b>Date:</b> {formatAnyDate(deleteState.report.docDate)}</div>
              <div><b>Shift:</b> {deleteState.report.shift}</div>
              <div><b>VLC Name:</b> {deleteState.report.vlcName}</div>
              {/* Show ID for trace */}
              <div className="text-gray-400"><b>ID:</b> {deleteState.report._id}</div>
            </div>
          )}
          {deleteState.err && (
            <div className="mb-3 text-red-500 text-sm">{deleteState.err}</div>
          )}
          <div className="flex items-center justify-end gap-2 mt-2">
            <Button
              onClick={() => setDeleteState({ open: false, report: null, loading: false, err: "" })}
              className="!bg-gray-200 !text-gray-700 hover:!bg-gray-300"
              disabled={deleteState.loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteReport}
              className="!bg-red-600 !text-white hover:!bg-red-700"
              // loading={deleteState.loading}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* ------------------- EDIT MODAL ------------------- */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="p-6 max-w-lg bg-white dark:bg-gray-100 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Milk Report</h2>

        {editData && (
          <div className="space-y-4">
            {[
              { label: "Document Date", key: "docDate", type: "date" },
              { label: "Shift", key: "shift", type: "text" },
              { label: "VLC Name", key: "vlcName", type: "text" },
              {
                label: "Milk Weight (Ltr)",
                key: "milkWeightLtr",
                type: "number",
              },
              { label: "Fat %", key: "fatPercentage", type: "number" },
              { label: "SNF %", key: "snfPercentage", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="font-medium text-sm">{f.label}</label>
                <input
                  type={f.type}
                  value={f.type === "date" && isDateLike(editData[f.key])
                    ? (new Date(editData[f.key]).toISOString().slice(0, 10))
                    : String(editData[f.key] ?? "")
                  }
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      [f.key]:
                        f.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200"
                />
              </div>
            ))}

            <Button className="w-full mt-3" onClick={handleUpdateReport}>
              Save Changes
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

