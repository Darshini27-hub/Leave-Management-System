import { useState } from "react";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import {getLeaveTypes,createLeaveType,updateLeaveType,updateLeaveTypeStatus,} from "../services/leaveTypeService";
import getError from "../utils/getError";
import Table from "../components/Table";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";

const LeaveTypes = () => {
  const { data, loading, error, reload } = useFetch(getLeaveTypes, { all: "true" });
  const types = data || [];
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null means adding a new one
  const [form, setForm] = useState({ name: "", yearlyDays: "" });
  const [errors, setErrors] = useState({});
  const [target, setTarget] = useState(null);
  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", yearlyDays: "" });
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (type) => {
    setEditing(type);
    setForm({ name: type.name, yearlyDays: type.yearlyDays });
    setErrors({});
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) 
        newErrors.name = "Name is required";
    if (form.yearlyDays === "" || Number(form.yearlyDays) < 0) 
        newErrors.yearlyDays = "Enter 0 or more days";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) 
        return;

    try {
      if (editing) {
        await updateLeaveType(editing._id, form);
        toast.success("Leave type updated");
      } else {
        await createLeaveType(form);
        toast.success("Leave type created");
      }
      setShowForm(false);
      reload();
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleStatus = async () => {
    try {
      await updateLeaveTypeStatus(target._id, !target.isActive);
      toast.success("Leave type updated");
      reload();
    } catch (err) {
      toast.error(getError(err));
    }
    setTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-800">Leave Types</h1>
        <Button onClick={openAdd}>+ Add Leave Type</Button>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <Table headings={["Name", "Yearly days", "Status", "Actions"]} isEmpty={types.length === 0} emptyText="No leave types found">
          {types.map((type) => (
            <tr key={type._id} className="border-t hover:bg-green-50">
              <td className="px-4 py-3">{type.name}</td>
              <td className="px-4 py-3">{type.yearlyDays}</td>
              <td className="px-4 py-3">
                {type.isActive ? (
                  <span className="text-green-700 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button color="gray" onClick={() => openEdit(type)}>
                    Edit
                  </Button>
                  <Button color={type.isActive ? "red" : "green"} onClick={() => setTarget(type)}>
                    {type.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal open={showForm} title={editing ? "Edit Leave Type" : "Add Leave Type"} onClose={() => setShowForm(false)}>
        <form onSubmit={handleSave}>
          <Input label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input
            label="Yearly allowed days"
            name="yearlyDays"
            type="number"
            value={form.yearlyDays}
            onChange={(e) => setForm({ ...form, yearlyDays: e.target.value })}
            error={errors.yearlyDays}
          />
          <div className="flex justify-end gap-2">
            <Button color="gray" onClick={() => setShowForm(false)}>
              Close
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={target !== null}
        title={target && target.isActive ? "Deactivate leave type" : "Activate leave type"}
        message={target ? "Are you sure you want to change the status of " + target.name + "?" : ""}
        color={target && target.isActive ? "red" : "green"}
        onConfirm={handleStatus}
        onClose={() => setTarget(null)}
      />
    </div>
  );
};

export default LeaveTypes;
