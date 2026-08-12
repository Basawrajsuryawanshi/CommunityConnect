import { useMemo, useState } from 'react'
import { Search, Plus, Edit3, Trash2, Save, X } from 'lucide-react'
import type { AdminUser } from '../types'
import type { RoleName } from '../auth/auth'
import { useApp } from '../context/AppContext'
import { Modal } from '../components/Modal'

const roleOptions: RoleName[] = ['SuperAdmin', 'CommunityAdmin', 'EventOrganizer', 'Member']

const emptyUser: AdminUser = {
  id: '',
  name: '',
  email: '',
  role: 'Member',
  batch: '',
  jnv: '',
  profession: '',
  company: '',
  city: '',
}

export function AdminUsersPage() {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser } = useApp()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<AdminUser>(emptyUser)

  const filteredUsers = useMemo(
    () =>
      adminUsers.filter((user) =>
        [user.name, user.email, user.role, user.company, user.city]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, adminUsers],
  )

  const openAddUser = () => {
    setEditingId(null)
    setFormState({ ...emptyUser, id: `u-${Date.now()}` })
    setModalOpen(true)
  }

  const openEditUser = (user: AdminUser) => {
    setEditingId(user.id)
    setFormState(user)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setFormState(emptyUser)
  }

  const handleFormChange = (field: keyof AdminUser, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveUser = () => {
    if (!formState.name.trim() || !formState.email.trim()) return

    if (editingId) {
      updateAdminUser(formState)
    } else {
      addAdminUser(formState)
    }

    closeModal()
  }

  const handleDeleteUser = (userId: string) => {
    deleteAdminUser(userId)
  }

  const handleRoleChange = (user: AdminUser, nextRole: RoleName) => {
    updateAdminUser({ ...user, role: nextRole })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900">User Management</h1>
            <p className="mt-2 text-sm text-stone-600">
              Manage user accounts, assign roles like Community Admin, Event Organizer, or Member, and remove users as needed.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddUser}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> Add User
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
        <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">User details</h2>
              <p className="mt-1 text-sm text-stone-500">Add or edit user records from this panel.</p>
            </div>
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-8 text-sm leading-6 text-stone-600">
            Manage users with the Add User button and the table below. Open the modal to create or update a user record, and use inline role selectors for quick role updates.
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 bg-stone-50 px-6 py-5">
            <h2 className="text-xl font-semibold text-stone-900">User table</h2>
            <p className="mt-1 text-sm text-stone-500">Review all users and update their role assignments instantly.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
              <thead className="bg-stone-50 text-stone-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Batch</th>
                  <th className="px-6 py-4 font-medium">JNV</th>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">City</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-stone-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 align-top font-medium text-stone-900">{user.name}</td>
                      <td className="px-6 py-4 align-top text-stone-600">{user.email}</td>
                      <td className="px-6 py-4 align-top text-stone-600">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user, e.target.value as RoleName)}
                          className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 align-top text-stone-600">{user.batch}</td>
                      <td className="px-6 py-4 align-top text-stone-600">{user.jnv}</td>
                      <td className="px-6 py-4 align-top text-stone-600">{user.company}</td>
                      <td className="px-6 py-4 align-top text-stone-600">{user.city}</td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditUser(user)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit User' : 'Add User'}
        onClose={closeModal}
        footer={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveUser}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" /> {editingId ? 'Save Changes' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Role</label>
            <select
              value={formState.role}
              onChange={(e) => handleFormChange('role', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Batch</label>
            <input
              type="text"
              value={formState.batch}
              onChange={(e) => handleFormChange('batch', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">JNV</label>
            <input
              type="text"
              value={formState.jnv}
              onChange={(e) => handleFormChange('jnv', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">City</label>
            <input
              type="text"
              value={formState.city}
              onChange={(e) => handleFormChange('city', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Profession</label>
            <input
              type="text"
              value={formState.profession}
              onChange={(e) => handleFormChange('profession', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Company</label>
            <input
              type="text"
              value={formState.company}
              onChange={(e) => handleFormChange('company', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
