import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { formatDate } from "../utils/formatDate";
import { statusOptions } from "../utils/constants";
import Table from "./Table";
import Select from "./Select";
import Button from "./Button";
import Loader from "./Loader";
import Pagination from "./Pagination";
import StatusBadge from "./StatusBadge";
import ReviewModal from "./ReviewModal";

const LeaveRequestList = ({ title, fetchFunction }) => {
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState("");

  const { data, loading, error, reload } = useFetch(fetchFunction, { status, page, limit: 10 });
  const leaves = data ? data.leaves : [];

  const handleFilter = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const openModal = (leave, newAction) => {
    setSelected(leave);
    setAction(newAction);
  };

  const handleDone = () => {
    setSelected(null);
    reload();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-green-800">{title}</h1>
        <div className="w-full sm:w-48">
          <Select value={status} onChange={handleFilter} options={statusOptions} />
        </div>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <>
          <Table
            headings={["Employee", "Leave type", "From", "To", "Days", "Reason", "Status", "Action"]}
            isEmpty={leaves.length === 0}
            emptyText="No leave requests found"
          >
            {leaves.map((leave) => (
              <tr key={leave._id} className="border-t hover:bg-green-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{leave.user.name}</p>
                  <p className="text-xs text-gray-500">{leave.user.email}</p>
                </td>
                <td className="px-4 py-3">{leave.leaveType ? leave.leaveType.name : "-"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(leave.fromDate)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(leave.toDate)}</td>
                <td className="px-4 py-3">{leave.days}</td>
                <td className="px-4 py-3 min-w-48">{leave.reason}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={leave.status} />
                </td>
                <td className="px-4 py-3">
                  {leave.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button onClick={() => openModal(leave, "approved")}>Approve</Button>
                      <Button color="red" onClick={() => openModal(leave, "rejected")}>
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-500">{leave.reviewComment || "-"}</span>
                  )}
                </td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} totalPages={data ? data.totalPages : 1} onPageChange={setPage} />
        </>
      )}

      {selected && <ReviewModal leave={selected} action={action} onClose={() => setSelected(null)} onDone={handleDone} />}
    </div>
  );
};

export default LeaveRequestList;
