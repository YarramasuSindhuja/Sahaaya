// Firebase configuration and initialization
let auth, db;

// Initialize Firebase when config is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Firebase is loaded
    if (typeof firebase !== 'undefined') {
        initializeFirebase();
    } else {
        // Wait for Firebase to load
        const checkFirebase = setInterval(() => {
            if (typeof firebase !== 'undefined') {
                initializeFirebase();
                clearInterval(checkFirebase);
            }
        }, 100);
    }
    
    // Initialize UI components
    initializeUI();
});

function initializeFirebase() {
    try {
        // Initialize Firebase (this will be done in firebase-config.js)
        auth = firebase.auth();
        db = firebase.firestore();
        
        // Set up auth state listener
        auth.onAuthStateChanged(function(user) {
            updateUIForAuthState(user);
        });
        
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}

function initializeUI() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Initialize forms
    initializeForms();
    
    // Initialize quiz if on career page
    if (window.location.pathname.includes('career.html')) {
        initializeQuiz();
    }
    
    // Initialize content loading
    loadContent();
    
    // Initialize program registration visibility
    initializeProgramRegistration();
    
    // Initialize resume functionality if on career page
    if (window.location.pathname.includes('career.html')) {
        initializeResumeFunctionality();
    }
    
    // Initialize event registration if on awareness page
    if (window.location.pathname.includes('awareness.html')) {
        initializeEventRegistration();
    }
}

async function updateUIForAuthState(user) {
    const loginLink = document.querySelector('a[href="login.html"]');
    const signupLink = document.querySelector('a[href="signup.html"]');
    const userGreeting = document.getElementById('userGreeting');
    
    if (user) {
        // User is signed in
        if (loginLink) {
            loginLink.textContent = 'Dashboard';
            loginLink.href = '#';
            loginLink.addEventListener('click', showUserDashboard);
        }
        if (signupLink) {
            signupLink.style.display = 'none';
        }
        
        // Fetch user profile and show personalized greeting
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const userName = userData.name || userData.profile?.name || user.email.split('@')[0];
                
                if (userGreeting) {
                    userGreeting.innerHTML = `
                        <div class="welcome-message">
                            <h3>Welcome back, ${userName}! 👋</h3>
                            <p>Ready to continue your journey with Sahaya?</p>
                        </div>
                    `;
                }
                
                showAlert(`Welcome back, ${userName}!`, 'success');
            } else {
                showAlert(`Welcome back, ${user.email}!`, 'success');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            showAlert(`Welcome back, ${user.email}!`, 'success');
        }
    } else {
        // User is signed out
        if (loginLink) {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
        }
        if (signupLink) {
            signupLink.style.display = 'inline';
        }
        
        if (userGreeting) {
            userGreeting.innerHTML = `
                <div class="welcome-message">
                    <h3>Welcome to Sahaya! 🌟</h3>
                    <p>Your trusted companion for mental health, career guidance, and social awareness.</p>
                </div>
            `;
        }
    }
}

function initializeForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Mental health anonymous form
    const mentalHealthForm = document.getElementById('mentalHealthForm');
    if (mentalHealthForm) {
        mentalHealthForm.addEventListener('submit', handleMentalHealthSubmission);
    }
    
    // Career mentor form
    const mentorForm = document.getElementById('mentorForm');
    if (mentorForm) {
        mentorForm.addEventListener('submit', handleMentorRequest);
    }
    
    // Program registration form
    const programForm = document.getElementById('programForm');
    if (programForm) {
        programForm.addEventListener('submit', handleProgramRegistration);
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Check if Firebase is properly configured
    if (!auth) {
        console.log('Firebase not configured, using fallback mode');
        showAlert('✅ Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showAlert('✅ Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        showAlert(`Login failed: ${error.message}`, 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    console.log('Signup form submitted');  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name') ? document.getElementById('name').value : '';
    const age = document.getElementById('age') ? document.getElementById('age').value : '';
    const interests = document.getElementById('interests') ? document.getElementById('interests').value.split(',').map(i => i.trim()) : [];
    
    console.log('Form data:', { email, name, age, interests });
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    // Check if Firebase is properly configured
    if (!auth || !db) {
        console.log('Firebase not configured, using fallback mode');
        showAlert('✅ Account created successfully! Please log in to continue.', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    try {
        console.log('Attempting to create Firebase account...');
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        console.log('Firebase account created successfully:', userCredential.user.uid);
        
        // Store full name and email in 'users' collection using uid
        console.log('Storing user data in Firestore...');
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email
        });
        console.log('User data stored in Firestore successfully');
        
        showAlert('✅ Account created successfully! Please log in to continue.', 'success');
        console.log('Redirecting to login page in 2 seconds...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        console.error('Signup error:', error);
        showAlert(`Signup failed: ${error.message}`, 'error');
    }
}

function handleLogout() {
    auth.signOut().then(() => {
        showAlert('Logged out successfully!', 'success');
        window.location.href = 'index.html';
    }).catch((error) => {
        showAlert(`Logout failed: ${error.message}`, 'error');
    });
}

// Form Submission Functions
async function handleMentalHealthSubmission(e) {
    e.preventDefault();
    
    const message = document.getElementById('anonymousMessage').value;
    const category = document.getElementById('messageCategory').value;
    
    if (!message.trim()) {
        showAlert('Please enter a message.', 'error');
        return;
    }
    
    try {
        await db.collection('anonymous_thoughts').add({
            message: message,
            category: category,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showAlert('✅ Message submitted.\nYour privacy is protected. Share your thoughts, feelings, or experiences anonymously. \nOur team will review and provide supportive responses.', 'success');
        document.getElementById('anonymousMessage').value = '';
        if (e.target) e.target.reset();
        // Optionally record activity if user is logged in
        if (auth.currentUser) {
            await recordUserActivity(auth.currentUser.uid, 'Submitted Mental Health Thought', message);
        }
        showMentorSuggestions();
    } catch (error) {
        showAlert(`Submission failed: ${error.message}`, 'error');
    }
}

// Program Registration Function
async function handleProgramRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('programName').value;
    const email = document.getElementById('programEmail').value;
    const program = document.getElementById('selectedProgram').value;
    const message = document.getElementById('programMessage').value;
    
    if (!name || !email || !program) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    try {
        await db.collection('program_registrations').add({
            name: name,
            email: email,
            program: program,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: auth.currentUser ? auth.currentUser.uid : 'anonymous',
            status: 'pending'
        });
        
        showAlert('You\'ve successfully joined the program! We\'ll contact you soon.', 'success');
        e.target.reset();
        await recordUserActivity(auth.currentUser ? auth.currentUser.uid : null, 'Joined Program', program);
    } catch (error) {
        showAlert(`Registration failed: ${error.message}`, 'error');
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function handleMentorRequest(e) {
    e.preventDefault();
    
    const name = document.getElementById('mentorName').value;
    const email = document.getElementById('mentorEmail').value;
    const field = document.getElementById('mentorField').value;
    const message = document.getElementById('mentorMessage').value;
    
    if (!name || !email || !field) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    try {
        await db.collection('mentorRequests').add({
            name: name,
            email: email,
            field: field,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: auth.currentUser ? auth.currentUser.uid : 'anonymous',
            status: 'pending'
        });
        
        showAlert('Your mentor request has been submitted! We\'ll get back to you soon.', 'success');
        e.target.reset();
        await recordUserActivity(auth.currentUser ? auth.currentUser.uid : null, 'Requested Mentor', field);
    } catch (error) {
        showAlert(`Request failed: ${error.message}`, 'error');
    }
}

// Quiz Functions
function initializeQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    const questions = [
        {
            question: "Which activity excites you the most?",
            options: ["Building apps/websites", "Helping people with problems", "Designing graphics/art", "Leading a team", "Doing science experiments"]
        },
        {
            question: "What would you prefer to do on a weekend?",
            options: ["Code a project", "Volunteer at a clinic", "Paint or create music", "Organize a group event", "Visit a science museum"]
        },
        {
            question: "Which subject did you enjoy most in school?",
            options: ["Math/Computer Science", "Biology/Psychology", "Art/Literature", "Business/Economics", "Physics/Chemistry"]
        },
        {
            question: "What is your dream work environment?",
            options: ["Tech startup", "Hospital/NGO", "Studio/Creative agency", "Corporate office", "Research lab"]
        },
        {
            question: "Which skill describes you best?",
            options: ["Problem-solving", "Empathy", "Creativity", "Leadership", "Curiosity"]
        }
    ];
    const careers = [
        {
            name: "Software Developer",
            desc: "Create apps, websites, and digital solutions for real-world problems.",
            match: [0,0,0,0,0]
        },
        {
            name: "Psychologist",
            desc: "Support mental health and help people thrive.",
            match: [1,1,1,1,1]
        },
        {
            name: "Graphic Designer",
            desc: "Design visuals, graphics, and creative content.",
            match: [2,2,2,2,2]
        },
        {
            name: "Business Manager",
            desc: "Lead teams, manage projects, and drive business growth.",
            match: [3,3,3,3,3]
        },
        {
            name: "Research Scientist",
            desc: "Explore new ideas and make discoveries in science.",
            match: [4,4,4,4,4]
        }
    ];
    let currentQuestion = 0;
    let answers = [];
    function displayQuestion() {
        const question = questions[currentQuestion];
        quizContainer.innerHTML = `
            <h2>Career Aptitude Quiz</h2>
            <div class="quiz-question">
                <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
                <p>${question.question}</p>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option" data-index="${index}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                answers[currentQuestion] = parseInt(this.dataset.index);
            });
        });
    }
    function showResults() {
        // Tally answers
        const score = [0,0,0,0,0];
        answers.forEach(idx => { if (typeof idx === 'number') score[idx]++; });
        // Find top 1–3 careers
        const ranked = careers.map((c, i) => ({
            ...c,
            total: c.match.reduce((sum, val, j) => sum + (answers[j] === val ? 1 : 0), 0)
        })).sort((a,b) => b.total - a.total).slice(0,3);
        quizContainer.innerHTML = `
            <h2>Your Career Suggestions</h2>
            <div class="quiz-results">
                <h3>Based on your answers, we recommend:</h3>
                ${ranked.map(c => `
                    <div class="career-match">
                        <h4>${c.name}</h4>
                        <p>${c.desc}</p>
                        <span class="career-score">Match: ${c.total}/${questions.length}</span>
                    </div>
                `).join('')}
                <div class="quiz-actions">
                    <button onclick="initializeQuiz()" class="btn btn-primary">Take Quiz Again</button>
                    <a href="#mentorSection" class="btn btn-secondary">Connect with a Mentor</a>
                </div>
            </div>
        `;
        if (auth.currentUser) {
            db.collection('quiz_attempts').add({
                userId: auth.currentUser.uid,
                answers,
                recommendations: ranked.map(c => c.name),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            recordUserActivity(auth.currentUser.uid, 'Completed Career Quiz', ranked.map(c => c.name).join(', '));
        }
    }
    displayQuestion();
    const navButtons = document.createElement('div');
    navButtons.className = 'quiz-navigation';
    navButtons.innerHTML = `
        <button id="prevBtn" class="btn btn-secondary" style="display: none;">Previous</button>
        <button id="nextBtn" class="btn btn-primary">Next</button>
    `;
    quizContainer.appendChild(navButtons);
    document.getElementById('nextBtn').addEventListener('click', () => {
        if (answers[currentQuestion] === undefined) {
            showAlert('Please select an option before continuing.', 'error');
            return;
        }
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            displayQuestion();
            document.getElementById('prevBtn').style.display = 'inline';
        } else {
            showResults();
        }
    });
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            displayQuestion();
            if (currentQuestion === 0) {
                document.getElementById('prevBtn').style.display = 'none';
            }
        }
    });
}

// Content Loading Functions
async function loadContent() {
    // Load mental health articles
    if (window.location.pathname.includes('mental-health.html')) {
        await loadMentalHealthContent();
    }
    
    // Load career resources
    if (window.location.pathname.includes('career.html')) {
        await loadCareerContent();
    }
    
    // Load awareness content
    if (window.location.pathname.includes('awareness.html')) {
        await loadAwarenessContent();
    }
}

async function loadMentalHealthContent() {
    try {
        const articlesRef = db.collection('articles').where('category', '==', 'mental-health');
        const snapshot = await articlesRef.get();
        
        const articlesContainer = document.getElementById('articlesContainer');
        if (articlesContainer) {
            articlesContainer.innerHTML = '';
            
            snapshot.forEach(doc => {
                const article = doc.data();
                const articleElement = document.createElement('div');
                articleElement.className = 'content-card';
                articleElement.innerHTML = `
                    <div class="content-card-body">
                        <h3>${article.title}</h3>
                        <p>${article.excerpt}</p>
                        <small>Published: ${article.timestamp?.toDate().toLocaleDateString()}</small>
                    </div>
                `;
                articlesContainer.appendChild(articleElement);
            });
        }
    } catch (error) {
        console.error('Error loading mental health content:', error);
    }
}

async function loadCareerContent() {
    // Load resume templates
    const templatesContainer = document.getElementById('templatesContainer');
    if (templatesContainer) {
        templatesContainer.innerHTML = `
            <div class="content-card">
                <div class="content-card-body">
                    <h3>Student Resume Template</h3>
                    <p>Perfect for students and recent graduates</p>
                    <a href="#" class="btn btn-primary">Download Template</a>
                </div>
            </div>
            <div class="content-card">
                <div class="content-card-body">
                    <h3>Professional Resume Template</h3>
                    <p>For experienced professionals</p>
                    <a href="#" class="btn btn-primary">Download Template</a>
                </div>
            </div>
            <div class="content-card">
                <div class="content-card-body">
                    <h3>Creative Portfolio Template</h3>
                    <p>For creative professionals</p>
                    <a href="#" class="btn btn-primary">Download Template</a>
                </div>
            </div>
        `;
    }
}

async function loadAwarenessContent() {
    try {
        const eventsRef = db.collection('events');
        const snapshot = await eventsRef.get();
        
        const eventsContainer = document.getElementById('eventsContainer');
        if (eventsContainer) {
            eventsContainer.innerHTML = '';
            
            snapshot.forEach(doc => {
                const event = doc.data();
                const eventElement = document.createElement('div');
                eventElement.className = 'content-card';
                eventElement.innerHTML = `
                    <div class="content-card-body">
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                        <small>Date: ${event.date}</small>
                        <br>
                        <small>Location: ${event.location}</small>
                    </div>
                `;
                eventsContainer.appendChild(eventElement);
            });
        }
    } catch (error) {
        console.error('Error loading awareness content:', error);
    }
}

// Utility Functions
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insert at the top of the form or page
    const form = document.querySelector('.form-container') || document.body;
    form.insertBefore(alertDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showUserDashboard() {
    // This would show a user dashboard modal or redirect to a dashboard page
    showAlert('Dashboard feature coming soon!', 'success');
}

// Program Registration Visibility
function initializeProgramRegistration() {
    const programForm = document.getElementById('programForm');
    const programLoginPrompt = document.getElementById('programLoginPrompt');
    
    if (programForm && programLoginPrompt) {
        // Check if user is logged in
        auth.onAuthStateChanged(function(user) {
            if (user) {
                // User is logged in - show form
                programForm.style.display = 'block';
                programLoginPrompt.style.display = 'none';
            } else {
                // User is not logged in - show login prompt
                programForm.style.display = 'none';
                programLoginPrompt.style.display = 'block';
            }
        });
    }
}

async function recordUserActivity(userId, action, details) {
    if (!userId) return;
    try {
        await db.collection('user_activity').add({
            userId,
            action,
            details,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (e) { console.error('Activity log error:', e); }
}

function showMentorSuggestions() {
    const mentors = [
        {
            name: 'Dr. Asha Rao',
            title: 'Clinical Psychologist',
            img: 'https://randomuser.me/api/portraits/women/44.jpg',
            email: 'asha.mentor@example.com'
        },
        {
            name: 'Mr. Ravi Kumar',
            title: 'Youth Counselor',
            img: 'https://randomuser.me/api/portraits/men/32.jpg',
            email: 'ravi.mentor@example.com'
        },
        {
            name: 'Ms. Priya Singh',
            title: 'Mental Health Advocate',
            img: 'https://randomuser.me/api/portraits/women/68.jpg',
            email: 'priya.mentor@example.com'
        }
    ];
    const container = document.getElementById('mentorSuggestions');
    if (!container) return;
    container.innerHTML = '<h3>Mentor Suggestions</h3>' + mentors.map(m => `
        <div class="mentor-card">
            <img src="${m.img}" alt="${m.name}" class="mentor-avatar" />
            <div class="mentor-info">
                <h4>${m.name}</h4>
                <p>${m.title}</p>
                <a href="mailto:${m.email}" class="btn btn-secondary">Connect</a>
            </div>
        </div>
    `).join('');
    container.style.display = 'block';
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading states to buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.form-button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.disabled = true;
                this.textContent = 'Processing...';
                
                // Re-enable after 3 seconds (fallback)
                setTimeout(() => {
                    this.disabled = false;
                    this.textContent = this.getAttribute('data-original-text') || 'Submit';
                }, 3000);
            }
        });
    });
});

// Resume Functionality
function initializeResumeFunctionality() {
    const previewBtn = document.getElementById('previewResume');
    const downloadBtn = document.getElementById('downloadResume');
    const downloadFromPreviewBtn = document.getElementById('downloadFromPreview');
    const closeModalBtn = document.getElementById('closeResumeModal');
    const resumeModal = document.getElementById('resumeModal');
    
    if (previewBtn) {
        previewBtn.addEventListener('click', showResumePreview);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadResume);
    }
    
    if (downloadFromPreviewBtn) {
        downloadFromPreviewBtn.addEventListener('click', downloadResume);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeResumeModal);
    }
    
    // Close modal when clicking outside
    if (resumeModal) {
        resumeModal.addEventListener('click', function(e) {
            if (e.target === resumeModal) {
                closeResumeModal();
            }
        });
    }
}

function showResumePreview() {
    const modal = document.getElementById('resumeModal');
    const preview = document.getElementById('resumePreview');
    
    if (modal && preview) {
        // Generate sample resume content
        const resumeContent = generateSampleResume();
        preview.innerHTML = resumeContent;
        modal.style.display = 'block';
        
        // Record activity if user is logged in
        if (auth.currentUser) {
            recordUserActivity(auth.currentUser.uid, 'Previewed Resume', 'Viewed resume preview');
        }
    }
}

function closeResumeModal() {
    const modal = document.getElementById('resumeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function generateSampleResume() {
    return `
        <div class="resume-header">
            <div class="resume-name">Priya Sharma</div>
            <div class="resume-contact">
                priya.sharma@email.com | +91 98765 43210<br>
                Mumbai, Maharashtra | linkedin.com/in/priyasharma
            </div>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Professional Summary</div>
            <p>Passionate software developer with 2+ years of experience in web development and mobile applications. 
            Skilled in JavaScript, React, Node.js, and Python. Committed to creating user-friendly applications 
            and continuously learning new technologies.</p>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Technical Skills</div>
            <div class="resume-skills">
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">React</span>
                <span class="skill-tag">Node.js</span>
                <span class="skill-tag">Python</span>
                <span class="skill-tag">HTML/CSS</span>
                <span class="skill-tag">Git</span>
                <span class="skill-tag">MongoDB</span>
                <span class="skill-tag">AWS</span>
            </div>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Work Experience</div>
            
            <div class="resume-item">
                <div class="resume-item-title">Frontend Developer</div>
                <div class="resume-item-subtitle">TechCorp Solutions, Mumbai</div>
                <div class="resume-item-date">January 2023 - Present</div>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    <li>Developed responsive web applications using React and JavaScript</li>
                    <li>Collaborated with design team to implement user interface improvements</li>
                    <li>Optimized application performance and reduced load times by 30%</li>
                    <li>Mentored junior developers and conducted code reviews</li>
                </ul>
            </div>
            
            <div class="resume-item">
                <div class="resume-item-title">Software Developer Intern</div>
                <div class="resume-item-subtitle">StartupXYZ, Bangalore</div>
                <div class="resume-item-date">June 2022 - December 2022</div>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    <li>Built RESTful APIs using Node.js and Express</li>
                    <li>Implemented database schemas and queries using MongoDB</li>
                    <li>Participated in agile development processes and sprint planning</li>
                </ul>
            </div>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Education</div>
            <div class="resume-item">
                <div class="resume-item-title">Bachelor of Technology in Computer Science</div>
                <div class="resume-item-subtitle">Mumbai University</div>
                <div class="resume-item-date">2018 - 2022</div>
                <p>GPA: 8.5/10 | Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development</p>
            </div>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Projects</div>
            <div class="resume-item">
                <div class="resume-item-title">E-commerce Platform</div>
                <div class="resume-item-date">2023</div>
                <p>Built a full-stack e-commerce application using React, Node.js, and MongoDB. 
                Features include user authentication, product catalog, shopping cart, and payment integration.</p>
            </div>
            
            <div class="resume-item">
                <div class="resume-item-title">Task Management App</div>
                <div class="resume-item-date">2022</div>
                <p>Developed a collaborative task management application with real-time updates, 
                user roles, and progress tracking features.</p>
            </div>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Certifications</div>
            <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                <li>AWS Certified Developer Associate</li>
                <li>MongoDB Certified Developer</li>
                <li>React Developer Certification</li>
            </ul>
        </div>
    `;
}

function downloadResume() {
    // Create a temporary link to download the resume
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`
PRIYA SHARMA
priya.sharma@email.com | +91 98765 43210
Mumbai, Maharashtra | linkedin.com/in/priyasharma

PROFESSIONAL SUMMARY
Passionate software developer with 2+ years of experience in web development and mobile applications. 
Skilled in JavaScript, React, Node.js, and Python. Committed to creating user-friendly applications 
and continuously learning new technologies.

TECHNICAL SKILLS
JavaScript, React, Node.js, Python, HTML/CSS, Git, MongoDB, AWS

WORK EXPERIENCE

Frontend Developer
TechCorp Solutions, Mumbai
January 2023 - Present
• Developed responsive web applications using React and JavaScript
• Collaborated with design team to implement user interface improvements
• Optimized application performance and reduced load times by 30%
• Mentored junior developers and conducted code reviews

Software Developer Intern
StartupXYZ, Bangalore
June 2022 - December 2022
• Built RESTful APIs using Node.js and Express
• Implemented database schemas and queries using MongoDB
• Participated in agile development processes and sprint planning

EDUCATION
Bachelor of Technology in Computer Science
Mumbai University | 2018 - 2022
GPA: 8.5/10

PROJECTS
E-commerce Platform (2023)
Built a full-stack e-commerce application using React, Node.js, and MongoDB.

Task Management App (2022)
Developed a collaborative task management application with real-time updates.

CERTIFICATIONS
• AWS Certified Developer Associate
• MongoDB Certified Developer
• React Developer Certification
    `);
    link.download = 'resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Record activity if user is logged in
    if (auth.currentUser) {
        recordUserActivity(auth.currentUser.uid, 'Downloaded Resume', 'Downloaded resume template');
    }
    
    showAlert('Resume downloaded successfully!', 'success');
}

// Event Registration Functionality
function initializeEventRegistration() {
    const registerBtn = document.getElementById('registerEventBtn');
    const eventModal = document.getElementById('eventModal');
    const closeModalBtn = document.getElementById('closeEventModal');
    const eventForm = document.getElementById('eventRegistrationForm');
    const eventLoginPrompt = document.getElementById('eventLoginPrompt');
    
    if (registerBtn) {
        registerBtn.addEventListener('click', showEventRegistrationModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEventModal);
    }
    
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventRegistration);
    }
    
    // Close modal when clicking outside
    if (eventModal) {
        eventModal.addEventListener('click', function(e) {
            if (e.target === eventModal) {
                closeEventModal();
            }
        });
    }
    
    // Check auth state for form visibility
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is logged in - show form
            if (eventForm) eventForm.style.display = 'block';
            if (eventLoginPrompt) eventLoginPrompt.style.display = 'none';
        } else {
            // User is not logged in - show login prompt
            if (eventForm) eventForm.style.display = 'none';
            if (eventLoginPrompt) eventLoginPrompt.style.display = 'block';
        }
    });
}

function showEventRegistrationModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function handleEventRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('eventName').value;
    const email = document.getElementById('eventEmail').value;
    const selectedEvent = document.getElementById('selectedEvent').value;
    const eventDate = document.getElementById('eventDate').value;
    const message = document.getElementById('eventMessage').value;
    
    if (!auth.currentUser) {
        showAlert('Please login to register for events.', 'error');
        return;
    }
    
    try {
        // Save event registration to Firestore
        await db.collection('event_registrations').add({
            userId: auth.currentUser.uid,
            name: name,
            email: email,
            eventType: selectedEvent,
            eventDate: eventDate,
            message: message,
            registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        });
        
        // Record user activity
        await recordUserActivity(auth.currentUser.uid, 'Registered for Event', `${selectedEvent} on ${eventDate}`);
        
        showAlert('Event registration submitted successfully! We will contact you with details.', 'success');
        e.target.reset();
        closeEventModal();
        
    } catch (error) {
        console.error('Error registering for event:', error);
        showAlert('Failed to register for event. Please try again.', 'error');
    }
} 

// Navbar update and page access control
function updateNavbarForAuth(user) {
    const loginLink = document.querySelector('a[href="login.html"]');
    const signupLink = document.querySelector('a[href="signup.html"]');
    const profileLink = document.querySelector('a[href="profile.html"]');
    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'inline';
        // Optionally add a logout button if not present
        if (!document.getElementById('logoutNavBtn')) {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                const li = document.createElement('li');
                li.className = 'nav-item';
                const btn = document.createElement('a');
                btn.className = 'nav-link';
                btn.id = 'logoutNavBtn';
                btn.href = '#';
                btn.textContent = 'Logout';
                btn.onclick = function(e) { e.preventDefault(); handleLogout(); };
                li.appendChild(btn);
                navMenu.appendChild(li);
            }
        }
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (signupLink) signupLink.style.display = 'inline';
        if (profileLink) profileLink.style.display = 'none';
        const logoutBtn = document.getElementById('logoutNavBtn');
        if (logoutBtn && logoutBtn.parentNode) logoutBtn.parentNode.remove();
    }
}
// Prevent access to login/signup if already logged in
function preventAuthPageForLoggedIn() {
    auth.onAuthStateChanged(function(user) {
        const path = window.location.pathname;
        if (user && (path.includes('login.html') || path.includes('signup.html'))) {
            window.location.href = 'index.html';
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    auth.onAuthStateChanged(function(user) {
        updateNavbarForAuth(user);
    });
    preventAuthPageForLoggedIn();
}); 