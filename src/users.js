import React, { useState } from "react";
import { Edit, Trash2, Plus, X, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
  const navigate = useNavigate(); // 用來跳轉頁面
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = 新增
  const [form, setForm] = useState({ name: "", email: "", role: "User" });

  const openAddModal = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "User" });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) {
      alert("請填寫姓名與 Email");
      return;
    }
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u)));
    } else {
      const newUser = { ...form, id: Date.now() };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("確定要刪除這個使用者嗎？")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-indigo-50 p-8">
      {/* 標題區 + 按鈕 */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-indigo-700">用戶管理</h1>
        <div className="flex gap-2">
          {/* 回到儀表板按鈕 */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
          >
            <Home size={18} /> 儀表板
          </button>
          {/* 新增使用者按鈕 */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            <Plus size={18} /> 新增使用者
          </button>
        </div>
      </header>

      {/* 搜尋 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜尋姓名或 Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* 使用者列表 */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-indigo-100 text-left">
            <tr>
              <th className="px-6 py-3">姓名</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">角色</th>
              <th className="px-6 py-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-indigo-50 transition">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => openEditModal(user)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  沒有符合的使用者
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingUser ? "編輯使用者" : "新增使用者"}
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="姓名"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              <button
                onClick={handleSave}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
