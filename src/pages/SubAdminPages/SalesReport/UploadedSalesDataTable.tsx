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

interface SalesReport {
  history?: History[];
  edited?: boolean;
  [key: string]: any;
}

export default function UploadedSalesDataTable() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [reports, setReports] = useState<SalesReport[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<SalesReport | null>(null);

  // History Modal
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
        `${API_URL}/api/sub-admin/get-uploaded-sales-report`,
        {
          params: { page: pageNumber, limit },
          headers: {
            Authorization: localStorage.getItem("sub-admin-token"),
          },
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
      console.error("Error fetching sales reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (row: SalesReport) => {
    setEditData({ ...row });
    setIsEditModalOpen(true);
  };

  const handleUpdateSalesReport = async () => {
    try {
      if (!editData?._id) return;

      const body = {
        itemCode: editData.itemCode,
        itemName: editData.itemName,
        quantity: editData.quantity,
        docDate: editData.docDate,
      };

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
      fetchReports(page);
    } catch (err) {
      console.error("Error updating sales report:", err);
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

  // FILTER
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

  if (loading)
    return (
      <p className="p-4 text-center">Loading...</p>
    );
  if (!filteredReports.length)
    return (
      <p className="p-4 text-center">No data available</p>
    );

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="p-4">
          <input
            type="text"
            className="w-full max-w-md px-4 py-2 border rounded-lg"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto ">
          <Table>
            <TableHeader>
              <TableRow>
                {columns
                  .filter((col) => col !== "edited")
                  .map((col) => (
                    <TableCell
                      key={col}
                      isHeader
                      className="font-medium text-center "
                    >
                      {col}
                    </TableCell>
                  ))}
                <TableCell isHeader className="font-medium text-center">
                  Action
                </TableCell>

                {columns.includes("edited") && (
                  <TableCell isHeader className="font-medium text-center">
                    edited
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="">
              {filteredReports.map((row, idx) => (
                <TableRow key={idx} className="">
                  {columns
                    .filter((col) => col !== "edited")
                    .map((col) => (
                      <TableCell
                        key={col}
                        className="text-center align-middle px-4 py-3"
                      >
                        {col === "uploadedOn"
                          ? formatDate(row[col], true)
                          : col === "docDate"
                          ? formatDate(row[col])
                          : row[col] ?? ""}
                      </TableCell>
                    ))}

                  <TableCell className="text-center align-middle px-4 py-3">
                    <Button onClick={() => openEditModal(row)}>Edit</Button>
                  </TableCell>

                  {columns.includes("edited") && (
                    <TableCell className="text-center align-middle px-4 py-3">
                      {row.edited ? (
                        <Button
                          onClick={() => setSelectedHistory(row.history || [])}
                        >
                          Show History
                        </Button>
                      ) : (
                        <p className="text-gray-400 text-center">No History</p>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center p-4">
          <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <p className="text-center flex-1">
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
        className="p-4"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">
          Sales Report History
        </h2>

        {selectedHistory?.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(selectedHistory[0]).map((col) => (
                    <TableCell isHeader key={col} className="text-center">
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedHistory.map((entry, i) => (
                  <TableRow key={i}>
                    {Object.keys(entry).map((col) => (
                      <TableCell key={col} className="text-center">
                        {col === "changedOn"
                          ? formatDate(entry[col], true)
                          : typeof entry[col] === "object"
                          ? JSON.stringify(entry[col])
                          : entry[col]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center">No history available</p>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="p-6 max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Edit Sales Report
        </h2>

        {editData && (
          <div className="space-y-4">
            <div className="flex flex-col items-start">
              <label className="mb-1">Item Code</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded text-center"
                value={editData.itemCode}
                onChange={(e) =>
                  setEditData({ ...editData, itemCode: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="mb-1">Item Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded text-center"
                value={editData.itemName}
                onChange={(e) =>
                  setEditData({ ...editData, itemName: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="mb-1">Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded text-center"
                value={editData.quantity}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex flex-col items-start">
              <label className="mb-1">Document Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded text-center"
                value={editData.docDate?.slice(0, 10)}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    docDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-center">
              <Button onClick={handleUpdateSalesReport}>Update Report</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
