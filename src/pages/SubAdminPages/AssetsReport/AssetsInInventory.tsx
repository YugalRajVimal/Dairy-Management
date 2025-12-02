
// import { useState, useEffect } from "react";
// import ComponentCard from "../../../components/common/ComponentCard";
// import Label from "../../../components/form/Label";
// import Alert from "../../../components/ui/alert/Alert";
// import axios from "axios";

// // ---------------- TYPES ----------------
// interface AlertState {
//   isEnable: boolean;
//   variant: "success" | "error" | "info";
//   title: string;
//   message: string;
// }

// interface AssetReport {
//   _id?: string;
//   subAdminId: string;
//   stockNo?: string;
//   rt?: string;
//   duplicate?: string;
//   status?: string;
//   cStatus?: string;
//   can?: number | string;
//   lid?: number | string;
//   pvc?: number | string;
//   keyboard?: number | string;
//   printer?: number | string;
//   charger?: number | string;
//   stripper?: number | string;
//   solar?: number | string;
//   controller?: number | string;
//   ews?: number | string;
//   display?: number | string;
//   battery?: number | string;
//   bond?: string;
//   vspSign?: string;
//   dps?: string;
// }

// // ---------------- COMPONENT ----------------
// export default function AssetsInInventory() {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const subAdminId = localStorage.getItem("sub-admin-id") || "";

//   const [alert, setAlert] = useState<AlertState>({
//     isEnable: false,
//     variant: "info",
//     title: "",
//     message: "",
//   });

//   const [formData, setFormData] = useState<AssetReport>({ subAdminId });
//   const [usedAssets, setUsedAssets] = useState<AssetReport>({ subAdminId });
//   const [loading, setLoading] = useState(false);

//   // Load sub-admin asset report on mount
//   useEffect(() => {
//     const fetchAssetReport = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(
//           `${API_URL}/api/sub-admin/get-issued-assets-report`,
//           {
//             headers: { Authorization: localStorage.getItem("sub-admin-token") },
//           }
//         );

//         if (res.data?.data) {
//           setFormData(res?.data?.data);
//           if (res?.data?.usedAssets) setUsedAssets(res?.data?.usedAssets);
//         }
//       } catch (error) {
//         console.error("Error fetching asset report:", error);
//         setAlert({
//           isEnable: true,
//           variant: "error",
//           title: "Error",
//           message: "Failed to load asset report.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssetReport();
//   }, [subAdminId, API_URL]);

//   if (loading && !formData.stockNo)
//     return <p className="p-4 text-gray-500">Loading asset data...</p>;

//   // Grouped asset categories
//   const groupedAssets = [
//     {
//       title: "Core Equipment",
//       fields: ["can", "lid", "pvc", "keyboard", "printer", "charger"],
//       type: "inventory",
//     },
//     {
//       title: "Support Equipment",
//       fields: [
//         "stripper",
//         "solar",
//         "controller",
//         "ews",
//         "display",
//         "battery",
//         "rt",
//         "duplicate",
//       ],
//       type: "inventory",
//     },
//     {
//       title: "Identifiers",
//       fields: ["bond", "dps"],
//       type: "tags",
//     },
//     {
//       title: "Status Information",
//       fields: ["status", "cStatus", "vspSign"],
//       type: "text",
//     },
//   ];

//   return (
//     <ComponentCard
//       title="Your Issued Assets"
//       className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
//     >
//       {alert.isEnable && (
//         <Alert
//           variant={alert.variant as any}
//           title={alert.title}
//           message={alert.message}
//         />
//       )}

//       {/* Show Remaining Assets in Inventory */}
//       <div className="mb-8 mt-4">
//         <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
//           Remaining Assets in Inventory
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//           {/* Core Equipment */}
//           <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl shadow-sm">
//             <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Core Equipment</h4>
//             <div className="flex flex-wrap gap-4">
//               {["can", "lid", "pvc", "keyboard", "printer", "charger"].map((field) => {
//                 const total = Number(formData[field as keyof typeof formData]) || 0;
//                 const used = Number(usedAssets[field as keyof typeof usedAssets]) || 0;
//                 const remaining = total - used;
//                 return (
//                   <div key={field} className="flex flex-col items-center min-w-[62px]">
//                     <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{field.toUpperCase()}</span>
//                     <span className="block text-blue-700 dark:text-blue-200 text-lg font-semibold">{remaining >= 0 ? remaining : 0}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Support Equipment */}
//           <div className="bg-green-50 dark:bg-green-900/15 p-4 rounded-xl shadow-sm">
//             <h4 className="font-semibold mb-2 text-green-900 dark:text-green-300">Support Equipment</h4>
//             <div className="flex flex-wrap gap-4">
//               {["stripper", "solar", "controller", "ews", "display", "battery", "rt", "duplicate"].map((field) => {
//                 const total = Number(formData[field as keyof typeof formData]) || 0;
//                 const used = Number(usedAssets[field as keyof typeof usedAssets]) || 0;
//                 const remaining = total - used;
//                 return (
//                   <div key={field} className="flex flex-col items-center min-w-[62px]">
//                     <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{field.toUpperCase()}</span>
//                     <span className="block text-green-800 dark:text-green-200 text-lg font-semibold">{remaining >= 0 ? remaining : 0}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Identifiers (DPS, BOND) */}
//           <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl shadow-sm">
//             <h4 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-200">Identifiers</h4>
//             <div className="flex flex-wrap gap-4">
//               {["bond", "dps"].map((field) => {
//                 // Text value handling for DPS, BOND
//                 // If all text values are used, then N/A; else show the actual value(s)
//                 const formRaw = formData[field as keyof typeof formData];
//                 const usedRaw = usedAssets[field as keyof typeof usedAssets];
                
//                 // Convert comma separated string into array of trimmed values, will work if only one value as well
//                 const toArray = (v: any) =>
//                   (typeof v === "string"
//                     ? v.split(",").map((x) => x.trim()).filter(Boolean)
//                     : Array.isArray(v)
//                     ? v.map((x) => String(x).trim()).filter(Boolean)
//                     : v
//                     ? [String(v).trim()]
//                     : []
//                   );

//                 const allIssued = toArray(formRaw);
//                 const allUsed = toArray(usedRaw);

//                 // Compute unused values: issued but not used
//                 const unused = allIssued.filter((val) => !allUsed.includes(val));
//                 let displayVal;
//                 if (!allIssued.length) {
//                   displayVal = "N/A";
//                 } else if (!unused.length) {
//                   displayVal = "N/A";
//                 } else {
//                   displayVal = unused.join(", ");
//                 }

//                 return (
//                   <div key={field} className="flex flex-col items-center min-w-[90px]">
//                     <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{field.toUpperCase()}</span>
//                     <span className="block text-yellow-900 dark:text-yellow-100 text-lg font-semibold text-center break-words">
//                       {displayVal}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-8">
//         {groupedAssets.map((group) => (
//           <div key={group.title}>
//             <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2">
//               {group.title}
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {group?.fields?.map((field) => {
//                 const valueForm = formData[field as keyof AssetReport];
//                 const valueUsed = usedAssets[field as keyof AssetReport];

//                 // Inventory Fields (show progress bar)
//                 if (group.type === "inventory") {
//                   const used = Number(valueUsed) || 0;
//                   const total = Number(valueForm) || 0;
//                   const percentage =
//                     total > 0 ? Math.min((used / total) * 100, 100) : 0;

//                   return (
//                     <div
//                       key={field}
//                       className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition"
//                     >
//                       <Label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
//                         {field?.toUpperCase()}
//                       </Label>

//                       <div className="flex justify-between text-sm font-medium mb-1">
//                         <span className="text-blue-600 dark:text-blue-400">
//                           {used}
//                         </span>
//                         <span className="text-gray-400">/ {total}</span>
//                       </div>

//                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
//                         <div
//                           className={`h-2 rounded-full ${
//                             percentage < 60
//                               ? "bg-green-500"
//                               : percentage < 90
//                               ? "bg-yellow-500"
//                               : "bg-red-500"
//                           }`}
//                           style={{ width: `${percentage}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   );
//                 }

//                 // Tags (Bond / DPS)
//                 // Tags (Bond / DPS)
//                 if (group.type === "tags") {
//                   const usedItems = (valueUsed as string)
//                     ?.split(",")
//                     .map((s) => s.trim())
//                     .filter((s) => s);
//                   const totalItems = (valueForm as string)
//                     ?.split(",")
//                     .map((s) => s.trim())
//                     .filter((s) => s);

//                   return (
//                     <div
//                       key={field}
//                       className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition"
//                     >
//                       <Label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
//                         {field?.toUpperCase()}
//                       </Label>

//                       {/* Used Items */}
//                       <div className="mb-2">
//                         <p className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1">
//                           Used
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {usedItems && usedItems.length > 0 ? (
//                             usedItems?.map((item, idx) => (
//                               <span
//                                 key={idx}
//                                 className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
//                               >
//                                 {item}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-gray-400 text-xs italic">
//                               No used items
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Total / Available Items */}
//                       <div>
//                         <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
//                           Total
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {totalItems && totalItems.length > 0 ? (
//                             totalItems.map((item, idx) => (
//                               <span
//                                 key={idx}
//                                 className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
//                               >
//                                 {item}
//                               </span>
//                             ))
//                           ) : (
//                             <span className="text-gray-400 text-xs italic">
//                               No total items
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 }

//                 // Text Fields (Status, cStatus, VSP Sign)
//                 return (
//                   <div
//                     key={field}
//                     className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition"
//                   >
//                     <Label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                       {field.toUpperCase()}
//                     </Label>
//                     <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
//                       {valueForm || "—"}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </ComponentCard>
//   );
// }

import { useState, useEffect } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Alert from "../../../components/ui/alert/Alert";
import axios from "axios";

// ---------------- TYPES ----------------
interface AlertState {
  isEnable: boolean;
  variant: "success" | "error" | "info";
  title: string;
  message: string;
}

interface AssetReport {
  _id?: string;
  subAdminId: string;
  stockNo?: string;
  rt?: string;
  duplicate?: string;
  status?: string;
  cStatus?: string;
  can?: number | string;
  lid?: number | string;
  pvc?: number | string;
  keyboard?: number | string;
  printer?: number | string;
  charger?: number | string;
  stripper?: number | string;
  solar?: number | string;
  controller?: number | string;
  ews?: number | string;
  display?: number | string;
  battery?: number | string;
  bond?: string;
  vspSign?: string;
  dps?: string;
}

// ---------------- COMPONENT ----------------
export default function AssetsInInventory() {
  const API_URL = import.meta.env.VITE_API_URL;
  const subAdminId = localStorage.getItem("sub-admin-id") || "";

  const [alert, setAlert] = useState<AlertState>({
    isEnable: false,
    variant: "info",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState<AssetReport>({ subAdminId });
  const [usedAssets, setUsedAssets] = useState<AssetReport>({ subAdminId });
  const [loading, setLoading] = useState(false);

  // Load sub-admin asset report on mount
  useEffect(() => {
    const fetchAssetReport = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/api/sub-admin/get-issued-assets-report`,
          {
            headers: { Authorization: localStorage.getItem("sub-admin-token") },
          }
        );

        // If assets are not yet issued, surface a friendly "not yet issued" message
        // as seen in @file_context_0 (sub-admin.controller.js 3040-3044)
        if (
          res.data?.message === "Assets are not yet issued to this SubAdmin" ||
          res.status === 404
        ) {
          setAlert({
            isEnable: true,
            variant: "info",
            title: "No Assets Issued",
            message: "Assets are not yet issued to this SubAdmin. Please contact the administrator if you believe this is an error.",
          });
          setFormData({ subAdminId });
          setUsedAssets({ subAdminId });
        } else if (res.data?.data) {
          setFormData(res?.data?.data);
          if (res?.data?.usedAssets) setUsedAssets(res?.data?.usedAssets);
        }
      } catch (error: any) {
        // Handle 404 specifically for the backend response
        if (
          error?.response?.data?.message === "Assets are not yet issued to this SubAdmin" ||
          error?.response?.status === 404
        ) {
          setAlert({
            isEnable: true,
            variant: "info",
            title: "No Assets Issued",
            message: "Assets are not yet issued to this SubAdmin. Please contact the administrator if you believe this is an error.",
          });
          setFormData({ subAdminId });
          setUsedAssets({ subAdminId });
        } else {
          console.error("Error fetching asset report:", error);
          setAlert({
            isEnable: true,
            variant: "error",
            title: "Error",
            message: "Failed to load asset report.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAssetReport();
    // eslint-disable-next-line
  }, [subAdminId, API_URL]);

  if (loading && !formData.stockNo)
    return <p className="p-4 text-gray-500">Loading asset data...</p>;

  // Flat list (no categories)
  const assetFields: { key: keyof AssetReport; label: string; type: "inventory" | "tags" | "text" }[] = [
    { key: "can", label: "CAN", type: "inventory" },
    { key: "lid", label: "LID", type: "inventory" },
    { key: "pvc", label: "PVC", type: "inventory" },
    { key: "keyboard", label: "KEYBOARD", type: "inventory" },
    { key: "printer", label: "PRINTER", type: "inventory" },
    { key: "charger", label: "CHARGER", type: "inventory" },
    { key: "stripper", label: "STRIPPER", type: "inventory" },
    { key: "solar", label: "SOLAR", type: "inventory" },
    { key: "controller", label: "CONTROLLER", type: "inventory" },
    { key: "ews", label: "EWS", type: "inventory" },
    { key: "display", label: "DISPLAY", type: "inventory" },
    { key: "battery", label: "BATTERY", type: "inventory" },
    { key: "rt", label: "RT", type: "inventory" },
    { key: "duplicate", label: "DUPLICATE", type: "inventory" },
    { key: "bond", label: "BOND", type: "tags" },
    { key: "dps", label: "DPS", type: "tags" },
  ];

  // If assets not yet issued, show only the alert and no inventory UI
  if (
    alert.isEnable &&
    alert.variant === "info" &&
    alert.title === "No Assets Issued"
  ) {
    return (
      <ComponentCard
        title="Your Issued Assets"
        className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <Alert
          variant={alert.variant as any}
          title={alert.title}
          message={alert.message}
        />
      </ComponentCard>
    );
  }

  return (
    <ComponentCard
      title="Your Issued Assets"
      className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
    >
      {alert.isEnable && (
        <Alert
          variant={alert.variant as any}
          title={alert.title}
          message={alert.message}
        />
      )}

      <div className="mb-8 mt-4">
        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
          Remaining Assets in Inventory
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Loop through all assetFields flatly */}
          {assetFields.map((fieldDef) => {
            const field = fieldDef.key;
            const label = fieldDef.label;
            const type = fieldDef.type;

            if (type === "inventory") {
              // Inventory (number values): calculate remaining = total - used
              const total = Number(formData[field]) || 0;
              const used = Number(usedAssets[field]) || 0;
              const remaining = total - used;
              return (
                <div
                  key={field}
                  className="flex flex-col items-center p-4 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-900 min-w-[62px]"
                >
                  <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{label}</span>
                  <span className="block text-blue-700 dark:text-blue-200 text-lg font-semibold">{remaining >= 0 ? remaining : 0}</span>
                </div>
              );
            }

            if (type === "tags") {
              // Text array/tags (DPS, BOND): calculate unused = issued - used, display joined or "N/A"
              const formRaw = formData[field];
              const usedRaw = usedAssets[field];

              const toArray = (v: any) =>
                typeof v === "string"
                  ? v.split(",").map((x) => x.trim()).filter(Boolean)
                  : Array.isArray(v)
                  ? v.map((x) => String(x).trim()).filter(Boolean)
                  : v
                  ? [String(v).trim()]
                  : [];

              const allIssued = toArray(formRaw);
              const allUsed = toArray(usedRaw);

              const unused = allIssued.filter((val) => !allUsed.includes(val));
              let displayVal;
              if (!allIssued.length) {
                displayVal = "N/A";
              } else if (!unused.length) {
                displayVal = "N/A";
              } else {
                displayVal = unused.join(", ");
              }

              return (
                <div
                  key={field}
                  className="flex flex-col items-center p-4 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-900 min-w-[90px]"
                >
                  <span className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{label}</span>
                  <span className="block text-yellow-900 dark:text-yellow-100 text-lg font-semibold text-center break-words">
                    {displayVal}
                  </span>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      <div className="mb-8 mt-4">
        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
          Assets Inventory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assetFields.map((fieldDef) => {
            const field = fieldDef.key;
            const label = fieldDef.label;
            const type = fieldDef.type;
            const valueForm = formData[field] as string | number | undefined;
            const valueUsed = usedAssets[field] as string | number | undefined;

            if (type === "inventory") {
              // Inventory (show used / total and progress bar)
              const used = Number(valueUsed) || 0;
              const total = Number(valueForm) || 0;
              const remaining = total - used;
              const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
              return (
                <div
                  key={field}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition flex flex-col"
                >
                  <Label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {label}
                  </Label>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-blue-600 dark:text-blue-400">{used}</span>
                    <span className="text-gray-400">/ {total}</span>
                    <span className="ml-auto text-green-700 dark:text-green-400 pl-2">
                      Rem: <b>{remaining >= 0 ? remaining : 0}</b>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        percentage < 60
                          ? "bg-green-500"
                          : percentage < 90
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            }

            if (type === "tags") {
              // Tags: show unused/remaining items for bond/dps
              const formRaw = valueForm;
              const usedRaw = valueUsed;
              const toArray = (v: any) =>
                typeof v === "string"
                  ? v.split(",").map((x) => x.trim()).filter(Boolean)
                  : Array.isArray(v)
                  ? v.map((x: any) => String(x).trim()).filter(Boolean)
                  : v
                  ? [String(v).trim()]
                  : [];
              const allIssued = toArray(formRaw);
              const allUsed = toArray(usedRaw);
              const unused = allIssued.filter((val) => !allUsed.includes(val));
              let displayVal;
              if (!allIssued.length) {
                displayVal = "N/A";
              } else if (!unused.length) {
                displayVal = "N/A";
              } else {
                displayVal = unused.join(", ");
              }

              return (
                <div
                  key={field}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20 hover:shadow-md transition flex flex-col"
                >
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {label}
                  </Label>
                  <span className="block text-yellow-900 dark:text-yellow-100 text-lg font-semibold text-center break-words min-h-[22px]">
                    {displayVal}
                  </span>
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-red-500 dark:text-red-400">Used:</span>
                      {allUsed.length > 0 ? (
                        <span className="text-xs text-red-800 dark:text-red-300">
                          {allUsed.join(", ")}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No used items</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">Total:</span>
                      {allIssued.length > 0 ? (
                        <span className="text-xs text-green-800 dark:text-green-300">
                          {allIssued.join(", ")}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No total items</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Text fields
            return (
              <div
                key={field}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:shadow-md transition flex flex-col"
              >
                <Label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {label}
                </Label>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {valueForm || "—"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </ComponentCard>
  );
}

