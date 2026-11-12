const colors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span className={"px-2 py-1 rounded-full text-xs font-medium capitalize " + colors[status]}>{status}</span>
  );
};

export default StatusBadge;
