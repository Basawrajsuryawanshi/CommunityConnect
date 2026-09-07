import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  UserPlus,
  Users,
  Mail,
  Lock,
  User,
  Phone,
  School,
  MapPin,
  GraduationCap,
  Briefcase,
  Droplet
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

export function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    state: '',
    schoolRegion: '',
    passoutYear: '',
    email: '',
    mobileNumber: '',
    role: '',
    university: '',
    currentState: '',
    currentDistrict: '',
    bloodGroup: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, getDefaultLandingRoute } = useAuth()
  const navigate = useNavigate()

  // --------------------------------------------------
  // Dummy Dropdown Data
  // --------------------------------------------------

  const schoolNames = [
    'JNV Bidar',
    'JNV Bangalore',
    'JNV Mysore',
    'JNV Kalaburagi',
    'JNV Raichur',
    'JNV Belagavi',
    'JNV Hubballi',
    'JNV Mangalore'
  ]

  const states = [
    'Karnataka',
    'Maharashtra',
    'Telangana',
    'Andhra Pradesh',
    'Tamil Nadu',
    'Kerala',
    'Goa',
    'Delhi',
    'Gujarat',
    'Rajasthan'
  ]

  const schoolRegions = [
    'North Karnataka',
    'South Karnataka',
    'Central Karnataka',
    'East Karnataka',
    'West Karnataka',
    'North India',
    'South India',
    'East India',
    'West India'
  ]

  const roles = [
    'Student',
    'Alumni',
    'Teacher',
    'Principal',
    'Parent',
    'Staff',
    'Volunteer',
    'Other'
  ]

  const universities = [
    'Visvesvaraya Technological University',
    'Bangalore University',
    'University of Mysore',
    'Karnataka University',
    'Mangalore University',
    'Gulbarga University',
    'University of Delhi',
    'University of Mumbai',
    'Osmania University',
    'Other'
  ]

  const districts = [
    'Bangalore Urban',
    'Bangalore Rural',
    'Bidar',
    'Kalaburagi',
    'Raichur',
    'Yadgir',
    'Ballari',
    'Vijayapura',
    'Belagavi',
    'Mysore',
    'Mandya',
    'Tumakuru',
    'Hassan',
    'Shivamogga',
    'Dharwad',
    'Mangalore',
    'Udupi',
    'Chitradurga',
    'Kolar',
    'Chikkaballapur'
  ]

  const bloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
  ]

  // --------------------------------------------------
  // Handle Input Changes
  // --------------------------------------------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // --------------------------------------------------
  // Handle Submit
  // --------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/

    if (!mobileRegex.test(formData.mobileNumber)) {
      setError('Mobile number must contain exactly 10 digits')
      return
    }

    // Passout year validation
    const currentYear = new Date().getFullYear()
    const passoutYear = Number(formData.passoutYear)

    if (
      !passoutYear ||
      passoutYear < 1950 ||
      passoutYear > currentYear + 1
    ) {
      setError(`Please enter a valid passout year`)
      return
    }

    setIsLoading(true)

    try {
      // Prepare registration data with backend field names (PascalCase)
      const registerData = {
        Email: formData.email,
        Password: formData.password,
        FullName: formData.name,
        MobileNumber: formData.mobileNumber,
        SchoolName: formData.schoolName,
        State: formData.state,
        SchoolRegion: formData.schoolRegion,
        PassoutYear: Number(formData.passoutYear),
        Role: formData.role,
        University: formData.university,
        CurrentState: formData.currentState,
        CurrentDistrict: formData.currentDistrict,
        BloodGroup: formData.bloodGroup
      }

      await authService.register(registerData)
      await login(formData.email, formData.password)
      const landing = getDefaultLandingRoute()
      navigate(landing)
    } catch (err: any) {
      setError(
        err.message || 'An error occurred. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // --------------------------------------------------
  // Reusable Select Component
  // --------------------------------------------------

  const SelectField = ({
    id,
    name,
    label,
    icon,
    options,
    placeholder
  }: {
    id: string
    name: string
    label: string
    icon: React.ReactNode
    options: string[]
    placeholder: string
  }) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>

          <select
            id={id}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none"
          >
            <option value="">{placeholder}</option>

            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* --------------------------------------------- */}
        {/* Logo and Title */}
        {/* --------------------------------------------- */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>

          <p className="text-gray-600">
            Join CommunityConnect today
          </p>
        </div>

        {/* --------------------------------------------- */}
        {/* Signup Card */}
        {/* --------------------------------------------- */}

        <div className="bg-white rounded-lg shadow-xl p-8">

          {/* Google Sign Up */}
          {/* <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />

              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />

              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />

              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>

            Sign up with Google
          </button> */}

          {/* Divider */}
          {/* <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div> */}

          {/* --------------------------------------------- */}
          {/* Form */}
          {/* --------------------------------------------- */}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            autoComplete="off"
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* School Name */}
            <SelectField
              id="schoolName"
              name="schoolName"
              label="Select Your School Name"
              icon={<School className="w-5 h-5" />}
              options={schoolNames}
              placeholder="Select your school"
            />

            {/* School State */}
            <SelectField
              id="state"
              name="state"
              label="Select Your State"
              icon={<MapPin className="w-5 h-5" />}
              options={states}
              placeholder="Select your school state"
            />

            {/* School Region */}
            <SelectField
              id="schoolRegion"
              name="schoolRegion"
              label="Select Your School Region"
              icon={<MapPin className="w-5 h-5" />}
              options={schoolRegions}
              placeholder="Select school region"
            />

            {/* Passout Year */}
            <div>
              <label
                htmlFor="passoutYear"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Passout Year
              </label>

              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="passoutYear"
                  name="passoutYear"
                  type="number"
                  value={formData.passoutYear}
                  onChange={handleChange}
                  required
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Example: 2015"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email ID
                <span className="ml-2 text-xs text-gray-400">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="10 digit mobile number"
                />
              </div>
            </div>

            {/* Role */}
            <SelectField
              id="role"
              name="role"
              label="Role"
              icon={<Briefcase className="w-5 h-5" />}
              options={roles}
              placeholder="Select your role"
            />

            {/* University */}
            <SelectField
              id="university"
              name="university"
              label="University"
              icon={<GraduationCap className="w-5 h-5" />}
              options={universities}
              placeholder="Select your university"
            />

            {/* Current State */}
            <SelectField
              id="currentState"
              name="currentState"
              label="Current State"
              icon={<MapPin className="w-5 h-5" />}
              options={states}
              placeholder="Select your current state"
            />

            {/* Current District */}
            <SelectField
              id="currentDistrict"
              name="currentDistrict"
              label="Select Your Current District"
              icon={<MapPin className="w-5 h-5" />}
              options={districts}
              placeholder="Select your current district"
            />

            {/* Blood Group */}
            <SelectField
              id="bloodGroup"
              name="bloodGroup"
              label="Select Your Blood Group"
              icon={<Droplet className="w-5 h-5" />}
              options={bloodGroups}
              placeholder="Select your blood group"
            />

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Terms */}
            <div className="md:col-span-2 flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />

              <label
                htmlFor="terms"
                className="ml-2 text-sm text-gray-600"
              >
                I agree to the{' '}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* --------------------------------------------- */}
          {/* Sign In Link */}
          {/* --------------------------------------------- */}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* --------------------------------------------- */}
        {/* Footer */}
        {/* --------------------------------------------- */}

        <p className="text-center text-sm text-gray-500 mt-8">
          © 2024 CommunityConnect. All rights reserved.
        </p>
      </div>
    </div>
  )
}

// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { UserPlus, Users, Mail, Lock, User } from 'lucide-react'
// import { useAuth } from '../context/AuthContext'
// import authService from '../services/authService'

// export function SignupPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   })
//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const { login, loginWithGoogle } = useAuth()
//   const navigate = useNavigate()

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       return
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters')
//       return
//     }

//     setIsLoading(true)

//     try {
//       // Call the .NET API register endpoint
//       const response = await authService.register(formData.email, formData.password)

//       // Fetch user profile from backend
//       try {
//         const userProfile = await authService.getUserProfile()

//         // Update Auth Context with real user data from backend
//         login({
//           id: userProfile.userId,
//           name: userProfile.name,
//           email: userProfile.email,
//           avatar: userProfile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&background=random`
//         })
//       } catch (profileError) {
//         // If profile fetch fails, use form data
//         console.warn('Failed to fetch user profile:', profileError)
//         login({
//           id: response.userId,
//           name: formData.name,
//           email: response.email,
//           avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
//         })
//       }

//       navigate('/')
//     } catch (err: any) {
//       setError(err.message || 'An error occurred. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleGoogleSignup = async () => {
//     setIsLoading(true)
//     setError('')

//     try {
//       await loginWithGoogle()
//       navigate('/')
//     } catch (err: any) {
//       setError(err.message || 'Failed to sign up with Google')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo and Title */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
//             <Users className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
//           <p className="text-gray-600">Join CommunityConnect today</p>
//         </div>

//         {/* Signup Card */}
//         <div className="bg-white rounded-lg shadow-xl p-8">
//           {/* Google Sign Up Button */}
//           <button
//             type="button"
//             onClick={handleGoogleSignup}
//             disabled={isLoading}
//             className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
//           >
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="#34A853"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="#EA4335"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//             Sign up with Google
//           </button>

//           {/* Divider */}
//           <div className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or continue with email</span>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Name Input */}
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   placeholder="John Doe"
//                 />
//               </div>
//             </div>

//             {/* Email Input */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   placeholder="you@example.com"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             {/* Confirm Password Input */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type="password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             {/* Terms and Conditions */}
//             <div className="flex items-start">
//               <input
//                 id="terms"
//                 type="checkbox"
//                 required
//                 className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//               />
//               <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
//                 I agree to the{' '}
//                 <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
//                   Terms of Service
//                 </a>{' '}
//                 and{' '}
//                 <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
//                   Privacy Policy
//                 </a>
//               </label>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Creating account...
//                 </>
//               ) : (
//                 <>
//                   <UserPlus className="w-5 h-5" />
//                   Create Account
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Sign In Link */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-sm text-gray-500 mt-8">
//           © 2024 CommunityConnect. All rights reserved.
//         </p>
//       </div>
//     </div>
//   )
// }
