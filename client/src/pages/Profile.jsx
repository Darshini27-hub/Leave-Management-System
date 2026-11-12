import { useState } from "react";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import { getMe, changePassword } from "../services/authService";
import { formatDate } from "../utils/formatDate";
import getError from "../utils/getError";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";

const Profile = () => {
  const { data: profile, loading } = useFetch(getMe);

  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.oldPassword) newErrors.oldPassword = "Old password is required";
    if (form.newPassword.length < 6) newErrors.newPassword = "New password must be at least 6 characters";
    if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    try {
      await changePassword(form.oldPassword, form.newPassword);
      toast.success("Password changed");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(getError(err));
    }
    setSaving(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-bold text-green-800 mb-3">My Profile</h2>
        <p className="text-sm py-1"><b>Name:</b> {profile.name}</p>
        <p className="text-sm py-1"><b>Email:</b> {profile.email}</p>
        <p className="text-sm py-1 capitalize"><b>Role:</b> {profile.role}</p>
        <p className="text-sm py-1"><b>Department:</b> {profile.department || "-"}</p>
        <p className="text-sm py-1"><b>Manager:</b> {profile.manager ? profile.manager.name : "-"}</p>
        <p className="text-sm py-1"><b>Joining date:</b> {profile.joiningDate ? formatDate(profile.joiningDate) : "-"}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-bold text-green-800 mb-3">Change Password</h2>
        <Input label="Old password" name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange} error={errors.oldPassword} />
        <Input label="New password" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} error={errors.newPassword} />
        <Input label="Confirm new password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
