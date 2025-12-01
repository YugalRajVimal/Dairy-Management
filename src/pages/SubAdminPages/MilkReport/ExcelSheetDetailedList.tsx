// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../../components/ui/table";
// import Button from "../../../components/ui/button/Button";

// interface MilkReport {
//   [key: string]: any; // Dynamic keys from uploaded Excel
// }

// export default function SubAdminExcelDataTable() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const [reports, setReports] = useState<MilkReport[]>([]);
//   const [columns, setColumns] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [filter, setFilter] = useState<string>(""); // Added filter state

//   const hiddenColumns = ["_id", "__v", "createdAt", "updatedAt", "uploadedBy"];

//   const fetchReports = async (pageNumber: number) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${API_URL}/api/sub-admin/get-uploaded-milk-report`,
//         {
//           params: { page: pageNumber, limit },
//           headers: { Authorization: localStorage.getItem("sub-admin-token") },
//         }
//       );

//       setReports(res.data.data || []);
//       setColumns(
//         res.data.data.length > 0
//           ? Object.keys(res.data.data[0]).filter(
//               (col) => !hiddenColumns.includes(col)
//             )
//           : []
//       );
//       setTotalPages(res.data.totalPages || 1);
//       setPage(res.data.currentPage || 1);
//     } catch (err) {
//       console.error("Error fetching milk reports:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (value: string | Date | null, withTime = false) => {
//     if (!value) return "";
//     const date = new Date(value);
//     if (isNaN(date.getTime())) return "";
//     return new Intl.DateTimeFormat("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       ...(withTime && { hour: "2-digit", minute: "2-digit" }),
//     }).format(date);
//   };

//   useEffect(() => {
//     fetchReports(page);
//   }, [page]);

//   // Filtering logic: filter by the whole row (all column values as a string, case-insensitive)
//   const filterText = filter.trim().toLowerCase();

//   const filteredReports = filterText
//     ? reports.filter((row) => {
//         const rowStr = columns
//           .map((col) => {
//             if (col === "uploadedOn")
//               return formatDate(row[col], true);
//             if (col === "docDate")
//               return formatDate(row[col]);
//             return row[col] !== undefined && row[col] !== null ? String(row[col]) : "";
//           })
//           .join(" ")
//           .toLowerCase();
//         return rowStr.includes(filterText);
//       })
//     : reports;

//   if (loading) {
//     return <p className="p-4 text-gray-500">Loading reports...</p>;
//   }

//   if (!filteredReports || filteredReports.length === 0) {
//     return <p className="p-4 text-gray-500">No data available</p>;
//   }

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="max-w-full overflow-x-auto">
//         {/* Filter input */}
//         <div className="p-4">
//           <input
//             type="text"
//             className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
//             placeholder="Search in all columns..."
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//           />
//         </div>
//         <Table>
//           {/* Table Header */}
//           <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//             <TableRow>
//               {columns.map((col) => (
//                 <TableCell
//                   key={col}
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   {col.trim()}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHeader>

//           {/* Table Body */}
//           <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//             {filteredReports.map((row, rowIndex) => (
//               <TableRow key={rowIndex}>
//                 {columns.map((col) => (
//                   <TableCell
//                     key={col}
//                     className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
//                   >
//                     {col === "uploadedOn"
//                       ? formatDate(row[col]) // show with time
//                       : col === "docDate"
//                       ? formatDate(row[col]) // show only date
//                       : row[col] ?? ""}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center p-4">
//         <Button
//           disabled={page <= 1}
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//         >
//           Previous
//         </Button>
//         <p className="text-gray-500">
//           Page {page} of {totalPages}
//         </p>
//         <Button
//           disabled={page >= totalPages}
//           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
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

export default function SubAdminExcelDataTable() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [reports, setReports] = useState<MilkReport[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<string>("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<MilkReport | null>(null);

  const openEditModal = (report: MilkReport) => {
    setEditData({ ...report });
    setIsEditModalOpen(true);
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
            Authorization: localStorage.getItem("sub-admin-token"),
          },
        }
      );

      setIsEditModalOpen(false);
      fetchReports(page); // refresh table
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

  const fetchReports = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/sub-admin/get-uploaded-milk-report`,
        {
          params: { page: pageNumber, limit },
          headers: { Authorization: localStorage.getItem("sub-admin-token") },
        }
      );

      setReports(res.data.data || []);
      setColumns(
        res.data.data.length > 0
          ? Object.keys(res.data.data[0]).filter(
              (col) => !hiddenColumns.includes(col)
            )
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

  // Legacy formatDate for explicit field rules
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

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const filterText = filter.trim().toLowerCase();
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
          className="w-full bg-white max-w-md px-4 py-2 border rounded-lg"
          placeholder="Search in all columns..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border rounded-xl p-4">
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search in all fields..."
            className="w-full px-4 py-2 pr-10 rounded-lg border 
                       bg-gray-50 dark:bg-gray-800 dark:text-gray-200
                       focus:ring-2 focus:ring-brand-500 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {filter && (
            <button
              onClick={() => setFilter("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
          )}
        </div>
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

                  <TableCell className="px-4 py-3">
                    <Button
                      className="!px-3 !py-1"
                      onClick={() => openEditModal(row)}
                    >
                      Edit
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
