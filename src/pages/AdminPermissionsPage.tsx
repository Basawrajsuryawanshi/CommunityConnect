import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Save,
  X,
  Trash2,
  Edit3,
  ShieldCheck,
} from 'lucide-react'
import { Modal } from '../components/Modal'

type PermissionScope = 'Global' | 'Community' | 'Event'

type Permission = {
  id: string
  key: string
  description: string
  category: string
  scope: PermissionScope
  status: 'Active' | 'Inactive'
}

const initialPermissions: Permission[] = [
  {
    id: 'p-1',
    key: 'users.view',
    description: 'View registered users',
    category: 'Users',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-2',
    key: 'users.create',
    description: 'Create new user accounts',
    category: 'Users',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-3',
    key: 'users.edit',
    description: 'Edit user profile information',
    category: 'Users',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-4',
    key: 'users.delete',
    description: 'Delete user accounts',
    category: 'Users',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-5',
    key: 'users.suspend',
    description: 'Suspend or reactivate user accounts',
    category: 'Users',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-6',
    key: 'community.view',
    description: 'View communities',
    category: 'Community',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-7',
    key: 'community.create',
    description: 'Create new communities',
    category: 'Community',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-8',
    key: 'community.edit',
    description: 'Edit community information',
    category: 'Community',
    scope: 'Community',
    status: 'Active',
  },
  {
    id: 'p-9',
    key: 'community.delete',
    description: 'Delete or archive communities',
    category: 'Community',
    scope: 'Community',
    status: 'Active',
  },
  {
    id: 'p-10',
    key: 'community.members.view',
    description: 'View community members',
    category: 'Community',
    scope: 'Community',
    status: 'Active',
  },
  {
    id: 'p-11',
    key: 'community.members.manage',
    description: 'Manage community members',
    category: 'Community',
    scope: 'Community',
    status: 'Active',
  },
  {
    id: 'p-12',
    key: 'events.view',
    description: 'View community events',
    category: 'Events',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-13',
    key: 'events.create',
    description: 'Create new events',
    category: 'Events',
    scope: 'Community',
    status: 'Active',
  },
  {
    id: 'p-14',
    key: 'events.edit',
    description: 'Edit existing events',
    category: 'Events',
    scope: 'Community',
    status: 'Active',
  },
  {
    id: 'p-15',
    key: 'events.delete',
    description: 'Delete events',
    category: 'Events',
    scope: 'Community',
    status: 'Active',
  },
  {
    id: 'p-16',
    key: 'roles.view',
    description: 'View platform roles',
    category: 'Roles',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-17',
    key: 'roles.manage',
    description: 'Create and manage roles',
    category: 'Roles',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-18',
    key: 'permissions.view',
    description: 'View platform permissions',
    category: 'Permissions',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-19',
    key: 'permissions.manage',
    description: 'Create and manage permissions',
    category: 'Permissions',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-20',
    key: 'audit.view',
    description: 'View platform audit logs',
    category: 'Audit',
    scope: 'Global',
    status: 'Active',
  },
  {
    id: 'p-21',
    key: 'settings.manage',
    description: 'Manage platform settings',
    category: 'Settings',
    scope: 'Global',
    status: 'Active',
  },
]

const emptyPermission: Permission = {
  id: '',
  key: '',
  description: '',
  category: 'Users',
  scope: 'Global',
  status: 'Active',
}

const categories = [
  'Users',
  'Community',
  'Events',
  'Roles',
  'Permissions',
  'Audit',
  'Settings',
]

export function AdminPermissionsPage() {
  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [scopeFilter, setScopeFilter] = useState('All')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] =
    useState<string | null>(null)

  const [formState, setFormState] =
    useState<Permission>(emptyPermission)

  const filteredPermissions = useMemo(() => {
    return permissions.filter((permission) => {
      const searchText = [
        permission.key,
        permission.description,
        permission.category,
        permission.scope,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchText.includes(
        search.toLowerCase(),
      )

      const matchesCategory =
        categoryFilter === 'All' ||
        permission.category === categoryFilter

      const matchesScope =
        scopeFilter === 'All' ||
        permission.scope === scopeFilter

      return (
        matchesSearch &&
        matchesCategory &&
        matchesScope
      )
    })
  }, [
    permissions,
    search,
    categoryFilter,
    scopeFilter,
  ])

  const openAddPermission = () => {
    setEditingId(null)

    setFormState({
      ...emptyPermission,
      id: `p-${Date.now()}`,
    })

    setModalOpen(true)
  }

  const openEditPermission = (
    permission: Permission,
  ) => {
    setEditingId(permission.id)
    setFormState(permission)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setFormState(emptyPermission)
  }

  const handleFormChange = (
    field: keyof Permission,
    value: string,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSavePermission = () => {
    if (
      !formState.key.trim() ||
      !formState.description.trim()
    ) {
      return
    }

    if (editingId) {
      setPermissions((prev) =>
        prev.map((permission) =>
          permission.id === editingId
            ? formState
            : permission,
        ),
      )
    } else {
      setPermissions((prev) => [
        ...prev,
        formState,
      ])
    }

    closeModal()
  }

  const handleDeletePermission = (
    permissionId: string,
  ) => {
    setPermissions((prev) =>
      prev.filter(
        (permission) =>
          permission.id !== permissionId,
      ),
    )
  }

  const handleStatusChange = (
    permissionId: string,
    status: 'Active' | 'Inactive',
  ) => {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.id === permissionId
          ? {
              ...permission,
              status,
            }
          : permission,
      ),
    )
  }

  return (
    <div className="min-w-0 space-y-6">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="w-full rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>

              <span className="text-sm font-medium text-emerald-700">
                Access Control
              </span>
            </div>

            <h1 className="text-3xl font-semibold text-stone-900">
              Permission Management
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
              Create and manage platform permissions that
              control what users and administrators can access.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddPermission}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Permission
          </button>

        </div>
      </div>

      {/* ================================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================================= */}

      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-stone-500">
            Total Permissions
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {permissions.length}
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">
            Active Permissions
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {
              permissions.filter(
                (permission) =>
                  permission.status === 'Active',
              ).length
            }
          </p>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-sky-50 p-5">
          <p className="text-sm font-medium text-sky-700">
            Categories
          </p>

          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {categories.length}
          </p>
        </div>

      </div>

      {/* ================================================= */}
      {/* PERMISSION TABLE */}
      {/* ================================================= */}

      <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Permissions
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Manage individual permissions available to platform roles.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-2 sm:flex-row">

              {/* Search */}
              <div className="relative w-full sm:w-64">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search permissions..."
                  className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-300"
              >
                <option value="All">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              {/* Scope */}
              <select
                value={scopeFilter}
                onChange={(e) =>
                  setScopeFilter(e.target.value)
                }
                className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-300"
              >
                <option value="All">
                  All Scopes
                </option>

                <option value="Global">
                  Global
                </option>

                <option value="Community">
                  Community
                </option>

                <option value="Event">
                  Event
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-[900px] text-left text-sm">

            <thead className="bg-stone-50">

              <tr>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Permission
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Description
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Category
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Scope
                </th>

                <th className="px-5 py-4 font-semibold text-stone-600">
                  Status
                </th>

                <th className="px-5 py-4 text-center font-semibold text-stone-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-stone-200">

              {filteredPermissions.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-stone-500"
                  >
                    No permissions found.
                  </td>
                </tr>

              ) : (

                filteredPermissions.map(
                  (permission) => (
                    <tr
                      key={permission.id}
                      className="transition hover:bg-stone-50"
                    >

                      {/* Permission */}
                      <td className="px-5 py-4">

                        <code className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-semibold text-stone-800">
                          {permission.key}
                        </code>

                      </td>

                      {/* Description */}
                      <td className="px-5 py-4">

                        <span
                          className="block max-w-[300px] truncate text-stone-600"
                          title={permission.description}
                        >
                          {permission.description}
                        </span>

                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">

                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                          {permission.category}
                        </span>

                      </td>

                      {/* Scope */}
                      <td className="px-5 py-4">

                        <span className="text-stone-600">
                          {permission.scope}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              permission.id,
                              permission.status ===
                                'Active'
                                ? 'Inactive'
                                : 'Active',
                            )
                          }
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            permission.status ===
                            'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {permission.status}
                        </button>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditPermission(
                                permission,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeletePermission(
                                permission.id,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ),
                )

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* ================================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ================================================= */}

      <Modal
        open={modalOpen}
        title={
          editingId
            ? 'Edit Permission'
            : 'Add Permission'
        }
        onClose={closeModal}
        footer={
          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleSavePermission}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" />

              {editingId
                ? 'Save Changes'
                : 'Create Permission'}
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

          {/* Permission Key */}
          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Permission Key
            </label>

            <input
              type="text"
              value={formState.key}
              onChange={(e) =>
                handleFormChange(
                  'key',
                  e.target.value,
                )
              }
              placeholder="e.g. users.view"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />

            <p className="mt-1.5 text-xs text-stone-400">
              Use a structured format such as
              users.view or community.members.manage.
            </p>

          </div>

          {/* Description */}
          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Description
            </label>

            <textarea
              value={formState.description}
              onChange={(e) =>
                handleFormChange(
                  'description',
                  e.target.value,
                )
              }
              rows={3}
              placeholder="Describe what this permission allows..."
              className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />

          </div>

          {/* Category + Scope */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                Category
              </label>

              <select
                value={formState.category}
                onChange={(e) =>
                  handleFormChange(
                    'category',
                    e.target.value,
                  )
                }
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                Scope
              </label>

              <select
                value={formState.scope}
                onChange={(e) =>
                  handleFormChange(
                    'scope',
                    e.target.value,
                  )
                }
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              >
                <option value="Global">
                  Global
                </option>

                <option value="Community">
                  Community
                </option>

                <option value="Event">
                  Event
                </option>
              </select>

            </div>

          </div>

        </div>

      </Modal>

    </div>
  )
}