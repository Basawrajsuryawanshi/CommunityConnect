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
  const {
    adminRoles,
    addAdminRole,
    updateAdminRole,
    deleteAdminRole,
  } = useApp()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formState, setFormState] = useState<AdminRole>(emptyRole)

  const filteredRoles = useMemo(
    () =>
      adminRoles.filter((role) =>
        [role.name, role.description]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [adminRoles, search],
  )

  const openAddRole = () => {
    setEditingId(null)
    setFormState({
      ...emptyRole,
      id: `r-${Date.now()}`,
    })
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

  const handleFormChange = (
    field: keyof AdminRole,
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveRole = () => {
    if (
      !formState.name.trim() ||
      !formState.description.trim()
    ) {
      return
    }

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
    <div className="w-full min-w-0 space-y-6">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="w-full rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">
            <h1 className="text-3xl font-semibold text-stone-900">
              Role Management
            </h1>

            <p className="mt-2 text-sm text-stone-600">
              Create, update, and remove platform roles.
              Assign the right access levels for each role.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddRole}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Role
          </button>

        </div>
      </div>

      {/* ================================================= */}
      {/* ROLE TABLE */}
      {/* ================================================= */}

      <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-stone-900">
                Roles Table
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Review role names and descriptions for the platform.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72 shrink-0">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles..."
                className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              />

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <div className="w-full">

          <table className="w-full table-fixed divide-y divide-stone-200 text-left text-sm">

            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[55%]" />
              <col className="w-[20%]" />
            </colgroup>

            {/* Table Header */}
            <thead className="bg-stone-50">

              <tr>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Role Name
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Description
                </th>

                <th className="px-5 py-4 text-center font-semibold text-stone-600">
                  Actions
                </th>

              </tr>

            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-stone-200 bg-white">

              {filteredRoles.length === 0 ? (

                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-sm text-stone-500"
                  >
                    No roles found.
                  </td>
                </tr>

              ) : (

                filteredRoles.map((role) => (

                  <tr
                    key={role.id}
                    className="transition hover:bg-stone-50"
                  >

                    {/* Role Name */}
                    <td className="px-5 py-4 align-middle">

                      <div
                        className="truncate font-medium text-stone-900"
                        title={role.name}
                      >
                        {role.name}
                      </div>

                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 align-middle">

                      <div
                        className="truncate text-stone-600"
                        title={role.description}
                      >
                        {role.description}
                      </div>

                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 align-middle">

                      <div className="flex items-center justify-center gap-2">

                        <button
                          type="button"
                          onClick={() => openEditRole(role)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteRole(role.id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
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

      {/* ================================================= */}
      {/* ADD / EDIT ROLE MODAL */}
      {/* ================================================= */}

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
              <Save className="h-4 w-4" />

              {editingId
                ? 'Save Changes'
                : 'Create Role'}
            </button>

            <button
              type="button"
              onClick={closeModal}
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>

          </div>
        }
      >

        <div className="space-y-4">

          {/* Role Name */}
          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Role Name
            </label>

            <input
              type="text"
              value={formState.name}
              onChange={(e) =>
                handleFormChange(
                  'name',
                  e.target.value,
                )
              }
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
              placeholder="e.g. CommunityAdmin"
            />

          </div>

          {/* Role Description */}
          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Role Description
            </label>

            <textarea
              value={formState.description}
              onChange={(e) =>
                handleFormChange(
                  'description',
                  e.target.value,
                )
              }
              className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
              rows={4}
              placeholder="Describe the permissions and responsibilities for this role"
            />

          </div>

        </div>

      </Modal>

    </div>
  )
}