import {
    Users,
    ShieldCheck,
    Building2,
    UserCheck,
    UserPlus,
    Clock3,
    Activity,
    ArrowUpRight,
    ArrowRight,
    Settings,
    FileText,
    CheckCircle2,
    AlertCircle,
    CalendarDays,
    MoreHorizontal,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AdminDashboardPage() {
    // --------------------------------------------------
    // Dummy dashboard data
    // --------------------------------------------------
const navigate = useNavigate()
    const stats = [
        {
            title: 'Total Users',
            value: '1,248',
            change: '+12.5%',
            description: 'from last month',
            icon: Users,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            changeColor: 'text-emerald-600',
        },
        {
            title: 'Communities',
            value: '36',
            change: '+3',
            description: 'this month',
            icon: Building2,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
            changeColor: 'text-emerald-600',
        },
        {
            title: 'Active Users',
            value: '982',
            change: '78.7%',
            description: 'of total users',
            icon: UserCheck,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            changeColor: 'text-emerald-600',
        },
        {
            title: 'Pending Approvals',
            value: '8',
            change: 'Needs action',
            description: 'community requests',
            icon: Clock3,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            changeColor: 'text-amber-600',
        },
    ]

    const recentActivities = [
        {
            id: 1,
            title: 'New user registered',
            description: 'Rahul Sharma joined CommunityConnect',
            time: '5 minutes ago',
            type: 'user',
        },
        {
            id: 2,
            title: 'Community created',
            description: 'JNV Bangalore community was created',
            time: '24 minutes ago',
            type: 'community',
        },
        {
            id: 3,
            title: 'Role updated',
            description: 'Kiran changed Ravi Kumar to Community Admin',
            time: '1 hour ago',
            type: 'role',
        },
        {
            id: 4,
            title: 'Community approved',
            description: 'JNV Mysore community was approved',
            time: '2 hours ago',
            type: 'approval',
        },
        {
            id: 5,
            title: 'User account suspended',
            description: 'A user account was temporarily suspended',
            time: '3 hours ago',
            type: 'security',
        },
    ]

    const communities = [
        {
            name: 'JNV Bidar',
            admin: 'Rahul Kumar',
            members: 450,
            status: 'Active',
        },
        {
            name: 'JNV Bangalore',
            admin: 'Anil Sharma',
            members: 320,
            status: 'Active',
        },
        {
            name: 'JNV Mysore',
            admin: 'Priya Singh',
            members: 210,
            status: 'Pending',
        },
        {
            name: 'JNV Kalaburagi',
            admin: 'Vijay Kumar',
            members: 185,
            status: 'Active',
        },
    ]

    const recentUsers = [
        {
            name: 'Rahul Sharma',
            email: 'rahul@example.com',
            role: 'Member',
            status: 'Active',
        },
        {
            name: 'Priya Singh',
            email: 'priya@example.com',
            role: 'CommunityAdmin',
            status: 'Active',
        },
        {
            name: 'Anil Kumar',
            email: 'anil@example.com',
            role: 'Member',
            status: 'Pending',
        },
        {
            name: 'Vijay Patil',
            email: 'vijay@example.com',
            role: 'EventOrganizer',
            status: 'Active',
        },
    ]

    return (
        <div className="min-w-0 space-y-6">

            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />

                            <p className="text-sm font-medium text-emerald-700">
                                Platform administration
                            </p>
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
                            Admin Dashboard
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                            Monitor CommunityConnect, manage users and communities,
                            control access, and review platform activity from one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                        >
                            <FileText className="h-4 w-4" />
                            View Audit Logs
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <UserPlus className="h-4 w-4" />
                            Add User
                        </button>

                    </div>

                </div>
            </div>

            {/* ================================================= */}
            {/* STAT CARDS */}
            {/* ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {stats.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <div
                            key={stat.title}
                            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm font-medium text-stone-500">
                                        {stat.title}
                                    </p>

                                    <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                                        {stat.value}
                                    </p>
                                </div>

                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.iconBg}`}
                                >
                                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                                </div>

                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs">
                                <span className={`font-semibold ${stat.changeColor}`}>
                                    {stat.change}
                                </span>

                                <span className="text-stone-400">
                                    {stat.description}
                                </span>
                            </div>

                        </div>
                    )
                })}

            </div>

            {/* ================================================= */}
            {/* QUICK ACTIONS */}
            {/* ================================================= */}

            <div>

                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-stone-900">
                            Quick Actions
                        </h2>

                        <p className="text-sm text-stone-500">
                            Common platform administration tasks.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {/* Users */}
                    <button
                        type="button"
                        className="group rounded-3xl border border-stone-200 bg-amber-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                                <Users className="h-5 w-5 text-amber-600" />
                            </div>

                            <ArrowUpRight className="h-4 w-4 text-stone-400 transition group-hover:text-stone-700" />

                        </div>

                        <p className="mt-4 text-sm font-medium text-amber-700">
                            Users
                        </p>

                        <p className="mt-1 text-lg font-semibold text-stone-900">
                            Manage users
                        </p>

                        <p className="mt-1 text-sm text-stone-600">
                            View, edit, suspend, and assign roles.
                        </p>
                    </button>

                    {/* Roles */}
                    <button
                        type="button"
                        className="group rounded-3xl border border-stone-200 bg-sky-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                                <ShieldCheck className="h-5 w-5 text-sky-600" />
                            </div>

                            <ArrowUpRight className="h-4 w-4 text-stone-400 transition group-hover:text-stone-700" />

                        </div>

                        <p className="mt-4 text-sm font-medium text-sky-700">
                            Roles & Permissions
                        </p>

                        <p className="mt-1 text-lg font-semibold text-stone-900">
                            Manage access
                        </p>

                        <p className="mt-1 text-sm text-stone-600">
                            Control roles and platform permissions.
                        </p>
                    </button>

                    {/* Communities */}
                    <button
                        type="button"
                        className="group rounded-3xl border border-stone-200 bg-purple-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                                <Building2 className="h-5 w-5 text-purple-600" />
                            </div>

                            <ArrowUpRight className="h-4 w-4 text-stone-400 transition group-hover:text-stone-700" />

                        </div>

                        <p className="mt-4 text-sm font-medium text-purple-700">
                            Communities
                        </p>

                        <p className="mt-1 text-lg font-semibold text-stone-900">
                            Manage communities
                        </p>

                        <p className="mt-1 text-sm text-stone-600">
                            Review, approve, and manage communities.
                        </p>
                    </button>

                    {/* Settings */}
                    <button
                        type="button"
                        className="group rounded-3xl border border-stone-200 bg-emerald-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                                <Settings className="h-5 w-5 text-emerald-600" />
                            </div>

                            <ArrowUpRight className="h-4 w-4 text-stone-400 transition group-hover:text-stone-700" />

                        </div>

                        <p className="mt-4 text-sm font-medium text-emerald-700">
                            Settings
                        </p>

                        <p className="mt-1 text-lg font-semibold text-stone-900">
                            Platform settings
                        </p>

                        <p className="mt-1 text-sm text-stone-600">
                            Configure security and platform preferences.
                        </p>
                    </button>

                </div>

            </div>

            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}

            <div className="grid min-w-0 gap-6 xl:grid-cols-[1.35fr_1fr]">

                {/* ================================================= */}
                {/* RECENT ACTIVITY */}
                {/* ================================================= */}

                <section className="min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">

                        <div>
                            <h2 className="text-lg font-semibold text-stone-900">
                                Recent Activity
                            </h2>

                            <p className="mt-1 text-sm text-stone-500">
                                Latest platform administration activity.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </button>

                    </div>

                    <div className="divide-y divide-stone-100">

                        {recentActivities.map((activity) => {

                            let icon = Activity
                            let iconBg = 'bg-stone-100'
                            let iconColor = 'text-stone-600'

                            if (activity.type === 'user') {
                                icon = UserPlus
                                iconBg = 'bg-blue-50'
                                iconColor = 'text-blue-600'
                            }

                            if (activity.type === 'community') {
                                icon = Building2
                                iconBg = 'bg-purple-50'
                                iconColor = 'text-purple-600'
                            }

                            if (activity.type === 'role') {
                                icon = ShieldCheck
                                iconBg = 'bg-sky-50'
                                iconColor = 'text-sky-600'
                            }

                            if (activity.type === 'approval') {
                                icon = CheckCircle2
                                iconBg = 'bg-emerald-50'
                                iconColor = 'text-emerald-600'
                            }

                            if (activity.type === 'security') {
                                icon = AlertCircle
                                iconBg = 'bg-rose-50'
                                iconColor = 'text-rose-600'
                            }

                            const ActivityIcon = icon

                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 px-6 py-4"
                                >

                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
                                    >
                                        <ActivityIcon
                                            className={`h-4 w-4 ${iconColor}`}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="text-sm font-semibold text-stone-900">
                                            {activity.title}
                                        </p>

                                        <p className="mt-1 truncate text-sm text-stone-500">
                                            {activity.description}
                                        </p>

                                        <p className="mt-1 text-xs text-stone-400">
                                            {activity.time}
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        className="shrink-0 rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>

                                </div>
                            )
                        })}

                    </div>

                </section>

                {/* ================================================= */}
                {/* COMMUNITY OVERVIEW */}
                {/* ================================================= */}

                <section className="min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">

                        <div>
                            <h2 className="text-lg font-semibold text-stone-900">
                                Community Overview
                            </h2>

                            <p className="mt-1 text-sm text-stone-500">
                                Recently active communities.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                            View all
                            <ArrowRight className="h-4 w-4" />
                        </button>

                    </div>

                    <div className="divide-y divide-stone-100">

                        {communities.map((community) => (
                            <div
                                key={community.name}
                                className="flex items-center gap-3 px-6 py-4"
                            >

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-100">
                                    <Building2 className="h-4 w-4 text-stone-600" />
                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-sm font-semibold text-stone-900">
                                        {community.name}
                                    </p>

                                    <p className="mt-1 truncate text-xs text-stone-500">
                                        Admin: {community.admin}
                                    </p>

                                </div>

                                <div className="text-right">

                                    <p className="text-sm font-semibold text-stone-900">
                                        {community.members}
                                    </p>

                                    <span
                                        className={`text-xs font-medium ${community.status === 'Active'
                                                ? 'text-emerald-600'
                                                : 'text-amber-600'
                                            }`}
                                    >
                                        {community.status}
                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>

                </section>

            </div>

            {/* ================================================= */}
            {/* RECENT USERS + SYSTEM STATUS */}
            {/* ================================================= */}

            <div className="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]">

                {/* Recent Users */}
                <section className="min-w-0 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">

                        <div>
                            <h2 className="text-lg font-semibold text-stone-900">
                                Recent Users
                            </h2>

                            <p className="mt-1 text-sm text-stone-500">
                                Latest registered users on the platform.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                            View users
                            <ArrowRight className="h-4 w-4" />
                        </button>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="border-b border-stone-200 bg-stone-50">

                                <tr>
                                    <th className="px-6 py-3 font-medium text-stone-500">
                                        User
                                    </th>

                                    <th className="px-6 py-3 font-medium text-stone-500">
                                        Role
                                    </th>

                                    <th className="px-6 py-3 font-medium text-stone-500">
                                        Status
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-stone-100">

                                {recentUsers.map((user) => (
                                    <tr
                                        key={user.email}
                                        className="hover:bg-stone-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                                                    {user.name
                                                        .split(' ')
                                                        .map((name) => name[0])
                                                        .join('')
                                                        .slice(0, 2)}
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate font-medium text-stone-900">
                                                        {user.name}
                                                    </p>

                                                    <p className="truncate text-xs text-stone-500">
                                                        {user.email}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        <td className="px-6 py-4 text-stone-600">
                                            {user.role}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${user.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                    }`}
                                            >
                                                {user.status}
                                            </span>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                </section>

                {/* System Status */}
                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div>
                            <h2 className="text-lg font-semibold text-stone-900">
                                System Status
                            </h2>

                            <p className="mt-1 text-sm text-stone-500">
                                CommunityConnect services.
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
                            <Activity className="h-5 w-5 text-emerald-600" />
                        </div>

                    </div>

                    <div className="mt-6 space-y-4">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                <span className="text-sm font-medium text-stone-700">
                                    API
                                </span>

                            </div>

                            <span className="text-xs font-semibold text-emerald-600">
                                Operational
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                <span className="text-sm font-medium text-stone-700">
                                    Database
                                </span>

                            </div>

                            <span className="text-xs font-semibold text-emerald-600">
                                Operational
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                <span className="text-sm font-medium text-stone-700">
                                    Authentication
                                </span>

                            </div>

                            <span className="text-xs font-semibold text-emerald-600">
                                Operational
                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                <span className="text-sm font-medium text-stone-700">
                                    Notifications
                                </span>

                            </div>

                            <span className="text-xs font-semibold text-emerald-600">
                                Operational
                            </span>

                        </div>

                    </div>

                    <div className="mt-6 rounded-2xl bg-stone-50 p-4">

                        <div className="flex items-center gap-3">

                            <CalendarDays className="h-4 w-4 text-stone-500" />

                            <div>

                                <p className="text-xs font-medium text-stone-500">
                                    Last system check
                                </p>

                                <p className="mt-1 text-sm font-semibold text-stone-900">
                                    Today, 3:45 PM
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

            {/* ================================================= */}
            {/* PENDING APPROVALS */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white">
                            <Clock3 className="h-5 w-5 text-amber-600" />
                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-stone-900">
                                8 items need your attention
                            </h2>

                            <p className="mt-1 text-sm text-stone-600">
                                There are pending community requests and account actions
                                waiting for review.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                    >
                        Review Pending
                        <ArrowRight className="h-4 w-4" />
                    </button>

                </div>

            </section>

        </div>
    )
}