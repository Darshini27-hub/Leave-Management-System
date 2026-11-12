import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import { getUsers, getUser, createUser, updateUser } from "../services/userService";
import { roleOptions } from "../utils/constants";
import getError from "../utils/getError";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import Loader from "../components/Loader";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "employee",
  department: "",
  manager: "",
  joiningDate: "",
};

const UserForm = () => {
  const { id } = useParams(); // id is there only when editing
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(id ? true : false);

  const { data: managerData } = useFetch(getUsers, { role: "manager", limit: 100 });
  const managers = managerData ? managerData.users.filter((m) => m._id !== id) : [];
  const managerOptions = managers.map((m) => ({ value: m._id, label: m.name }));

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      try {
        const res = await getUser(id);
        const u = res.data.data;
        setForm({
          name: u.name,
          email: u.email,
          password: "",
          role: u.role,
          department: u.department || "",
          manager: u.manager ? u.manager._id : "",
          joiningDate: u.joiningDate ? u.joiningDate.split("T")[0] : "",
        });
      } catch (err) {
        toast.error(getError(err));
        navigate("/admin/users");
      }
      setLoading(false);
    };
    loadUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }
    // password only needed when creating
    if (!id && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { ...form };
    if (!data.joiningDate) delete data.joiningDate;
    if (id) delete data.password; // password is not changed here

    setSaving(true);
    try {
      if (id) {
        await updateUser(id, data);
        toast.success("User updated");
      } else {
        await createUser(data);
        toast.success("User created");
      }
      navigate("/admin/users");
    } catch (err) {
      toast.error(getError(err));
    }
    setSaving(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-green-800 mb-4">{id ? "Edit User" : "Add User"}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5">
        <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
        {!id && (
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
        )}
        <Select label="Role" name="role" value={form.role} onChange={handleChange} options={roleOptions} />
        <Input label="Department" name="department" value={form.department} onChange={handleChange} />
        <Select
          label="Manager"
          name="manager"
          value={form.manager}
          onChange={handleChange}
          options={managerOptions}
          placeholder="No manager"
        />
        <Input label="Joining date" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button color="gray" onClick={() => navigate("/admin/users")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
