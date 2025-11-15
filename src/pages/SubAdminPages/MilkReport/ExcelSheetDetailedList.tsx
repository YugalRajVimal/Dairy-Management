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

      const res = await axios.put(
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
            if (col === "uploadedOn") return formatDate(row[col], true);
            if (col === "docDate") return formatDate(row[col]);
            return row[col] ? String(row[col]) : "";
          })
          .join(" ")
          .toLowerCase();
        return rowStr.includes(filterText);
      })
    : reports;

  if (loading) return <p className="p-4 text-gray-500">Loading reports...</p>;
  if (!filteredReports.length)
    return <p className="p-4 text-gray-500">No data available</p>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="max-w-full overflow-x-auto">
          {/* FILTER INPUT */}
          <div className="p-4">
            <input
              type="text"
              className="w-full max-w-md px-4 py-2 border rounded-lg"
              placeholder="Search in all columns..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <Table>
            {/* TABLE HEADER */}
            <TableHeader>
              <TableRow>
                {columns
                  .filter((col) => col !== "edited")
                  .map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="px-5 py-3 font-medium"
                    >
                      {col}
                    </TableCell>
                  ))}
                <TableCell isHeader className="font-medium">
                  Action
                </TableCell>
                {columns.includes("edited") && (
                  <TableCell isHeader className="px-5 py-3 font-medium">
                    edited
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* TABLE BODY */}
            <TableBody>
              {filteredReports.map((row, idx) => (
                <TableRow key={idx}>
                  {columns
                    .filter((col) => col !== "edited")
                    .map((col) => (
                      <TableCell key={col} className="px-4 py-3">
                        {col === "uploadedOn"
                          ? formatDate(row[col], true)
                          : col === "docDate"
                          ? formatDate(row[col])
                          : row[col] ?? ""}
                      </TableCell>
                    ))}

                  <TableCell className="px-4 py-3">
                    <Button onClick={() => openEditModal(row)}>Edit</Button>
                  </TableCell>
                  {/* EDITED COLUMN WITH HISTORY BUTTON */}
                  {columns.includes("edited") && (
                    <TableCell className="px-4 py-3 text-center">
                      {row.edited ? (
                        <>
                          <Button
                            onClick={() =>
                              setSelectedHistory(row.history || [])
                            }
                          >
                            Show History
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-400">No History</span>
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-4">
          <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <p className="text-gray-500">
            Page {page} of {totalPages}
          </p>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* HISTORY MODAL */}
      <Modal
        isOpen={!!selectedHistory}
        onClose={() => setSelectedHistory(null)}
        className="p-4 text-center"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">
          Milk Report History
        </h2>

        {selectedHistory && selectedHistory.length > 0 ? (
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(selectedHistory[0]).map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="px-5 py-3 font-medium"
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedHistory.map((h, idx) => (
                  <TableRow key={idx}>
                    {Object.keys(h).map((col) => (
                      <TableCell key={col} className="px-4 py-3">
                        {col === "changedOn"
                          ? formatDate(h[col], true)
                          : typeof h[col] === "object"
                          ? JSON.stringify(h[col])
                          : String(h[col] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No history available</p>
        )}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="p-6 max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Milk Report</h2>

        {editData && (
          <div className="space-y-4">
            {/* docDate */}
            <div>
              <label className="font-medium">Document Date</label>
              <input
                type="date"
                value={editData.docDate?.slice(0, 10) || ""}
                onChange={(e) =>
                  setEditData({ ...editData, docDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* shift */}
            <div>
              <label className="font-medium">Shift</label>
              <input
                type="text"
                value={editData.shift}
                onChange={(e) =>
                  setEditData({ ...editData, shift: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter shift (e.g., Morning or Evening)"
              />
            </div>

            {/* vlcName */}
            <div>
              <label className="font-medium">VLC Name</label>
              <input
                type="text"
                value={editData.vlcName}
                onChange={(e) =>
                  setEditData({ ...editData, vlcName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* milkWeightLtr */}
            <div>
              <label className="font-medium">Milk Weight (Ltr)</label>
              <input
                type="number"
                value={editData.milkWeightLtr}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    milkWeightLtr: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* fatPercentage */}
            <div>
              <label className="font-medium">Fat %</label>
              <input
                type="number"
                step="0.01"
                value={editData.fatPercentage}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    fatPercentage: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            {/* snfPercentage */}
            <div>
              <label className="font-medium">SNF %</label>
              <input
                type="number"
                step="0.01"
                value={editData.snfPercentage}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    snfPercentage: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <Button onClick={handleUpdateReport}>Update Report</Button>
          </div>
        )}
      </Modal>
    </>
  );
}
