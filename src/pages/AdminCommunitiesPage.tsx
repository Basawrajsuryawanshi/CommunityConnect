import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Save,
  X,
  Trash2,
  Edit3,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  Clock3,
  Ban,
  Eye,
} from 'lucide-react'
import { Modal } from '../components/Modal'

type CommunityStatus =
  | 'Active'
  | 'Pending'
  | 'Suspended'

type Community = {
  id: string
  name: string
  description: string
  admin: string
  adminEmail: string
  state: string
  district: string
  members: number
  status: CommunityStatus
  createdAt: string
}

const initialCommunities: Community[] = [
  {
    id: 'c-1',
    name: 'JNV Bidar',
    description:
      'Community for Jawahar Navodaya Vidyalaya Bidar alumni.',
    admin: 'Rahul Kumar',
    adminEmail: 'rahul@example.com',
    state: 'Karnataka',
    district: 'Bidar',
    members: 450,
    status: 'Active',
    createdAt: '12 Jan 2026',
  },
  {
    id: 'c-2',
    name: 'JNV Bangalore',
    description:
      'JNV alumni community for members currently living in Bangalore.',
    admin: 'Anil Sharma',
    adminEmail: 'anil@example.com',
    state: 'Karnataka',
    district: 'Bangalore Urban',
    members: 320,
    status: 'Active',
    createdAt: '18 Jan 2026',
  },
  {
    id: 'c-3',
    name: 'JNV Mysore',
    description:
      'Alumni community for JNV Mysore members.',
    admin: 'Priya Singh',
    adminEmail: 'priya@example.com',
    state: 'Karnataka',
    district: 'Mysore',
    members: 210,
    status: 'Pending',
    createdAt: '02 Feb 2026',
  },
  {
    id: 'c-4',
    name: 'JNV Kalaburagi',
    description:
      'Community for JNV alumni from Kalaburagi.',
    admin: 'Vijay Kumar',
    adminEmail: 'vijay@example.com',
    state: 'Karnataka',
    district: 'Kalaburagi',
    members: 185,
    status: 'Active',
    createdAt: '05 Feb 2026',
  },
  {
    id: 'c-5',
    name: 'JNV Hyderabad',
    description:
      'JNV alumni community for Hyderabad members.',
    admin: 'Suresh Reddy',
    adminEmail: 'suresh@example.com',
    state: 'Telangana',
    district: 'Hyderabad',
    members: 275,
    status: 'Active',
    createdAt: '12 Feb 2026',
  },
  {
    id: 'c-6',
    name: 'JNV Pune',
    description:
      'JNV alumni community for members living in Pune.',
    admin: 'Amit Patil',
    adminEmail: 'amit@example.com',
    state: 'Maharashtra',
    district: 'Pune',
    members: 140,
    status: 'Suspended',
    createdAt: '20 Feb 2026',
  },
  {
    id: 'c-7',
    name: 'JNV Delhi',
    description:
      'JNV alumni community for members in Delhi NCR.',
    admin: 'Neha Sharma',
    adminEmail: 'neha@example.com',
    state: 'Delhi',
    district: 'New Delhi',
    members: 390,
    status: 'Active',
    createdAt: '28 Feb 2026',
  },
  {
    id: 'c-8',
    name: 'JNV Chennai',
    description:
      'Community for JNV alumni based in Chennai.',
    admin: 'Arun Kumar',
    adminEmail: 'arun@example.com',
    state: 'Tamil Nadu',
    district: 'Chennai',
    members: 125,
    status: 'Pending',
    createdAt: '04 Mar 2026',
  },
]

const emptyCommunity: Community = {
  id: '',
  name: '',
  description: '',
  admin: '',
  adminEmail: '',
  state: '',
  district: '',
  members: 0,
  status: 'Pending',
  createdAt: '',
}

const states = [
  'Karnataka',
  'Telangana',
  'Maharashtra',
  'Delhi',
  'Tamil Nadu',
  'Kerala',
  'Andhra Pradesh',
]

export function AdminCommunitiesPage() {
  const [communities, setCommunities] =
    useState<Community[]>(initialCommunities)

  const [search, setSearch] = useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  const [stateFilter, setStateFilter] =
    useState('All')

  const [modalOpen, setModalOpen] =
    useState(false)

  const [editingId, setEditingId] =
    useState<string | null>(null)

  const [viewModalOpen, setViewModalOpen] =
    useState(false)

  const [selectedCommunity, setSelectedCommunity] =
    useState<Community | null>(null)

  const [formState, setFormState] =
    useState<Community>(emptyCommunity)

  // --------------------------------------------------
  // Filtering
  // --------------------------------------------------

  const filteredCommunities = useMemo(() => {
    return communities.filter((community) => {
      const searchText = [
        community.name,
        community.description,
        community.admin,
        community.adminEmail,
        community.state,
        community.district,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = searchText.includes(
        search.toLowerCase(),
      )

      const matchesStatus =
        statusFilter === 'All' ||
        community.status === statusFilter

      const matchesState =
        stateFilter === 'All' ||
        community.state === stateFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesState
      )
    })
  }, [
    communities,
    search,
    statusFilter,
    stateFilter,
  ])

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const totalCommunities = communities.length

  const activeCommunities = communities.filter(
    (community) =>
      community.status === 'Active',
  ).length

  const pendingCommunities = communities.filter(
    (community) =>
      community.status === 'Pending',
  ).length

  const suspendedCommunities = communities.filter(
    (community) =>
      community.status === 'Suspended',
  ).length

  const totalMembers = communities.reduce(
    (total, community) =>
      total + community.members,
    0,
  )

  // --------------------------------------------------
  // Add Community
  // --------------------------------------------------

  const openAddCommunity = () => {
    setEditingId(null)

    setFormState({
      ...emptyCommunity,
      id: `c-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        },
      ),
    })

    setModalOpen(true)
  }

  // --------------------------------------------------
  // Edit Community
  // --------------------------------------------------

  const openEditCommunity = (
    community: Community,
  ) => {
    setEditingId(community.id)
    setFormState({ ...community })
    setModalOpen(true)
  }

  // --------------------------------------------------
  // View Community
  // --------------------------------------------------

  const openViewCommunity = (
    community: Community,
  ) => {
    setSelectedCommunity(community)
    setViewModalOpen(true)
  }

  // --------------------------------------------------
  // Close modal
  // --------------------------------------------------

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setFormState(emptyCommunity)
  }

  // --------------------------------------------------
  // Form change
  // --------------------------------------------------

  const handleFormChange = (
    field: keyof Community,
    value: string | number,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // --------------------------------------------------
  // Save
  // --------------------------------------------------

  const handleSaveCommunity = () => {
    if (
      !formState.name.trim() ||
      !formState.description.trim() ||
      !formState.admin.trim() ||
      !formState.state.trim() ||
      !formState.district.trim()
    ) {
      return
    }

    if (editingId) {
      setCommunities((prev) =>
        prev.map((community) =>
          community.id === editingId
            ? formState
            : community,
        ),
      )
    } else {
      setCommunities((prev) => [
        ...prev,
        formState,
      ])
    }

    closeModal()
  }

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDeleteCommunity = (
    communityId: string,
  ) => {
    setCommunities((prev) =>
      prev.filter(
        (community) =>
          community.id !== communityId,
      ),
    )
  }

  // --------------------------------------------------
  // Status
  // --------------------------------------------------

  const handleStatusChange = (
    communityId: string,
    status: CommunityStatus,
  ) => {
    setCommunities((prev) =>
      prev.map((community) =>
        community.id === communityId
          ? {
              ...community,
              status,
            }
          : community,
      ),
    )
  }

  // --------------------------------------------------
  // Status badge
  // --------------------------------------------------

  const getStatusBadge = (
    status: CommunityStatus,
  ) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </span>
      )
    }

    if (status === 'Pending') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <Clock3 className="h-3.5 w-3.5" />
          Pending
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
        <Ban className="h-3.5 w-3.5" />
        Suspended
      </span>
    )
  }

  return (
   <div className="w-full min-w-0 max-w-full space-y-6 overflow-x-hidden">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="w-full rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
                <Building2 className="h-4 w-4 text-emerald-600" />
              </div>

              <span className="text-sm font-medium text-emerald-700">
                Community Administration
              </span>

            </div>

            <h1 className="text-3xl font-semibold text-stone-900">
              Community Management
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
              Review, approve, manage, and monitor all
              communities across CommunityConnect.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddCommunity}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Community
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* STAT CARDS */}
      {/* ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {/* Total */}
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <p className="text-sm font-medium text-stone-500">
              Total Communities
            </p>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>

          </div>

          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {totalCommunities}
          </p>

        </div>

        {/* Active */}
        <div className="rounded-3xl border border-stone-200 bg-emerald-50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm font-medium text-emerald-700">
              Active
            </p>

            <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          </div>

          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {activeCommunities}
          </p>

        </div>

        {/* Pending */}
        <div className="rounded-3xl border border-stone-200 bg-amber-50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm font-medium text-amber-700">
              Pending
            </p>

            <Clock3 className="h-5 w-5 text-amber-600" />

          </div>

          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {pendingCommunities}
          </p>

        </div>

        {/* Suspended */}
        <div className="rounded-3xl border border-stone-200 bg-rose-50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm font-medium text-rose-700">
              Suspended
            </p>

            <Ban className="h-5 w-5 text-rose-600" />

          </div>

          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {suspendedCommunities}
          </p>

        </div>

        {/* Members */}
        <div className="rounded-3xl border border-stone-200 bg-purple-50 p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm font-medium text-purple-700">
              Total Members
            </p>

            <Users className="h-5 w-5 text-purple-600" />

          </div>

          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {totalMembers.toLocaleString()}
          </p>

        </div>

      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                Communities
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Manage all registered communities and their administrators.
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
                  placeholder="Search communities..."
                  className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-300"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Suspended">
                  Suspended
                </option>
              </select>

              {/* State */}
              <select
                value={stateFilter}
                onChange={(e) =>
                  setStateFilter(e.target.value)
                }
                className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-300"
              >
                <option value="All">
                  All States
                </option>

                {states.map((state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

        {/* Table */}
       <div className="w-full max-w-full overflow-hidden">

  <table className="w-full table-fixed text-left text-sm">

           <thead className="bg-stone-50">
  <tr>
    <th className="w-[20%] px-4 py-4 font-semibold text-stone-600">
      Community
    </th>

    <th className="w-[15%] px-4 py-4 font-semibold text-stone-600">
      Admin
    </th>

    <th className="w-[14%] px-4 py-4 font-semibold text-stone-600">
      Location
    </th>

    <th className="w-[8%] px-4 py-4 font-semibold text-stone-600">
      Members
    </th>

    <th className="w-[10%] px-4 py-4 font-semibold text-stone-600">
      Status
    </th>

    <th className="w-[10%] px-4 py-4 font-semibold text-stone-600">
      Created
    </th>

    <th className="w-[23%] px-4 py-4 text-center font-semibold text-stone-600">
      Actions
    </th>
  </tr>
</thead>

            <tbody className="divide-y divide-stone-200">

              {filteredCommunities.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-stone-500"
                  >
                    No communities found.
                  </td>
                </tr>

              ) : (

                filteredCommunities.map(
                  (community) => (
                    <tr
                      key={community.id}
                      className="transition hover:bg-stone-50"
                    >

                      {/* Community */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                            <Building2 className="h-5 w-5 text-emerald-600" />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-stone-900">
                              {community.name}
                            </p>

                            <p
                              className="mt-1 max-w-[220px] truncate text-xs text-stone-500"
                              title={community.description}
                            >
                              {community.description}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Admin */}
                      <td className="px-5 py-4">

                        <p className="font-medium text-stone-800">
                          {community.admin}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-xs text-stone-500">
                          {community.adminEmail}
                        </p>

                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1.5">

                          <MapPin className="h-3.5 w-3.5 text-stone-400" />

                          <div>
                            <p className="font-medium text-stone-700">
                              {community.district}
                            </p>

                            <p className="text-xs text-stone-500">
                              {community.state}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Members */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Users className="h-4 w-4 text-stone-400" />

                          <span className="font-semibold text-stone-800">
                            {community.members.toLocaleString()}
                          </span>

                        </div>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {getStatusBadge(
                          community.status,
                        )}
                      </td>

                      {/* Created */}
                      <td className="whitespace-nowrap px-5 py-4 text-stone-500">
                        {community.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex flex-wrap items-center justify-center gap-1.5">

                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              openViewCommunity(
                                community,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() =>
                              openEditCommunity(
                                community,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          {/* Status */}
                          {community.status ===
                            'Pending' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  community.id,
                                  'Active',
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </button>
                          )}

                          {community.status ===
                            'Active' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  community.id,
                                  'Suspended',
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Suspend
                            </button>
                          )}

                          {community.status ===
                            'Suspended' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  community.id,
                                  'Active',
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Activate
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteCommunity(
                                community.id,
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
      {/* ADD / EDIT COMMUNITY MODAL */}
      {/* ================================================= */}

      <Modal
        open={modalOpen}
        title={
          editingId
            ? 'Edit Community'
            : 'Add Community'
        }
        onClose={closeModal}
        footer={
          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleSaveCommunity}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Save className="h-4 w-4" />

              {editingId
                ? 'Save Changes'
                : 'Create Community'}
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

          {/* Name */}
          <div>

            <label className="mb-2 block text-sm font-medium text-stone-700">
              Community Name
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
              placeholder="e.g. JNV Bidar"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />

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
              placeholder="Describe this community..."
              className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
            />

          </div>

          {/* Admin */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                Community Admin
              </label>

              <input
                type="text"
                value={formState.admin}
                onChange={(e) =>
                  handleFormChange(
                    'admin',
                    e.target.value,
                  )
                }
                placeholder="Admin name"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                Admin Email
              </label>

              <input
                type="email"
                value={formState.adminEmail}
                onChange={(e) =>
                  handleFormChange(
                    'adminEmail',
                    e.target.value,
                  )
                }
                placeholder="admin@example.com"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />

            </div>

          </div>

          {/* Location */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                State
              </label>

              <select
                value={formState.state}
                onChange={(e) =>
                  handleFormChange(
                    'state',
                    e.target.value,
                  )
                }
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              >
                <option value="">
                  Select State
                </option>

                {states.map((state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                District
              </label>

              <input
                type="text"
                value={formState.district}
                onChange={(e) =>
                  handleFormChange(
                    'district',
                    e.target.value,
                  )
                }
                placeholder="District"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />

            </div>

          </div>

          {/* Members */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                Members
              </label>

              <input
                type="number"
                min="0"
                value={formState.members}
                onChange={(e) =>
                  handleFormChange(
                    'members',
                    Number(e.target.value),
                  )
                }
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-stone-700">
                Status
              </label>

              <select
                value={formState.status}
                onChange={(e) =>
                  handleFormChange(
                    'status',
                    e.target.value,
                  )
                }
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Suspended">
                  Suspended
                </option>
              </select>

            </div>

          </div>

        </div>

      </Modal>

      {/* ================================================= */}
      {/* VIEW COMMUNITY MODAL */}
      {/* ================================================= */}

      <Modal
        open={viewModalOpen}
        title="Community Details"
        onClose={() => {
          setViewModalOpen(false)
          setSelectedCommunity(null)
        }}
        footer={
          <button
            type="button"
            onClick={() => {
              setViewModalOpen(false)
              setSelectedCommunity(null)
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            <X className="h-4 w-4" />
            Close
          </button>
        }
      >

        {selectedCommunity && (
          <div className="space-y-5">

            {/* Community Header */}
            <div className="flex items-center gap-4 rounded-2xl bg-stone-50 p-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Building2 className="h-6 w-6 text-emerald-700" />
              </div>

              <div>

                <h3 className="text-lg font-semibold text-stone-900">
                  {selectedCommunity.name}
                </h3>

                <div className="mt-1">
                  {getStatusBadge(
                    selectedCommunity.status,
                  )}
                </div>

              </div>

            </div>

            {/* Description */}
            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                Description
              </p>

              <p className="mt-1 text-sm text-stone-700">
                {selectedCommunity.description}
              </p>

            </div>

            {/* Details */}
            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-stone-200 p-4">

                <p className="text-xs text-stone-400">
                  Community Admin
                </p>

                <p className="mt-1 font-semibold text-stone-900">
                  {selectedCommunity.admin}
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  {selectedCommunity.adminEmail}
                </p>

              </div>

              <div className="rounded-2xl border border-stone-200 p-4">

                <p className="text-xs text-stone-400">
                  Location
                </p>

                <p className="mt-1 font-semibold text-stone-900">
                  {selectedCommunity.district}
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  {selectedCommunity.state}
                </p>

              </div>

              <div className="rounded-2xl border border-stone-200 p-4">

                <p className="text-xs text-stone-400">
                  Members
                </p>

                <p className="mt-1 font-semibold text-stone-900">
                  {selectedCommunity.members.toLocaleString()}
                </p>

              </div>

              <div className="rounded-2xl border border-stone-200 p-4">

                <p className="text-xs text-stone-400">
                  Created
                </p>

                <p className="mt-1 font-semibold text-stone-900">
                  {selectedCommunity.createdAt}
                </p>

              </div>

            </div>

          </div>
        )}

      </Modal>

    </div>
  )
}