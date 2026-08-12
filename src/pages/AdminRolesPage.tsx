import { useMemo, useState } from 'react'
import { Search, Plus, Save, X, Trash2, Edit3 } from 'lucide-react'
import type { AdminRole } from '../types'
import { useApp } from '../context/AppContext'
import { Modal } from '../components/Modal'

const emptyRole: AdminRole = {
  id: '',
  name: '',
  description: '',
}

export function AdminRolesPage() {
  const { adminRoles, addAdminRole, updateAdminRole, deleteAdminRole } = useApp()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<AdminRole>(emptyRole)

  const filteredRoles = useMemo(
    () =>
      adminRoles.filter((role) =>
        [role.name, role.description].join(' ').toLowerCase().includes(search.toLowerCase()),
      ),
    [adminRoles, search],
  )

  const openAddRole = () => {
    setEditingId(null)
    setFormState({ ...emptyRole, id: `r-${Date.now()}` })
    setModalOpen(true)
  }

  const openEditRole = (role: AdminRole) => {
    setEditingId(role.id)
    setFormState(role)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setFormState(emptyRole)
  }

  const handleFormChange = (field: keyof AdminRole, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveRole = () => {
    if (!formState.name.trim() || !formState.description.trim()) return

    if (editingId) {
      updateAdminRole(formState)
    } else {
      addAdminRole(formState)
    }

    closeModal()
  }

  const handleDeleteRole = (roleId: string) => {
    deleteAdminRole(roleId)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900">Role Management</h1>
            <p className="mt-2 text-sm text-stone-600">
              Create, update, and remove platform roles. Assign the right access levels for each role.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddRole}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> Add Role
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
        <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-stone-200">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">Role details</h2>
              <p className="mt-1 text-sm text-stone-500">Manage role definitions from a modal workflow.</p>
            </div>
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-8 text-sm leading-6 text-stone-600">
            Use the Add Role button to create a role or edit existing definitions from the table.
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 bg-stone-50 px-6 py-5">
            <h2 className="text-xl font-semibold text-stone-900">Roles table</h2>
            <p className="mt-1 text-sm text-stone-500">Review role names and descriptions for the platform.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
              <thead className="bg-stone-50 text-stone-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Role Name</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-sm text-stone-500">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr key={role.id}>
                      <td className="px-6 py-4 align-top">
                        <span className="font-medium text-stone-900">{role.name}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-stone-600">{role.description}</span>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditRole(role)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRole(role.id)}
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
        title={editingId ? 'Edit Role' : 'Add Role'}
        onClose={closeModal}
        footer={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveRole}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" /> {editingId ? 'Save Changes' : 'Create Role'}
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
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Role name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
              placeholder="e.g. CommunityAdmin"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Role description</label>
            <textarea
              value={formState.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
              rows={4}
              placeholder="Describe the permissions and responsibilities for this role"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
