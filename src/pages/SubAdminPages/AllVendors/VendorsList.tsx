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

// Interface for Vendors
interface Vendor {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  address: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function VendorsList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("sub-admin-token");
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
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
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
              <TableCell isHeader className="px-5 py-3 text-start text-gray-500">
                Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-gray-500">
                Vendor Id
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-gray-500">
                Email & Phone No.
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-gray-500">
                Address Line
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-gray-500">
                City
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-gray-500">
                State
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-gray-500">
                Pin Code
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {vendors.map((vendor) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
