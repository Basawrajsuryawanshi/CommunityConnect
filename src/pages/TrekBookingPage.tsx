import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  IndianRupee,
  MapPin,
  Mountain,
  Phone,
  Shield,
  Users,
} from 'lucide-react'
import { formatCurrency } from '../data/trekkingData'
import { formatDate, useApp } from '../context/AppContext'
import type { TrekBooking } from '../types/trekking'

type Step = 'details' | 'payment' | 'confirmation'

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Moderate: 'bg-amber-100 text-amber-800',
  Difficult: 'bg-orange-100 text-orange-800',
  Expert: 'bg-red-100 text-red-800',
}

export function TrekBookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { treks, user, bookTrek } = useApp()

  const trek = treks.find((t) => t.id === id)
  const [step, setStep] = useState<Step>('details')
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<TrekBooking['paymentMethod']>('upi')
  const [processing, setProcessing] = useState(false)
  const [booking, setBooking] = useState<TrekBooking | null>(null)

  if (!trek) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-stone-500">Trek not found.</p>
        <Link to="/events/trekking" className="mt-4 inline-block text-emerald-600 hover:underline">
          Back to trekking
        </Link>
      </div>
    )
  }

  const selectedSlot = trek.slots.find((s) => s.id === selectedSlotId)

  const handleProceedToPayment = () => {
    if (!selectedSlotId || !selectedSlot || selectedSlot.availableSeats <= 0) return
    setStep('payment')
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlotId || phone.length < 10) return

    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1500))

    const result = bookTrek({
      trekId: trek.id,
      slotId: selectedSlotId,
      phone,
      paymentMethod,
    })

    setProcessing(false)
    if (result) {
      setBooking(result)
      setStep('confirmation')
    }
  }

  if (step === 'confirmation' && booking) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-lg">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-8 text-center text-white">
            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-200" />
            <h1 className="mt-4 text-2xl font-bold">Booking Confirmed!</h1>
            <p className="mt-2 text-sm text-emerald-100">
              Your trek slot has been reserved and payment received.
            </p>
          </div>
          <div className="space-y-4 p-6">
            <div className="rounded-lg bg-stone-50 p-4 text-center">
              <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">
                Confirmation ID
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-emerald-700">{booking.id}</p>
            </div>

            <div className="space-y-3 text-sm">
              <Row label="Trek" value={booking.trekName} />
              <Row label="State" value={booking.state} />
              <Row label="Date" value={formatDate(booking.slotDate)} />
              <Row label="Reporting Time" value={booking.reportingTime} />
              <Row label="Booked By" value={booking.userName} />
              <Row label="Phone" value={booking.phone} />
              <Row
                label="Payment"
                value={`${formatCurrency(booking.amount)} via ${booking.paymentMethod.toUpperCase()}`}
              />
              <Row label="Status" value="Confirmed ✓" highlight />
            </div>

            <p className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-800">
              A confirmation SMS and email have been sent to {booking.phone}. Please carry a valid
              ID and arrive 30 minutes before reporting time.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/events/trekking')}
                className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Browse More Treks
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/events/trekking"
        className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to trekking
      </Link>

      <div className="mb-6 flex items-center gap-2">
        {(['details', 'payment'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step === s || (step === 'payment' && s === 'details')
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-200 text-stone-500'
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`text-sm font-medium capitalize ${
                step === s ? 'text-emerald-700' : 'text-stone-400'
              }`}
            >
              {s === 'details' ? 'Select Slot' : 'Pay & Confirm'}
            </span>
            {i === 0 && <span className="mx-2 text-stone-300">→</span>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {step === 'details' && (
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className={`h-36 bg-gradient-to-br ${trek.imageGradient} p-6`}>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${difficultyColors[trek.difficulty]}`}
                >
                  {trek.difficulty}
                </span>
                <h1 className="mt-3 text-2xl font-bold text-white">{trek.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                  <MapPin className="h-4 w-4" />
                  {trek.location}, {trek.state}
                </p>
              </div>
              <div className="space-y-5 p-6">
                <p className="text-sm leading-relaxed text-stone-600">{trek.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <InfoBox icon={Mountain} label="Duration" value={trek.duration} />
                  <InfoBox
                    icon={IndianRupee}
                    label="Rate"
                    value={`${formatCurrency(trek.rate)} / person`}
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-stone-700">Highlights</p>
                  <div className="flex flex-wrap gap-2">
                    {trek.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 ring-1 ring-emerald-100"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-stone-700">Inclusions</p>
                  <ul className="space-y-1">
                    {trek.inclusions.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-stone-700">Select a Slot</p>
                  <div className="space-y-2">
                    {trek.slots.map((slot) => {
                      const soldOut = slot.availableSeats <= 0
                      const selected = selectedSlotId === slot.id
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={soldOut}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition ${
                            soldOut
                              ? 'cursor-not-allowed border-stone-100 bg-stone-50 opacity-50'
                              : selected
                                ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                                : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                          }`}
                        >
                          <div>
                            <p className="flex items-center gap-2 text-sm font-medium text-stone-900">
                              <Calendar className="h-4 w-4 text-emerald-600" />
                              {formatDate(slot.date)}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
                              <Clock className="h-3.5 w-3.5" />
                              Report by {slot.reportingTime}
                            </p>
                          </div>
                          <div className="text-right">
                            {soldOut ? (
                              <span className="text-xs font-medium text-red-500">Sold Out</span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-stone-500">
                                <Users className="h-3.5 w-3.5" />
                                {slot.availableSeats} seats left
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={!selectedSlotId}
                  className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Proceed to Payment — {formatCurrency(trek.rate)}
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && selectedSlot && (
            <form
              onSubmit={handlePayment}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-stone-900">Payment Details</h2>
              <p className="mt-1 text-sm text-stone-500">
                Complete your booking for {trek.name} on {formatDate(selectedSlot.date)}
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-lg border border-stone-200 py-2 pr-3 pl-10 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                      required
                      minLength={10}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'upi', label: 'UPI', icon: '📱' },
                        { id: 'card', label: 'Card', icon: '💳' },
                        { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                      ] as const
                    ).map(({ id: method, label, icon }) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-lg border p-3 text-center text-sm transition ${
                          paymentMethod === method
                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                        <p className="mt-1 font-medium">{label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-lg bg-stone-50 p-3 text-xs text-stone-500">
                <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
                Payments are secured with 256-bit encryption. This is a prototype — no real charge
                is made.
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={processing || phone.length < 10}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {processing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay {formatCurrency(trek.rate)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-stone-900">Booking Summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Trek" value={trek.name} />
              <Row label="State" value={trek.state} />
              {selectedSlot && (
                <>
                  <Row label="Date" value={formatDate(selectedSlot.date)} />
                  <Row label="Reporting" value={selectedSlot.reportingTime} />
                </>
              )}
              <div className="border-t border-stone-100 pt-3">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-stone-700">Total Amount</span>
                  <span className="text-lg text-emerald-700">{formatCurrency(trek.rate)}</span>
                </div>
                <p className="mt-1 text-xs text-stone-400">Inclusive of taxes & service fee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-stone-500">{label}</span>
      <span className={`text-right font-medium ${highlight ? 'text-emerald-700' : 'text-stone-900'}`}>
        {value}
      </span>
    </div>
  )
}

function InfoBox({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mountain
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg bg-stone-50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-stone-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-stone-900">{value}</p>
    </div>
  )
}
