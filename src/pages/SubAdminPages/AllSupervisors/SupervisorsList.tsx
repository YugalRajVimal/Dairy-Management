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

// Interface for Supervisors (renamed from Vendor for clarity)
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
  supervisorRoutes: number[]; // route is now an array of numbers
}

export default function SupervisorsList() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const fetchSupervisors = async () => {
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
        setSupervisors(res.data.vendors || []); // API still returns "vendors" that are actually supervisors
      } catch (err: any) {
        console.error("Error fetching supervisors:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch supervisors. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  // Filtering logic: filter by name, email, phoneNo, supervisorId, or route (supervisorRoutes)
  const filterText = filter.trim().toLowerCase();
  const filteredSupervisors = filterText
    ? supervisors.filter((supervisor) => {
        const routesString = Array.isArray(supervisor.supervisorRoutes)
          ? supervisor.supervisorRoutes.join(", ")
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
            </TableRow>
          </TableHeader>

          {/* Table Body */}
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
                    ? supervisor.supervisorRoutes.join(", ")
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
