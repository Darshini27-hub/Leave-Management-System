import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import { getLeaveTypes } from "../services/leaveTypeService";
import { applyLeave, getBalance } from "../services/leaveService";
import getError from "../utils/getError";
import Select from "../components/Select";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";

const ApplyLeave = () => {
  const navigate = useNavigate();
  const now = new Date();
  const today = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  const [form, setForm] = useState({ leaveType: "", fromDate: "", toDate: "", reason: "", isHalfDay: false });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { data: types, loading } = useFetch(getLeaveTypes);
  const { data: balances } = useFetch(getBalance);
  if (loading) 
    return <Loader />;
  const typeOptions = types ? types.map((t) => ({ value: t._id, label: t.name })) : [];
  const selectedBalance = balances ? balances.find((b) => b.leaveType._id === form.leaveType) : null;
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newForm = { ...form, [name]: type === "checkbox" ? checked : value };
    if (newForm.isHalfDay && newForm.fromDate) {
      newForm.toDate = newForm.fromDate;
    }
    setForm(newForm);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.leaveType) 
      newErrors.leaveType = "Select a leave type";
    if (!form.fromDate) 
      newErrors.fromDate = "From date is required";
    if (!form.toDate) 
      newErrors.toDate = "To date is required";
    if (form.fromDate && form.fromDate < today) {
      newErrors.fromDate = "Past dates are not allowed";
    }
    if (form.fromDate && form.toDate && form.fromDate > form.toDate) {
      newErrors.toDate = "To date cannot be before From date";
    }
    if (form.isHalfDay && form.fromDate !== form.toDate) {
      newErrors.toDate = "Half day is allowed only for a single date";
    }
    if (form.reason.trim().length < 10) {
      newErrors.reason = "Reason must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) 
      return;
    setSaving(true);
    try {
      await applyLeave(form);
      toast.success("Leave applied successfully");
      navigate("/leaves/my");
    } catch (error) {
      toast.error(getError(error));
    }
    setSaving(false);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Apply Leave</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5">
        <Select
          label="Leave type"
          name="leaveType"
          value={form.leaveType}
          onChange={handleChange}
          options={typeOptions}
          placeholder="Select leave type"
          error={errors.leaveType}
        />
        {selectedBalance && (
          <p className="text-sm text-green-700 -mt-2 mb-4">Remaining balance: {selectedBalance.remaining} day(s)</p>
        )}

        <Input label="From date" name="fromDate" type="date" min={today} value={form.fromDate} onChange={handleChange} error={errors.fromDate} />
        <Input label="To date" name="toDate" type="date" min={today} value={form.toDate} onChange={handleChange} error={errors.toDate} />

        <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
          <input type="checkbox" name="isHalfDay" checked={form.isHalfDay} onChange={handleChange} />
          Half day (only for a single date)
        </label>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea
            name="reason"
            rows="3"
            value={form.reason}
            onChange={handleChange}
            placeholder="Write the reason for your leave"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
          {errors.reason && <p className="text-red-600 text-xs mt-1">{errors.reason}</p>}
        </div>

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Submitting..." : "Apply Leave"}
        </Button>
      </form>
    </div>
  );
};

export default ApplyLeave;
