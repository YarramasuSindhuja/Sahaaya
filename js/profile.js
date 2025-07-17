// profile.js

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(async function(user) {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        const db = firebase.firestore();
        const userId = user.uid;
        // Fetch user profile
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data() || {};
        document.getElementById('profileName').textContent = userData.name || user.email;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileAge').textContent = 'Age: ' + (userData.age || '--');

        // Fetch registered programs
        const programsSnap = await db.collection('program_registrations').where('userId', '==', userId).get();
        const programsList = document.getElementById('profilePrograms');
        programsList.innerHTML = '';
        programsSnap.forEach(doc => {
            const p = doc.data();
            const li = document.createElement('li');
            li.textContent = `${p.program} (${p.name})`;
            programsList.appendChild(li);
        });

        // Fetch quiz attempts
        const quizzesSnap = await db.collection('quiz_attempts').where('userId', '==', userId).get();
        const quizzesList = document.getElementById('profileQuizzes');
        quizzesList.innerHTML = '';
        quizzesSnap.forEach(doc => {
            const q = doc.data();
            const li = document.createElement('li');
            li.textContent = `Quiz on ${q.timestamp?.toDate().toLocaleDateString() || ''}: ${q.recommendations?.join(', ') || ''}`;
            quizzesList.appendChild(li);
        });

        // Fetch mental health thoughts
        const thoughtsSnap = await db.collection('anonymousMessages').where('userId', '==', userId).get();
        const thoughtsList = document.getElementById('profileThoughts');
        thoughtsList.innerHTML = '';
        thoughtsSnap.forEach(doc => {
            const t = doc.data();
            const li = document.createElement('li');
            li.textContent = `${t.category}: ${t.message}`;
            thoughtsList.appendChild(li);
        });

        // Fetch events registered
        const eventsSnap = await db.collection('event_registrations').where('userId', '==', userId).get();
        const eventsList = document.getElementById('profileEvents');
        eventsList.innerHTML = '';
        eventsSnap.forEach(doc => {
            const e = doc.data();
            const li = document.createElement('li');
            li.textContent = `${e.eventType} on ${e.eventDate} - ${e.status}`;
            eventsList.appendChild(li);
        });

        // Fetch resume/portfolio actions (from user_activity)
        const resumeActionsSnap = await db.collection('user_activity').where('userId', '==', userId).where('action', 'in', ['Previewed Resume', 'Downloaded Resume']).orderBy('timestamp', 'desc').get();
        const resumesList = document.getElementById('profileResumes');
        resumesList.innerHTML = '';
        resumeActionsSnap.forEach(doc => {
            const r = doc.data();
            const li = document.createElement('li');
            li.textContent = `${r.action} on ${r.timestamp?.toDate().toLocaleDateString()}`;
            resumesList.appendChild(li);
        });

        // Fetch activity history
        const historySnap = await db.collection('user_activity').where('userId', '==', userId).orderBy('timestamp', 'desc').limit(20).get();
        const historyList = document.getElementById('profileHistory');
        historyList.innerHTML = '';
        historySnap.forEach(doc => {
            const h = doc.data();
            const li = document.createElement('li');
            li.textContent = `${h.action} (${h.details || ''}) on ${h.timestamp?.toDate().toLocaleString()}`;
            historyList.appendChild(li);
        });

        // Progress bar (simple: count actions)
        const totalActions = historySnap.size;
        const percent = Math.min(100, Math.round((totalActions / 20) * 100));
        document.getElementById('progressBar').style.width = percent + '%';
        document.getElementById('progressPercent').textContent = percent + '%';

        // Edit profile modal (placeholder)
        document.getElementById('editProfileBtn').onclick = function() {
            alert('Edit profile feature coming soon!');
        };
    });
}); 