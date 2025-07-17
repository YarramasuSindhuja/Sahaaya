# Firebase Setup Guide for Sahaya

## 🔥 Setting Up Firebase

### Step 1e Firebase Project
1Firebase Console](https://console.firebase.google.com/)
2 Create a project" or "Add project"
3ter a project name (e.g., "sahaya-platform")4 Choose whether to enable Google Analytics (optional)
5. Click Create project

### Step2 Add Web App
1. In your Firebase project dashboard, click the web icon (</>)2 Register your app with a nickname (e.g., Sahaya Web App")
3lickRegister app"4Copy the `firebaseConfig` object that appears

### Step 3: Update Configuration
1. Open `js/firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key,
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId:your-messaging-sender-id",
    appId:your-app-id
};
```

### Step 4: Enable Authentication
1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"3to "Sign-in method" tab4le "Email/Password" provider5 Click Save"

### Step 5: Enable Firestore Database
1. In Firebase Console, go to "Firestore Database" in the left sidebar
2. Click Create database
3. Choose "Start in test mode(for development)
4. Select a location for your database5 Click Done### Step 6 Up Security Rules
1. In Firestore Database, go to "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = 2service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} [object Object]
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow anonymous thoughts to be written
    match /anonymous_thoughts/{document} {
      allow write: if true;
      allow read: if false; // Only admins should read these
    }
    
    // Allow program registrations
    match /program_registrations/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
    
    // Allow event registrations
    match /event_registrations/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
    
    // Allow mentor requests
    match /mentorRequests/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
    
    // Allow user activity tracking
    match /user_activity/{document} {
      allow write: if request.auth != null;
      allow read: if request.auth != null;
    }
    
    // Allow quiz attempts
    match /quiz_attempts/{document} {
      allow write: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```
3 Click "Publish"

## 🧪 Testing the Setup

### Test Signup Flow
1. Open `signup.html` in your browser
2. Fill out the form with test data
3. Submit the form
4. Check browser console for logs5. You should see:
   - "Signup form submitted- "Form data: {...}  - "Attempting to create Firebase account..."
   -Firebase account created successfully: [uid]"
   - Storing user data in Firestore..."
   -User data stored in Firestore successfully"
   - "Redirecting to login page in 2 seconds..."
6. After 2 seconds, you should be redirected to `login.html`

### Test Login Flow
1. Open `login.html` in your browser
2. Use the email and password from your signup test
3. Submit the form4. You should see "✅ Login successful!"
5. After 1.5 seconds, you should be redirected to `index.html`

## 🔧 Troubleshooting

### Common Issues

1ase not configured" message**
   - Check that you've updated `js/firebase-config.js` with your actual Firebase config
   - Make sure the Firebase SDK is loading properly2Permission denied" errors**
   - Check your Firestore security rules
   - Make sure Authentication is enabled
   - Verify the rules allow the operations you're trying to perform
3uth is not defined" errors**
   - Check that Firebase Auth is properly initialized
   - Make sure the Firebase SDK scripts are loading

4. **Form not submitting**
   - Check browser console for JavaScript errors
   - Verify that the form has the correct ID (`signupForm`)
   - Make sure the event listener is properly attached

### Debug Mode
The current code includes console logging to help debug issues:
- Check browser console (F12) for detailed logs
- Look for any error messages
- Verify that each step in the signup/login process is executing

## 📝 Notes

- The fallback mode allows testing the UI flow even without Firebase configured
- For production, make sure to properly configure Firebase with your actual project settings
- The security rules provided are for development - adjust them for production use
- Consider implementing proper error handling and user feedback for production

## 🚀 Next Steps

Once Firebase is properly configured:
1. Test all authentication flows (signup, login, logout)
2. Test all form submissions (mental health, career, events)3rify data is being stored in Firestore
4. Test the profile page functionality
5. Deploy to a hosting service (Firebase Hosting recommended) 