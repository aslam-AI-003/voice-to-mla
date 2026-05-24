// ===== PAGE NAVIGATION =====
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) targetPage.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) link.classList.add('active');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('navLinks').classList.remove('active');
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.page);
    });
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

// ===== LOGIN MODAL =====
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
loginBtn.addEventListener('click', () => loginModal.classList.add('active'));

function closeModal() { loginModal.classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    });
});

// ===== OTP FUNCTIONALITY =====
function sendOTP() {
    const otpSection = document.getElementById('otpSection');
    otpSection.style.display = 'block';
    setTimeout(() => { const fi = otpSection.querySelector('.otp-input'); if (fi) fi.focus(); }, 100);
}

function verifyOTP() {
    closeModal();
    loginBtn.innerHTML = '<i class="fas fa-user-circle"></i><span>User</span>';
    loginBtn.style.background = 'var(--primary)'; loginBtn.style.color = 'white'; loginBtn.style.border = 'none';
    showNotification('வெற்றிகரமாக Login செய்யப்பட்டது!', 'success');
}

document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
    input.addEventListener('input', (e) => { if (e.target.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !e.target.value && index > 0) inputs[index - 1].focus(); });
});

// ===== CATEGORY SELECTORS =====
document.querySelectorAll('.cat-option').forEach(option => {
    option.addEventListener('click', () => { document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected')); option.classList.add('selected'); });
});
document.querySelectorAll('.cat-card-new').forEach(card => {
    card.addEventListener('click', () => { document.querySelectorAll('.cat-card-new').forEach(c => c.classList.remove('selected')); card.classList.add('selected'); });
});

// ===== AI AUTO-CATEGORIZATION =====
const aiCategoryKeywords = {
    'roads': ['road', 'சாலை', 'பள்ளம்', 'pothole', 'tar', 'bridge', 'flyover', 'footpath'],
    'water': ['water', 'குடிநீர்', 'நீர்', 'tap', 'pipe', 'metro water', 'தண்ணீர்', 'borewell'],
    'drainage': ['drainage', 'வடிகால்', 'sewage', 'overflow', 'flood', 'மழை', 'drain'],
    'electricity': ['light', 'street light', 'மின்', 'current', 'eb', 'power', 'transformer', 'electric'],
    'garbage': ['garbage', 'waste', 'கழிவு', 'dustbin', 'cleaning', 'sanitation', 'dump', 'trash'],
    'traffic': ['traffic', 'signal', 'bus', 'போக்குவரத்து', 'parking', 'speed', 'accident'],
    'safety': ['safety', 'theft', 'fight', 'noise', 'பாதுகாப்பு', 'drunk', 'stray dog', 'cctv'],
    'scheme': ['scheme', 'ration', 'pension', 'card', 'housing', 'subsidy', 'certificate', 'திட்டம்']
};

const categoryNames = { 'roads': 'சாலைகள்', 'drainage': 'வடிகால்', 'water': 'குடிநீர்', 'electricity': 'மின்சாரம்', 'garbage': 'கழிவு', 'traffic': 'போக்குவரத்து', 'safety': 'பாதுகாப்பு', 'scheme': 'அரசு திட்டம்' };
const areaNames = { 'tambaram-east': 'Tambaram East', 'tambaram-west': 'Tambaram West', 'selaiyur': 'Selaiyur', 'mudichur': 'Mudichur', 'chromepet': 'Chromepet', 'pallavaram': 'Pallavaram', 'pammal': 'Pammal', 'anakaputhur': 'Anakaputhur', 'perungalathur': 'Perungalathur', 'chitlapakkam': 'Chitlapakkam' };

function aiAutoDetectCategory(text) {
    const lowerText = text.toLowerCase();
    let bestMatch = null, bestScore = 0;
    Object.entries(aiCategoryKeywords).forEach(([category, keywords]) => {
        let score = keywords.filter(k => lowerText.includes(k.toLowerCase())).length;
        if (score > bestScore) { bestScore = score; bestMatch = category; }
    });
    if (bestMatch && bestScore > 0) {
        const catCard = document.querySelector(`.cat-card-new[data-value="${bestMatch}"]`);
        if (catCard) {
            document.querySelectorAll('.cat-card-new').forEach(c => c.classList.remove('selected'));
            catCard.classList.add('selected');
            showNotification(`🤖 AI: "${categoryNames[bestMatch] || bestMatch}" வகை auto-detect!`, 'info');
        }
    }
}

let aiTimeout = null;
const titleInput = document.getElementById('title');
if (titleInput) {
    titleInput.addEventListener('input', () => {
        clearTimeout(aiTimeout);
        aiTimeout = setTimeout(() => { if (titleInput.value.length > 3) aiAutoDetectCategory(titleInput.value); }, 800);
    });
}

// ===== MULTI-STEP WIZARD =====
let currentStep = 1;

function nextStep(step) {
    if (currentStep === 1) {
        const name = document.getElementById('citizenName'), mobile = document.getElementById('mobileNumber'), area = document.getElementById('area');
        if (!name || !name.value.trim()) { showNotification('உங்கள் பெயரை உள்ளிடுங்கள்!', 'error'); return; }
        if (!mobile || !mobile.value.trim() || mobile.value.trim().length < 10) { showNotification('சரியான தொலைபேசி எண்ணை உள்ளிடுங்கள்!', 'error'); return; }
        if (!area || !area.value) { showNotification('பகுதியை தேர்வு செய்யுங்கள்!', 'error'); return; }
    }
    if (currentStep === 2) {
        if (!document.querySelector('.cat-card-new.selected')) { showNotification('புகார் வகையை தேர்வு செய்யுங்கள்!', 'error'); return; }
        const title = document.getElementById('title');
        if (!title || !title.value.trim()) { showNotification('புகார் தலைப்பு எழுதுங்கள்!', 'error'); return; }
    }
    currentStep = step;
    updateWizardUI();
    if (step === 3) populateReviewSummary();
}

function prevStep(step) { currentStep = step; updateWizardUI(); }

function updateWizardUI() {
    document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
    const activeStep = document.getElementById(`step${currentStep}`);
    if (activeStep) activeStep.classList.add('active');
    document.querySelectorAll('.progress-step').forEach((ps, i) => { ps.classList.remove('active', 'completed'); if (i + 1 === currentStep) ps.classList.add('active'); else if (i + 1 < currentStep) ps.classList.add('completed'); });
    document.querySelectorAll('.progress-line').forEach((pl, i) => { pl.classList.remove('active-line', 'completed-line'); if (i < currentStep - 1) pl.classList.add('completed-line'); else if (i === currentStep - 1) pl.classList.add('active-line'); });
}

function populateReviewSummary() {
    const name = document.getElementById('citizenName'), mobile = document.getElementById('mobileNumber'), area = document.getElementById('area'), selectedCat = document.querySelector('.cat-card-new.selected'), title = document.getElementById('title');
    document.getElementById('reviewName').textContent = name ? name.value : '-';
    document.getElementById('reviewPhone').textContent = mobile ? '+91 ' + mobile.value : '-';
    document.getElementById('reviewArea').textContent = area ? area.options[area.selectedIndex].text : '-';
    document.getElementById('reviewCategory').textContent = selectedCat ? selectedCat.querySelector('span').textContent : '-';
    document.getElementById('reviewTitle').textContent = title ? title.value : '-';
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;top:80px;right:20px;padding:14px 20px;border-radius:10px;color:white;font-size:0.85rem;font-weight:500;z-index:3000;animation:slideIn 0.3s ease;display:flex;align-items:center;gap:10px;box-shadow:0 4px 15px rgba(0,0,0,0.2);max-width:350px;';
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
    const icons = { success: '✓', error: '✗', info: 'ℹ' };
    notification.style.background = colors[type] || colors.info;
    notification.innerHTML = `<span style="font-size:1.1rem;">${icons[type] || icons.info}</span> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.animation = 'slideOut 0.3s ease'; setTimeout(() => notification.remove(), 300); }, 3000);
}

const notifStyle = document.createElement('style');
notifStyle.textContent = `@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}`;
document.head.appendChild(notifStyle);

// ===== COMPLAINTS DATABASE =====
const complaintsDB = {
    'TVK-2026-00847': { id: 'TVK-2026-00847', govId: 'TN/TBM/CPT/2026/00847', title: 'சாலையில் பள்ளம் - Mudichur Main Road', category: 'சாலைகள்', area: 'Mudichur', assigned: 'Highway Department - Mr. Kumar', date: 'May 13, 2026', status: 'பணியில்', statusClass: 'badge-progress', timeline: [{ text: 'புகார் பதிவு செய்யப்பட்டது', time: 'May 13, 2026 - 10:30 AM', state: 'completed' }, { text: 'ஆய்வு செய்யப்படுகிறது', time: 'May 13, 2026 - 11:15 AM', state: 'completed' }, { text: 'Highway Department-க்கு ஒதுக்கப்பட்டது', time: 'May 13, 2026 - 02:00 PM', state: 'completed' }, { text: 'பணி தொடங்கப்பட்டது', time: 'May 14, 2026 - 09:00 AM', state: 'active' }, { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }] },
    'TVK-2026-00848': { id: 'TVK-2026-00848', govId: 'TN/TBM/CPT/2026/00848', title: 'Street Light வேலை செய்யல - Selaiyur 4th Cross', category: 'மின்சாரம்', area: 'Selaiyur', assigned: 'EB Team - Mr. Rajan', date: 'May 14, 2026', status: 'ஒதுக்கப்பட்டது', statusClass: 'badge-assigned', timeline: [{ text: 'புகார் பதிவு செய்யப்பட்டது', time: 'May 14, 2026 - 08:45 AM', state: 'completed' }, { text: 'ஆய்வு செய்யப்படுகிறது', time: 'May 14, 2026 - 10:00 AM', state: 'completed' }, { text: 'EB Team-க்கு ஒதுக்கப்பட்டது', time: 'May 14, 2026 - 11:30 AM', state: 'active' }, { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' }, { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }] },
    'TVK-2026-00846': { id: 'TVK-2026-00846', govId: 'TN/TBM/CPT/2026/00846', title: 'Drainage overflow - Tambaram East Bus Stand அருகில்', category: 'வடிகால்', area: 'Tambaram East', assigned: 'Corporation Team', date: 'May 12, 2026', status: 'தீர்வு ✓', statusClass: 'badge-resolved', createdAt: '2026-05-12T09:00:00', timeline: [{ text: 'புகார் பதிவு செய்யப்பட்டது', time: 'May 12, 2026 - 09:00 AM', state: 'completed' }, { text: 'ஆய்வு செய்யப்படுகிறது', time: 'May 12, 2026 - 09:45 AM', state: 'completed' }, { text: 'Corporation Team-க்கு ஒதுக்கப்பட்டது', time: 'May 12, 2026 - 10:30 AM', state: 'completed' }, { text: 'பணி தொடங்கப்பட்டது', time: 'May 12, 2026 - 02:00 PM', state: 'completed' }, { text: 'தீர்வு & உறுதிப்படுத்தப்பட்டது ✓', time: 'May 13, 2026 - 04:30 PM', state: 'completed' }] },
    'TVK-2026-00845': { id: 'TVK-2026-00845', govId: 'TN/TBM/CPT/2026/00845', title: 'குடிநீர் வரவில்லை - Chromepet 3 நாட்கள்', category: 'குடிநீர்', area: 'Chromepet', assigned: '-', date: 'May 15, 2026', status: 'புதியது', statusClass: 'badge-new', timeline: [{ text: 'புகார் பதிவு செய்யப்பட்டது', time: 'May 15, 2026 - 07:30 AM', state: 'completed' }, { text: 'ஆய்வு செய்யப்படுகிறது', time: 'நிலுவையில்...', state: 'active' }, { text: 'ஒதுக்கப்படும்', time: 'நிலுவையில்...', state: '' }, { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' }, { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }] }
};

// ===== COMPLAINT FORM SUBMIT =====
const complaintForm = document.getElementById('complaintForm');
let lastComplaintId = 'TVK-2026-00848';
let complaintCounter = 849;

if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedCat = document.querySelector('.cat-card-new.selected');
        if (!selectedCat) { showNotification('புகார் வகையை தேர்வு செய்யுங்கள்!', 'error'); return; }
        const area = document.getElementById('area').value;
        if (!area) { showNotification('பகுதியை தேர்வு செய்யுங்கள்!', 'error'); return; }
        const title = document.getElementById('title').value;
        if (!title) { showNotification('புகார் தலைப்பு எழுதுங்கள்!', 'error'); return; }
        const description = document.getElementById('description').value;
        const categoryValue = selectedCat.dataset.value;
        const submitBtn = complaintForm.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> சமர்ப்பிக்கிறது...';
        submitBtn.disabled = true;

        setTimeout(async () => {
            if (firebaseReady && window.VoiceToMLA_DB) { try { complaintCounter = await VoiceToMLA_DB.getNextComplaintNumber(); } catch(e) {} }
            const paddedNum = String(complaintCounter).padStart(5, '0');
            const govStyleId = `TN/TBM/CPT/2026/${paddedNum}`;
            lastComplaintId = `TVK-2026-${paddedNum}`;
            complaintCounter++;
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            complaintsDB[lastComplaintId] = {
                id: lastComplaintId, govId: govStyleId,
                title: title + (areaNames[area] ? ' - ' + areaNames[area] : ''),
                description: description || '', category: categoryNames[categoryValue] || categoryValue,
                area: areaNames[area] || area,
                citizenName: document.getElementById('citizenName') ? document.getElementById('citizenName').value : '',
                mobileNumber: document.getElementById('mobileNumber') ? document.getElementById('mobileNumber').value : '',
                assigned: '-', date: dateStr, status: 'புதியது', statusClass: 'badge-new', createdAt: now.toISOString(),
                timeline: [
                    { text: 'புகார் பதிவு செய்யப்பட்டது', time: `${dateStr} - ${timeStr}`, state: 'completed' },
                    { text: 'ஆய்வு செய்யப்படுகிறது', time: 'நிலுவையில்...', state: 'active' },
                    { text: 'துறைக்கு ஒதுக்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }
                ]
            };

            const generatedIdEl = document.getElementById('generatedComplaintId');
            if (generatedIdEl) generatedIdEl.textContent = govStyleId;
            if (firebaseReady && window.VoiceToMLA_DB) VoiceToMLA_DB.saveComplaint(complaintsDB[lastComplaintId]);
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> புகார் சமர்ப்பி';
            submitBtn.disabled = false;
            document.getElementById('successModal').classList.add('active');
            complaintForm.reset();
            document.querySelectorAll('.cat-card-new').forEach(c => c.classList.remove('selected'));
            currentStep = 1; updateWizardUI();
            updateDashboardStats();
        }, 2000);
    });
}

function trackNewComplaint() { document.getElementById('successModal').classList.remove('active'); navigateTo('track'); const ti = document.getElementById('trackInput'); if (ti) { ti.value = lastComplaintId; searchComplaint(); } }
function closeSuccessModalEnhanced() { document.getElementById('successModal').classList.remove('active'); navigateTo('track'); setTimeout(searchComplaint, 500); }

// ===== TRACK SEARCH =====
function searchComplaint() {
    const input = document.getElementById('trackInput');
    const result = document.getElementById('trackResult');
    if (!input.value) { showNotification('Complaint ID enter செய்யுங்கள்!', 'error'); return; }
    result.style.opacity = '0.5';
    setTimeout(() => {
        let searchVal = input.value.trim().toUpperCase();
        let complaint = null;
        // Try gov ID format
        if (searchVal.includes('/')) {
            const numPart = searchVal.split('/').pop();
            const match = Object.keys(complaintsDB).find(k => complaintsDB[k].govId && complaintsDB[k].govId.toUpperCase() === searchVal);
            if (match) complaint = complaintsDB[match];
            if (!complaint && numPart) { const m2 = Object.keys(complaintsDB).find(k => k.includes(numPart)); if (m2) complaint = complaintsDB[m2]; }
        }
        if (!complaint) {
            if (!searchVal.startsWith('TVK')) searchVal = 'TVK-2026-' + searchVal.replace('#', '').replace('TVK-2026-', '');
            complaint = complaintsDB[searchVal];
        }
        if (!complaint) { const m = Object.keys(complaintsDB).find(k => k.includes(searchVal) || searchVal.includes(k.split('-').pop())); if (m) complaint = complaintsDB[m]; }

        if (complaint) {
            const displayId = complaint.govId || `TN/TBM/CPT/2026/${complaint.id.split('-').pop()}`;
            // Update search bar to show proper government ID format
            input.value = displayId;
            // Dynamic timeline based on current statusClass
            const statusSteps = ['badge-new', 'badge-assigned', 'badge-progress', 'badge-resolved'];
            const currentIdx = statusSteps.indexOf(complaint.statusClass);
            const escalated = complaint.statusClass === 'badge-escalated';
            const updatedTime = complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
            let dynamicTimeline = [];

            // Step 1: Always completed (complaint registered)
            dynamicTimeline.push({ text: '📝 புகார் பதிவு செய்யப்பட்டது', time: complaint.timeline && complaint.timeline[0] ? complaint.timeline[0].time : complaint.date, state: 'completed' });

            // Step 2: Assigned to department/volunteer
            if (currentIdx >= 1 || escalated) {
                dynamicTimeline.push({ text: `👤 ${complaint.assigned || 'Volunteer'}-க்கு ஒதுக்கப்பட்டது`, time: updatedTime || 'Assigned', state: 'completed' });
            } else {
                dynamicTimeline.push({ text: '🔍 ஆய்வு செய்யப்படுகிறது', time: 'நிலுவையில்...', state: 'active' });
            }

            // Step 3: Work started (பணி தொடங்கப்பட்டது)
            if (currentIdx >= 2) {
                dynamicTimeline.push({ text: '🔧 பணி தொடங்கப்பட்டது!', time: updatedTime || 'Work Started', state: currentIdx === 2 ? 'active' : 'completed' });
            } else if (currentIdx === 1) {
                dynamicTimeline.push({ text: '🔧 பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' });
            } else {
                dynamicTimeline.push({ text: '🔧 பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' });
            }

            // Step 4: Resolved
            if (currentIdx >= 3) {
                dynamicTimeline.push({ text: '✅ தீர்வு செய்யப்பட்டது!', time: complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Resolved', state: 'completed' });
            } else if (currentIdx === 2) {
                dynamicTimeline.push({ text: '⏳ தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' });
            } else {
                dynamicTimeline.push({ text: '⏳ தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' });
            }

            // Escalated extra step
            if (escalated) {
                dynamicTimeline.push({ text: '🚨 Minister-க்கு Escalate செய்யப்பட்டது!', time: updatedTime, state: 'active' });
            }
            let timelineHTML = dynamicTimeline.map(item => `<div class="tl-item ${item.state}"><div class="tl-dot"></div><div class="tl-content"><h4>${item.text}</h4><p>${item.time}</p></div></div>`).join('');
            result.innerHTML = `<div class="track-card"><div class="track-header"><div><h3>Complaint ${displayId}</h3><p>${complaint.title}</p></div><span class="status-badge ${complaint.statusClass}">${complaint.status}</span></div><div class="track-details"><div class="track-detail"><span class="label">வகை:</span><span class="value">${complaint.category}</span></div><div class="track-detail"><span class="label">பகுதி:</span><span class="value">${complaint.area}</span></div><div class="track-detail"><span class="label">ஒதுக்கப்பட்டவர்:</span><span class="value">${complaint.assigned}</span></div><div class="track-detail"><span class="label">பதிவு நாள்:</span><span class="value">${complaint.date}</span></div></div><div class="track-timeline">${timelineHTML}</div></div>`;
            result.style.opacity = '1';
            showNotification('புகார் விவரங்கள் கிடைத்தது!', 'success');
            if (complaint.statusClass === 'badge-resolved' && !complaint.feedback && !feedbackDB[complaint.id]) setTimeout(() => showFeedbackModal(complaint.id), 2000);
        } else {
            result.innerHTML = `<div class="track-card" style="text-align:center;padding:40px;"><i class="fas fa-search" style="font-size:2.5rem;color:var(--gray-light);margin-bottom:15px;"></i><h3 style="color:var(--gray);">புகார் கிடைக்கவில்லை</h3><p style="color:var(--gray-light);font-size:0.9rem;">ID "${input.value}" க்கான புகார் இல்லை.</p></div>`;
            result.style.opacity = '1';
            showNotification('புகார் கிடைக்கவில்லை', 'error');
        }
    }, 1000);
}

// ===== FIREBASE INTEGRATION =====
let firebaseReady = false;

async function loadComplaintsFromFirebase() {
    try {
        await VoiceToMLA_DB.initializeDefaultComplaints();
        const fc = await VoiceToMLA_DB.getAllComplaints();
        if (Object.keys(fc).length > 0) Object.keys(fc).forEach(k => { complaintsDB[k] = fc[k]; });
        const counterDoc = await db.collection('vtm_config').doc('counter').get();
        if (counterDoc.exists) complaintCounter = counterDoc.data().lastComplaintNumber + 1;
        firebaseReady = true;
        updateDashboardStats();
        updateTrustIndex();
        console.log('🔥 Firebase loaded:', Object.keys(complaintsDB).length, 'complaints');
        showNotification('🔥 Database connected! ' + Object.keys(complaintsDB).length + ' complaints loaded.', 'success');
    } catch (error) {
        console.error('Firebase error:', error);
        showNotification('⚠️ Offline mode - using local data', 'info');
    }
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(() => { if (window.VoiceToMLA_DB) loadComplaintsFromFirebase(); }, 500); });

// ===== UPDATE LIVE DASHBOARD STATS =====
function updateDashboardStats() {
    const all = Object.values(complaintsDB), total = all.length;
    const resolved = all.filter(c => c.statusClass === 'badge-resolved').length;
    const pending = all.filter(c => c.statusClass === 'badge-new').length;
    const progress = all.filter(c => c.statusClass === 'badge-progress' || c.statusClass === 'badge-assigned').length;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const todayComplaints = all.filter(c => c.date === today).length;
    const resolvedToday = all.filter(c => c.statusClass === 'badge-resolved' && c.date === today).length;

    const dashPage = document.getElementById('page-dashboard');
    if (dashPage) {
        const statCards = dashPage.querySelectorAll('.dash-stat-card');
        if (statCards.length >= 6) {
            statCards[0].querySelector('.dash-stat-num').textContent = total.toLocaleString();
            statCards[1].querySelector('.dash-stat-num').textContent = todayComplaints;
            statCards[2].querySelector('.dash-stat-num').textContent = resolved.toLocaleString();
            statCards[3].querySelector('.dash-stat-num').textContent = resolvedToday;
            statCards[4].querySelector('.dash-stat-num').textContent = pending;
            statCards[5].querySelector('.dash-stat-num').textContent = '48';
        }
    }
    const heroStats = document.querySelectorAll('.hero-stat-card .stat-num');
    if (heroStats.length >= 3) { heroStats[0].textContent = total.toLocaleString(); heroStats[1].textContent = resolved.toLocaleString(); heroStats[2].textContent = (pending + progress).toString(); }
    const lr = document.querySelector('.legend-resolved'), lp = document.querySelector('.legend-progress'), ln = document.querySelector('.legend-new');
    if (lr) lr.textContent = resolved.toLocaleString(); if (lp) lp.textContent = progress; if (ln) ln.textContent = pending;
}

// ===== WARD VOLUNTEERS =====
const wardVolunteers = {
    'Tambaram East': [{ name: 'Mr. Senthil Kumar', phone: '98765xxxxx', ward: 'Ward 12', role: 'Coordinator', active: 3 }, { name: 'Mrs. Revathi', phone: '87654xxxxx', ward: 'Ward 12', role: 'Volunteer', active: 1 }],
    'Selaiyur': [{ name: 'Mr. Rajan', phone: '98762xxxxx', ward: 'Ward 15', role: 'Coordinator', active: 4 }, { name: 'Mrs. Kavitha', phone: '87652xxxxx', ward: 'Ward 15', role: 'Volunteer', active: 1 }],
    'Mudichur': [{ name: 'Mr. Kumar', phone: '98763xxxxx', ward: 'Ward 18', role: 'Coordinator', active: 3 }],
    'Chromepet': [{ name: 'Mr. Selvam', phone: '98764xxxxx', ward: 'Ward 5', role: 'Coordinator', active: 2 }, { name: 'Mrs. Anitha', phone: '87654xxxxx', ward: 'Ward 5', role: 'Volunteer', active: 3 }],
    'Pallavaram': [{ name: 'Mrs. Priya', phone: '98765xxxxx', ward: 'Ward 22', role: 'Coordinator', active: 2 }],
    'Pammal': [{ name: 'Mr. Ganesh', phone: '98766xxxxx', ward: 'Ward 9', role: 'Coordinator', active: 1 }]
};

let currentAssignComplaintId = null;

function openAssignModal(complaintId) {
    const complaint = complaintsDB[complaintId];
    if (!complaint) { showNotification('Complaint not found!', 'error'); return; }
    currentAssignComplaintId = complaintId;
    const displayId = complaint.govId || `TN/TBM/CPT/2026/${complaintId.split('-').pop()}`;
    document.getElementById('assignComplaintInfo').textContent = `Complaint ${displayId} - ${complaint.title}`;
    document.getElementById('assignArea').value = complaint.area;
    const vs = document.getElementById('volunteerSelect');
    vs.innerHTML = '<option value="">-- Volunteer தேர்வு செய்யுங்கள் --</option>';
    (wardVolunteers[complaint.area] || []).forEach((vol, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `${vol.name} (${vol.role} - ${vol.ward})`; vs.appendChild(o); });
    document.getElementById('assignModal').classList.add('active');
}

function closeAssignModal() { document.getElementById('assignModal').classList.remove('active'); currentAssignComplaintId = null; }

function confirmAssignment() {
    const vs = document.getElementById('volunteerSelect');
    if (!vs.value) { showNotification('Volunteer-ஐ தேர்வு செய்யுங்கள்!', 'error'); return; }
    const complaint = complaintsDB[currentAssignComplaintId];
    if (!complaint) return;
    const volunteers = wardVolunteers[complaint.area] || [];
    const vol = volunteers[parseInt(vs.value)];
    const now = new Date(), timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    complaint.assigned = `${vol.name} (${vol.role})`;
    complaint.status = 'ஒதுக்கப்பட்டது'; complaint.statusClass = 'badge-assigned';
    complaint.timeline[1] = { text: 'Minister Office ஆய்வு செய்தது', time: `${dateStr} - ${timeStr}`, state: 'completed' };
    complaint.timeline[2] = { text: `${vol.name}-க்கு ஒதுக்கப்பட்டது`, time: `${dateStr} - ${timeStr}`, state: 'active' };
    if (firebaseReady && window.VoiceToMLA_DB) VoiceToMLA_DB.updateComplaint(currentAssignComplaintId, { assigned: complaint.assigned, status: complaint.status, statusClass: complaint.statusClass, timeline: complaint.timeline });
    closeAssignModal();
    showNotification(`✅ ${vol.name}-க்கு ஒதுக்கப்பட்டது!`, 'success');
    updateDashboardStats();
}

// ===== STATUS UPDATE =====
function updateComplaintStatus(complaintId, newStatus) {
    const complaint = complaintsDB[complaintId];
    if (!complaint) return;
    const now = new Date(), timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dm = document.getElementById('detailModal'); if (dm) dm.remove();
    if (newStatus === 'progress') {
        complaint.status = 'பணியில்'; complaint.statusClass = 'badge-progress';
        complaint.timeline[3] = { text: 'பணி தொடங்கப்பட்டது', time: `${dateStr} - ${timeStr}`, state: 'active' };
        complaint.timeline[2] = { ...complaint.timeline[2], state: 'completed' };
        showNotification('🔧 பணி தொடங்கப்பட்டது! (In Progress)', 'success');
    } else if (newStatus === 'resolved') {
        complaint.status = 'தீர்வு ✓'; complaint.statusClass = 'badge-resolved';
        complaint.timeline.forEach((item, i) => { complaint.timeline[i] = { ...item, state: 'completed' }; });
        complaint.timeline[complaint.timeline.length - 1] = { text: 'தீர்வு & உறுதிப்படுத்தப்பட்டது ✓', time: `${dateStr} - ${timeStr}`, state: 'completed' };
        showNotification('✅ தீர்வு செய்யப்பட்டது! (Resolved)', 'success');
    }
    if (firebaseReady && window.VoiceToMLA_DB) VoiceToMLA_DB.updateComplaint(complaintId, { status: complaint.status, statusClass: complaint.statusClass, timeline: complaint.timeline });
    updateDashboardStats();
    updateTrustIndex();
}

// ===== ESCALATION =====
function escalateComplaint(complaintId) {
    const complaint = complaintsDB[complaintId]; if (!complaint) return;
    const dm = document.getElementById('detailModal'); if (dm) dm.remove();
    const now = new Date(), timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const displayId = complaint.govId || `TN/TBM/CPT/2026/${complaint.id.split('-').pop()}`;
    complaint.status = '⚠️ Escalated'; complaint.statusClass = 'badge-new';
    complaint.timeline.push({ text: '⚠️ Minister-க்கு நேரடியாக Escalate செய்யப்பட்டது', time: `${dateStr} - ${timeStr}`, state: 'active' });
    if (firebaseReady && window.VoiceToMLA_DB) VoiceToMLA_DB.updateComplaint(complaintId, { status: complaint.status, statusClass: complaint.statusClass, timeline: complaint.timeline });
    showNotification(`🚨 ${displayId}: Minister-க்கு Escalated!`, 'error');
    setTimeout(() => showNotification('📱 Minister D. Sarathkumar-க்கு நேரடி SMS அனுப்பப்பட்டது!', 'error'), 1500);
    updateDashboardStats();
}

// ===== VIEW COMPLAINT DETAIL =====
function viewComplaintDetail(complaintId) {
    const complaint = complaintsDB[complaintId]; if (!complaint) return;
    const displayId = complaint.govId || `TN/TBM/CPT/2026/${complaint.id.split('-').pop()}`;
    let em = document.getElementById('detailModal'); if (em) em.remove();
    const modal = document.createElement('div'); modal.className = 'modal active'; modal.id = 'detailModal';
    modal.innerHTML = `<div class="modal-overlay" onclick="document.getElementById('detailModal').remove()"></div><div class="modal-content" style="max-width:600px;max-height:80vh;overflow-y:auto;"><button class="modal-close" onclick="document.getElementById('detailModal').remove()">&times;</button><div style="padding:5px;"><div style="text-align:center;margin-bottom:20px;"><h3>📋 புகார் விவரம்</h3><code style="background:var(--primary-light);color:var(--primary);padding:4px 12px;border-radius:6px;font-weight:700;">${displayId}</code></div><div style="background:var(--light);padding:12px;border-radius:8px;margin-bottom:12px;"><p><strong>${complaint.title}</strong></p><p style="font-size:0.8rem;color:var(--gray);">${complaint.area} | ${complaint.category} | ${complaint.date}</p><p style="font-size:0.8rem;margin-top:5px;">Assigned: <strong>${complaint.assigned}</strong></p></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:15px;">${complaint.statusClass === 'badge-assigned' ? `<button class="btn" style="background:#f59e0b;color:white;font-size:0.75rem;padding:6px 12px;border-radius:6px;" onclick="updateComplaintStatus('${complaintId}','progress')"><i class="fas fa-wrench"></i> Start Work</button>` : ''}${complaint.statusClass === 'badge-progress' || complaint.statusClass === 'badge-assigned' ? `<button class="btn" style="background:#10b981;color:white;font-size:0.75rem;padding:6px 12px;border-radius:6px;" onclick="updateComplaintStatus('${complaintId}','resolved')"><i class="fas fa-check-circle"></i> Mark Resolved</button>` : ''}${complaint.statusClass === 'badge-resolved' ? '<span style="color:#10b981;font-weight:600;">✅ தீர்வு!</span>' : ''}<button class="btn" style="background:var(--warning);color:white;font-size:0.75rem;padding:6px 12px;border-radius:6px;" onclick="escalateComplaint('${complaintId}')"><i class="fas fa-exclamation-triangle"></i> Escalate</button><button class="btn btn-primary" style="font-size:0.75rem;padding:6px 12px;" onclick="document.getElementById('detailModal').remove();openAssignModal('${complaintId}')"><i class="fas fa-user-plus"></i> Assign</button></div></div></div>`;
    document.body.appendChild(modal);
}

// ===== ADMIN ACCESS (Professional OTP Login) =====
let isAdminLoggedIn = false;
let adminOTP = '';

function showAdminLogin() {
    let em = document.getElementById('adminLoginModal'); if (em) em.remove();
    const modal = document.createElement('div'); modal.className = 'modal active'; modal.id = 'adminLoginModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="document.getElementById('adminLoginModal').remove()"></div>
        <div class="modal-content" style="max-width:400px;">
            <button class="modal-close" onclick="document.getElementById('adminLoginModal').remove()">&times;</button>
            <div style="padding:10px;">
                <div style="text-align:center;margin-bottom:20px;">
                    <div style="width:60px;height:60px;background:linear-gradient(135deg,#dc2626,#991b1b);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                        <i class="fas fa-shield-alt" style="color:white;font-size:1.5rem;"></i>
                    </div>
                    <h3 style="font-size:1.1rem;margin-bottom:4px;">🔒 Staff Portal Login</h3>
                    <p style="font-size:0.75rem;color:var(--gray);">Authorized Minister Office Staff Only</p>
                </div>
                <div id="adminStep1">
                    <div class="form-group" style="margin-bottom:15px;">
                        <label style="font-size:0.8rem;font-weight:600;">Staff Mobile Number</label>
                        <div style="display:flex;align-items:center;gap:8px;border:2px solid var(--light-gray);border-radius:10px;padding:10px 14px;">
                            <span style="font-weight:600;color:var(--gray);">+91</span>
                            <input type="tel" id="adminMobile" placeholder="Registered mobile number" maxlength="10" style="border:none;outline:none;flex:1;font-size:0.9rem;width:100%;">
                        </div>
                        <p style="font-size:0.7rem;color:var(--gray);margin-top:6px;">📱 OTP will be sent to registered staff number</p>
                    </div>
                    <button class="btn btn-primary btn-full" onclick="sendAdminOTP()" style="background:linear-gradient(135deg,#dc2626,#991b1b);">
                        <i class="fas fa-paper-plane"></i> Send OTP
                    </button>
                </div>
                <div id="adminStep2" style="display:none;">
                    <p style="font-size:0.8rem;text-align:center;margin-bottom:15px;color:var(--dark);">OTP sent to <strong id="adminMobileDisplay">+91 XXXXX</strong></p>
                    <div class="form-group" style="margin-bottom:15px;">
                        <label style="font-size:0.8rem;font-weight:600;">Enter 4-digit OTP</label>
                        <div style="display:flex;justify-content:center;gap:10px;margin-top:8px;">
                            <input type="text" maxlength="1" class="admin-otp-input" style="width:45px;height:50px;text-align:center;font-size:1.3rem;font-weight:700;border:2px solid var(--light-gray);border-radius:10px;outline:none;">
                            <input type="text" maxlength="1" class="admin-otp-input" style="width:45px;height:50px;text-align:center;font-size:1.3rem;font-weight:700;border:2px solid var(--light-gray);border-radius:10px;outline:none;">
                            <input type="text" maxlength="1" class="admin-otp-input" style="width:45px;height:50px;text-align:center;font-size:1.3rem;font-weight:700;border:2px solid var(--light-gray);border-radius:10px;outline:none;">
                            <input type="text" maxlength="1" class="admin-otp-input" style="width:45px;height:50px;text-align:center;font-size:1.3rem;font-weight:700;border:2px solid var(--light-gray);border-radius:10px;outline:none;">
                        </div>
                    </div>
                    <button class="btn btn-primary btn-full" onclick="verifyAdminOTP()" style="background:linear-gradient(135deg,#dc2626,#991b1b);">
                        <i class="fas fa-lock-open"></i> Verify & Login
                    </button>
                    <p style="font-size:0.7rem;color:var(--gray);text-align:center;margin-top:10px;">Didn't receive? <a href="#" onclick="sendAdminOTP()" style="color:var(--primary);">Resend OTP</a></p>
                </div>
                <div style="margin-top:20px;padding-top:15px;border-top:1px solid var(--light-gray);text-align:center;">
                    <p style="font-size:0.65rem;color:var(--gray);">🔐 Secured access | Only registered staff can login</p>
                    <p style="font-size:0.65rem;color:var(--gray);">Unauthorized access is monitored and logged</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => { const mi = document.getElementById('adminMobile'); if (mi) mi.focus(); }, 200);
}

function sendAdminOTP() {
    const mobile = document.getElementById('adminMobile');
    if (!mobile || !mobile.value || mobile.value.length < 10) {
        showNotification('சரியான mobile number உள்ளிடுங்கள்!', 'error');
        return;
    }
    // Generate random 4-digit OTP (for demo, always 1234)
    adminOTP = '1234';
    // Show step 2
    document.getElementById('adminStep1').style.display = 'none';
    document.getElementById('adminStep2').style.display = 'block';
    document.getElementById('adminMobileDisplay').textContent = '+91 ' + mobile.value.substring(0,5) + 'xxxxx';
    showNotification(`📱 OTP sent to +91 ${mobile.value.substring(0,5)}xxxxx`, 'success');
    // Auto-focus first OTP input
    setTimeout(() => {
        const firstOtp = document.querySelector('.admin-otp-input');
        if (firstOtp) firstOtp.focus();
        // Add auto-advance for OTP inputs
        document.querySelectorAll('.admin-otp-input').forEach((inp, idx, arr) => {
            inp.addEventListener('input', (e) => { if (e.target.value.length === 1 && idx < arr.length - 1) arr[idx + 1].focus(); });
            inp.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !e.target.value && idx > 0) arr[idx - 1].focus(); });
        });
    }, 200);
}

function verifyAdminOTP() {
    const inputs = document.querySelectorAll('.admin-otp-input');
    const enteredOTP = Array.from(inputs).map(i => i.value).join('');
    if (enteredOTP.length < 4) {
        showNotification('4-digit OTP முழுமையாக உள்ளிடுங்கள்!', 'error');
        return;
    }
    if (enteredOTP === adminOTP) {
        isAdminLoggedIn = true;
        document.getElementById('adminLoginModal').remove();
        unlockAdminFeatures();
        showNotification('🔓 Staff Login Successful! Welcome, Minister Office Staff', 'success');
    } else {
        showNotification('❌ Invalid OTP! Please try again.', 'error');
        inputs.forEach(i => { i.value = ''; i.style.borderColor = '#ef4444'; });
        inputs[0].focus();
        setTimeout(() => inputs.forEach(i => i.style.borderColor = ''), 2000);
    }
}

function unlockAdminFeatures() {
    const as = document.getElementById('adminSection'); if (as) { as.style.display = 'block'; }
    const aas = document.getElementById('adminActionsSection'); if (aas) { aas.style.display = 'block'; }
    const ab = document.getElementById('adminBadge'); if (ab) ab.style.display = 'inline-flex';
    const alb = document.getElementById('adminLoginBtn'); if (alb) alb.style.display = 'none';
}

// ===== DASHBOARD ASSIGN BUTTON HANDLERS =====
document.addEventListener('click', (e) => {
    const assignBtn = e.target.closest('.btn-action.assign');
    if (assignBtn) {
        const row = assignBtn.closest('tr'), idCell = row.querySelector('code');
        if (idCell) {
            const shortId = idCell.textContent.replace('#', ''), fullId = `TVK-2026-${shortId.padStart(5, '0')}`;
            if (!complaintsDB[fullId]) {
                complaintsDB[fullId] = { id: fullId, title: row.cells[3] ? row.cells[3].textContent.trim() : '-', area: row.cells[4] ? row.cells[4].textContent.trim() : '-', category: row.cells[5] ? row.cells[5].textContent.trim() : '-', assigned: '-', date: 'May 15, 2026', status: 'புதியது', statusClass: 'badge-new', timeline: [{ text: 'புகார் பதிவு', time: 'May 15, 2026', state: 'completed' }, { text: 'Minister Office Queue', time: 'Waiting...', state: 'active' }, { text: 'ஒதுக்கப்படும்', time: '...', state: '' }, { text: 'பணி', time: '...', state: '' }, { text: 'தீர்வு', time: '...', state: '' }] };
            }
            openAssignModal(fullId);
        }
    }
});

// ===== CITIZEN DASHBOARD =====
function loadCitizenComplaints() {
    const input = document.getElementById('citizenSearchInput'), statsSection = document.getElementById('citizenStats'), listSection = document.getElementById('citizenComplaintsList');
    if (!input || !input.value.trim()) { showNotification('Mobile Number உள்ளிடுங்கள்!', 'error'); return; }
    const searchVal = input.value.trim();
    let matched = Object.values(complaintsDB).filter(c => c.mobileNumber === searchVal);
    if (matched.length === 0) { const m = Object.keys(complaintsDB).find(k => k.includes(searchVal) || (complaintsDB[k].govId && complaintsDB[k].govId.includes(searchVal))); if (m) matched.push(complaintsDB[m]); }
    if (matched.length > 0) {
        statsSection.style.display = 'block';
        document.getElementById('citizenTotal').textContent = matched.length;
        document.getElementById('citizenPending').textContent = matched.filter(c => c.statusClass !== 'badge-resolved').length;
        document.getElementById('citizenResolved').textContent = matched.filter(c => c.statusClass === 'badge-resolved').length;
        listSection.innerHTML = matched.map(c => `<div class="complaint-card" style="cursor:pointer;" onclick="navigateTo('track');document.getElementById('trackInput').value='${c.id}';setTimeout(searchComplaint,300);"><div class="complaint-status ${c.statusClass === 'badge-resolved' ? 'status-resolved' : 'status-new'}"><i class="fas ${c.statusClass === 'badge-resolved' ? 'fa-check' : 'fa-clock'}"></i></div><div class="complaint-info"><h4>${c.title}</h4><p>${c.area} | ${c.date}</p></div><span class="status-badge ${c.statusClass}">${c.status}</span></div>`).join('');
    } else { statsSection.style.display = 'none'; listSection.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray);"><p>புகார்கள் கிடைக்கவில்லை</p></div>'; }
}

// ===== UPDATE POSTING =====
function openUpdateModal() { document.getElementById('updateModal').classList.add('active'); }
function closeUpdateModal() { document.getElementById('updateModal').classList.remove('active'); }
function postUpdate() {
    const tag = document.getElementById('updateTag').value, title = document.getElementById('updateTitle').value, content = document.getElementById('updateContent').value;
    if (!title || !content) { showNotification('தலைப்பு மற்றும் விளக்கம் தேவை!', 'error'); return; }
    const ug = document.querySelector('.updates-grid');
    if (ug) { const nu = document.createElement('div'); nu.className = 'update-card'; nu.innerHTML = `<div class="update-date"><span class="day">${new Date().getDate()}</span><span class="month">${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][new Date().getMonth()]}</span></div><div class="update-content"><span class="update-tag">${tag}</span><h4>${title}</h4><p>${content}</p></div>`; ug.insertBefore(nu, ug.firstChild); }
    closeUpdateModal(); showNotification('📢 Update Post செய்யப்பட்டது!', 'success');
    document.getElementById('updateTitle').value = ''; document.getElementById('updateContent').value = '';
}

// ===== CITIZEN FEEDBACK SYSTEM =====
let feedbackDB = {};
let selectedRating = 0;

function showFeedbackModal(complaintId) {
    const complaint = complaintsDB[complaintId]; if (!complaint) return;
    const displayId = complaint.govId || `TN/TBM/CPT/2026/${complaint.id.split('-').pop()}`;
    let em = document.getElementById('feedbackModal'); if (em) em.remove();
    const modal = document.createElement('div'); modal.className = 'modal active'; modal.id = 'feedbackModal';
    modal.innerHTML = `<div class="modal-overlay" onclick="document.getElementById('feedbackModal').remove()"></div><div class="modal-content" style="max-width:420px;text-align:center;"><button class="modal-close" onclick="document.getElementById('feedbackModal').remove()">&times;</button><div style="padding:10px;"><div style="font-size:3rem;margin-bottom:10px;">⭐</div><h3 style="font-size:1.1rem;margin-bottom:5px;">உங்கள் கருத்து (Feedback)</h3><p style="font-size:0.8rem;color:var(--gray);margin-bottom:5px;">${displayId}</p><p style="font-size:0.85rem;margin-bottom:20px;">${complaint.title}</p><p style="font-size:0.85rem;font-weight:600;margin-bottom:10px;">சேவை எப்படி இருந்தது?</p><div id="starRating" style="display:flex;justify-content:center;gap:8px;margin-bottom:15px;"><span class="feedback-star" onclick="selectRating(1)" style="font-size:2.2rem;cursor:pointer;">☆</span><span class="feedback-star" onclick="selectRating(2)" style="font-size:2.2rem;cursor:pointer;">☆</span><span class="feedback-star" onclick="selectRating(3)" style="font-size:2.2rem;cursor:pointer;">☆</span><span class="feedback-star" onclick="selectRating(4)" style="font-size:2.2rem;cursor:pointer;">☆</span><span class="feedback-star" onclick="selectRating(5)" style="font-size:2.2rem;cursor:pointer;">☆</span></div><p id="ratingText" style="font-size:0.8rem;color:var(--gray);margin-bottom:15px;">நட்சத்திரங்களை தேர்வு செய்யுங்கள்</p><button class="btn btn-primary btn-full" onclick="submitFeedback('${complaintId}')" id="submitFeedbackBtn" disabled style="opacity:0.5;"><i class="fas fa-paper-plane"></i> கருத்து சமர்ப்பி</button></div></div>`;
    document.body.appendChild(modal);
}

function selectRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.feedback-star');
    const texts = ['', '😞 மிகவும் மோசம்', '😐 மோசம்', '🙂 சரி', '😊 நல்லது', '🤩 மிக அருமை!'];
    stars.forEach((s, i) => { s.textContent = i < rating ? '★' : '☆'; s.style.color = i < rating ? '#f59e0b' : '#ccc'; });
    document.getElementById('ratingText').textContent = texts[rating];
    const btn = document.getElementById('submitFeedbackBtn'); btn.disabled = false; btn.style.opacity = '1';
}

function submitFeedback(complaintId) {
    if (selectedRating === 0) return;
    feedbackDB[complaintId] = { rating: selectedRating, date: new Date().toISOString() };
    if (complaintsDB[complaintId]) complaintsDB[complaintId].feedback = { rating: selectedRating };
    if (firebaseReady && window.VoiceToMLA_DB) VoiceToMLA_DB.updateComplaint(complaintId, { feedback: { rating: selectedRating } });
    document.getElementById('feedbackModal').remove();
    showNotification(`⭐ நன்றி! ${selectedRating}/5 Rating பதிவு செய்யப்பட்டது!`, 'success');
    selectedRating = 0;
    updateTrustIndex();
}

// ===== LIVE TRUST INDEX =====
function updateTrustIndex() {
    const all = Object.values(complaintsDB), total = all.length;
    if (total === 0) return;
    const resolved = all.filter(c => c.statusClass === 'badge-resolved').length;
    const resolutionRate = ((resolved / total) * 100).toFixed(1);
    let totalRating = 0, ratingCount = 0;
    all.forEach(c => { if (c.feedback && c.feedback.rating) { totalRating += c.feedback.rating; ratingCount++; } });
    Object.values(feedbackDB).forEach(f => { if (f.rating) { totalRating += f.rating; ratingCount++; } });
    const satisfactionRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '4.6';
    const avgResponseTime = '2.3';
    const resScore = Math.min(parseFloat(resolutionRate), 100);
    const speedScore = Math.max(0, 100 - (parseFloat(avgResponseTime) * 10));
    const satScore = (parseFloat(satisfactionRating) / 5) * 100;
    const trustScore = Math.round((resScore * 0.4) + (speedScore * 0.3) + (satScore * 0.3));

    const scoreNum = document.querySelector('.score-num'); if (scoreNum) scoreNum.textContent = trustScore + '%';
    const trustFill = document.querySelector('.trust-fill');
    if (trustFill) { const c = 283; trustFill.style.strokeDasharray = c; trustFill.style.strokeDashoffset = c - (c * trustScore / 100); }
    const mv = document.querySelectorAll('.metric-value');
    if (mv.length >= 4) { mv[0].textContent = resolutionRate + '%'; mv[1].textContent = avgResponseTime + ' Days'; mv[2].textContent = satisfactionRating + '/5 ⭐'; mv[3].textContent = '48'; }
}

// ===== FILE UPLOAD =====
const uploadArea = document.getElementById('uploadArea'), fileInput = document.getElementById('fileInput'), uploadPreview = document.getElementById('uploadPreview');
if (uploadArea) {
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        Array.from(e.target.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => { const p = document.createElement('div'); p.style.cssText = 'width:80px;height:80px;border-radius:8px;overflow:hidden;position:relative;'; p.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;"><button onclick="this.parentElement.remove()" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:red;color:white;border:none;cursor:pointer;">&times;</button>`; uploadPreview.appendChild(p); };
                reader.readAsDataURL(file);
            }
        });
    });
}

// ===== LOCATION =====
const getLocationBtn = document.getElementById('getLocation');
if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
        getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        setTimeout(() => {
            document.getElementById('locationText').textContent = '📍 12.9249, 80.1000 (Tambaram Area)';
            document.getElementById('locationText').style.color = '#10b981';
            getLocationBtn.innerHTML = '<i class="fas fa-check"></i> Location Set';
            showNotification('Location captured!', 'success');
        }, 1500);
    });
}

// ===== VOICE INPUT =====
let recognition = null, isRecording = false;
function startVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn'), voiceStatus = document.getElementById('voiceStatus'), description = document.getElementById('description');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SR(); recognition.lang = 'ta-IN'; recognition.continuous = true; recognition.interimResults = true;
        recognition.onstart = () => { isRecording = true; voiceBtn.classList.add('recording'); voiceStatus.style.display = 'block'; };
        recognition.onresult = (e) => { for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) description.value += e.results[i][0].transcript + ' '; } };
        recognition.onerror = () => stopVoiceInput();
        recognition.start();
    } else { simulateVoiceInput(); }
}
function stopVoiceInput() { isRecording = false; document.getElementById('voiceBtn').classList.remove('recording'); document.getElementById('voiceStatus').style.display = 'none'; if (recognition) { recognition.stop(); recognition = null; } }
function simulateVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn'), voiceStatus = document.getElementById('voiceStatus'), description = document.getElementById('description');
    isRecording = true; voiceBtn.classList.add('recording'); voiceStatus.style.display = 'block';
    const texts = ['எங்கள் பகுதியில் ', 'எங்கள் பகுதியில் சாலையில் பெரிய பள்ளம் உள்ளது. ', 'எங்கள் பகுதியில் சாலையில் பெரிய பள்ளம் உள்ளது. உடனடியாக சரி செய்ய வேண்டும்.'];
    let i = 0;
    const iv = setInterval(() => { if (i < texts.length && isRecording) { description.value = texts[i]; i++; } else { clearInterval(iv); stopVoiceInput(); } }, 800);
}

// ===== DASHBOARD BAR ANIMATION =====
function animateBars() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
        const w = bar.getAttribute('data-width') || bar.style.width;
        if (!bar.getAttribute('data-width')) bar.setAttribute('data-width', bar.style.width);
        bar.style.width = '0%'; setTimeout(() => { bar.style.width = w; }, 200);
    });
}
const dashboardPage = document.getElementById('page-dashboard');
const dashObserver = new MutationObserver((mutations) => { mutations.forEach(m => { if (m.target.classList.contains('active')) setTimeout(animateBars, 300); }); });
if (dashboardPage) { dashObserver.observe(dashboardPage, { attributes: true, attributeFilter: ['class'] }); if (dashboardPage.classList.contains('active')) setTimeout(animateBars, 500); }

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); if (isRecording) stopVoiceInput(); } });

// ===== PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero-stat-card').forEach((card, i) => { card.style.opacity = '0'; card.style.transform = 'translateY(20px)'; setTimeout(() => { card.style.transition = 'all 0.5s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 200 + (i * 150)); });
    setTimeout(updateTrustIndex, 2000);
});

console.log('🎯 Voice to Minister - Demo Platform Loaded Successfully!');
console.log('Pages: Home | Complaint | Track | Updates | Minister Dashboard');
console.log('Features: Voice Input | Heatmap | Feedback | Trust Index | Minister Branding');
