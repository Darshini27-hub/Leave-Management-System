import { useState } from "react";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import { getMyLeaves, cancelLeave } from "../services/leaveService";
import { formatDate } from "../utils/formatDate";
import { statusOptions } from "../utils/constants";
import getError from "../utils/getError";
import Table from "../components/Table";
import Select from "../components/Select";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";

const MyLeaves = () => {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState(null);
  const { data, loading, error, reload } = useFetch(getMyLeaves, { status, page, limit: 10 });
  const leaves = data ? data.leaves : [];

  const handleFilter = (e) => {
    setStatus(e.target.value);
    setPage(1); 
  };

  const handleCancel = async () => {
    try {
      await cancelLeave(cancelId);
      toast.success("Leave cancelled");
      reload();
    } catch (err) {
      toast.error(getError(err));
    }
    setCancelId(null);
  };
  const canCancel = (leave) => {
    if (leave.status === "pending") return true;
    return leave.status === "approved" && new Date(leave.fromDate) > new Date();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold text-green-800">My Leaves</h1>
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
            headings={["Leave type", "From", "To", "Days", "Reason", "Status", "Manager comment", "Action"]}
            isEmpty={leaves.length === 0}
            emptyText="No leave requests found"
          >
            {leaves.map((leave) => (
              <tr key={leave._id} className="border-t hover:bg-green-50">
                <td className="px-4 py-3">{leave.leaveType ? leave.leaveType.name : "-"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(leave.fromDate)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(leave.toDate)}</td>
                <td className="px-4 py-3">
                  {leave.days}
                  {leave.isHalfDay ? " (half)" : ""}
                </td>
                <td className="px-4 py-3 min-w-48">{leave.reason}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={leave.status} />
                </td>
                <td className="px-4 py-3">{leave.reviewComment || "-"}</td>
                <td className="px-4 py-3">
                  {leave.status === "pending" && new Date(leave.fromDate) < new Date(new Date().toISOString().split("T")[0]) ? (
                    <span className="text-gray-500">Expired</span>
                  ) : (
                    canCancel(leave) && (
                      <Button color="red" onClick={() => setCancelId(leave._id)}>
                        Cancel
                      </Button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} totalPages={data ? data.totalPages : 1} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        open={cancelId !== null}
        title="Cancel leave"
        message="Are you sure you want to cancel this leave?"
        confirmText="Yes, cancel"
        onConfirm={handleCancel}
        onClose={() => setCancelId(null)}
      />
    </div>
  );
};

export default MyLeaves;
