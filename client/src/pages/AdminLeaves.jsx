import LeaveRequestList from "../components/LeaveRequestList";
import { getAllLeaves } from "../services/leaveService";

const AdminLeaves = () => {
  return <LeaveRequestList title="All Leave Requests" fetchFunction={getAllLeaves} />;
};

export default AdminLeaves;
