# House of Charity

A modern web platform connecting donors and NGOs for charitable donations. Built with React, TypeScript, and Firebase, designed for deployment on Netlify.

## 🌟 Features

### For Donors
- **Browse NGOs**: Discover and connect with verified non-governmental organizations
- **Multiple Donation Types**: Support money, food items, daily essentials, and more
- **Connection Management**: Connect with NGOs to receive updates on their work
- **Donation History**: Track all your donations and their impact
- **Real-time Updates**: Get notified about new NGO requirements and activities

### For NGOs
- **Profile Management**: Create comprehensive organization profiles
- **Donation Dashboard**: View and manage incoming donations
- **Requirements Posting**: Post specific needs and notify all donors
- **Work Showcase**: Display past works, awards, and achievements
- **Donor Connections**: Manage relationships with donors

### Platform Features
- **Secure Authentication**: Firebase-based user authentication
- **Real-time Database**: Firestore for data management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Beautiful, intuitive interface
- **Search & Filter**: Advanced NGO discovery tools

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/house-of-charity.git
   cd house-of-charity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration

4. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm start
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Header, Footer, Layout components
├── contexts/           # React contexts (Auth, etc.)
├── firebase/           # Firebase configuration
├── pages/              # Page components
│   └── auth/          # Authentication pages
├── types/              # TypeScript type definitions
├── App.tsx            # Main app component
├── index.tsx          # App entry point
└── index.css          # Global styles
```

## 🚀 Deployment to Netlify

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
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add all your Firebase environment variables

### Method 2: Manual Deploy

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

## 🔧 Configuration

### Firebase Setup

1. **Authentication**
   - Enable Email/Password authentication
   - Configure sign-in methods

2. **Firestore Database**
   - Create collections: `users`, `donations`, `requirements`
   - Set up security rules

3. **Storage** (Optional)
   - Enable Firebase Storage for file uploads
   - Configure CORS if needed

### Customization

- **Colors**: Modify `tailwind.config.js` for brand colors
- **Styling**: Update `src/index.css` for global styles
- **Components**: Customize components in `src/components/`

## 📱 Features in Detail

### User Authentication
- Secure login/registration system
- User type selection (Donor/NGO)
- Protected routes
- Profile management

### NGO Discovery
- Advanced search and filtering
- Verification badges
- Detailed organization profiles
- Contact information

### Donation System
- Multiple donation types (money, food, essentials)
- Real-time status tracking
- Donation history
- Impact visualization

### Communication
- NGO requirement notifications
- Connection management
- Real-time updates
- Activity feeds

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Deployment**: Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@houseofcharity.org or create an issue in this repository.

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced notification system
- [ ] Social media integration
- [ ] Volunteer management system
- [ ] Impact measurement tools

---

**Made with ❤️ for making the world a better place** 