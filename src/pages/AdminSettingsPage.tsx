import { useState } from 'react'
import {
  Settings,
  Save,
  Globe,
  UserPlus,
  Building2,
  CalendarDays,
  Bell,
  ShieldCheck,
  Wrench,
  AlertTriangle,
} from 'lucide-react'

export function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Platform
    platformName: 'CommunityConnect',
    platformDescription:
      'A community platform for alumni, communities, events, and networking.',
    supportEmail: 'support@communityconnect.com',

    // Registration
    allowRegistration: true,
    requireEmailVerification: true,
    requireAdminApproval: false,

    // Communities
    allowCommunityCreation: true,
    requireCommunityApproval: true,
    allowMultipleCommunities: true,

    // Events
    allowEventCreation: true,
    requireEventApproval: false,
    allowEventCancellation: true,

    // Notifications
    emailNotifications: true,
    announcementNotifications: true,
    adminNotifications: true,

    // Security
    sessionTimeout: '30',
    minimumPasswordLength: '8',
    maxLoginAttempts: '5',

    // Maintenance
    maintenanceMode: false,
    maintenanceMessage:
      'CommunityConnect is temporarily unavailable. Please try again later.',
  })

  const [saved, setSaved] = useState(false)

  const updateSetting = (
    field: keyof typeof settings,
    value: string | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))

    setSaved(false)
  }

  const handleSave = () => {
    // Dummy save
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 3000)
  }

  const handleResetDemoData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset demo data? This action cannot be undone.',
    )

    if (!confirmed) return

    alert('Demo data reset successfully.')
  }

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <Settings className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold text-stone-900">
                Platform Settings
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                Configure global CommunityConnect settings, registration,
                communities, events, notifications, and security.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />

            {saved ? 'Saved' : 'Save Changes'}
          </button>

        </div>

        {saved && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Settings saved successfully.
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* PLATFORM SETTINGS */}
      {/* ================================================= */}

      <section className="rounded-3xl border border-stone-200 bg-white shadow-sm">

        <div className="border-b border-stone-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-blue-600" />

            <div>
              <h2 className="text-lg font-semibold text-stone-900">
                Platform Settings
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Basic information displayed across the platform.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Platform Name
            </label>

            <input
              type="text"
              value={settings.platformName}
              onChange={(e) =>
                updateSetting('platformName', e.target.value)
              }
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Support Email
            </label>

            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                updateSetting('supportEmail', e.target.value)
              }
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Platform Description
            </label>

            <textarea
              rows={3}
              value={settings.platformDescription}
              onChange={(e) =>
                updateSetting(
                  'platformDescription',
                  e.target.value,
                )
              }
              className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            />
          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* REGISTRATION */}
      {/* ================================================= */}

      <SettingsSection
        icon={<UserPlus className="h-5 w-5 text-purple-600" />}
        title="Registration Settings"
        description="Control how new users can join CommunityConnect."
      >
        <ToggleRow
          title="Allow New Registrations"
          description="Allow new users to create accounts."
          checked={settings.allowRegistration}
          onChange={(value) =>
            updateSetting('allowRegistration', value)
          }
        />

        <ToggleRow
          title="Require Email Verification"
          description="Users must verify their email address before accessing the platform."
          checked={settings.requireEmailVerification}
          onChange={(value) =>
            updateSetting('requireEmailVerification', value)
          }
        />

        <ToggleRow
          title="Require Admin Approval"
          description="New accounts must be approved by a Super Admin."
          checked={settings.requireAdminApproval}
          onChange={(value) =>
            updateSetting('requireAdminApproval', value)
          }
        />
      </SettingsSection>

      {/* ================================================= */}
      {/* COMMUNITY SETTINGS */}
      {/* ================================================= */}

      <SettingsSection
        icon={<Building2 className="h-5 w-5 text-emerald-600" />}
        title="Community Settings"
        description="Control community creation and management."
      >
        <ToggleRow
          title="Allow Community Creation"
          description="Allow authorized users to create new communities."
          checked={settings.allowCommunityCreation}
          onChange={(value) =>
            updateSetting('allowCommunityCreation', value)
          }
        />

        <ToggleRow
          title="Require Community Approval"
          description="New communities must be approved by a Super Admin."
          checked={settings.requireCommunityApproval}
          onChange={(value) =>
            updateSetting('requireCommunityApproval', value)
          }
        />

        <ToggleRow
          title="Allow Multiple Community Memberships"
          description="Users can belong to more than one community."
          checked={settings.allowMultipleCommunities}
          onChange={(value) =>
            updateSetting('allowMultipleCommunities', value)
          }
        />
      </SettingsSection>

      {/* ================================================= */}
      {/* EVENT SETTINGS */}
      {/* ================================================= */}

      <SettingsSection
        icon={<CalendarDays className="h-5 w-5 text-orange-600" />}
        title="Event Settings"
        description="Control event creation, approval, and cancellation."
      >
        <ToggleRow
          title="Allow Event Creation"
          description="Allow Event Organizers to create events."
          checked={settings.allowEventCreation}
          onChange={(value) =>
            updateSetting('allowEventCreation', value)
          }
        />

        <ToggleRow
          title="Require Event Approval"
          description="Events must be approved before they become visible."
          checked={settings.requireEventApproval}
          onChange={(value) =>
            updateSetting('requireEventApproval', value)
          }
        />

        <ToggleRow
          title="Allow Event Cancellation"
          description="Organizers can cancel their events."
          checked={settings.allowEventCancellation}
          onChange={(value) =>
            updateSetting('allowEventCancellation', value)
          }
        />
      </SettingsSection>

      {/* ================================================= */}
      {/* NOTIFICATIONS */}
      {/* ================================================= */}

      <SettingsSection
        icon={<Bell className="h-5 w-5 text-sky-600" />}
        title="Notification Settings"
        description="Control platform-wide notifications."
      >
        <ToggleRow
          title="Email Notifications"
          description="Send important platform notifications through email."
          checked={settings.emailNotifications}
          onChange={(value) =>
            updateSetting('emailNotifications', value)
          }
        />

        <ToggleRow
          title="Announcement Notifications"
          description="Notify users when important announcements are published."
          checked={settings.announcementNotifications}
          onChange={(value) =>
            updateSetting('announcementNotifications', value)
          }
        />

        <ToggleRow
          title="Admin Notifications"
          description="Notify administrators about important platform activity."
          checked={settings.adminNotifications}
          onChange={(value) =>
            updateSetting('adminNotifications', value)
          }
        />
      </SettingsSection>

      {/* ================================================= */}
      {/* SECURITY */}
      {/* ================================================= */}

      <SettingsSection
        icon={<ShieldCheck className="h-5 w-5 text-rose-600" />}
        title="Security Settings"
        description="Configure basic platform security policies."
      >
        <div className="grid gap-5 p-5 md:grid-cols-3">

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Session Timeout
            </label>

            <select
              value={settings.sessionTimeout}
              onChange={(e) =>
                updateSetting('sessionTimeout', e.target.value)
              }
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Minimum Password Length
            </label>

            <select
              value={settings.minimumPasswordLength}
              onChange={(e) =>
                updateSetting(
                  'minimumPasswordLength',
                  e.target.value,
                )
              }
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            >
              <option value="8">8 characters</option>
              <option value="10">10 characters</option>
              <option value="12">12 characters</option>
              <option value="14">14 characters</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Maximum Login Attempts
            </label>

            <select
              value={settings.maxLoginAttempts}
              onChange={(e) =>
                updateSetting(
                  'maxLoginAttempts',
                  e.target.value,
                )
              }
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
            >
              <option value="3">3 attempts</option>
              <option value="5">5 attempts</option>
              <option value="10">10 attempts</option>
            </select>
          </div>

        </div>
      </SettingsSection>

      {/* ================================================= */}
      {/* MAINTENANCE */}
      {/* ================================================= */}

      <SettingsSection
        icon={<Wrench className="h-5 w-5 text-amber-600" />}
        title="Maintenance"
        description="Temporarily restrict access when platform maintenance is required."
      >
        <ToggleRow
          title="Maintenance Mode"
          description="Prevent normal users from accessing the platform."
          checked={settings.maintenanceMode}
          onChange={(value) =>
            updateSetting('maintenanceMode', value)
          }
        />

        <div className="p-5">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Maintenance Message
          </label>

          <textarea
            rows={3}
            value={settings.maintenanceMessage}
            onChange={(e) =>
              updateSetting(
                'maintenanceMessage',
                e.target.value,
              )
            }
            className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:bg-white"
          />
        </div>
      </SettingsSection>

      {/* ================================================= */}
      {/* DANGER ZONE */}
      {/* ================================================= */}

      <section className="rounded-3xl border border-rose-200 bg-white shadow-sm">

        <div className="border-b border-rose-100 bg-rose-50 px-6 py-5">
          <div className="flex items-center gap-3">

            <AlertTriangle className="h-5 w-5 text-rose-600" />

            <div>
              <h2 className="font-semibold text-rose-800">
                Danger Zone
              </h2>

              <p className="mt-1 text-sm text-rose-600">
                Destructive platform-level actions.
              </p>
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="font-semibold text-stone-900">
              Reset Demo Data
            </p>

            <p className="mt-1 text-sm text-stone-500">
              Remove dummy communities, users, and other demo records.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetDemoData}
            className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Reset Demo Data
          </button>

        </div>

      </section>

      {/* Bottom save */}
      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved' : 'Save All Settings'}
        </button>
      </div>

    </div>
  )
}

/* ================================================= */
/* SETTINGS SECTION */
/* ================================================= */

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">

      <div className="border-b border-stone-200 px-6 py-5">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-50">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              {title}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {description}
            </p>
          </div>

        </div>
      </div>

      <div className="divide-y divide-stone-200">
        {children}
      </div>

    </section>
  )
}

/* ================================================= */
/* TOGGLE */
/* ================================================= */

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-6 p-5">

      <div className="min-w-0">
        <p className="text-sm font-semibold text-stone-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-stone-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? 'bg-emerald-600'
            : 'bg-stone-300'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked
              ? 'left-6'
              : 'left-1'
          }`}
        />
      </button>

    </div>
  )
}