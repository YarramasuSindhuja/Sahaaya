// Firebase Configuration
// Replace the following configuration with your own Firebase project settings

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
} else {
    // Load Firebase SDK if not already loaded
    const firebaseScript = document.createElement('script');
    firebaseScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
    document.head.appendChild(firebaseScript);
    
    firebaseScript.onload = function() {
        const firebaseAuthScript = document.createElement('script');
        firebaseAuthScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
        document.head.appendChild(firebaseAuthScript);
        
        firebaseAuthScript.onload = function() {
            const firebaseFirestoreScript = document.createElement('script');
            firebaseFirestoreScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
            document.head.appendChild(firebaseFirestoreScript);
            
            firebaseFirestoreScript.onload = function() {
                firebase.initializeApp(firebaseConfig);
            };
        };
    };
}

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
} else {
    // Load Firebase SDK if not already loaded
    const firebaseScript = document.createElement('script');
    firebaseScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
    document.head.appendChild(firebaseScript);
    
    firebaseScript.onload = function() {
        const firebaseAuthScript = document.createElement('script');
        firebaseAuthScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
        document.head.appendChild(firebaseAuthScript);
        
        firebaseAuthScript.onload = function() {
            const firebaseFirestoreScript = document.createElement('script');
            firebaseFirestoreScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
            document.head.appendChild(firebaseFirestoreScript);
            
            firebaseFirestoreScript.onload = function() {
                firebase.initializeApp(firebaseConfig);
            };
        };
    };
}

// Instructions for setting up Firebase:
/*
1. Go to https://console.firebase.google.com/
2. Create a new project or select an existing one
3. Click on "Add app" and select "Web"
4. Register your app with a nickname
5. Copy the firebaseConfig object from the console
6. Replace the placeholder values above with your actual config
7. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
8. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in test mode
   - Set up security rules for your collections
*/

// Example Firestore Security Rules:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow anonymous messages to be written
    match /anonymousMessages/{document} {
      allow write: if true;
      allow read: if false; // Only admins should read these
    }
    
    // Allow mentor requests to be written
    match /mentorRequests/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
    
    // Allow public articles to be read
    match /articles/{document} {
      allow read: if true;
      allow write: if false; // Only admins should write these
    }
    
    // Allow public events to be read
    match /events/{document} {
      allow read: if true;
      allow write: if false; // Only admins should write these
    }
  }
}
*/ 