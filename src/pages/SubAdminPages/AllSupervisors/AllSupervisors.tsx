
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

import SupervisorsList from "./SupervisorsList";

const AllSupervisors = () => {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Onboarded Supervisors" />
      <div className="space-y-6">
        {/* <ComponentCard title="Sub Admins"> */}
        <SupervisorsList />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
};

export default AllSupervisors;
