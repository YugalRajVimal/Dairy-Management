
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
import { useSidebar } from "../../../context/SidebarContext";

interface History {
  [key: string]: any;
}

interface SalesReport {
  history?: History[];
  edited?: boolean;
  [key: string]: any;
}

function isDateLike(value: any) {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

function formatAnyDate(value: any, withTime = false) {
  if (!isDateLike(value)) return value;

  const date = new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  }).format(date);
}

export default function UploadedSalesDataTable() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [reports, setReports] = useState<SalesReport[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<SalesReport | null>(null);

  const [selectedHistory, setSelectedHistory] = useState<History[] | null>(null);

  // New: For Delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState<string | null>(null);

  // Use searchText/setSearchText from SidebarContext
  const { searchText, setSearchText } = useSidebar();

  const hiddenColumns = [
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "uploadedBy",
    "history",
  ];

  const fetchReports = async (pageNumber: number, search: string) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/sub-admin/get-uploaded-sales-report`,
        {
          params: { page: pageNumber, limit, search: search.trim() },
          headers: {
            Authorization: localStorage.getItem("sub-admin-token"),
          },
        }
      );

      const list = res.data.data || [];

      setReports(list);
      setColumns(
        list.length > 0
          ? Object.keys(list[0]).filter((col) => !hiddenColumns.includes(col))
          : []
      );

      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);
    } catch (error) {
      console.error("Error fetching sales reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports on page or searchText change
  useEffect(() => {
    fetchReports(page, searchText || "");
    // eslint-disable-next-line
  }, [page, searchText]);

  const openEditModal = (row: SalesReport) => {
    setEditData({ ...row });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (rowId: string) => {
    setDeleteRowId(rowId);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateSalesReport = async () => {
    try {
      if (!editData?._id) return;

      const body: any = {
        itemCode: editData.itemCode,
        itemName: editData.itemName,
        quantity: editData.quantity,
        docDate: editData.docDate,
      };

      if ("vlcUploaderCode" in editData) {
        body.vlcUploaderCode = editData.vlcUploaderCode;
      }

      await axios.put(
        `${API_URL}/api/sub-admin/update-sales-report/${editData._id}`,
        body,
        {
          headers: {
            Authorization: localStorage.getItem("sub-admin-token"),
          },
        }
      );

      setIsEditModalOpen(false);
      fetchReports(page, searchText || "");
    } catch (error) {
      console.error("Error updating sales report:", error);
    }
  };

  // Reset page when searchText changes
useEffect(() => {
  setPage(1);
}, [searchText]);


  // Delete logic
  const handleDeleteSalesReport = async () => {
    if (!deleteRowId) return;
    try {
      await axios.delete(
        `${API_URL}/api/sub-admin/delete-sales-report/${deleteRowId}`,
        {
          headers: {
            Authorization: localStorage.getItem("sub-admin-token"),
          },
        }
      );
      setIsDeleteModalOpen(false);
      setDeleteRowId(null);
      // If we're on the last page and delete the last item, ensure we don't end up on an empty page
      // Refetch accordingly
      fetchReports(page, searchText || "");
    } catch (error) {
      console.error("Error deleting sales report:", error);
    }
  };



  if (loading)
    return (
      <div className="p-8 flex justify-center items-center min-h-32">
        <p className="text-center text-gray-500 text-lg">Loading...</p>
      </div>
    );

  if (!reports.length)
    return (
      <div className="p-8 flex flex-col items-center">
        <p className="text-gray-500 dark:text-gray-400 mt-6 text-lg">No data available</p>
      </div>
    );

  return (
    <>
      <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-lg mt-8 mx-auto max-w-6xl border-gray-200 dark:border-gray-700">
        {/* SEARCH */}
        {/* Search input has been removed as per requirements. */}
        <div className="p-6 pb-2 flex justify-between items-center flex-wrap gap-2">
          {/* Intentionally left empty */}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto px-2 pt-2 pb-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                {columns
                  .filter((c) => c !== "edited")
                  .map((c) => (
                    <TableCell
                      key={c}
                      isHeader
                      className="font-semibold text-base text-center px-5 py-4 text-gray-700 dark:text-gray-200"
                    >
                      {c}
                    </TableCell>
                  ))}

                <TableCell isHeader className="text-base text-center px-5 py-4 text-gray-700 dark:text-gray-200">
                  Action
                </TableCell>

                {columns.includes("edited") && (
                  <TableCell isHeader className="text-base text-center px-5 py-4 text-gray-700 dark:text-gray-200">
                    History
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {reports.map((row, idx) => (
                <TableRow key={idx} className="even:bg-gray-50 dark:even:bg-gray-800">
                  {columns
                    .filter((c) => c !== "edited")
                    .map((col) => (
                      <TableCell
                        key={col}
                        className="text-center align-middle px-5 py-3 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
                      >
                        {isDateLike(row[col])
                          ? formatAnyDate(row[col], col === "uploadedOn")
                          : row[col] ?? ""}
                      </TableCell>
                    ))}

                  <TableCell className="text-center align-middle px-5 py-3 bg-white dark:bg-gray-900 flex items-center gap-2 justify-center">
                    <Button
                      className="!px-3 !py-1"
                      onClick={() => openEditModal(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="!px-3 !py-1 !bg-red-600 hover:!bg-red-700 text-white"

                      onClick={() => openDeleteModal(row._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>

                  {columns.includes("edited") && (
                    <TableCell className="text-center align-middle px-5 py-3 bg-white dark:bg-gray-900">
                      {row.edited ? (
                        <Button
                        className="!px-3 !py-1"
                          onClick={() => setSelectedHistory(row.history || [])}
                        >
                          View
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm px-2 py-1">
                          None
                        </span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t mt-2 border-gray-200 dark:border-gray-700">
          <Button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-6 py-2"
          >
            Previous
          </Button>

          <p className="text-base text-gray-600 dark:text-gray-300 px-6 py-2">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>

          <Button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-6 py-2"
          >
            Next
          </Button>
        </div>
      </div>

      {/* HISTORY MODAL */}
      <Modal
        isOpen={!!selectedHistory}
        onClose={() => setSelectedHistory(null)}
        className="p-10 max-w-4xl bg-white dark:bg-gray-900"
      >
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Sales Report History
        </h3>

        {selectedHistory?.length ? (
          <div className="overflow-x-auto px-1">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-800">
                  {Object.keys(selectedHistory[0]).map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="text-center px-4 py-3 text-base font-semibold text-gray-700 dark:text-gray-200"
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedHistory.map((item, i) => (
                  <TableRow key={i} className="even:bg-gray-50 dark:even:bg-gray-800">
                    {Object.keys(item).map((col) => (
                      <TableCell
                        key={col}
                        className="text-center px-4 py-3 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
                      >
                        {isDateLike(item[col])
                          ? formatAnyDate(item[col], true)
                          : typeof item[col] === "object"
                          ? JSON.stringify(item[col])
                          : item[col]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-8 text-lg">
            No history available.
          </p>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="p-8 max-w-lg bg-white dark:bg-gray-900"
      >
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Edit Sales Report
        </h3>

        {editData && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-medium mb-1 text-gray-700 dark:text-gray-200">Item Code</label>
              <input
                type="text"
                className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100
                           bg-white dark:bg-gray-800 dark:text-gray-200
                           border-gray-300 dark:border-gray-700
                           placeholder:text-gray-400 dark:placeholder:text-gray-400"
                value={editData.itemCode}
                onChange={(e) =>
                  setEditData({ ...editData, itemCode: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium mb-1 text-gray-700 dark:text-gray-200">Item Name</label>
              <input
                type="text"
                className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100
                           bg-white dark:bg-gray-800 dark:text-gray-200
                           border-gray-300 dark:border-gray-700
                           placeholder:text-gray-400 dark:placeholder:text-gray-400"
                value={editData.itemName}
                onChange={(e) =>
                  setEditData({ ...editData, itemName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium mb-1 text-gray-700 dark:text-gray-200">Quantity</label>
              <input
                type="number"
                className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100
                           bg-white dark:bg-gray-800 dark:text-gray-200
                           border-gray-300 dark:border-gray-700
                           placeholder:text-gray-400 dark:placeholder:text-gray-400"
                value={editData.quantity}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium mb-1 text-gray-700 dark:text-gray-200">Document Date</label>
              <input
                type="date"
                className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100
                           bg-white dark:bg-gray-800 dark:text-gray-200
                           border-gray-300 dark:border-gray-700
                           placeholder:text-gray-400 dark:placeholder:text-gray-400"
                value={
                  isDateLike(editData.docDate)
                    ? new Date(editData.docDate).toISOString().slice(0, 10)
                    : editData.docDate
                }
                onChange={(e) =>
                  setEditData({ ...editData, docDate: e.target.value })
                }
              />
            </div>

            {/* vlcUploaderCode can also get updated */}
            {"vlcUploaderCode" in editData ? (
              <div className="flex flex-col gap-2">
                <label className="font-medium mb-1 text-gray-700 dark:text-gray-200">VLC Uploader Code</label>
                <input
                  type="text"
                  className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100
                             bg-white dark:bg-gray-800 dark:text-gray-200
                             border-gray-300 dark:border-gray-700
                             placeholder:text-gray-400 dark:placeholder:text-gray-400"
                  value={editData.vlcUploaderCode ?? ""}
                  onChange={e =>
                    setEditData({ ...editData, vlcUploaderCode: e.target.value })
                  }
                />
              </div>
            ) : null}

            <Button
              onClick={handleUpdateSalesReport}
              className="w-full mt-6 py-3 px-5"
            >
              Save Changes
            </Button>
          </div>
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteRowId(null);
        }}
        className="p-8 max-w-sm bg-white dark:bg-gray-900"
      >
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
          Delete Sales Report
        </h3>
        <div className="mb-6 text-center text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this sales report? This action cannot be undone.
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            className="px-6 py-2 !bg-red-600 hover:!bg-red-700 text-white"
            onClick={handleDeleteSalesReport}
          >
            Delete
          </Button>
          <Button
            className="px-6 py-2"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setDeleteRowId(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

