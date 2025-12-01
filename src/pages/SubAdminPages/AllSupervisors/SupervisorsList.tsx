import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { UserCircleIcon } from "../../../icons";
import MultiSelect from "../../../components/form/MultiSelect";
import Label from "../../../components/form/Label";

// Simple toast
function Toast({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  return (
    <div
      className={`fixed z-[9999] top-6 right-6 px-5 py-3 rounded-lg shadow-lg transition-all bg-${type === "success" ? "green" : "red"}-500 text-white text-base font-medium`}
      role="alert"
    >
      {message}
    </div>
  );
}

// Clean, simple modal for editors/viewers
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
    <div
      className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-0 relative animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 rounded-t-2xl">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto border-0 text-2xl text-gray-400 hover:text-brand-600 transition-colors rounded-full px-2 py-1 focus:outline-none"
            type="button"
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

// Supervisor entity type
interface Supervisor {
  _id: string;
  name: string;
  supervisorId: string;
  email: string;
  phoneNo: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  supervisorRoutes: (string | number)[];
}

function EditSupervisorModal({
  open,
  onClose,
  supervisor,
  onEdit,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  supervisor: Supervisor | null;
  onEdit: (updated: Supervisor) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<Supervisor | null>(null);
  const [routes, setRoutes] = useState<string[]>([]);
  const [routesOptions, setRoutesOptions] = useState<{ value: string; text: string }[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);

  useEffect(() => {
    if (supervisor) {
      setForm({ ...supervisor });
      setRoutes(
        Array.isArray(supervisor.supervisorRoutes)
          ? supervisor.supervisorRoutes
              .filter((r) => typeof r === "string" || typeof r === "number")
              .map((r) => String(r))
          : []
      );
    } else {
      setForm(null);
      setRoutes([]);
    }
  }, [supervisor, open]);

  useEffect(() => {
    async function loadRoutes() {
      setLoadingRoutes(true);
      try {
        const token = localStorage.getItem("sub-admin-token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sub-admin/get-all-routes`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200 && Array.isArray(response.data.routes)) {
          setRoutesOptions(
            response.data.routes.map((route: any) => ({
              value: String(route.route),
              text: `Route ${route.route}`,
            }))
          );
        } else {
          setRoutesOptions([]);
        }
      } catch {
        setRoutesOptions([]);
      }
      setLoadingRoutes(false);
    }
    loadRoutes();
  }, []);

  // Field editing logic
  const handleChange = (label: keyof Supervisor, value: any) =>
    setForm((f) => (f ? { ...f, [label]: value } : f));

  const handleAddressChange = (label: keyof Supervisor["address"], value: string) =>
    setForm((f) =>
      f ? { ...f, address: { ...f.address, [label]: value } } : f
    );

  const handleRoutesChange = (selected: string[]) => {
    setRoutes(selected);
    setForm((f) =>
      f ? { ...f, supervisorRoutes: selected.map((r) => isNaN(Number(r)) ? r : Number(r)) } : f
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      // only filter out undefined/null; leave string/number as is
      const safeRoutes = routes
        .filter((r) => r && (typeof r === "string" || typeof r === "number"))
        .map((r) => isNaN(Number(r)) ? r : Number(r));
      onEdit({ ...form, supervisorRoutes: safeRoutes });
    }
  };

  if (!form) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Supervisor">
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
              Supervisor Id
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.supervisorId}
              onChange={(e) => handleChange("supervisorId", e.target.value)}
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
        {/* Route selection */}
        <div>
          <Label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
            Route
          </Label>
          <div>
            {loadingRoutes ? (
              <p className="text-sm text-gray-500">Loading routes...</p>
            ) : (
              <MultiSelect
                options={routesOptions}
                defaultSelected={routes}
                onChange={handleRoutesChange}
                label="Select route(s)..."
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              Address Line
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.address.addressLine}
              onChange={e => handleAddressChange("addressLine", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              City
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.address.city}
              onChange={e => handleAddressChange("city", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              State
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.address.state}
              onChange={e => handleAddressChange("state", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-100">
              Pin Code
            </label>
            <input
              className="w-full border px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-brand-500 focus:border-brand-500 dark:focus:bg-gray-800 outline-none transition"
              value={form.address.pincode}
              onChange={e => handleAddressChange("pincode", e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 pt-2 mt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            className="px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium border transition hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={onClose}
            tabIndex={0}
          >
            Cancel
          </button>
          <button
            className={`px-6 py-2 rounded-lg bg-brand-600 text-white font-semibold shadow-sm transition 
              ${saving ? "bg-brand-400 cursor-not-allowed" : "hover:bg-brand-700"}`}
            type="submit"
            disabled={saving}
            tabIndex={0}
          >
            {saving ? (
              <span>
                <svg
                  className="inline-block -mt-1 mr-2 animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function SupervisorsList() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // New: State for toast
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchSupervisors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("sub-admin-token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sub-admin/get-all-supervisors`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setSupervisors(Array.isArray(res.data.vendors) ? res.data.vendors : []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to fetch supervisors. Please try again."
        );
        setSupervisors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSupervisors();
  }, [refreshFlag]);

  const filterText = filter.trim().toLowerCase();
  const filteredSupervisors = filterText
    ? supervisors.filter((supervisor) => {
        const routesString = Array.isArray(supervisor.supervisorRoutes)
          ? supervisor.supervisorRoutes
              .map((route) => String(route))
              .join(", ")
          : "";
        return (
          (supervisor.name && supervisor.name.toLowerCase().includes(filterText)) ||
          (supervisor.email && supervisor.email.toLowerCase().includes(filterText)) ||
          (supervisor.phoneNo && supervisor.phoneNo.toLowerCase().includes(filterText)) ||
          (supervisor.supervisorId && supervisor.supervisorId.toLowerCase().includes(filterText)) ||
          (routesString && routesString.toLowerCase().includes(filterText))
        );
      })
    : supervisors;

  const handleOpenEdit = (supervisor: Supervisor) => {
    setEditingSupervisor(supervisor);
    setEditModalOpen(true);
  };

  const handleEditSupervisor = async (updated: Supervisor) => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("sub-admin-token");
      // Ensure supervisorRoutes contains only string or number, send as is
      const cleanSupervisor = {
        ...updated,
        supervisorRoutes: Array.isArray(updated.supervisorRoutes)
          ? updated.supervisorRoutes.map((r) =>
              typeof r === "string" && !isNaN(Number(r)) ? Number(r) : r
            )
          : [],
      };
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/sub-admin/update-supervisor/${cleanSupervisor._id}`,
        cleanSupervisor,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEditModalOpen(false);
      setEditingSupervisor(null);
      setRefreshFlag((v) => v + 1);
      // Show success toast on update
      setToast({ message: "Supervisor updated successfully!", type: "success" });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to update supervisor. Please try again."
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
            placeholder="Search by Name, Email, Phone No, Supervisor Id, or Route..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        {error && (
          <div className="mt-2 p-4 text-red-600 bg-red-100 border border-red-300 rounded-md">
            {error}
          </div>
        )}

        <Table>
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
                Supervisor Id
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Routes
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
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredSupervisors.map((supervisor) => (
              <TableRow key={supervisor._id}>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex justify-center items-center rounded-full">
                      <UserCircleIcon width={28} height={28} />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {supervisor.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {supervisor.supervisorId}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {Array.isArray(supervisor.supervisorRoutes)
                    ? supervisor.supervisorRoutes.map((r) => String(r)).join(", ")
                    : ""}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  <a
                    href={`mailto:${supervisor.email}`}
                    className="hover:underline text-blue-800 dark:text-blue-400"
                  >
                    {supervisor.email}
                  </a>
                  <br />
                  <a
                    href={`tel:${supervisor.phoneNo}`}
                    className="hover:underline text-blue-800 dark:text-blue-400"
                  >
                    {supervisor.phoneNo}
                  </a>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {supervisor.address?.addressLine}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {supervisor.address?.city}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {supervisor.address?.state}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {supervisor.address?.pincode}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  <button
                    className="p-2 rounded hover:bg-brand-100 dark:hover:bg-brand-900 text-brand-600 border border-brand-500"
                    title="Edit Supervisor"
                    onClick={() => handleOpenEdit(supervisor)}
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditSupervisorModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingSupervisor(null);
        }}
        supervisor={editingSupervisor}
        onEdit={handleEditSupervisor}
        saving={saving}
      />
    </div>
  );
}
