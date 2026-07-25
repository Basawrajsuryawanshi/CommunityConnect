export interface TrekSlot {
  id: string
  date: string
  reportingTime: string
  availableSeats: number
  totalSeats: number
}

export interface Trek {
  id: string
  name: string
  state: string
  location: string
  difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Expert'
  duration: string
  rate: number
  description: string
  highlights: string[]
  inclusions: string[]
  imageGradient: string
  slots: TrekSlot[]
}

export interface TrekBooking {
  id: string
  trekId: string
  trekName: string
  state: string
  slotId: string
  slotDate: string
  reportingTime: string
  amount: number
  userId: string
  userName: string
  phone: string
  paymentMethod: 'upi' | 'card' | 'netbanking'
  status: 'confirmed'
  bookedAt: string
}
