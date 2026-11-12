import Modal from "./Modal";
import Button from "./Button";

const ConfirmModal = ({ open, title, message, onConfirm, onClose, confirmText = "Yes", color = "red" }) => {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-gray-700 mb-5">{message}</p>
      <div className="flex justify-end gap-2">
        <Button color="gray" onClick={onClose}>
          No
        </Button>
        <Button color={color} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
