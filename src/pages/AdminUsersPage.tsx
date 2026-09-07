import { useMemo, useState, useEffect } from 'react'
import { Search, Plus, Edit3, Trash2, Save, X } from 'lucide-react'
import type { AdminUser } from '../types'
import type { RoleName } from '../auth/auth'
import { useApp } from '../context/AppContext'
import { Modal } from '../components/Modal'
import usersService, { type UserProfile } from '../services/usersService'

const roleOptions: RoleName[] = ['SuperAdmin', 'CommunityAdmin', 'EventOrganizer', 'Member']

const emptyUser: AdminUser = {
    id: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    schoolName: '',
    state: '',
    schoolRegion: '',
    passoutYear: 0,
    role: 'Member',
    university: '',
    currentState: '',
    currentDistrict: '',
    bloodGroup: '',
    createdAt: '',
    updatedAt: '',
}

export function AdminUsersPage() {
    const { addAdminUser, updateAdminUser, deleteAdminUser } = useApp()
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formState, setFormState] = useState<AdminUser>(emptyUser)
    const [apiUsers, setApiUsers] = useState<UserProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch users from API on mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const users = await usersService.getUserProfiles()
                setApiUsers(users)
            } catch (err: any) {
                console.error('Failed to fetch users:', err)
                setError(err.message || 'Failed to load users')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    }, [])

    // Transform API users to AdminUser format
    const transformedUsers: AdminUser[] = useMemo(() => {
        return apiUsers.map((user) => ({
            id: user.userId,
            fullName: user.fullName || user.emailID,
            email: user.emailID,
            mobileNumber: user.mobileNumber || '',
            schoolName: user.schoolName || '',
            state: user.state || '',
            schoolRegion: user.schoolRegion || '',
            passoutYear: user.passoutYear || 0,
            role: user.role || 'Member',
            university: user.university || '',
            currentState: user.currentState || '',
            currentDistrict: user.currentDistrict || '',
            bloodGroup: user.bloodGroup || '',
            createdAt: '',
            updatedAt: '',
        }))
    }, [apiUsers])

    const filteredUsers = useMemo(
        () =>
            transformedUsers.filter((user) =>
                [user.fullName, user.email, user.role, user.schoolName, user.currentState]
                    .join(' ')
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [search, transformedUsers],
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
        if (!formState.fullName.trim() || !formState.email.trim()) return

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



            <section className="w-full min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

                {/* Header */}
                <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">
                    <div className="flex items-center justify-between gap-4">

                        <div className="min-w-0">
                            <h2 className="text-xl font-semibold text-stone-900">
                                User Table
                            </h2>

                            <p className="mt-1 truncate text-sm text-stone-500">
                                Review all users and update their role assignments instantly.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-64 shrink-0">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                    </div>
                </div>

                {/* Table */}
                <div className="w-full">
                    <table className="w-full table-fixed divide-y divide-stone-200 text-left text-sm">

                        <colgroup>
                            <col className="w-[18%]" />
                            <col className="w-[20%]" />
                            <col className="w-[12%]" />
                            <col className="w-[8%]" />
                            <col className="w-[14%]" />
                            <col className="w-[14%]" />
                            <col className="w-[14%]" />
                        </colgroup>

                        {/* Header */}
                        <thead className="bg-stone-50">
                            <tr>

                                <th className="px-4 py-3 font-semibold text-stone-600">
                                    Name
                                </th>

                                <th className="px-4 py-3 font-semibold text-stone-600">
                                    Email
                                </th>

                                <th className="px-4 py-3 font-semibold text-stone-600">
                                    Role
                                </th>

                                <th className="px-4 py-3 font-semibold text-stone-600">
                                    Batch
                                </th>

                                <th className="px-4 py-3 font-semibold text-stone-600">
                                    School
                                </th>

                                <th className="px-4 py-3 font-semibold text-stone-600">
                                    University
                                </th>

                                <th className="px-4 py-3 text-center font-semibold text-stone-600">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-stone-200 bg-white">

                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-sm text-stone-500"
                                    >
                                        Loading users...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-sm text-red-600"
                                    >
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-sm text-stone-500"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-stone-50"
                                    >

                                        {/* Name */}
                                        <td className="px-4 py-3">
                                            <div
                                                className="truncate font-medium text-stone-900"
                                                title={user.fullName}
                                            >
                                                {user.fullName}
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3">
                                            <div
                                                className="truncate text-stone-600"
                                                title={user.email}
                                            >
                                                {user.email}
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-3">
                                            <select
                                                value={user.role}
                                                onChange={(e) =>
                                                    handleRoleChange(
                                                        user,
                                                        e.target.value as RoleName
                                                    )
                                                }
                                                className="w-full min-w-0 rounded-xl border border-stone-200 bg-stone-50 px-2 py-2 text-xs outline-none focus:border-emerald-300 focus:bg-white"
                                            >
                                                {roleOptions.map((role) => (
                                                    <option
                                                        key={role}
                                                        value={role}
                                                    >
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Batch */}
                                        <td className="px-4 py-3 text-stone-600">
                                            <div className="truncate">
                                                {user.passoutYear || '-'}
                                            </div>
                                        </td>

                                        {/* JNV */}
                                        <td className="px-4 py-3 text-stone-600">
                                            <div
                                                className="truncate"
                                                title={user.schoolName}
                                            >
                                                {user.schoolName || '-'}
                                            </div>
                                        </td>

                                        {/* Company */}
                                        <td className="px-4 py-3 text-stone-600">
                                            <div
                                                className="truncate"
                                                title={user.university}
                                            >
                                                {user.university || '-'}
                                            </div>
                                        </td>

                                        {/* City */}
                                        <td className="px-4 py-3 text-stone-600">
                                            <div
                                                className="truncate"
                                                title={user.currentState}
                                            >
                                                {user.currentState || '-'}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-center gap-1.5">

                                                <button
                                                    type="button"
                                                    onClick={() => openEditUser(user)}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
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
                            value={formState.fullName}
                            onChange={(e) => handleFormChange('fullName', e.target.value)}
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
                        <label className="mb-2 block text-sm font-medium text-stone-700">Batch Year</label>
                        <input
                            type="number"
                            value={formState.passoutYear}
                            onChange={(e) => handleFormChange('passoutYear', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                        />
                    </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">School Name</label>
                        <input
                            type="text"
                            value={formState.schoolName}
                            onChange={(e) => handleFormChange('schoolName', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">Current State</label>
                        <input
                            type="text"
                            value={formState.currentState}
                            onChange={(e) => handleFormChange('currentState', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                        />
                    </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">University</label>
                        <input
                            type="text"
                            value={formState.university}
                            onChange={(e) => handleFormChange('university', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">Mobile Number</label>
                        <input
                            type="text"
                            value={formState.mobileNumber}
                            onChange={(e) => handleFormChange('mobileNumber', e.target.value)}
                            className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300 focus:bg-white"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
