import { useState } from "react";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import { getHolidays, addHoliday, deleteHoliday } from "../services/holidayService";
import { formatDate } from "../utils/formatDate";
import getError from "../utils/getError";
import Table from "../components/Table";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";

const Holidays = () => {
  const { data, loading, error, reload } = useFetch(getHolidays);
  const holidays = data || [];
  const [form, setForm] = useState({ name: "", date: "" });
  const [errors, setErrors] = useState({});
  const [target, setTarget] = useState(null);
  const handleAdd = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) 
        newErrors.name = "Holiday name is required";
    if (!form.date) 
        newErrors.date = "Date is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) 
        return;
    try {
      await addHoliday(form);
      toast.success("Holiday added");
      setForm({ name: "", date: "" });
      reload();
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHoliday(target._id);
      toast.success("Holiday removed");
      reload();
    } catch (err) {
      toast.error(getError(err));
    }
    setTarget(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-4">Holidays</h1>
      <form onSubmit={handleAdd} className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
        <Input label="Holiday name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input label="Date" name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} error={errors.date} />
        <div className="sm:mt-6">
          <Button type="submit">Add Holiday</Button>
        </div>
      </form>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <Table headings={["Date", "Name", "Action"]} isEmpty={holidays.length === 0} emptyText="No holidays added yet">
          {holidays.map((holiday) => (
            <tr key={holiday._id} className="border-t hover:bg-green-50">
              <td className="px-4 py-3">{formatDate(holiday.date)}</td>
              <td className="px-4 py-3">{holiday.name}</td>
              <td className="px-4 py-3">
                <Button color="red" onClick={() => setTarget(holiday)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <ConfirmModal
        open={target !== null}
        title="Remove holiday"
        message={target ? "Remove " + target.name + " from the holiday list?" : ""}
        confirmText="Yes, remove"
        onConfirm={handleDelete}
        onClose={() => setTarget(null)}
      />
    </div>
  );
};

export default Holidays;
