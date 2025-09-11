import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { UserCircleIcon } from "../../../icons";

// Define the interface for a SubAdmin based on the provided context
interface SubAdmin {
  id: number;
  name: string;
  email: string;
  phoneNo: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  status: "Active" | "Inactive" | "Pending"; // Added status for consistency with Badge component
}

// Define the table data using the new SubAdmin interface
const tableData: SubAdmin[] = [
  {
    id: 1,
    name: "Amit Sharma",
    email: "amit.sharma@example.com",
    phoneNo: "+919876543210",
    addressLine: "12 MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400001",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phoneNo: "+919812345678",
    addressLine: "45 Civil Lines",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pinCode: "226001",
    status: "Pending",
  },
  {
    id: 3,
    name: "Rohit Kumar",
    email: "rohit.kumar@example.com",
    phoneNo: "+919700112233",
    addressLine: "78 Park Street",
    city: "Kolkata",
    state: "West Bengal",
    pinCode: "700016",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    phoneNo: "+918888556677",
    addressLine: "10 MG Layout",
    city: "Bengaluru",
    state: "Karnataka",
    pinCode: "560001",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phoneNo: "+919011223344",
    addressLine: "22 Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pinCode: "110001",
    status: "Active",
  },
];

export default function SubAdminList() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email & Phone No.
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Address Line
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                City
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                State
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Pin Code
              </TableCell>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell> */}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((subAdmin) => (
              <TableRow key={subAdmin.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex justify-center items-center rounded-full">
                      <UserCircleIcon width={28} height={28} />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {subAdmin.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <a
                    href={`mailto:${subAdmin.email}`}
                    className="hover:underline text-blue-800 dark:text-blue-400"
                  >
                    {subAdmin.email}
                  </a>
                  <br />
                  <a
                    href={`tel:${subAdmin.phoneNo}`}
                    className="hover:underline text-blue-800 dark:text-blue-400"
                  >
                    {subAdmin.phoneNo}
                  </a>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {subAdmin.addressLine}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {subAdmin.city}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {subAdmin.state}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {subAdmin.pinCode}
                </TableCell>
                {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      subAdmin.status === "Active"
                        ? "success"
                        : subAdmin.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {subAdmin.status}
                  </Badge>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
