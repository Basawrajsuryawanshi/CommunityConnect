# Google OAuth Setup Guide for CommunityConnect

This guide will help you integrate real Google OAuth authentication into your CommunityConnect application.

## 🚀 Quick Start (Current Demo)

The app currently uses **mock Google authentication** for demonstration purposes. Click "Sign in with Google" to see the flow in action.

## 🔐 Setting Up Real Google OAuth

To enable real Google authentication, follow these steps:

### Option 1: Using Firebase Authentication (Recommended)

#### Step 1: Install Firebase

```bash
npm install firebase
```

#### Step 2: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Enable Google Analytics (optional)

#### Step 3: Enable Google Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** and enable it
3. Add your support email
4. Save

#### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app
5. Copy the Firebase configuration

#### Step 5: Create Firebase Configuration File

Create `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
```

#### Step 6: Update AuthContext

Replace the mock `loginWithGoogle` function in `src/context/AuthContext.tsx`:

```typescript
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'

const loginWithGoogle = async () => {
  try {
	const result = await signInWithPopup(auth, googleProvider)
	const user = result.user

	const userData = {
	  id: user.uid,
	  name: user.displayName || 'User',
	  email: user.email || '',
	  avatar: user.photoURL || undefined
	}

	login(userData)
  } catch (error: any) {
	throw new Error(error.message || 'Google sign-in failed')
  }
}
```

---

### Option 2: Using Google OAuth Directly

#### Step 1: Install Google OAuth Library

```bash
npm install @react-oauth/google
```

#### Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Select **Web application**
7. Add authorized JavaScript origins: `http://localhost:5173`
8. Add authorized redirect URIs: `http://localhost:5173`
9. Copy the Client ID

#### Step 3: Wrap App with GoogleOAuthProvider

Update `src/main.tsx`:

```typescript
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
	<App />
  </GoogleOAuthProvider>
)
```

#### Step 4: Use GoogleLogin Component

Update `src/pages/LoginPage.tsx` and `src/pages/SignupPage.tsx`:

```typescript
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

// Replace the Google button with:
<GoogleLogin
  onSuccess={(credentialResponse) => {
	const decoded = jwtDecode(credentialResponse.credential)
	const userData = {
	  id: decoded.sub,
	  name: decoded.name,
	  email: decoded.email,
	  avatar: decoded.picture
	}
	login(userData)
	navigate('/')
  }}
  onError={() => {
	setError('Google sign-in failed')
  }}
/>
```

---

### Option 3: Backend OAuth Flow (Production Ready)

For production applications, implement OAuth on the backend:

#### Backend (Node.js/Express Example)

```javascript
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

app.post('/auth/google', async (req, res) => {
  const { token } = req.body
  const ticket = await client.verifyIdToken({
	idToken: token,
	audience: process.env.GOOGLE_CLIENT_ID
  })

  const payload = ticket.getPayload()
  // Create or update user in database
  // Generate JWT token
  // Return to frontend
})
```

#### Frontend

Send the Google token to your backend and receive your app's JWT token.

---

## 🔒 Security Best Practices

1. **Never commit API keys** - Use `.env` files:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_GOOGLE_CLIENT_ID=your_client_id
   ```

2. **Use environment variables**:
   ```typescript
   const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
   ```

3. **Enable HTTPS** in production

4. **Set up authorized domains** in Google/Firebase Console

5. **Implement CSRF protection**

6. **Add rate limiting** for authentication endpoints

---

## 📱 Testing

### Test Accounts

For development, create test accounts:
- Use real Google accounts for testing
- Firebase provides test phone numbers for SMS authentication

### Local Testing

1. Make sure `http://localhost:5173` is in authorized origins
2. Clear browser cache if authentication fails
3. Check browser console for detailed errors

---

## 🚨 Troubleshooting

### "redirect_uri_mismatch" error
- Add `http://localhost:5173` to authorized redirect URIs in Google Console

### "idpiframe_initialization_failed" error
- Check if cookies are enabled
- Ensure domain is in authorized domains
- Try incognito mode

### Firebase "auth/unauthorized-domain" error
- Add your domain to Firebase Console > Authentication > Settings > Authorized domains

---

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google](https://www.npmjs.com/package/@react-oauth/google)

---

## 🎯 Next Steps

1. Choose an authentication method (Firebase recommended for beginners)
2. Follow the setup steps above
3. Replace mock authentication with real implementation
4. Test thoroughly
5. Deploy to production with proper environment variables

---

**Current Status**: Demo mode with mock authentication
**Production Ready**: Follow Option 1 (Firebase) or Option 3 (Backend OAuth)
