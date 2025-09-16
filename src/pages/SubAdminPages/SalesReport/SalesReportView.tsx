import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import UploadedSalesDataTable from "./UploadedSalesDataTable";

const SubAdminSalesSheetView = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Uploaded Sales Report" />
      <div className="space-y-6">
        {/* <ComponentCard title="Excel Sheet View"> */}
        <UploadedSalesDataTable />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
};

export default SubAdminSalesSheetView;
