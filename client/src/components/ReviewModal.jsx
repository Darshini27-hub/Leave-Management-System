import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import Button from "./Button";
import { reviewLeave } from "../services/leaveService";
import getError from "../utils/getError";

const ReviewModal = ({ leave, action, onClose, onDone }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (action === "rejected" && !comment.trim()) {
      setError("Comment is required when rejecting");
      return;
    }

    setSaving(true);
    try {
      await reviewLeave(leave._id, { status: action, comment });
      toast.success("Leave " + action);
      onDone();
    } catch (err) {
      toast.error(getError(err));
    }
    setSaving(false);
  };

  return (
    <Modal open={true} title={action === "approved" ? "Approve leave" : "Reject leave"} onClose={onClose}>
      <p className="text-sm text-gray-700 mb-1">
        {leave.user.name} - {leave.days} day(s)
      </p>
      <p className="text-sm text-gray-500 mb-3">Reason: {leave.reason}</p>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Comment {action === "rejected" ? "(required)" : "(optional)"}
      </label>
      <textarea
        rows="3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      ></textarea>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

      <div className="flex justify-end gap-2 mt-4">
        <Button color="gray" onClick={onClose}>
          Close
        </Button>
        <Button color={action === "approved" ? "green" : "red"} onClick={handleSubmit} disabled={saving}>
          {action === "approved" ? "Approve" : "Reject"}
        </Button>
      </div>
    </Modal>
  );
};

export default ReviewModal;
