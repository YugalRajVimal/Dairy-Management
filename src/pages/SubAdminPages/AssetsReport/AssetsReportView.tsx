import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UploadedAssetsDataTable from "./UploadedAssetsDataTable";

const SubAdminAssetsSheetView = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Uploaded Assets Report" />
      <div className="space-y-6">
        {/* <ComponentCard title="Excel Sheet View"> */}
        <UploadedAssetsDataTable />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
};

export default SubAdminAssetsSheetView;
