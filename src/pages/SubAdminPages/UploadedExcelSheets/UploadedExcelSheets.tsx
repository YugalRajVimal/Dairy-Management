import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

import ExcelSheetsList from "./ExcelSheetList";

const UploadedExcelSheets = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Uploaded Excel Sheets" />
      <div className="space-y-6">
        <ExcelSheetsList />
      </div>
    </div>
  );
};

export default UploadedExcelSheets;
