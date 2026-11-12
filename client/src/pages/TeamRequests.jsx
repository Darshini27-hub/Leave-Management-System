import LeaveRequestList from "../components/LeaveRequestList";
import { getTeamLeaves } from "../services/leaveService";

const TeamRequests = () => {
  return <LeaveRequestList title="Team Leave Requests" fetchFunction={getTeamLeaves} />;
};

export default TeamRequests;
