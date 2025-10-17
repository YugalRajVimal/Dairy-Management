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
import Button from "../../../components/ui/button/Button";
import { Link } from "react-router";

// Interface for Vendors
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
}

export default function SubAdminList() {
  const [subadmins, setSubAdmins] = useState<SubAdmins[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubAdmins = async () => {
      try {
        const token = localStorage.getItem("admin-token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/get-all-sub-admins`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
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
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
            <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Sub Admin Id
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-gray-500"
              >
                Name & Nick Name
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
            {subadmins.map((subadmin) => (
              <TableRow key={subadmin._id}>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {subadmin._id}
                </TableCell>
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex justify-center items-center rounded-full">
                      <UserCircleIcon width={28} height={28} />
                    </div>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {subadmin.name} <br /> {subadmin.nickName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  <a
                    href={`mailto:${subadmin.email}`}
                    className="hover:underline text-blue-800 dark:text-blue-400"
                  >
                    {subadmin.email}
                  </a>
                  <br />
                  <a
                    href={`tel:${subadmin.phoneNo}`}
                    className="hover:underline text-blue-800 dark:text-blue-400"
                  >
                    {subadmin.phoneNo}
                  </a>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {subadmin.address?.addressLine}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {subadmin.address?.city}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {subadmin.address?.state}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {subadmin.address?.pincode}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {/* <a
                    href="/admin/issue-assets-to-sub-admin"
                    
                  >
                    <Button>Issue Assets</Button>
                  </a> */}
                  <Link
                    to="/admin/issue-assets-to-sub-admin"
                    state={{ subAdminId: subadmin._id }} // <-- pass the ID here
                  >
                    <Button>Issue Assets</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
