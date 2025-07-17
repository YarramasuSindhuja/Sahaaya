# Sahaya - Youth Upliftment Platform

A comprehensive web platform focused on mental health support, career guidance, and social awareness for youth empowerment.

## 🌟 Features

### 🏠 Home Page
- Welcome section with platform overview
- Quick navigation to all services
- User authentication status display

### 🧠 Mental Health Support
- Anonymous message submission system
- Mental health articles and resources
- Educational videos on mental health topics
- Mentor suggestions after message submission
- Emergency contact information
- Activity tracking for mental health engagement

### 💼 Career Guidance
- **Interactive Aptitude Quiz** (5 questions with detailed career suggestions)
- **Resume/Portfolio System**:
  - Professional resume preview with sample content
  - Downloadable resume templates
  - Activity tracking for resume actions
- Mentor connection form
- Program registration system
- Industry insights and job search tips
- Skills development resources

### 🌍 Social Awareness
- **Event Registration System**:
  - Community event registration
  - Volunteer opportunity tracking
  - Event management with user authentication
- Social issues education (Environmental, Social Justice, Mental Health)
- Educational resources (books, podcasts, documentaries)
- Online courses and learning materials
- Advocacy and activism guidance

### 👤 User Profile & Activity Tracking
- **Comprehensive User Dashboard**:
  - Personal information display
  - Activity progress bar
  - Registered programs tracking
  - Quiz attempts and recommendations
  - Mental health thoughts history
  - Event registrations
  - Resume/portfolio actions
  - Complete activity history
- Real-time activity logging
- Progress visualization

### 🔐 Authentication System
- Firebase email/password authentication
- User profile creation and management
- Secure data storage in Firestore
- Session management and state persistence

## 🛠 Technical Implementation

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript**: Interactive functionality and Firebase integration
- **Font Awesome**: Icon library for visual elements

### Backend & Database
- **Firebase Authentication**: Secure user management
- **Firestore Database**: Real-time data storage
- **Collections Structure**:
  - `users`: User profiles and preferences
  - `anonymousMessages`: Mental health submissions
  - `quiz_attempts`: Career quiz results
  - `program_registrations`: Program enrollments
  - `event_registrations`: Event participation
  - `user_activity`: Activity tracking
  - `mentor_requests`: Mentor connections

### Key Features
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data synchronization
- **Activity Tracking**: Comprehensive user engagement monitoring
- **Modal Systems**: Interactive forms and previews
- **Progress Visualization**: User engagement metrics

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Internet connection for Firebase services
- Local development server (optional)

### Installation
1. Clone the repository
2. Open `index.html` in a web browser
3. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication and Firestore
3. Update `js/firebase-config.js` with your Firebase credentials

## 📱 Pages Overview

1. **index.html** - Home page with platform overview
2. **mental-health.html** - Mental health resources and support
3. **career.html** - Career guidance, quiz, and resume tools
4. **awareness.html** - Social awareness and event registration
5. **login.html** - User authentication
6. **signup.html** - User registration
7. **profile.html** - User dashboard and activity tracking

## 🎯 Recent Enhancements

### Resume/Portfolio System
- Professional resume preview with sample content
- Downloadable resume templates
- Activity tracking for resume actions
- Modal-based preview system

### Event Registration System
- Community event registration with authentication
- Event type selection and date preferences
- Registration status tracking
- User activity logging

### UI/UX Improvements
- Enhanced profile page with animations
- Improved modal systems
- Better responsive design
- Activity progress visualization

## 🔧 Customization

### Adding New Features
1. Create HTML page or section
2. Add corresponding CSS styles
3. Implement JavaScript functionality
4. Update Firebase collections as needed

### Styling
- Main styles in `css/style.css`
- Responsive design with mobile-first approach
- CSS animations and transitions
- Consistent color scheme and typography

## 📊 Data Structure

### User Activity Tracking
- Action types: Quiz taken, Program joined, Thought submitted, Resume downloaded, Event registered
- Timestamp tracking
- Detailed activity descriptions

### Event Registration
- Event type and date selection
- User information and preferences
- Registration status management

### Resume System
- Preview functionality with sample content
- Download capabilities
- Activity logging for user engagement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, contact: sinyarra@gmail.com

---

**Sahaya** - Empowering youth through comprehensive support systems for mental health, career development, and social awareness.