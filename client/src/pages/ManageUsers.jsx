import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useFetch from "../hooks/useFetch";
import { getUsers, updateUserStatus } from "../services/userService";
import { roleOptions } from "../utils/constants";
import getError from "../utils/getError";
import Table from "../components/Table";
import Select from "../components/Select";
import Button from "../components/Button";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [departmentText, setDepartmentText] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null); 
  const { data, loading, error, reload } = useFetch(getUsers, { search, role, department, page, limit: 10 });
  const users = data ? data.users : [];
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchText);
    setDepartment(departmentText);
    setPage(1);
  };

  const handleRole = (e) => {
    setRole(e.target.value);
    setPage(1);
  };

  const handleStatus = async () => {
    try {
      await updateUserStatus(target._id, !target.isActive);
      toast.success(target.isActive ? "User deactivated" : "User activated");
      reload();
    } catch (err) {
      toast.error(getError(err));
    }
    setTarget(null);
  };

  const roleFilterOptions = [{ value: "", label: "All roles" }, ...roleOptions];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-green-800">Manage Users</h1>
        <Button onClick={() => navigate("/admin/users/new")}>+ Add User</Button>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search name or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
        />
        <input
          type="text"
          placeholder="Department"
          value={departmentText}
          onChange={(e) => setDepartmentText(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
        />
        <Select value={role} onChange={handleRole} options={roleFilterOptions} />
        <div>
          <Button type="submit">Search</Button>
        </div>
      </form>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <>
          <Table
            headings={["Name", "Email", "Role", "Department", "Manager", "Status", "Actions"]}
            isEmpty={users.length === 0}
            emptyText="No users found"
          >
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-green-50">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">{u.department || "-"}</td>
                <td className="px-4 py-3">{u.manager ? u.manager.name : "-"}</td>
                <td className="px-4 py-3">
                  {u.isActive ? (
                    <span className="text-green-700 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button color="gray" onClick={() => navigate("/admin/users/" + u._id)}>
                      Edit
                    </Button>
                    <Button color={u.isActive ? "red" : "green"} onClick={() => setTarget(u)}>
                      {u.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} totalPages={data ? data.totalPages : 1} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        open={target !== null}
        title={target && target.isActive ? "Deactivate user" : "Activate user"}
        message={
          target
            ? "Are you sure you want to " + (target.isActive ? "deactivate " : "activate ") + target.name + "?"
            : ""
        }
        confirmText="Yes"
        color={target && target.isActive ? "red" : "green"}
        onConfirm={handleStatus}
        onClose={() => setTarget(null)}
      />
    </div>
  );
};

export default ManageUsers;
