# CommunityConnect Mobile - React Native Implementation Prompts

## 📱 Complete React Native Mobile App Development Guide

This document contains **50+ ready-to-use prompts** for building the CommunityConnect mobile app using React Native.

---

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Architecture & Structure](#architecture--structure)
3. [Authentication](#authentication)
4. [Navigation](#navigation)
5. [Screens & Features](#screens--features)
6. [Components](#components)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Offline Support](#offline-support)
10. [Push Notifications](#push-notifications)
11. [Performance](#performance)
12. [Testing](#testing)

---

## 🎯 Project Overview

### App Name
**CommunityConnect Mobile**

### Platforms
- iOS (iPhone, iPad)
- Android (Phone, Tablet)

### Tech Stack
- **Framework**: React Native (Expo or bare workflow)
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: Redux Toolkit + RTK Query OR Zustand + React Query
- **UI Library**: React Native Paper OR NativeBase
- **Forms**: React Hook Form + Zod validation
- **Storage**: AsyncStorage + MMKV
- **Authentication**: JWT with secure storage
- **API Client**: Axios
- **Push Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Sentry

---

## 1. PROJECT SETUP

### Prompt 1: Initialize Project with Expo

```
Create a React Native mobile app using Expo with TypeScript for CommunityConnect.

Requirements:
- Use Expo SDK 50+
- TypeScript configuration
- ESLint and Prettier setup
- Folder structure following best practices:
  /src
	/screens
	/components
	/navigation
	/services
	/store (or /state)
	/utils
	/types
	/constants
	/assets
	/hooks
  /app.json with proper configuration
  /tsconfig.json
  /package.json with essential dependencies

Dependencies to include:
- @react-navigation/native
- @react-navigation/stack
- @react-navigation/bottom-tabs
- axios
- react-hook-form
- @hookform/resolvers
- zod
- date-fns
- react-native-paper (or native-base)
- @react-native-async-storage/async-storage
- expo-secure-store
- expo-notifications

Setup scripts for:
- npm start (start expo)
- npm run android
- npm run ios
- npm run lint
- npm run type-check
```

### Prompt 2: Initialize Bare React Native Project (Alternative)

```
Create a bare React Native project (no Expo) for CommunityConnect mobile app.

Requirements:
- React Native 0.73+
- TypeScript setup
- iOS and Android project configuration
- CocoaPods for iOS
- Gradle configuration for Android
- Same folder structure as Prompt 1
- React Native CLI scripts

Additional native dependencies:
- react-native-vector-icons
- react-native-keychain (secure storage)
- @react-native-firebase/app
- @react-native-firebase/messaging
- react-native-push-notification
- react-native-fast-image

Include setup instructions for:
- iOS Pod installation
- Android Gradle sync
- Firebase configuration (iOS & Android)
- Linking native modules
```

---

## 2. ARCHITECTURE & STRUCTURE

### Prompt 3: Project Architecture Setup

```
Set up the architecture for CommunityConnect mobile app following clean architecture principles.

Create the following structure with TypeScript:

1. **Services Layer** (/src/services)
   - AuthService.ts (authentication API calls)
   - UserService.ts (user profile operations)
   - EventService.ts (event CRUD operations)
   - DiscussionService.ts (forum operations)
   - NotificationService.ts (notifications)
   - API client with interceptors for:
	 - JWT token attachment
	 - Token refresh on 401
	 - Error handling
	 - Request/response logging

2. **Types** (/src/types)
   - User.ts
   - Event.ts
   - Discussion.ts
   - Announcement.ts
   - API response types
   - Navigation types

3. **Constants** (/src/constants)
   - API endpoints
   - App configuration
   - Colors and theme
   - Dimensions

4. **Utils** (/src/utils)
   - formatDate.ts
   - validation.ts
   - storage.ts
   - errorHandler.ts

Include:
- Base API client with Axios
- TypeScript interfaces for all data models
- Error boundary component
- Loading states handling
```

### Prompt 4: State Management with Redux Toolkit

```
Set up Redux Toolkit for state management in CommunityConnect mobile app.

Create the following Redux slices:

1. **authSlice.ts**
   - State: user, tokens (access, refresh), isAuthenticated, loading
   - Actions: login, logout, register, refreshToken, updateProfile
   - Async thunks for API calls

2. **eventsSlice.ts**
   - State: events list, selectedEvent, filters, loading, error
   - Actions: fetchEvents, fetchEventById, createEvent, updateEvent, rsvpEvent
   - Pagination support

3. **discussionsSlice.ts**
   - State: discussions, comments, loading
   - Actions: fetchDiscussions, createDiscussion, addComment, addReaction

4. **notificationsSlice.ts**
   - State: notifications, unreadCount
   - Actions: fetchNotifications, markAsRead, clearAll

5. **Store configuration**
   - Redux Toolkit store setup
   - Redux persist for offline support
   - Redux DevTools integration

Include:
- RTK Query setup for caching and automatic refetching
- TypeScript types for all slices
- Selectors for derived state
- Middleware for token refresh
```

### Prompt 5: State Management with Zustand + React Query (Alternative)

```
Set up lightweight state management using Zustand and React Query for CommunityConnect mobile app.

Create:

1. **Zustand stores** (/src/store)
   - useAuthStore.ts
	 - user, tokens, login(), logout(), setUser()
   - useAppStore.ts
	 - theme, language, settings
   - useUIStore.ts
	 - modals, toasts, loading states

2. **React Query setup** (/src/hooks/queries)
   - useEvents.ts (useQuery for events list)
   - useEvent.ts (useQuery for single event)
   - useCreateEvent.ts (useMutation for creating event)
   - useDiscussions.ts
   - useProfile.ts
   - Query client configuration with:
	 - Caching strategy
	 - Stale time
	 - Retry logic
	 - Optimistic updates

3. **Custom hooks**
   - useAuth.ts (authentication logic)
   - useRefreshToken.ts (token refresh)
   - useNetworkStatus.ts (online/offline)

Include TypeScript types for all stores and queries.
```

---

## 3. AUTHENTICATION

### Prompt 6: Authentication Flow - Login Screen

```
Create a Login screen for CommunityConnect mobile app using React Native.

Requirements:

**UI Components:**
- App logo at top
- Email input field with validation
- Password input field with show/hide toggle
- "Forgot Password?" link
- Login button with loading state
- "Sign in with Google" button
- "Don't have an account? Sign up" link

**Functionality:**
- Form validation using react-hook-form and zod
  - Email format validation
  - Password minimum 6 characters
  - Show error messages below fields
- API call to POST /api/auth/login
- Store JWT tokens in SecureStore (Expo) or Keychain (React Native)
- Navigate to main app on success
- Show error toast on failure
- Loading spinner on button during API call

**State Management:**
- Use Redux authSlice or Zustand authStore
- Update user state on successful login
- Set isAuthenticated to true

**Styling:**
- Use React Native Paper or NativeBase
- Follow design system (colors, spacing, typography)
- Responsive design (safe area insets)
- Keyboard-aware scroll view

Include TypeScript types for form data and API response.
```

### Prompt 7: Authentication Flow - Registration Screen

```
Create a Registration/Signup screen for CommunityConnect mobile app.

**UI Components:**
- App logo
- Full Name input
- Email input
- Password input with strength indicator
- Confirm Password input
- Terms and Conditions checkbox
- Sign Up button
- "Sign up with Google" button
- "Already have an account? Sign in" link

**Functionality:**
- Multi-step form (optional: split into 3 screens)
  - Step 1: Name and Email
  - Step 2: Password
  - Step 3: Additional info (JNV, Batch)
- Validation:
  - Name: required, min 2 characters
  - Email: valid format, check availability
  - Password: min 8 chars, uppercase, lowercase, number, special char
  - Confirm password: must match
- Password strength indicator (weak/medium/strong)
- API call to POST /api/auth/register
- Auto-login after successful registration
- Send to profile completion screen

**Google OAuth:**
- Integrate Google Sign-In
- Handle OAuth flow
- POST /api/auth/google with ID token

Include form validation schemas and TypeScript types.
```

### Prompt 8: Secure Token Storage

```
Implement secure token storage for JWT tokens in CommunityConnect mobile app.

**Requirements:**

1. **Storage Service** (src/services/StorageService.ts)
   - saveTokens(accessToken, refreshToken)
   - getAccessToken()
   - getRefreshToken()
   - clearTokens()
   - Use expo-secure-store for Expo
   - Use react-native-keychain for bare React Native

2. **API Interceptor**
   - Attach access token to all API requests
   - Intercept 401 responses
   - Auto-refresh token using refresh token
   - Retry original request with new token
   - Logout user if refresh fails

3. **Token Refresh Logic**
   - Check token expiration before requests
   - Proactively refresh if expiring soon (< 5 min)
   - Queue requests during token refresh
   - Avoid multiple simultaneous refresh calls

4. **Security Best Practices**
   - Never log tokens
   - Clear tokens on logout
   - Encrypt sensitive data
   - Use biometric authentication (optional)

Include TypeScript interfaces and error handling.
```

### Prompt 9: Biometric Authentication

```
Add biometric authentication (Face ID / Touch ID / Fingerprint) to CommunityConnect mobile app.

**Requirements:**

1. **Feature Check**
   - Check if biometric hardware is available
   - Check if user has enrolled biometrics
   - Fallback to PIN if not available

2. **Enable Biometric Login**
   - Setting in user profile to enable/disable
   - Store flag in AsyncStorage
   - Show biometric prompt on subsequent app opens

3. **Implementation**
   - Use expo-local-authentication (Expo)
   - Use react-native-biometrics (bare RN)
   - Show biometric prompt after splash screen
   - On success: auto-login with stored tokens
   - On failure: show login screen
   - Option to cancel and enter password

4. **UI**
   - Biometric icon on login screen
   - Toggle in settings screen
   - Loading state during authentication

5. **Security**
   - Don't store password
   - Only use for token retrieval
   - Re-authenticate periodically (e.g., after 7 days)

Include platform-specific code for iOS and Android.
```

---

## 4. NAVIGATION

### Prompt 10: Navigation Structure Setup

```
Set up React Navigation for CommunityConnect mobile app with TypeScript.

**Navigation Structure:**

1. **Root Navigator** (Stack)
   - SplashScreen
   - AuthNavigator (if not authenticated)
   - MainNavigator (if authenticated)

2. **Auth Navigator** (Stack)
   - LoginScreen
   - SignupScreen
   - ForgotPasswordScreen
   - ResetPasswordScreen

3. **Main Navigator** (Bottom Tabs)
   - HomeTab (Stack Navigator)
   - EventsTab (Stack Navigator)
   - DiscussionsTab (Stack Navigator)
   - ProfileTab (Stack Navigator)

4. **Home Stack**
   - HomeScreen (Dashboard)
   - AnnouncementDetailScreen

5. **Events Stack**
   - EventsListScreen
   - EventDetailScreen
   - EventBookingScreen
   - TrekkingListScreen
   - TrekkingDetailScreen
   - CreateEventScreen

6. **Discussions Stack**
   - DiscussionsListScreen
   - DiscussionDetailScreen
   - CreateDiscussionScreen

7. **Profile Stack**
   - ProfileScreen
   - EditProfileScreen
   - SettingsScreen
   - NotificationsScreen
   - MyEventsScreen
   - SavedEventsScreen

**Configuration:**
- TypeScript navigation types
- Deep linking configuration
- Transition animations
- Header customization
- Tab bar icons (using vector icons)
- Badge for notifications count

**Theme:**
- Light and dark mode support
- Custom colors matching brand
- Typography and spacing

Include navigation prop types and screen options.
```

### Prompt 11: Bottom Tab Navigator with Custom Icons

```
Create a custom bottom tab navigator for CommunityConnect mobile app.

**Tabs:**

1. **Home**
   - Icon: home (active: solid, inactive: outline)
   - Label: "Home"
   - Badge: none

2. **Events**
   - Icon: calendar
   - Label: "Events"
   - Badge: upcoming events count

3. **Discussions**
   - Icon: message-square
   - Label: "Forums"
   - Badge: unread count

4. **Profile**
   - Icon: user
   - Label: "Profile"
   - Badge: none

**Custom Tab Bar:**
- Animated active indicator
- Custom styling with elevation/shadow
- Smooth transitions
- Haptic feedback on press
- Hide tab bar on keyboard open
- Safe area insets for iOS

**Icons:**
- Use react-native-vector-icons or @expo/vector-icons
- Icon library: Ionicons, MaterialCommunityIcons, or Feather
- Size: 24px
- Colors: active (primary color), inactive (gray)

Include TypeScript types for tab params and custom tab bar component.
```

---

## 5. SCREENS & FEATURES

### Prompt 12: Home/Dashboard Screen

```
Create the Home (Dashboard) screen for CommunityConnect mobile app.

**Layout:**

1. **Header**
   - User avatar (top right)
   - App logo (center)
   - Notification bell icon with badge (top right)

2. **Welcome Section**
   - "Welcome back, {User Name}!"
   - User's JNV and batch info

3. **Quick Stats Cards** (Horizontal ScrollView)
   - Total Events card
   - Upcoming Events card
   - Active Discussions card
   - Member Count card

4. **Featured Events** (Carousel)
   - Horizontal scrollable
   - Event image, title, date
   - "View All" button

5. **Recent Announcements** (List)
   - Show 3 recent announcements
   - Priority indicator (High = red dot)
   - "See All" link

6. **Quick Actions** (Grid)
   - Create Event button
   - Find Members button
   - New Discussion button
   - My Bookings button

**Functionality:**
- Pull-to-refresh
- Fetch dashboard data from API
- Navigate to respective screens on tap
- Skeleton loading placeholders
- Error state with retry button

**Styling:**
- Cards with elevation/shadow
- Smooth scrolling
- Vibrant colors for stats
- Responsive spacing

Include API integration with React Query or Redux.
```

### Prompt 13: Events List Screen

```
Create the Events List screen with filtering and search for CommunityConnect mobile app.

**UI Components:**

1. **Search Bar**
   - Search input with icon
   - Clear button
   - Debounced search (300ms)

2. **Filter Bar** (Horizontal ScrollView)
   - All, Workshop, Trekking, Networking, Sports, Cultural, Social
   - Active filter highlighted
   - Multi-select option

3. **Sort Options** (Dropdown)
   - Date (Upcoming first)
   - Date (Latest first)
   - Popularity
   - Price (Low to High)

4. **Events List** (FlatList)
   - Event card with:
	 - Event image (thumbnail)
	 - Title
	 - Date and time
	 - Location (or "Online")
	 - Price (or "Free")
	 - RSVP count (e.g., "45 going")
	 - "RSVP" button
   - Optimized rendering with getItemLayout
   - Pull-to-refresh
   - Infinite scroll pagination

5. **Floating Action Button**
   - "+" button for creating event (if user has permission)

**Functionality:**
- Filter events by category
- Search events by title/description
- Sort events
- Navigate to event detail on tap
- Quick RSVP from list
- Show loading skeleton
- Empty state if no events
- Error state with retry

**API:**
- GET /api/events?page=1&limit=20&category={cat}&search={query}&sort={sort}
- POST /api/events/{id}/rsvp (quick RSVP)

Include TypeScript types and state management.
```

### Prompt 14: Event Detail Screen

```
Create the Event Detail screen for CommunityConnect mobile app.

**Layout:**

1. **Header Image**
   - Full-width event banner
   - Back button (top left)
   - Share button (top right)
   - Bookmark button (top right)

2. **Event Info Section**
   - Category badge
   - Event title
   - Date and time with icon
   - Location with map preview (if physical)
   - Online meeting link (if virtual)
   - Organizer info (avatar, name)

3. **Description**
   - Full event description
   - "Read more" expandable text

4. **Details Cards**
   - Duration
   - Max attendees / Current count
   - Price (or Free)
   - Registration deadline

5. **Attendees Section**
   - Show avatars of attendees (first 5)
   - "+20 more going" text
   - "View All" button

6. **Similar Events**
   - Horizontal scrollable list
   - 3-4 similar events

7. **Bottom Action Bar**
   - RSVP Button (primary)
   - Share Button (secondary)
   - Bookmark Button (icon only)

**Functionality:**
- Fetch event details from API
- RSVP / Cancel RSVP
- Share event (React Native Share API)
- Save/bookmark event
- Show RSVP confirmation modal
- Navigate to payment if event is paid
- Show QR code after successful booking
- Add to calendar option

**States:**
- Loading skeleton
- Error state
- RSVP success/failure toast
- Disabled RSVP if event is full or deadline passed

**API:**
- GET /api/events/{id}
- POST /api/events/{id}/rsvp
- DELETE /api/events/{id}/rsvp (cancel)
- POST /api/events/{id}/bookmark

Include TypeScript types and animations.
```

### Prompt 15: Trekking Events Screen

```
Create a dedicated Trekking Events screen for CommunityConnect mobile app.

**UI Components:**

1. **Hero Section**
   - Background image (mountains)
   - "Explore Treks" heading
   - Search bar

2. **Difficulty Filter Chips**
   - Easy, Moderate, Hard, Expert
   - Multi-select with checkboxes

3. **Additional Filters** (Expandable)
   - Duration (1 day, 2-3 days, 4-7 days, 7+ days)
   - Max Altitude (sliders)
   - Price range
   - Dates (date picker)
   - Guide included toggle

4. **Trek Cards** (FlatList)
   - Trek image
   - Trek name
   - Difficulty badge with color coding
   - Duration (e.g., "5 days")
   - Distance (e.g., "45 km")
   - Max altitude (e.g., "4,500m")
   - Price
   - Rating (stars)
   - "Book Now" button

5. **Trek Detail Screen** (Navigate on card tap)
   - All standard event details
   - Plus trekking-specific:
	 - Difficulty description
	 - Itinerary (day-by-day)
	 - Required equipment list
	 - Provided equipment list
	 - Fitness requirements
	 - Age restrictions
	 - Safety information
	 - Guide information
	 - Medical support details

**Functionality:**
- Filter by difficulty, duration, altitude
- Search treks
- View trek route on map
- Download itinerary PDF
- Book trek
- Share trek with friends
- Save to wishlist

**API:**
- GET /api/events/trekking?difficulty={}&duration={}
- GET /api/events/trekking/{id}

Include animations for difficulty badges and custom icons.
```

### Prompt 16: Discussions (Forum) Screen

```
Create the Discussions/Forum screen for CommunityConnect mobile app.

**UI Components:**

1. **Header**
   - "Discussions" title
   - Search icon (top right)
   - Filter icon (top right)

2. **Category Tabs** (Horizontal ScrollView)
   - All, General, Events, Trekking, Alumni, Help
   - Active tab highlighted

3. **Sort Options** (Dropdown)
   - Latest Activity
   - Most Popular
   - Most Comments
   - Newest

4. **Discussion List** (FlatList)
   - Each discussion card:
	 - Author avatar
	 - Author name and JNV
	 - Discussion title
	 - Preview text (2 lines)
	 - Category badge
	 - View count, comment count, reaction count
	 - Time posted (relative, e.g., "2 hours ago")
	 - Pinned indicator (if pinned)
   - Infinite scroll
   - Pull-to-refresh

5. **Floating Action Button**
   - "+" button to create new discussion

6. **Empty State**
   - "No discussions yet"
   - "Be the first to start a conversation!" button

**Functionality:**
- Filter by category
- Search discussions
- Sort discussions
- Navigate to discussion detail
- Create new discussion
- Show loading skeleton
- Pull-to-refresh

**API:**
- GET /api/discussions?category={}&sort={}&page={}
- POST /api/discussions

Include swipe gestures for quick actions (save, share).
```

### Prompt 17: Discussion Detail Screen

```
Create the Discussion Detail screen (thread view) for CommunityConnect mobile app.

**Layout:**

1. **Discussion Header**
   - Author avatar
   - Author name and badge
   - Time posted
   - More options menu (report, edit, delete)

2. **Discussion Content**
   - Title (large, bold)
   - Category badge
   - Full discussion text
   - Images (if any)
   - Tags

3. **Reaction Bar**
   - Like, Love, Helpful, Insightful buttons
   - Reaction count
   - Comment count
   - Share button

4. **Comments Section**
   - "Comments ({count})" heading
   - Sort options (Newest, Oldest, Most Liked)
   - Comment list (FlatList)
	 - Each comment:
	   - Author avatar
	   - Author name
	   - Comment text
	   - Time posted
	   - Like button and count
	   - Reply button
	   - More options (report, delete)
   - Nested replies (indented)
   - "Show more replies" button

5. **Bottom Input Bar**
   - Comment text input
   - Attachment button (optional)
   - Send button

**Functionality:**
- Fetch discussion and comments
- Add reaction to discussion
- Post comment
- Reply to comment (nested)
- Like comment
- Edit own discussion/comment
- Delete own discussion/comment
- Report inappropriate content
- Share discussion
- Real-time updates (optional: WebSocket)

**States:**
- Loading
- Error with retry
- Empty comments state
- Posting comment (loading)
- Success toast after posting

**API:**
- GET /api/discussions/{id}
- GET /api/discussions/{id}/comments
- POST /api/discussions/{id}/comments
- POST /api/discussions/{id}/reactions
- POST /api/comments/{id}/reactions

Include Keyboard-aware scrolling and animations.
```

### Prompt 18: Create Discussion Screen

```
Create the "New Discussion" screen for CommunityConnect mobile app.

**UI Components:**

1. **Form Fields**
   - Title input
	 - Placeholder: "What's on your mind?"
	 - Max 200 characters
	 - Character counter

   - Category picker (dropdown)
	 - General, Events, Trekking, Alumni, Help

   - Description input (multiline)
	 - Placeholder: "Write your discussion..."
	 - Min 20 characters
	 - Rich text editor (optional): bold, italic, bullet points

   - Tags input
	 - Add tags chip
	 - Max 5 tags
	 - Tag suggestions

   - Image picker (optional)
	 - "Add Image" button
	 - Show selected images (up to 3)
	 - Remove image option

2. **Bottom Action Bar**
   - "Discard" button (secondary)
   - "Post Discussion" button (primary)

**Functionality:**
- Form validation
  - Title required, 10-200 chars
  - Category required
  - Description required, min 20 chars
- Image selection from gallery or camera
- Image compression before upload
- API call to create discussion
- Navigate back on success
- Show confirmation dialog on discard
- Save draft (optional: AsyncStorage)
- Loading state during API call

**Validation:**
- Show error messages below fields
- Disable post button until valid
- Use react-hook-form and zod

**API:**
- POST /api/discussions
- POST /api/media/upload (for images)

Include TypeScript types and keyboard handling.
```

### Prompt 19: Profile Screen

```
Create the User Profile screen for CommunityConnect mobile app.

**Layout:**

1. **Header Image** (Optional cover photo)
   - Gradient background if no cover photo

2. **Profile Info Section**
   - Avatar (large, circular)
   - Edit button (if own profile)
   - Name
   - JNV name and Batch
   - Bio (2-3 lines)
   - Location (city, state)
   - Member since date

3. **Stats Row**
   - Events Attended
   - Discussions Posted
   - Connections

4. **Action Buttons** (if not own profile)
   - Connect button
   - Message button (future)

5. **Tabs**
   - About
   - Events (Organized, Attended, Saved)
   - Discussions (Created, Commented)

6. **About Tab**
   - Contact info (email, phone - private)
   - Social links (LinkedIn, Twitter, GitHub)
   - Education (JNV details, batch year)
   - Current work/study
   - Interests/hobbies

7. **Events Tab**
   - Upcoming events
   - Past events
   - Organized events (if organizer)
   - Saved events

8. **Discussions Tab**
   - Recent discussions created
   - Recent comments/replies

9. **Settings Button** (if own profile)
   - Gear icon in header

**Functionality:**
- Fetch user profile data
- Edit profile (navigate to edit screen)
- View events/discussions
- Connect with user
- Share profile
- Report user (if not own)
- Refresh data

**API:**
- GET /api/users/{id}
- GET /api/users/{id}/events
- GET /api/users/{id}/discussions
- POST /api/users/{id}/connect

Include pull-to-refresh and loading states.
```

### Prompt 20: Edit Profile Screen

```
Create the Edit Profile screen for CommunityConnect mobile app.

**UI Components:**

1. **Avatar Section**
   - Current avatar (large)
   - "Change Photo" button
   - Options: Take Photo, Choose from Gallery, Remove Photo

2. **Cover Photo Section**
   - Current cover photo
   - "Change Cover" button

3. **Form Fields**
   - First Name
   - Last Name
   - Display Name (optional)
   - Bio (multiline, max 150 chars)
   - Date of Birth (date picker)
   - Gender (dropdown)
   - Phone Number
   - Email (read-only)

4. **JNV Information**
   - JNV name (dropdown/autocomplete)
   - Batch year
   - Student ID

5. **Address**
   - Address Line 1
   - Address Line 2
   - City
   - State
   - Country
   - Postal Code

6. **Social Links**
   - LinkedIn URL
   - Twitter handle
   - GitHub username

7. **Privacy Settings**
   - Profile visibility (Public/Private)
   - Show email toggle
   - Show phone toggle

8. **Bottom Actions**
   - Cancel button
   - Save button

**Functionality:**
- Pre-fill with current data
- Form validation
- Image crop after selection
- Image compression
- Upload images to media service
- API call to update profile
- Show loading during save
- Success message on save
- Navigate back on success

**Validation:**
- Name: required, 2-50 chars
- Bio: max 150 chars
- Phone: valid format
- URLs: valid format

**API:**
- GET /api/users/me
- PUT /api/users/me
- POST /api/media/upload

Include optimistic updates and error handling.
```

### Prompt 21: Settings Screen

```
Create the Settings screen for CommunityConnect mobile app.

**Sections:**

1. **Account Settings**
   - Edit Profile
   - Change Password
   - Email Preferences
   - Privacy Settings
   - Connected Accounts (Google, Facebook)

2. **Notifications**
   - Push Notifications toggle
   - Email Notifications toggle
   - Event Reminders toggle
   - Discussion Updates toggle
   - Announcement Alerts toggle
   - In-App Sounds toggle

3. **Appearance**
   - Theme (Light, Dark, Auto)
   - Language (English, Hindi, etc.)
   - Text Size slider

4. **Security**
   - Enable Biometric Login toggle
   - Auto-Lock timeout
   - Two-Factor Authentication (future)

5. **Data & Storage**
   - Cache size (show size)
   - Clear Cache button
   - Download Quality (High, Medium, Low)
   - Auto-Download Media toggle

6. **About**
   - App Version
   - Terms & Conditions
   - Privacy Policy
   - Help & Support
   - Rate App
   - Share App

7. **Danger Zone**
   - Logout button (red)
   - Delete Account button (red)

**Functionality:**
- Save preferences to AsyncStorage
- Sync preferences with backend
- Clear app cache
- Logout confirmation
- Delete account confirmation (with password)
- Show app version
- Open external links (T&C, Privacy)
- Native share for "Share App"

**API:**
- GET /api/users/preferences
- PUT /api/users/preferences
- POST /api/auth/logout
- DELETE /api/users/me

Include confirmation dialogs for destructive actions.
```

### Prompt 22: Notifications Screen

```
Create the Notifications screen for CommunityConnect mobile app.

**UI Components:**

1. **Header**
   - "Notifications" title
   - Mark All as Read button
   - Filter icon (All, Unread, Events, Discussions)

2. **Notifications List** (FlatList)
   - Each notification:
	 - Icon based on type (event, discussion, announcement)
	 - Avatar of sender (if applicable)
	 - Notification title (bold if unread)
	 - Notification message
	 - Time (relative: "2h ago")
	 - Unread indicator (blue dot)
	 - Action button (View, RSVP, etc.)
   - Group by date (Today, Yesterday, This Week, Older)
   - Swipe to delete
   - Pull-to-refresh

3. **Empty State**
   - Icon
   - "No notifications yet"
   - "You're all caught up!"

**Notification Types:**

1. **Event Notifications**
   - Event RSVP confirmation
   - Event reminder (24h, 1h before)
   - Event update/cancellation
   - New event in category of interest

2. **Discussion Notifications**
   - Reply to your comment
   - Mention in discussion
   - New comment on followed discussion

3. **Announcement Notifications**
   - New high-priority announcement
   - Announcement relevant to user

4. **Social Notifications**
   - New connection request
   - Connection accepted
   - Profile view

**Functionality:**
- Fetch notifications from API
- Mark as read on tap
- Mark all as read
- Delete notification
- Navigate to relevant screen on tap
- Real-time updates (optional: push or polling)
- Badge count on app icon

**API:**
- GET /api/notifications?filter={}&page={}
- PUT /api/notifications/{id}/mark-read
- PUT /api/notifications/mark-all-read
- DELETE /api/notifications/{id}

Include animations for read/unread transitions.
```

---

## 6. COMPONENTS

### Prompt 23: Reusable Button Component

```
Create a reusable Button component for CommunityConnect mobile app.

**Props:**
- title: string (button text)
- onPress: () => void
- variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- size: 'sm' | 'md' | 'lg'
- disabled: boolean
- loading: boolean
- icon: ReactNode (optional icon on left)
- iconRight: ReactNode (optional icon on right)
- fullWidth: boolean

**Variants:**
- primary: blue background, white text
- secondary: gray background, white text
- outline: transparent background, blue border, blue text
- ghost: transparent background, blue text
- danger: red background, white text

**Sizes:**
- sm: 32px height, 12px padding
- md: 44px height, 16px padding
- lg: 52px height, 20px padding

**States:**
- Default
- Pressed (slightly darker, scale 0.98)
- Disabled (opacity 0.5, no interaction)
- Loading (show ActivityIndicator, disable interaction)

**Features:**
- Haptic feedback on press
- Smooth animations
- Accessibility labels
- TypeScript props

Include usage examples.
```

### Prompt 24: Event Card Component

```
Create a reusable EventCard component for CommunityConnect mobile app.

**Props:**
- event: Event (event object with all details)
- onPress: () => void
- onRSVP: () => void (optional)
- variant: 'list' | 'grid' | 'featured'

**Event Card (List Variant):**
- Horizontal layout
- Left: Event image (80x80, rounded)
- Right: Event details
  - Title (1 line, ellipsize)
  - Date with calendar icon
  - Location with pin icon (or "Online")
  - Price or "Free"
  - RSVP count (e.g., "24 going")
- RSVP button on right
- Bookmark icon on top-right

**Event Card (Grid Variant):**
- Vertical layout
- Top: Event image (full width, 16:9 ratio)
- Bottom: Event details
  - Category badge
  - Title (2 lines)
  - Date
  - Price
  - Small RSVP button

**Event Card (Featured Variant):**
- Large card for carousel
- Full-width image background
- Gradient overlay
- Title and date overlay on image
- "View Details" button

**Features:**
- Optimized image loading (lazy load)
- Skeleton loader
- Press animation
- Bookmark toggle
- Quick RSVP from card
- Share button

Include TypeScript interface for Event type.
```

### Prompt 25: Discussion Card Component

```
Create a reusable DiscussionCard component for CommunityConnect mobile app.

**Props:**
- discussion: Discussion object
- onPress: () => void
- showActions: boolean (default true)

**Layout:**
- Header:
  - Author avatar (small, left)
  - Author name
  - Time posted (relative)
  - Category badge
  - Pin icon (if pinned)
- Body:
  - Discussion title (2 lines, bold)
  - Preview text (2-3 lines, gray)
  - Tags (chips, max 3 visible)
- Footer:
  - View count with eye icon
  - Comment count with comment icon
  - Reaction count with heart icon
- Actions (if showActions):
  - Bookmark button
  - Share button
  - More options menu

**Features:**
- Press animation
- Long press for context menu
- Highlight if unread
- Skeleton loader
- Optimistic updates

Include TypeScript types.
```

### Prompt 26: User Avatar Component

```
Create a reusable Avatar component for CommunityConnect mobile app.

**Props:**
- imageUrl: string | null
- name: string (for initials fallback)
- size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
- status: 'online' | 'offline' | 'busy' | null (optional status indicator)
- badge: string | number (optional badge, e.g., unread count)
- onPress: () => void (optional)

**Sizes:**
- xs: 24px
- sm: 32px
- md: 40px
- lg: 56px
- xl: 80px
- custom: number

**Features:**
- Load image from URI
- Fallback to initials if no image
- Initials in circle with color from name hash
- Circular or square (rounded) variant
- Status indicator (small circle on bottom-right)
- Badge (small circle on top-right)
- Skeleton loader while loading
- Error state (show generic avatar icon)
- Press animation (if onPress provided)

**Optimizations:**
- Use FastImage for better performance
- Cache images
- Placeholder while loading

Include TypeScript props and color hash function.
```

### Prompt 27: Bottom Sheet Component

```
Create a reusable BottomSheet component for CommunityConnect mobile app.

**Use Cases:**
- Filters sheet
- Sort options
- Share options
- Action menu
- Image picker options

**Props:**
- visible: boolean
- onClose: () => void
- children: ReactNode
- snapPoints: string[] (e.g., ['25%', '50%', '90%'])
- title: string (optional)
- closeOnBackdropPress: boolean (default true)

**Features:**
- Smooth slide-up animation
- Backdrop with opacity
- Drag handle at top
- Snap to different heights
- Dismiss on backdrop tap
- Dismiss on back button (Android)
- Keyboard-aware (adjust when keyboard opens)
- Safe area insets

**Implementation Options:**
- Use @gorhom/bottom-sheet library
- Or custom implementation with Animated API

**Variants:**
- Simple list of options
- Form bottom sheet
- Custom content bottom sheet

Include usage examples with TypeScript.
```

### Prompt 28: Search Bar Component

```
Create a reusable SearchBar component for CommunityConnect mobile app.

**Props:**
- placeholder: string
- onSearch: (query: string) => void
- debounce: number (default 300ms)
- autoFocus: boolean
- onClear: () => void
- loading: boolean (show loading indicator)

**Features:**
- Search icon on left
- Clear button on right (visible when text present)
- Debounced search (avoid API spam)
- Keyboard type: default
- Return key: search
- Blur on submit
- Loading indicator while searching
- Cancel button (iOS style)

**Styling:**
- Rounded corners
- Light background
- Border on focus
- Smooth transitions

**Accessibility:**
- Proper labels
- Keyboard navigation

Include TypeScript types and debounce logic.
```

### Prompt 29: Empty State Component

```
Create a reusable EmptyState component for CommunityConnect mobile app.

**Props:**
- icon: ReactNode
- title: string
- description: string
- actionText: string (optional)
- onAction: () => void (optional)
- illustration: string (optional image URL)

**Use Cases:**
- No events found
- No discussions yet
- No notifications
- No search results
- No internet connection
- Error state

**Layout:**
- Centered content
- Icon or illustration at top
- Title (bold, larger)
- Description (smaller, gray)
- Action button (if provided)

**Variants:**
- EmptyState (general)
- NoResults (for searches)
- ErrorState (for errors with retry)
- OfflineState (for no internet)

**Styling:**
- Use app theme colors
- Consistent spacing
- Subtle animations

Include common empty state messages as constants.
```

---

## 7. STATE MANAGEMENT

### Prompt 30: Global App State

```
Set up global app state for CommunityConnect mobile app.

**State to Manage:**

1. **Authentication State**
   - user: User | null
   - tokens: { access: string, refresh: string } | null
   - isAuthenticated: boolean
   - isLoading: boolean

2. **UI State**
   - theme: 'light' | 'dark' | 'auto'
   - language: string
   - onboarding_completed: boolean
   - active_tab: string

3. **Network State**
   - isOnline: boolean
   - isConnecting: boolean

4. **Notifications State**
   - notifications: Notification[]
   - unreadCount: number

5. **Cache State**
   - lastSync: Date
   - cachedData: { events: [], discussions: [] }

**Persistence:**
- Use Redux Persist or AsyncStorage
- Persist auth tokens securely
- Persist user preferences
- Clear sensitive data on logout

**Actions:**
- login, logout, updateUser
- setTheme, setLanguage
- setOnline, setOffline
- addNotification, clearNotifications
- syncData

Include TypeScript types for all state.
```

---

## 8. API INTEGRATION

### Prompt 31: API Client Setup

```
Create a centralized API client for CommunityConnect mobile app.

**Requirements:**

1. **Base API Client** (src/services/api.ts)
   - Axios instance with base URL
   - Request interceptors:
	 - Attach JWT token to headers
	 - Add request ID for tracking
	 - Log requests (dev only)
   - Response interceptors:
	 - Handle 401 (refresh token)
	 - Handle network errors
	 - Transform response data
	 - Log responses (dev only)

2. **Token Refresh Logic**
   - Detect 401 responses
   - Call refresh token endpoint
   - Retry original request with new token
   - Logout if refresh fails
   - Queue requests during refresh

3. **Error Handling**
   - Network errors (no internet)
   - Server errors (500+)
   - Authentication errors (401, 403)
   - Validation errors (400)
   - Timeout errors
   - Show appropriate messages

4. **Request Cancellation**
   - Cancel requests on screen unmount
   - Use AbortController

5. **Retry Logic**
   - Retry failed requests (max 3 times)
   - Exponential backoff
   - Only retry idempotent requests

**Configuration:**
- Base URL: environment variable
- Timeout: 30 seconds
- Headers: Content-Type, Accept, Authorization
- HTTPS only in production

**TypeScript:**
- Generic type for responses
- API error types
- Request/response types

Include usage examples for GET, POST, PUT, DELETE.
```

### Prompt 32: Offline Support

```
Implement offline support for CommunityConnect mobile app.

**Features:**

1. **Offline Detection**
   - Use @react-native-community/netinfo
   - Monitor network status
   - Show offline banner
   - Disable certain features when offline

2. **Data Caching**
   - Cache API responses in AsyncStorage
   - Cache timeout: 5 minutes
   - Serve stale data when offline
   - Sync when back online

3. **Offline Queue**
   - Queue POST/PUT/DELETE requests
   - Store in AsyncStorage
   - Retry when back online
   - Show pending changes indicator

4. **Optimistic Updates**
   - Update UI immediately
   - Revert on error
   - Show sync status

5. **Background Sync**
   - Sync data when app comes to foreground
   - Sync data every 5 minutes (when online)

**Implementation:**

1. **Network Monitor**
   - useNetworkStatus hook
   - Subscribe to network changes
   - Update global state

2. **Cache Manager**
   - saveToCache(key, data)
   - getFromCache(key)
   - clearCache()
   - isCacheValid(key)

3. **Offline Queue**
   - addToQueue(request)
   - processQueue()
   - clearQueue()

**UI Indicators:**
- Offline banner at top
- "Syncing..." indicator
- "Failed to sync" error

Include TypeScript types and examples.
```

---

## 9. PUSH NOTIFICATIONS

### Prompt 33: Push Notifications Setup

```
Set up push notifications for CommunityConnect mobile app using Firebase Cloud Messaging (FCM).

**Setup:**

1. **Firebase Configuration**
   - Install @react-native-firebase/app
   - Install @react-native-firebase/messaging
   - Configure iOS (APNs certificate)
   - Configure Android (google-services.json)

2. **Request Permission**
   - iOS: Request permission on first launch
   - Android: Auto-granted (SDK 33+)
   - Store permission status

3. **Get FCM Token**
   - Get device token on app launch
   - Send token to backend
   - Refresh token on change

4. **Handle Notifications**
   - Foreground: Show in-app notification
   - Background: Show system notification
   - Notification tap: Navigate to relevant screen

**Notification Handlers:**

1. **onNotificationOpenedApp** (background tap)
   - Extract notification data
   - Navigate to screen based on type
   - Event notification → EventDetailScreen
   - Discussion → DiscussionDetailScreen

2. **onMessage** (foreground)
   - Show custom in-app notification
   - Option to tap and navigate
   - Option to dismiss

3. **getInitialNotification** (app killed)
   - Check if app opened from notification
   - Navigate after login

**Notification Types:**
- Event reminder
- New announcement
- Discussion reply
- Connection request
- RSVP confirmation

**Backend Integration:**
- POST /api/users/fcm-token
- Backend sends push via FCM Admin SDK

Include platform-specific configuration and deep linking.
```

---

## 10. PERFORMANCE

### Prompt 34: Performance Optimization

```
Optimize performance for CommunityConnect mobile app.

**Optimizations:**

1. **Image Optimization**
   - Use FastImage library
   - Lazy load images
   - Image caching
   - Resize images on upload
   - Use WebP format
   - Placeholder while loading

2. **List Optimization** (FlatList)
   - Use getItemLayout for fixed height items
   - Set keyExtractor
   - Set windowSize (default 21)
   - Implement pagination
   - Use memo for list items
   - Avoid anonymous functions in renderItem

3. **Component Optimization**
   - Use React.memo for pure components
   - Use useMemo for expensive calculations
   - Use useCallback for functions passed as props
   - Avoid inline styles
   - Use PureComponent for class components

4. **Navigation Optimization**
   - Lazy load screens
   - Use screens with enableFreeze (React Navigation)
   - Optimize header animations
   - Reduce gestureHandlerRootView depth

5. **Bundle Size**
   - Enable Hermes engine
   - Tree shaking
   - Remove unused dependencies
   - Split bundles (if possible)

6. **Animation Optimization**
   - Use native driver for animations
   - Avoid animating layout properties
   - Use LayoutAnimation sparingly
   - Use Reanimated 2 for complex animations

7. **State Management**
   - Normalize state shape
   - Memoize selectors
   - Avoid unnecessary re-renders
   - Use Redux DevTools to monitor

8. **Network Optimization**
   - Request deduplication
   - Debounce search
   - Cancel inflight requests
   - Compress request/response

**Profiling:**
- Use React DevTools Profiler
- Use Flipper for debugging
- Monitor memory usage
- Track render times

Include before/after performance comparisons.
```

---

## 11. TESTING

### Prompt 35: Unit Testing Setup

```
Set up unit testing for CommunityConnect mobile app.

**Libraries:**
- Jest (test runner)
- @testing-library/react-native
- @testing-library/jest-native
- react-test-renderer

**Test Structure:**

1. **Component Tests** (__tests__/components/)
   - Button.test.tsx
   - EventCard.test.tsx
   - Avatar.test.tsx
   - Test rendering
   - Test user interactions
   - Test props variations
   - Test accessibility

2. **Hook Tests** (__tests__/hooks/)
   - useAuth.test.ts
   - useEvents.test.ts
   - Test hook logic
   - Mock API calls

3. **Utility Tests** (__tests__/utils/)
   - formatDate.test.ts
   - validation.test.ts
   - Test pure functions

4. **Redux Tests** (if using Redux)
   - authSlice.test.ts
   - Test reducers
   - Test async thunks
   - Mock API

**Example Test:**

```typescript
describe('Button Component', () => {
  it('renders correctly with title', () => {
	const { getByText } = render(<Button title="Press Me" onPress={() => {}} />);
	expect(getByText('Press Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
	const mockOnPress = jest.fn();
	const { getByText } = render(<Button title="Press Me" onPress={mockOnPress} />);
	fireEvent.press(getByText('Press Me'));
	expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
	const { getByText } = render(<Button title="Press Me" onPress={() => {}} disabled />);
	expect(getByText('Press Me')).toBeDisabled();
  });
});
```

**Mock Data:**
- Create mock user, events, discussions
- Store in __mocks__ folder

**Coverage:**
- Aim for 70%+ coverage
- Generate coverage report

Include jest.config.js and setup files.
```

---

## 12. DEPLOYMENT

### Prompt 36: iOS Build and Deployment

```
Prepare and deploy CommunityConnect mobile app to Apple App Store.

**Prerequisites:**
- Apple Developer Account ($99/year)
- Xcode 15+
- macOS

**Steps:**

1. **App Configuration**
   - Bundle identifier: com.communityconnect.app
   - Display name: CommunityConnect
   - Version: 1.0.0
   - Build number: 1

2. **App Icons and Launch Screen**
   - Create app icons (1024x1024)
   - Use React Native Asset Generator
   - Create launch screen (splash screen)

3. **Signing**
   - Create provisioning profile in Apple Developer Portal
   - Configure signing in Xcode
   - Use automatic signing (recommended)

4. **Build**
   - Archive app in Xcode
   - Product → Archive
   - Or use Fastlane for automation

5. **App Store Connect**
   - Create new app
   - Fill app information
   - Upload screenshots (6.5", 5.5")
   - Write description
   - Set pricing (Free)
   - Content rating

6. **Upload Build**
   - Distribute → App Store Connect
   - Wait for processing
   - Select build in App Store Connect

7. **Submit for Review**
   - Submit app
   - Review guidelines compliance
   - Wait 1-3 days for review

**Fastlane (Optional):**
- Install Fastlane
- Configure Appfile
- Configure Fastfile
- Run: fastlane ios release

Include checklist and common rejection reasons.
```

### Prompt 37: Android Build and Deployment

```
Prepare and deploy CommunityConnect mobile app to Google Play Store.

**Prerequisites:**
- Google Play Developer Account ($25 one-time)
- Android Studio

**Steps:**

1. **App Configuration**
   - Package name: com.communityconnect.app
   - Version name: 1.0.0
   - Version code: 1

2. **App Icon and Splash**
   - Create app icons (adaptive icons)
   - Create splash screen

3. **Generate Signing Key**
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

4. **Configure Gradle**
   - Add keystore config to android/app/build.gradle
   - Enable Proguard for release

5. **Build APK/AAB**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   - AAB file in: android/app/build/outputs/bundle/release/

6. **Google Play Console**
   - Create new app
   - Fill app information
   - Upload screenshots
   - Write description
   - Set content rating
   - Set pricing (Free)

7. **Upload Bundle**
   - Create release
   - Upload AAB
   - Fill release notes

8. **Submit for Review**
   - Submit app
   - Wait for review (few hours)

**Automation:**
- Use Fastlane for Android
- Or use GitHub Actions

Include build variant configuration and ProGuard rules.
```

---

## 🎯 App Features Summary

### Core Features (MVP)
1. ✅ User Authentication (Email/Password, Google OAuth)
2. ✅ User Profile Management
3. ✅ Events List and Detail
4. ✅ Event RSVP
5. ✅ Trekking Events
6. ✅ Discussion Forums
7. ✅ Announcements
8. ✅ Notifications
9. ✅ Search and Filters
10. ✅ Offline Support

### Advanced Features (v2.0)
1. ✅ Real-time Chat
2. ✅ Video Calls
3. ✅ Payment Integration
4. ✅ QR Code Scanning
5. ✅ Maps Integration
6. ✅ Calendar Sync
7. ✅ Social Sharing
8. ✅ Analytics Dashboard
9. ✅ Multi-language Support
10. ✅ Dark Mode

---

## 📦 Dependencies List

```json
{
  "dependencies": {
	"react": "18.2.0",
	"react-native": "0.73.0",
	"expo": "~50.0.0",
	"@react-navigation/native": "^6.1.9",
	"@react-navigation/stack": "^6.3.20",
	"@react-navigation/bottom-tabs": "^6.5.11",
	"axios": "^1.6.2",
	"react-hook-form": "^7.48.2",
	"@hookform/resolvers": "^3.3.2",
	"zod": "^3.22.4",
	"date-fns": "^2.30.0",
	"react-native-paper": "^5.11.1",
	"@react-native-async-storage/async-storage": "1.21.0",
	"expo-secure-store": "~12.8.1",
	"expo-notifications": "~0.27.6",
	"@tanstack/react-query": "^5.8.4",
	"zustand": "^4.4.7",
	"react-native-fast-image": "^8.6.3",
	"@react-native-community/netinfo": "11.1.0",
	"react-native-vector-icons": "^10.0.2"
  },
  "devDependencies": {
	"@types/react": "~18.2.45",
	"@types/react-native": "~0.73.0",
	"typescript": "^5.3.3",
	"@testing-library/react-native": "^12.4.1",
	"jest": "^29.7.0",
	"eslint": "^8.55.0",
	"prettier": "^3.1.0"
  }
}
```

---

## ✅ Development Checklist

### Setup Phase
- [ ] Initialize React Native project (Expo or bare)
- [ ] Setup TypeScript
- [ ] Configure ESLint and Prettier
- [ ] Setup folder structure
- [ ] Install dependencies
- [ ] Configure navigation
- [ ] Setup state management
- [ ] Configure API client
- [ ] Setup secure storage

### Development Phase
- [ ] Design system and theme
- [ ] Reusable components
- [ ] Authentication screens
- [ ] Main app screens
- [ ] API integration
- [ ] Offline support
- [ ] Push notifications
- [ ] Error handling
- [ ] Loading states

### Testing Phase
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing (iOS)
- [ ] Manual testing (Android)
- [ ] Performance testing
- [ ] Accessibility testing

### Pre-Launch Phase
- [ ] App icons and splash screen
- [ ] Screenshots for stores
- [ ] App descriptions
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Beta testing (TestFlight, Internal Testing)
- [ ] Bug fixes from beta
- [ ] Build for release

### Launch Phase
- [ ] Submit to App Store
- [ ] Submit to Play Store
- [ ] Marketing materials
- [ ] App website
- [ ] Social media announcement

---

## 🎓 Learning Resources

### React Native
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Video Tutorials
- React Native Crash Course (YouTube)
- Building Mobile Apps with React Native (Udemy)
- React Native Advanced Concepts

### Communities
- React Native Discord
- React Native Reddit
- Stack Overflow

---

## 📝 Notes

- All prompts are ready to use with ChatGPT, GitHub Copilot, or Claude
- Customize based on your specific requirements
- Use TypeScript for better type safety
- Follow React Native best practices
- Test on both iOS and Android devices
- Consider accessibility from the start

---

**Total Prompts**: 37 detailed prompts  
**Estimated Development Time**: 8-12 weeks (1 developer)  
**With Team of 2-3**: 4-6 weeks

**Ready to build! 🚀📱**
