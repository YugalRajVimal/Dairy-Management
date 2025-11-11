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
import { Link } from "react-router";
import Button from "../../../components/ui/button/Button";

interface SubAdmins {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  nickName: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  zone: string;
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
  onboardedBy: string;
}

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

const AdminTreeFormation = () => {
  const [subadmins, setSubAdmins] = useState<SubAdmins[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const [expandedSubAdmins, setExpandedSubAdmins] = useState<string[]>([]);
  const [expandedSupervisors, setExpandedSupervisors] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filter, setFilter] = useState<string>("");

  // Fetch SubAdmins
  useEffect(() => {
    const fetchSubAdmins = async () => {
      try {
        const token = localStorage.getItem("admin-token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-sub-admins`,
          { headers: { Authorization: `${token}` } }
        );
        setSubAdmins(res.data.subadmins || []);
      } catch (err: any) {
        console.error("Error fetching subadmins:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch subadmins. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubAdmins();
  }, []);

  // Fetch Supervisors & Vendors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("admin-token");
        const [supervisorRes, vendorRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/get-all-supervisors`,
            { headers: { Authorization: `${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/get-all-vendors`,
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

  const toggleSubAdminExpand = (id: string) => {
    setExpandedSubAdmins((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSupervisorExpand = (id: string) => {
    setExpandedSupervisors((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Filtering logic
  // Filter on: name, email, phoneNo, nickName, _id , vendorId, supervisorId, route (anywhere in subadmin, supervisor or vendor)
  const filterText = filter.trim().toLowerCase();

  const filteredSubAdmins = filterText
    ? subadmins.filter((subadmin) => {
        // Check subadmin fields
        const matchSubadmin =
          (subadmin.name && subadmin.name.toLowerCase().includes(filterText)) ||
          (subadmin.email && subadmin.email.toLowerCase().includes(filterText)) ||
          (subadmin.phoneNo && subadmin.phoneNo.toLowerCase().includes(filterText)) ||
          (subadmin.nickName && subadmin.nickName.toLowerCase().includes(filterText)) ||
          (subadmin._id && subadmin._id.toLowerCase().includes(filterText));
        if (matchSubadmin) return true;

        // Check related supervisors fields
        const supervisorsForSub = supervisors.filter(s => s.onboardedBy === subadmin._id);
        for (const sup of supervisorsForSub) {
          const matchSupervisor =
            (sup.name && sup.name.toLowerCase().includes(filterText)) ||
            (sup.supervisorId && sup.supervisorId.toLowerCase().includes(filterText)) ||
            (sup.email && sup.email.toLowerCase().includes(filterText)) ||
            (sup.phoneNo && sup.phoneNo.toLowerCase().includes(filterText)) ||
            (sup.route && sup.route.toLowerCase().includes(filterText)) ||
            (sup._id && sup._id.toLowerCase().includes(filterText));

          if (matchSupervisor) return true;

          // Check related vendor fields for this supervisor
          const relatedVendors = vendors.filter(v => v.route === sup.route);
          for (const ven of relatedVendors) {
            const matchVendor =
              (ven.name && ven.name.toLowerCase().includes(filterText)) ||
              (ven.email && ven.email.toLowerCase().includes(filterText)) ||
              (ven.phoneNo && ven.phoneNo.toLowerCase().includes(filterText)) ||
              (ven.vendorId && ven.vendorId.toLowerCase().includes(filterText)) ||
              (ven.route && ven.route.toLowerCase().includes(filterText)) ||
              (ven._id && ven._id.toLowerCase().includes(filterText));
            if (matchVendor) return true;
          }
        }
        return false;
      })
    : subadmins;

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
            placeholder="Search by Name, Email, Phone No, Nick Name, ID, Vendor ID, Supervisor ID or Route..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <Table>
          {/* Header */}
          <TableHeader className="border-b border-gray-100">
            <TableRow>
              <TableCell isHeader>Sub Admin Id</TableCell>
              <TableCell isHeader>Name & Nick Name</TableCell>
              <TableCell isHeader>Zone</TableCell>
              <TableCell isHeader>Email & Phone No.</TableCell>
              <TableCell isHeader>
                Address Line, City, State, Pin Code
              </TableCell>

              <TableCell isHeader>Action</TableCell>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-gray-100">
            {filteredSubAdmins.map((subadmin) => {
              const relatedSupervisors = supervisors.filter(
                (s) => s.onboardedBy === subadmin._id
              );
              const isSubAdminExpanded = expandedSubAdmins.includes(
                subadmin._id
              );

              return (
                <>
                  {/* SubAdmin Row */}
                  <TableRow
                    key={subadmin._id}
                    className="cursor-pointer hover:bg-gray-50  text-center"
                  >
                    <TableCell className="px-4 py-6 flex items-center gap-2">
                      {isSubAdminExpanded ? (
                        <ChevronDownIcon
                          onClick={() => toggleSubAdminExpand(subadmin._id)}
                          className="w-5 h-5 text-gray-600"
                        />
                      ) : (
                        <ChevronUpIcon
                          onClick={() => toggleSubAdminExpand(subadmin._id)}
                          className="w-5 h-5 text-gray-600"
                        />
                      )}
                      {subadmin._id}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 text-left">
                        <UserCircleIcon width={28} height={28} />
                        <span className="font-medium text-gray-800">
                          {subadmin.name} <br /> {subadmin.nickName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{subadmin.zone}</TableCell>
                    <TableCell className="text-left px-2">
                      <a href={`mailto:${subadmin.email}`}>{subadmin.email}</a>
                      <br />
                      {subadmin.phoneNo}
                    </TableCell>
                    <TableCell>
                      {subadmin.address?.addressLine}, {subadmin.address?.city},{" "}
                      {subadmin.address?.state}, {subadmin.address?.pincode}
                    </TableCell>

                    <TableCell>
                      <Link
                        to="/admin/issue-assets-to-sub-admin"
                        state={{ subAdminId: subadmin._id }}
                      >
                        <Button>Issue Assets</Button>
                      </Link>
                    </TableCell>
                  </TableRow>

                  {/* Supervisors (Expandable section) */}
                  {isSubAdminExpanded &&
                    relatedSupervisors.map((supervisor) => {
                      const relatedVendors = vendors.filter(
                        (v) => v.route === supervisor.route
                      );
                      const isSupervisorExpanded = expandedSupervisors.includes(
                        supervisor._id
                      );

                      return (
                        <>
                          <TableRow
                            key={supervisor._id}
                            className="cursor-pointer ml-4 hover:bg-violet-300 bg-violet-200"
                          >
                            <TableCell className="px-10 py-4 flex items-center gap-2">
                              {isSupervisorExpanded ? (
                                <ChevronDownIcon
                                  onClick={() =>
                                    toggleSupervisorExpand(supervisor._id)
                                  }
                                  className="w-5 h-5 text-gray-500"
                                />
                              ) : (
                                <ChevronUpIcon
                                  onClick={() =>
                                    toggleSupervisorExpand(supervisor._id)
                                  }
                                  className="w-5 h-5 text-gray-500"
                                />
                              )}
                              <UserCircleIcon width={24} height={24} />
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
                              {supervisor.address?.city},{" "}
                              {supervisor.address?.state},{" "}
                              {supervisor.address?.pincode}
                            </TableCell>
                          </TableRow>

                          {/* Vendors */}
                          {isSupervisorExpanded &&
                            relatedVendors.map((vendor) => (
                              <TableRow
                                key={vendor._id}
                                className="border-l-4 ml-4 border-blue-400 hover:bg-blue-300 bg-blue-200"
                              >
                                <TableCell className="px-14 py-3 flex items-center gap-3">
                                  <UserCircleIcon width={20} height={20} />
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
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminTreeFormation;
