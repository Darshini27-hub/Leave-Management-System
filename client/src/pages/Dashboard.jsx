import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import { getStats } from "../services/dashboardService";
import { formatDate } from "../utils/formatDate";
import Loader from "../components/Loader";
import Table from "../components/Table";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-green-700">{value}</p>
    </div>
  );
};

const AdminSection = ({ data }) => {
  const max = Math.max(...data.leavesPerMonth.map((m) => m.count), 1);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard title="Total employees" value={data.totalEmployees} />
        <StatCard title="Total pending requests" value={data.totalPending} />
      </div>

      <h2 className="text-lg font-semibold text-green-800 mb-3">Leaves per month (approved)</h2>
      <Table headings={["Month", "Leaves", ""]} isEmpty={false}>
        {data.leavesPerMonth.map((item) => (
          <tr key={item.month} className="border-t">
            <td className="px-4 py-2">{item.month}</td>
            <td className="px-4 py-2">{item.count}</td>
            <td className="px-4 py-2 w-1/2">
              <div className="bg-green-500 h-3 rounded" style={{ width: (item.count / max) * 100 + "%" }}></div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

const ManagerSection = ({ data }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-green-800 mb-3">Team overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
        <StatCard title="Pending approvals" value={data.pendingApprovals} />
        <StatCard title="On leave today" value={data.onLeaveToday.length} />
      </div>
      <Link to="/leaves/team" className="text-green-700 underline text-sm">
        Go to team requests
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">On leave today</h3>
          {data.onLeaveToday.length === 0 && <p className="text-sm text-gray-500">Nobody is on leave today</p>}
          {data.onLeaveToday.map((leave) => (
            <p key={leave._id} className="text-sm py-1">
              {leave.user.name} (till {formatDate(leave.toDate)})
            </p>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">On leave in next 7 days</h3>
          {data.onLeaveNext7Days.length === 0 && <p className="text-sm text-gray-500">No leaves in the next 7 days</p>}
          {data.onLeaveNext7Days.map((leave) => (
            <p key={leave._id} className="text-sm py-1">
              {leave.user.name} ({formatDate(leave.fromDate)} to {formatDate(leave.toDate)})
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmployeeSection = ({ data }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-green-800 mb-3">My leave balance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {data.balances.map((balance) => (
          <div key={balance._id} className="bg-white rounded-lg shadow p-4">
            <p className="font-medium text-gray-700">{balance.leaveType.name}</p>
            <p className="text-3xl font-bold text-green-700">{balance.remaining}</p>
            <p className="text-xs text-gray-500">remaining out of {balance.total} days</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Pending leaves" value={data.counts.pending} />
        <StatCard title="Approved leaves" value={data.counts.approved} />
        <StatCard title="Rejected leaves" value={data.counts.rejected} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Upcoming approved leaves</h3>
          {data.upcomingLeaves.length === 0 && <p className="text-sm text-gray-500">No upcoming leaves</p>}
          {data.upcomingLeaves.map((leave) => (
            <p key={leave._id} className="text-sm py-1">
              {leave.leaveType.name}: {formatDate(leave.fromDate)} to {formatDate(leave.toDate)} ({leave.days} days)
            </p>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Upcoming holidays</h3>
          {data.holidays.length === 0 && <p className="text-sm text-gray-500">No holidays added</p>}
          {data.holidays.map((holiday) => (
            <p key={holiday._id} className="text-sm py-1">
              {formatDate(holiday.date)} - {holiday.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(getStats);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800">Welcome, {user.name}</h1>
      <p className="text-gray-500 mb-6 capitalize">{user.role} dashboard</p>

      {data.role === "admin" && <AdminSection data={data} />}
      {data.role === "manager" && <ManagerSection data={data} />}
      {data.role !== "admin" && <EmployeeSection data={data} />}
    </div>
  );
};

export default Dashboard;
