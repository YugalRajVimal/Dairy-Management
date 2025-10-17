import { BrowserRouter as Router, Routes, Route } from "react-router";

import SignIn from "./pages/AdminPages/AuthPages/SignIn";

import NotFound from "./pages/AdminPages/OtherPage/NotFound";
import UserProfiles from "./pages/AdminPages/UserProfiles";
import Videos from "./pages/AdminPages/UiElements/Videos";
import Images from "./pages/AdminPages/UiElements/Images";
import Alerts from "./pages/AdminPages/UiElements/Alerts";
import Badges from "./pages/AdminPages/UiElements/Badges";
import Avatars from "./pages/AdminPages/UiElements/Avatars";
import Buttons from "./pages/AdminPages/UiElements/Buttons";
import LineChart from "./pages/AdminPages/Charts/LineChart";
import BarChart from "./pages/AdminPages/Charts/BarChart";
import Calendar from "./pages/AdminPages/Calendar";
import BasicTables from "./pages/AdminPages/Tables/BasicTables";
import FormElements from "./pages/AdminPages/Forms/FormElements";
import Blank from "./pages/AdminPages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/AdminPages/Dashboard/Home";
import SubAdminSignIn from "./pages/AdminPages/AuthPages/SubAdmin/SignIn";
import OnboardSubAdmin from "./pages/AdminPages/OnboardSubAdmin/OnboardSubAdmin";
import AllSubAdmins from "./pages/AdminPages/AllSubAdmins/AllSubAdmins";
import ExcelSheetView from "./pages/AdminPages/ExcelSheetDetails/ExcelSheetView";
import SubAdminUploadedExcelSheets from "./pages/AdminPages/SubAdminUploadedExcelSheets/SubAdminUploadedExcelSheets";
import SubAdminAppLayout from "./layout/SubAdmin/AppLayout";
import SubAdminHome from "./pages/SubAdminPages/Dashboard/Home";
import SubAdminProfiles from "./pages/SubAdminPages/UserProfiles";
import AllVendors from "./pages/SubAdminPages/AllVendors/AllVendors";
import OnboardVendor from "./pages/SubAdminPages/OnboardVendor/OnboardVendor";
// import UploadedExcelSheets from "./pages/SubAdminPages/UploadedExcelSheets/UploadedExcelSheets";
import SubAdminExcelSheetView from "./pages/SubAdminPages/MilkReport/ExcelSheetView";
import UploadExcelSheet from "./pages/SubAdminPages/UploadData/UploadExcelSheet";
import UploadSalesSheet from "./pages/SubAdminPages/UploadData/UploadSalesReport";
import ManageAssets from "./pages/SubAdminPages/UploadData/ManageAssets";
import HomePage from "./pages/HomePage";

import SubAdminAssetsSheetView from "./pages/SubAdminPages/AssetsReport/AssetsReportView";
import SubAdminSalesSheetView from "./pages/SubAdminPages/SalesReport/SalesReportView";
import AdminIssuedAssetsSheetView from "./pages/AdminPages/IssuedAssets/IssuedAssetsView";
import IssueAssetsToSubAdmin from "./pages/AdminPages/IssuedAssets/IssueAssetsToSubAdmin";
import AssetsInInventory from "./pages/SubAdminPages/AssetsReport/AssetsInInventory";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route index path="/" element={<HomePage />} />
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/admin" element={<Home />} />
            <Route
              index
              path="/admin/onboard-sub-admin"
              element={<OnboardSubAdmin />}
            />
            <Route
              index
              path="/admin/all-sub-admins"
              element={<AllSubAdmins />}
            />

            <Route
              index
              path="/admin/issued-assets-report"
              element={<AdminIssuedAssetsSheetView />}
            />

            <Route
              index
              path="/admin/issue-assets-to-sub-admin"
              element={<IssueAssetsToSubAdmin />}
            />

            <Route
              index
              path="/admin/excel-sheet-view/:id"
              element={<ExcelSheetView />}
            />
            <Route
              index
              path="/admin/all-excel-sheet/:id"
              element={<SubAdminUploadedExcelSheets />}
            />

            {/* Others Page */}
            <Route path="/admin/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          <Route element={<SubAdminAppLayout />}>
            <Route index path="/sub-admin" element={<SubAdminHome />} />
            <Route
              index
              path="/sub-admin/onboard-vendor"
              element={<OnboardVendor />}
            />
            <Route path="/sub-admin/all-vendors" element={<AllVendors />} />
            <Route
              index
              path="/sub-admin/upload-excel-sheet"
              element={<UploadExcelSheet />}
            />
            <Route
              index
              path="/sub-admin/upload-sales-report"
              element={<UploadSalesSheet />}
            />
             <Route
              index
              path="/sub-admin/assets-inventory"
              element={<AssetsInInventory />}
            />
            <Route
              index
              path="/sub-admin/manage-assets"
              element={<ManageAssets />}
            />
            {/* <Route
              index
              path="/sub-admin/all-excel-sheet/:id"
              element={<UploadedExcelSheets />}
            /> */}
            <Route
              index
              path="/sub-admin/excel-sheet-view"
              element={<SubAdminExcelSheetView />}
            />

            <Route
              index
              path="/sub-admin/sales-report-view"
              element={<SubAdminSalesSheetView />}
            />

            <Route
              index
              path="/sub-admin/asstes-report-view"
              element={<SubAdminAssetsSheetView />}
            />

            {/* Others Page */}
            <Route path="/sub-admin/profile" element={<SubAdminProfiles />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/admin/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/sub-admin/signin" element={<SubAdminSignIn />} />
          {/* <Route path="/sub-admin/signup" element={<SubAdminSignUpForm />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
