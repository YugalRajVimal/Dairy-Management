import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { PencilIcon, UserCircleIcon } from "../../../icons";
import Label from "../../../components/form/Label";

// Toast component (very basic)
function Toast({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) {
  if (!message) return null;
  return (
    <div
      className={`fixed z-[9999] top-6 right-6 px-5 py-3 rounded-lg shadow-lg transition-all ${
        type === "success"
          ? "bg-green-500"
          : "bg-red-500"
      } text-white text-base font-medium`}
      role="alert"
    >
      {message}
      <button
        className="ml-4 font-semibold text-white"
        onClick={onClose}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

// Modal UI component
function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl animate-fadeIn relative max-w-lg w-full">
        <div className="flex justify-between items-center px-6 pt-6 pb-3 border-b border-gray-100 dark:border-white/[0.07]">
          <span className="font-semibold text-lg text-gray-800 dark:text-white">{title}</span>
          <button
            className="text-gray-500 hover:text-red-600 text-2xl font-normal rounded-full w-8 h-8 flex items-center justify-center transition"
            onClick={onClose}
            aria-label="Close"
            tabIndex={0}
          >
            <span aria-hidden>&times;</span>
          </button>
        </div>
        <div className="px-6 py-4 max-h-[72vh] overflow-y-auto">{children}</div>
      </div>
      <style>
        {`
        @keyframes fadeIn {
          0% { transform: scale(0.97); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.18s cubic-bezier(0.4,0,0.2,1); }
        `}
      </style>
    </div>
  );
}

// Vendor interface
interface Vendor {
  _id: string;
  name: string;
  vendorId: string;
  email: string;
  phoneNo: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  route: string;
}

function EditVendorModal({
  open,
  onClose,
  vendor,
  onEdit,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onEdit: (updated: Vendor) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Vendor | null>(null);

  useEffect(() => {
    setForm(vendor ? { ...vendor } : null);
  }, [vendor, open]);

  const handleChange = (label: keyof Vendor, value: any) =>
    setForm((f) => (f ? { ...f, [label]: value } : f));
  const handleAddressChange = (
    label: keyof Vendor["address"],
    value: string
  ) =>
    setForm((f) =>
      f ? { ...f, address: { ...f.address, [label]: value } } : f
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      onEdit(form);
    }
  };

  if (!form) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Vendor">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        autoComplete="off"
        spellCheck="false"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              Name
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              Vendor Id
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.vendorId}
              onChange={(e) => handleChange("vendorId", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              Email
            </label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              Phone No.
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.phoneNo}
              onChange={(e) => handleChange("phoneNo", e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <Label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
            Route
          </Label>
          <input
            className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
            value={form.route}
            onChange={(e) => handleChange("route", e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              Address Line
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.address.addressLine}
              onChange={(e) => handleAddressChange("addressLine", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              City
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              State
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              Pin Code
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.address.pincode}
              onChange={(e) => handleAddressChange("pincode", e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-lg font-medium transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function VendorsList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [saving, setSaving] = useState(false);
  // Toast
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  // Filter
  const [filter, setFilter] = useState<string>("");
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("sub-admin-token");
        // Fetch vendors from new route
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sub-admin/get-all-vendors`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setVendors(res.data.vendors || []);
      } catch (err: any) {
        console.error("Error fetching vendors:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch vendors. Please try again."
        );
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [refreshFlag]);

  // Filtering logic: filter by name, email, phoneNo, vendorId, route, address, city, state, pincode
  const normalize = (value: any) =>
    typeof value === "string" ? value.toLowerCase().trim() : "";

  const filteredVendors = vendors.filter((vendor) => {
    const search = filter.toLowerCase().trim();
    if (!search) return true;
    return (
      normalize(vendor.name).includes(search) ||
      normalize(vendor.email).includes(search) ||
      normalize(vendor.phoneNo).includes(search) ||
      normalize(vendor.vendorId).includes(search) ||
      normalize(vendor.route).includes(search) ||
      normalize(vendor.address?.addressLine).includes(search) ||
      normalize(vendor.address?.city).includes(search) ||
      normalize(vendor.address?.state).includes(search) ||
      normalize(vendor.address?.pincode).includes(search)
    );
  });

  const handleOpenEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setEditModalOpen(true);
  };

  const handleEditVendor = async (updated: Vendor) => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("sub-admin-token");
      // Update vendor using new route
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/sub-admin/update-vendor/${updated._id}`,
        updated,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEditModalOpen(false);
      setEditingVendor(null);
      setRefreshFlag((v) => v + 1);
      setToast({ message: "Vendor updated successfully!", type: "success" });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update vendor. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Toast notification */}
      {toast && toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-full overflow-x-auto">
        {/* Filter Input */}
        <div className="p-4">
          <input
            type="text"
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
            placeholder="Search by Name, Email, Phone No, Vendor ID, or Route..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        {error && (
          <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded-md mb-3">
            {error}
          </div>
        )}
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Vendor Id
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Route
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Email & Phone No.
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Address Line
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                City
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                State
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Pin Code
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor._id}>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex justify-center items-center rounded-full">
                      <UserCircleIcon width={28} height={28} />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {vendor.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {vendor.vendorId}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {vendor.route}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  <a
                    href={`mailto:${vendor.email}`}
                    className="hover:underline text-blue-800 dark:text-blue-400"
                  >
                    {vendor.email}
                  </a>
                  <br />
                  <a
                    href={`tel:${vendor.phoneNo}`}
                    className="hover:underline text-blue-800 dark:text-blue-400"
                  >
                    {vendor.phoneNo}
                  </a>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {vendor.address?.addressLine}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {vendor.address?.city}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {vendor.address?.state}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {vendor.address?.pincode}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  <button
                    className="inline-flex items-center gap-1 px-3 py-[6px] rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-400/10 dark:hover:bg-brand-400/15 text-brand-600 text-sm font-medium transition"
                    onClick={() => handleOpenEdit(vendor)}
                  >
                    <PencilIcon width={16} height={16} />
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Edit Modal */}
      <EditVendorModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingVendor(null);
        }}
        vendor={editingVendor}
        onEdit={handleEditVendor}
        saving={saving}
      />
    </div>
  );
}
