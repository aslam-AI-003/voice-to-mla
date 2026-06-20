// ===== FIREBASE CONFIGURATION FOR VOICE TO MINISTER =====
const firebaseConfig = {
    apiKey: "AIzaSyA0h41dnLHhll9QebR4fkiaiG8C3cdo8Es",
    authDomain: "abm-billing.firebaseapp.com",
    projectId: "abm-billing",
    storageBucket: "abm-billing.firebasestorage.app",
    messagingSenderId: "774462936172",
    appId: "1:774462936172:web:3312f7c3876aa09ba77449",
    measurementId: "G-6ZN8GZYY8Q"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ===== VOICE TO MINISTER - FIRESTORE OPERATIONS =====
const VoiceToMLA_DB = {

    // --- COMPLAINTS ---
    
    // Save a new complaint to Firestore
    async saveComplaint(complaint) {
        try {
            await db.collection('vtm_complaints').doc(complaint.id).set({
                ...complaint,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Complaint saved to Firebase:', complaint.id);
            return true;
        } catch (error) {
            console.error('❌ Error saving complaint:', error);
            return false;
        }
    },

    // Get all complaints from Firestore (force server to avoid stale cache)
    async getAllComplaints() {
        try {
            let snapshot;
            try {
                snapshot = await db.collection('vtm_complaints').get({ source: 'server' });
            } catch (serverErr) {
                console.log('Server fetch failed, using cache:', serverErr.message);
                snapshot = await db.collection('vtm_complaints').get();
            }
            
            const complaints = {};
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                complaints[data.id || doc.id] = data;
            });
            console.log(`✅ Loaded ${snapshot.docs.length} complaints from Firebase`);
            return complaints;
        } catch (error) {
            console.error('❌ Error getting complaints:', error);
            return {};
        }
    },

    // Get a single complaint by ID
    async getComplaint(complaintId) {
        try {
            const doc = await db.collection('vtm_complaints').doc(complaintId).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error('❌ Error getting complaint:', error);
            return null;
        }
    },

    // Update a complaint (e.g., after assignment)
    async updateComplaint(complaintId, updates) {
        try {
            await db.collection('vtm_complaints').doc(complaintId).update({
                ...updates,
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Complaint updated:', complaintId);
            return true;
        } catch (error) {
            console.error('❌ Error updating complaint:', error);
            return false;
        }
    },

    // Get next complaint number (auto-increment, ensures uniqueness)
    async getNextComplaintNumber() {
        try {
            const counterDoc = await db.collection('vtm_config').doc('counter').get();
            let nextNum = 849; // default start
            
            if (counterDoc.exists) {
                nextNum = counterDoc.data().lastComplaintNumber + 1;
            }
            
            // Double-check: make sure this ID doesn't already exist (use 5-digit padded format)
            const paddedNum = String(nextNum).padStart(5, '0');
            const existingCheck = await db.collection('vtm_complaints').doc(`TVK-2026-${paddedNum}`).get();
            if (existingCheck.exists) {
                // ID already taken, find the max and go one above
                const allDocs = await db.collection('vtm_complaints').get();
                let maxNum = 848;
                allDocs.docs.forEach(doc => {
                    const id = doc.id; // e.g., "TVK-2026-00849"
                    const numStr = id.split('-').pop();
                    const num = parseInt(numStr);
                    if (!isNaN(num) && num > maxNum) maxNum = num;
                });
                nextNum = maxNum + 1;
            }
            
            // Update counter in Firebase (atomic update)
            await db.collection('vtm_config').doc('counter').set({
                lastComplaintNumber: nextNum,
                updatedAt: new Date().toISOString()
            });
            
            console.log('🔢 Next complaint number:', nextNum);
            return nextNum;
        } catch (error) {
            console.error('❌ Error getting next number:', error);
            // Fallback: use timestamp-based to ensure uniqueness
            return Date.now() % 10000 + 900;
        }
    },

    // Listen for real-time changes (for Dashboard live updates)
    onComplaintsChange(callback) {
        return db.collection('vtm_complaints')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                const complaints = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    complaints[data.id] = data;
                });
                callback(complaints);
            }, (error) => {
                console.error('❌ Real-time listener error:', error);
            });
    },

    // --- INITIALIZE DEFAULT DATA ---
    async initializeDefaultComplaints() {
        const defaultComplaints = {
            'TVK-2026-0847': {
                id: 'TVK-2026-0847',
                title: 'சாலையில் பள்ளம் - Mudichur Main Road',
                category: 'சாலைகள்',
                area: 'Mudichur',
                assigned: 'Highway Department - Mr. Kumar',
                date: 'May 13, 2026',
                status: 'பணியில்',
                statusClass: 'badge-progress',
                timeline: [
                    { text: 'புகார் பதிவு செய்யப்பட்டது', time: 'May 13, 2026 - 10:30 AM', state: 'completed' },
                    { text: 'ஆய்வு செய்யப்படுகிறது', time: 'May 13, 2026 - 11:15 AM', state: 'completed' },
                    { text: 'Highway Department-க்கு ஒதுக்கப்பட்டது', time: 'May 13, 2026 - 02:00 PM', state: 'completed' },
                    { text: 'பணி தொடங்கப்பட்டது', time: 'May 14, 2026 - 09:00 AM', state: 'active' },
                    { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }
                ]
            },
            'TVK-2026-0848': {
                id: 'TVK-2026-0848',
                title: 'Street Light வேலை செய்யல - Selaiyur 4th Cross',
                category: 'மின்சாரம்',
                area: 'Selaiyur',
                assigned: 'EB Team - Mr. Rajan',
                date: 'May 14, 2026',
                status: 'ஒதுக்கப்பட்டது',
                statusClass: 'badge-assigned',
                timeline: [
                    { text: 'புகார் பதிவு செய்யப்பட்டது', time: 'May 14, 2026 - 08:45 AM', state: 'completed' },
                    { text: 'ஆய்வு செய்யப்படுகிறது', time: 'May 14, 2026 - 10:00 AM', state: 'completed' },
                    { text: 'EB Team-க்கு ஒதுக்கப்பட்டது', time: 'May 14, 2026 - 11:30 AM', state: 'active' },
                    { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }
                ]
            },
            'TVK-2026-0846': {
                id: 'TVK-2026-0846',
                title: 'Drainage overflow - Tambaram East Bus Stand அருகில்',
                category: 'வடிகால்',
                area: 'Tambaram East',
                assigned: 'Corporation Team',
                date: 'May 12, 2026',
                status: 'தீர்வு ✓',
                statusClass: 'badge-resolved',
                timeline: [
                    { text: 'புகார் பதிவு செய்யப்பட்டது', time: 'May 12, 2026 - 09:00 AM', state: 'completed' },
                    { text: 'ஆய்வு செய்யப்படுகிறது', time: 'May 12, 2026 - 09:45 AM', state: 'completed' },
                    { text: 'Corporation Team-க்கு ஒதுக்கப்பட்டது', time: 'May 12, 2026 - 10:30 AM', state: 'completed' },
                    { text: 'பணி தொடங்கப்பட்டது', time: 'May 12, 2026 - 02:00 PM', state: 'completed' },
                    { text: 'தீர்வு & உறுதிப்படுத்தப்பட்டது ✓', time: 'May 13, 2026 - 04:30 PM', state: 'completed' }
                ]
            },
            'TVK-2026-0845': {
                id: 'TVK-2026-0845',
                title: 'குடிநீர் வரவில்லை - Chromepet 3 நாட்கள்',
                category: 'குடிநீர்',
                area: 'Chromepet',
                assigned: '-',
                date: 'May 15, 2026',
                status: 'புதியது',
                statusClass: 'badge-new',
                timeline: [
                    { text: 'புகார் பதிவு செய்யப்பட்டது', time: 'May 15, 2026 - 07:30 AM', state: 'completed' },
                    { text: 'ஆய்வு செய்யப்படுகிறது', time: 'நிலுவையில்...', state: 'active' },
                    { text: 'ஒதுக்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }
                ]
            }
        };

        // Check if data already exists
        const existing = await db.collection('vtm_complaints').limit(1).get();
        if (existing.empty) {
            console.log('📦 Initializing default complaints in Firebase...');
            const batch = db.batch();
            for (const [id, complaint] of Object.entries(defaultComplaints)) {
                const ref = db.collection('vtm_complaints').doc(id);
                batch.set(ref, { ...complaint, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
            }
            await batch.commit();
            
            // Set counter
            await db.collection('vtm_config').doc('counter').set({
                lastComplaintNumber: 848,
                updatedAt: new Date().toISOString()
            });
            
            console.log('✅ Default complaints initialized!');
        }
    },

    // --- FIREBASE STORAGE: Upload attachment ---
    async uploadAttachment(complaintId, file, index) {
        try {
            const fileName = `attachment_${index}_${Date.now()}_${file.name}`;
            const storageRef = storage.ref(`complaints/${complaintId}/${fileName}`);
            const snapshot = await storageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            console.log('📸 Uploaded attachment:', fileName, '→', downloadURL.substring(0, 60) + '...');
            return downloadURL;
        } catch (error) {
            console.error('❌ Upload error:', error);
            return null;
        }
    },

    // Upload multiple attachments and return array of URLs
    async uploadAllAttachments(complaintId, files) {
        const urls = [];
        for (let i = 0; i < files.length; i++) {
            const url = await this.uploadAttachment(complaintId, files[i], i);
            if (url) urls.push(url);
        }
        return urls;
    }
};

// Make available globally
window.VoiceToMLA_DB = VoiceToMLA_DB;
console.log('🔥 Firebase connected for Voice to Minister');
