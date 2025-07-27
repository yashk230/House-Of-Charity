# Deployment Guide

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save changes

### 3. Create Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users
5. Click "Done"

### 4. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web app icon (</>) to add a web app
4. Register your app with a nickname
5. Copy the configuration object

### 5. Environment Variables
Create a `.env` file in the project root with your Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Netlify Deployment

### Method 1: Deploy from Git (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

3. **Add Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add all your Firebase environment variables from the `.env` file

### Method 2: Manual Deploy

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

## Post-Deployment

### 1. Test Authentication
- Try registering a new user
- Test login functionality
- Verify user profiles are created in Firestore

### 2. Test Core Features
- Browse NGOs (should show mock data)
- Test donation forms
- Verify dashboard functionality

### 3. Custom Domain (Optional)
- In Netlify dashboard, go to Domain settings
- Add your custom domain
- Configure DNS settings

## Troubleshooting

### Common Issues

1. **Build fails on Netlify**
   - Check that all dependencies are in `package.json`
   - Verify build command is correct
   - Check for TypeScript errors

2. **Firebase connection fails**
   - Verify environment variables are set correctly
   - Check Firebase project settings
   - Ensure Firestore rules allow read/write

3. **Authentication not working**
   - Verify Email/Password auth is enabled in Firebase
   - Check authentication rules
   - Test with different browsers

### Support
- Check the [README.md](README.md) for more details
- Review Firebase documentation
- Check Netlify deployment logs 