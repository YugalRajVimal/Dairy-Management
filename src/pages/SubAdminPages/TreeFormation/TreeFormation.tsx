
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { UserCircleIcon, ChevronDownIcon, ChevronUpIcon } from "../../../icons";

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
  route: string;
}

const TreeFormation = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [expandedRoutes, setExpandedRoutes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("sub-admin-token");

        const [supervisorRes, vendorRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/sub-admin/get-all-supervisors`,
            { headers: { Authorization: `${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/sub-admin/get-all-vendors`,
            { headers: { Authorization: `${token}` } }
          ),
        ]);

        setSupervisors(supervisorRes.data.vendors || []);
        setVendors(vendorRes.data.vendors || []);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (route: string) => {
    setExpandedRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route]
    );
  };

  // --- Filter logic ---
  // Filter on: name, email, phoneNo, nickName (not present in sup/vendors), _id, vendorId, supervisorId, route
  const filterText = filter.trim().toLowerCase();

  // Supervisors to render (including only those matching filter, or have vendors matching filter)
  const filteredSupervisors = filterText
    ? supervisors.filter((supervisor) => {
        // Supervisor fields
        const matchSupervisor =
          (supervisor.name && supervisor.name.toLowerCase().includes(filterText)) ||
          (supervisor.email && supervisor.email.toLowerCase().includes(filterText)) ||
          (supervisor.phoneNo && supervisor.phoneNo.toLowerCase().includes(filterText)) ||
          (supervisor._id && supervisor._id.toLowerCase().includes(filterText)) ||
          (supervisor.supervisorId && supervisor.supervisorId.toLowerCase().includes(filterText)) ||
          (supervisor.route && supervisor.route.toLowerCase().includes(filterText));
        if (matchSupervisor) return true;

        // Related vendors for supervisor's route
        const relatedVendors = vendors.filter(v => v.route === supervisor.route);
        for (const vendor of relatedVendors) {
          const matchVendor =
            (vendor.name && vendor.name.toLowerCase().includes(filterText)) ||
            (vendor.email && vendor.email.toLowerCase().includes(filterText)) ||
            (vendor.phoneNo && vendor.phoneNo.toLowerCase().includes(filterText)) ||
            (vendor._id && vendor._id.toLowerCase().includes(filterText)) ||
            (vendor.vendorId && vendor.vendorId.toLowerCase().includes(filterText)) ||
            (vendor.route && vendor.route.toLowerCase().includes(filterText));
          if (matchVendor) return true;
        }
        return false;
      })
    : supervisors;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-t-brand-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-600 bg-red-100 border border-red-300 rounded-md">
        {error}
      </div>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="max-w-full overflow-x-auto">
        {/* Filter Input */}
        <div className="p-4">
          <input
            type="text"
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Search by Name, Email, Phone No, ID, Vendor ID, Supervisor ID or Route..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <Table>
          {/* Header */}
          <TableHeader className="border-b border-gray-100">
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
                Id
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
                Address Line, City, State, Pincode
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-gray-100">
            {filteredSupervisors.map((supervisor) => {
              // Only show related vendors that also match filter (if filter is applied)
              let relatedVendors = vendors.filter(
                (v) => v.route === supervisor.route
              );
              if (filterText) {
                relatedVendors = relatedVendors.filter(vendor =>
                  (vendor.name && vendor.name.toLowerCase().includes(filterText)) ||
                  (vendor.email && vendor.email.toLowerCase().includes(filterText)) ||
                  (vendor.phoneNo && vendor.phoneNo.toLowerCase().includes(filterText)) ||
                  (vendor._id && vendor._id.toLowerCase().includes(filterText)) ||
                  (vendor.vendorId && vendor.vendorId.toLowerCase().includes(filterText)) ||
                  (vendor.route && vendor.route.toLowerCase().includes(filterText))
                );
                // ...BUT if supervisor itself matched, we show all vendors under them
                const matchSupervisor =
                  (supervisor.name && supervisor.name.toLowerCase().includes(filterText)) ||
                  (supervisor.email && supervisor.email.toLowerCase().includes(filterText)) ||
                  (supervisor.phoneNo && supervisor.phoneNo.toLowerCase().includes(filterText)) ||
                  (supervisor._id && supervisor._id.toLowerCase().includes(filterText)) ||
                  (supervisor.supervisorId && supervisor.supervisorId.toLowerCase().includes(filterText)) ||
                  (supervisor.route && supervisor.route.toLowerCase().includes(filterText));
                if (matchSupervisor) {
                  relatedVendors = vendors.filter(
                    (v) => v.route === supervisor.route
                  );
                }
              }
              const isExpanded = expandedRoutes.includes(supervisor.route);

              return (
                <>
                  {/* Supervisor Row */}
                  <TableRow
                    key={supervisor._id}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell className="px-5 py-4 flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDownIcon
                          onClick={() => toggleExpand(supervisor.route)}
                          className="w-5 h-5 text-gray-500"
                        />
                      ) : (
                        <ChevronUpIcon
                          onClick={() => toggleExpand(supervisor.route)}
                          className="w-5 h-5 text-gray-500"
                        />
                      )}
                      <UserCircleIcon width={28} height={28} />
                      <span className="font-semibold text-gray-800">
                        {supervisor.name} (Supervisor)
                      </span>
                    </TableCell>
                    <TableCell>{supervisor.supervisorId}</TableCell>
                    <TableCell>{supervisor.route}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${supervisor.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {supervisor.email}
                      </a>
                      <br />
                      {supervisor.phoneNo}
                    </TableCell>
                    <TableCell>
                      {supervisor.address?.addressLine},{" "}
                      {supervisor.address?.city}, {supervisor.address?.state},{" "}
                      {supervisor.address?.pincode}
                    </TableCell>
                  </TableRow>

                  {/* Vendors under Supervisor */}
                  {isExpanded &&
                    relatedVendors.map((vendor) => (
                      <TableRow
                        key={vendor._id}
                        className=" border-l-4 border-blue-400 bg-blue-200"
                      >
                        <TableCell className="px-10 py-3 flex items-center gap-3">
                          <UserCircleIcon width={22} height={22} />
                          <span>{vendor.name} (Vendor)</span>
                        </TableCell>
                        <TableCell>{vendor.vendorId}</TableCell>
                        <TableCell>{vendor.route}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${vendor.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {vendor.email}
                          </a>
                          <br />
                          {vendor.phoneNo}
                        </TableCell>
                        <TableCell>
                          {vendor.address?.addressLine},{" "}
                          {vendor.address?.city},{" "}
                          {vendor.address?.state},{" "}
                          {vendor.address?.pincode}
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TreeFormation;
