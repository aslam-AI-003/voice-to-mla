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
let loggedInUser = JSON.parse(localStorage.getItem('vtm_loggedInUser') || 'null');

loginBtn.addEventListener('click', () => {
    if (loggedInUser) { toggleProfileDropdown(); }
    else {
        // Reset modal to fresh state
        const mobileInput = document.querySelector('#loginModal .phone-input input[type="tel"]');
        if (mobileInput) mobileInput.value = '';
        const otpSection = document.getElementById('otpSection');
        if (otpSection) otpSection.style.display = 'none';
        document.querySelectorAll('.otp-input').forEach(i => i.value = '');
        loginModal.classList.add('active');
    }
});

function closeModal() { loginModal.classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
    });
});

// ===== OTP FUNCTIONALITY =====
function sendOTP() {
    const mobileInput = document.querySelector('#loginModal .phone-input input[type="tel"]');
    if (!mobileInput || !mobileInput.value || mobileInput.value.length < 10) {
        showNotification('சரியான Mobile Number உள்ளிடுங்கள்!', 'error'); return;
    }
    const otpSection = document.getElementById('otpSection');
    otpSection.style.display = 'block';
    showNotification(`📱 OTP sent to +91 ${mobileInput.value.substring(0,5)}xxxxx`, 'success');
    setTimeout(() => { const fi = otpSection.querySelector('.otp-input'); if (fi) fi.focus(); }, 100);
}

function verifyOTP() {
    const mobileInput = document.querySelector('#loginModal .phone-input input[type="tel"]');
    const mobile = mobileInput ? mobileInput.value.trim() : '';
    // Find user's name from existing complaints or use mobile
    let userName = '';
    const userComplaints = Object.values(complaintsDB).filter(c => c.mobileNumber === mobile);
    if (userComplaints.length > 0 && userComplaints[0].citizenName) {
        userName = userComplaints[0].citizenName;
    } else {
        userName = 'User';
    }
    // Save logged in state
    loggedInUser = { name: userName, mobile: mobile, loginTime: new Date().toISOString() };
    localStorage.setItem('vtm_loggedInUser', JSON.stringify(loggedInUser));
    closeModal();
    updateLoginUI();
    autoFillFormFromLogin();
    showNotification(`✅ வெற்றிகரமாக Login! வணக்கம் ${userName}`, 'success');
}

function updateLoginUI() {
    if (!loggedInUser) {
        loginBtn.innerHTML = '<i class="fas fa-user-circle"></i><span>Login</span>';
        loginBtn.style.background = ''; loginBtn.style.color = ''; loginBtn.style.border = '';
        return;
    }
    const displayName = loggedInUser.name.length > 8 ? loggedInUser.name.substring(0, 8) + '..' : loggedInUser.name;
    loginBtn.innerHTML = `<i class="fas fa-user-circle"></i><span>${displayName} ▾</span>`;
    loginBtn.style.background = 'var(--primary)'; loginBtn.style.color = 'white'; loginBtn.style.border = 'none'; loginBtn.style.borderRadius = '8px'; loginBtn.style.padding = '8px 14px';
}

function toggleProfileDropdown() {
    let dd = document.getElementById('profileDropdown');
    if (dd) { dd.remove(); return; }
    const rect = loginBtn.getBoundingClientRect();
    dd = document.createElement('div');
    dd.id = 'profileDropdown';
    dd.style.cssText = `position:fixed;top:${rect.bottom + 8}px;right:20px;background:white;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.15);padding:0;min-width:240px;z-index:5000;overflow:hidden;animation:slideIn 0.2s ease;`;
    const userComplaints = Object.values(complaintsDB).filter(c => c.mobileNumber === loggedInUser.mobile);
    const resolved = userComplaints.filter(c => c.statusClass === 'badge-resolved').length;
    dd.innerHTML = `
        <div style="background:linear-gradient(135deg,#dc2626,#991b1b);padding:16px;color:white;">
            <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">👤</div>
                <div><h4 style="margin:0;font-size:0.9rem;">${loggedInUser.name}</h4><p style="margin:0;font-size:0.7rem;opacity:0.8;">+91 ${loggedInUser.mobile}</p></div>
            </div>
        </div>
        <div style="padding:8px;">
            <div style="display:flex;justify-content:space-around;padding:10px 0;border-bottom:1px solid #f3f4f6;">
                <div style="text-align:center;"><span style="font-size:1.1rem;font-weight:700;color:#dc2626;">${userComplaints.length}</span><p style="font-size:0.6rem;color:#666;margin:2px 0 0;">புகார்கள்</p></div>
                <div style="text-align:center;"><span style="font-size:1.1rem;font-weight:700;color:#059669;">${resolved}</span><p style="font-size:0.6rem;color:#666;margin:2px 0 0;">தீர்வு</p></div>
                <div style="text-align:center;"><span style="font-size:1.1rem;font-weight:700;color:#d97706;">${userComplaints.length - resolved}</span><p style="font-size:0.6rem;color:#666;margin:2px 0 0;">நிலுவை</p></div>
            </div>
            <a href="#" onclick="document.getElementById('profileDropdown').remove();navigateTo('mycomplaints');autoLoadMyComplaints();" style="display:flex;align-items:center;gap:10px;padding:10px 12px;text-decoration:none;color:#333;font-size:0.8rem;border-radius:8px;margin-top:4px;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''"><i class="fas fa-clipboard-list" style="color:#dc2626;"></i> என் புகார்கள்</a>
            <a href="#" onclick="document.getElementById('profileDropdown').remove();navigateTo('complaint');" style="display:flex;align-items:center;gap:10px;padding:10px 12px;text-decoration:none;color:#333;font-size:0.8rem;border-radius:8px;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background=''"><i class="fas fa-plus-circle" style="color:#2563eb;"></i> புதிய புகார் செய்</a>
            <a href="#" onclick="document.getElementById('profileDropdown').remove();logoutUser();" style="display:flex;align-items:center;gap:10px;padding:10px 12px;text-decoration:none;color:#ef4444;font-size:0.8rem;border-radius:8px;border-top:1px solid #f3f4f6;margin-top:4px;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background=''"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>`;
    document.body.appendChild(dd);
    // Close on outside click
    setTimeout(() => { document.addEventListener('click', closeProfileDropdown); }, 100);
}

function closeProfileDropdown(e) {
    const dd = document.getElementById('profileDropdown');
    if (dd && !dd.contains(e.target) && !loginBtn.contains(e.target)) {
        dd.remove(); document.removeEventListener('click', closeProfileDropdown);
    }
}

function logoutUser() {
    loggedInUser = null;
    localStorage.removeItem('vtm_loggedInUser');
    updateLoginUI();
    showNotification('👋 Logged out successfully', 'info');
}

function autoFillFormFromLogin() {
    if (!loggedInUser) return;
    const nameField = document.getElementById('citizenName');
    const mobileField = document.getElementById('mobileNumber');
    // Only auto-fill mobile (safe - it's the user's own number)
    if (mobileField && !mobileField.value && loggedInUser.mobile) mobileField.value = loggedInUser.mobile;
    // Only fill name if it's the user's OWN name (not from other complaints)
    // Don't fill name if it's just "User" (generic)
}

function autoLoadMyComplaints() {
    if (!loggedInUser) return;
    const input = document.getElementById('citizenSearchInput');
    if (input) { input.value = loggedInUser.mobile; loadCitizenComplaints(); }
}

// Restore login state on page load
if (loggedInUser) { setTimeout(() => { updateLoginUI(); autoFillFormFromLogin(); }, 300); }

// After Firebase loads, update user's name if still "User"
function refreshLoggedInUserName() {
    if (!loggedInUser || loggedInUser.name !== 'User') return;
    const userComplaints = Object.values(complaintsDB).filter(c => c.mobileNumber === loggedInUser.mobile);
    if (userComplaints.length > 0 && userComplaints[0].citizenName) {
        loggedInUser.name = userComplaints[0].citizenName;
        localStorage.setItem('vtm_loggedInUser', JSON.stringify(loggedInUser));
        updateLoginUI();
    }
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

// ===== ALL TN GOVERNMENT DEPARTMENTS & GRIEVANCE TYPES =====
const govDepartments = {
    'GENERAL': { name: 'General Issues (Local)', nameTA: 'பொது பிரச்சனைகள் (உள்ளூர்)', grievances: ['சாலை பள்ளம் / Road Pothole', 'சாலை சீரமைப்பு / Road Repair', 'குடிநீர் வரவில்லை / No Water Supply', 'குடிநீர் குழாய் உடைப்பு / Water Pipe Leakage', 'வடிகால் அடைப்பு / Drainage Block', 'சாக்கடை வழிதல் / Sewage Overflow', 'தெரு விளக்கு பழுது / Street Light Not Working', 'மின் தடை / Power Cut', 'குப்பை அகற்றப்படவில்லை / Garbage Not Cleared', 'குப்பை கொட்டுதல் / Illegal Dumping', 'பூங்கா பராமரிப்பு / Park Maintenance', 'போக்குவரத்து நெரிசல் / Traffic Congestion', 'சிக்னல் பழுது / Signal Not Working', 'தெரு நாய் தொல்லை / Stray Dog Menace', 'சத்தம் மாசு / Noise Pollution', 'ஆக்கிரமிப்பு / Encroachment', 'பொது புகார் / General Complaint'] },
    'ADW': { name: 'Adi Dravidar and Tribal Welfare Department', nameTA: 'ஆதிதிராவிடர் மற்றும் பழங்குடியினர் நலத்துறை', grievances: ['இலவச வீட்டு மனை திட்டம் / Free Housing Scheme', 'உதவித்தொகை வழங்கப்படவில்லை / Scholarship Not Received', 'விடுதி சேர்க்கை / Hostel Admission', 'நலத்திட்ட உதவி / Welfare Scheme Benefits', 'சமூக சான்றிதழ் / Community Certificate Issue', 'பொது புகார் / General Complaint'] },
    'AGRI': { name: 'Agriculture and Farmers Welfares Department', nameTA: 'வேளாண்மை மற்றும் உழவர் நலத்துறை', grievances: ['பயிர் காப்பீட்டு உரிமை / Crop Insurance Claim', 'மானியம் வழங்கப்படவில்லை / Subsidy Not Received', 'ஆழ்துளை கிணறு திட்டம் / Bore Well Scheme', 'உரம் வழங்கல் / Fertilizer Supply Issue', 'PM-KISAN தொகை / PM-KISAN Amount', 'பொது புகார் / General Complaint'] },
    'AHFISH': { name: 'Animal Husbandry, Dairying, Fisheries and Fishermen Welfare Department', nameTA: 'கால்நடை பராமரிப்பு, பால்வளம், மீன்வளம் மற்றும் மீனவர் நலத்துறை', grievances: ['கால்நடை மருத்துவமனை / Veterinary Hospital', 'கால்நடை காப்பீடு / Cattle Insurance', 'மீன்பிடி அனுமதி / Fishing Permit', 'மீன் சந்தை வசதி / Fish Market Facilities', 'பொது புகார் / General Complaint'] },
    'BCMBC': { name: 'BC, MBC and Minorities Welfare Department', nameTA: 'பிற்படுத்தப்பட்டோர், மிகவும் பிற்படுத்தப்பட்டோர் மற்றும் சிறுபான்மையினர் நலத்துறை', grievances: ['உதவித்தொகை / Scholarship', 'சமூக சான்றிதழ் / Community Certificate', 'நலத்திட்ட உதவி / Welfare Scheme', 'திருமண உதவி / Marriage Assistance', 'பொது புகார் / General Complaint'] },
    'FOODCO': { name: 'Co-operation, Food and Consumer Protection Department', nameTA: 'கூட்டுறவு, உணவு மற்றும் நுகர்வோர் பாதுகாப்புத்துறை', grievances: ['ரேஷன் அட்டை பிரச்சனை / Ration Card Issue', 'நியாய விலை கடை புகார் / PDS Shop Complaint', 'பொருட்கள் தரம் / Product Quality', 'நுகர்வோர் தகராறு / Consumer Dispute', 'பொது புகார் / General Complaint'] },
    'CTREG': { name: 'Commercial Taxes and Registration Department', nameTA: 'வணிக வரி மற்றும் பதிவுத்துறை', grievances: ['சொத்து பதிவு தாமதம் / Property Registration Delay', 'முத்திரை கட்டண பிரச்சனை / Stamp Duty Issue', 'GST புகார் / GST Grievance', 'பொது புகார் / General Complaint'] },
    'ENERGY': { name: 'Energy Department', nameTA: 'எரிசக்தித்துறை', grievances: ['மின் தடை / Power Cut', 'தெரு விளக்கு பழுது / Street Light Repair', 'புதிய மின் இணைப்பு / New Connection', 'மின்மாற்றி பழுது / Transformer Issue', 'மின் கட்டண தகராறு / EB Bill Dispute', 'மீட்டர் பிரச்சனை / Meter Problem', 'மின் கம்பம் சாய்வு / Electric Pole Tilt', 'பொது புகார் / General Complaint'] },
    'ENVFOR': { name: 'Environment, Climate Change and Forests Department', nameTA: 'சுற்றுச்சூழல், காலநிலை மாற்றம் மற்றும் வனத்துறை', grievances: ['மரம் வெட்ட அனுமதி / Tree Cutting Permission', 'மாசு புகார் / Pollution Complaint', 'காடு ஆக்கிரமிப்பு / Forest Encroachment', 'பொது புகார் / General Complaint'] },
    'FIN': { name: 'Finance Department', nameTA: 'நிதித்துறை', grievances: ['கருவூல பணம் தாமதம் / Treasury Payment Delay', 'ஓய்வூதியம் வழங்கல் / Pension Disbursement', 'பொது புகார் / General Complaint'] },
    'HHTK': { name: 'Handlooms, Handicrafts, Textiles and Khadi Department', nameTA: 'கைத்தறி, கைவினைப்பொருட்கள், ஜவுளி மற்றும் காதித்துறை', grievances: ['நெசவாளர் கடன் / Weaver Loan', 'மானியம் / Subsidy', 'மூலப்பொருள் வழங்கல் / Raw Material Supply', 'பொது புகார் / General Complaint'] },
    'HEALTH': { name: 'Health and Family Welfare Department', nameTA: 'சுகாதாரம் மற்றும் குடும்ப நலத்துறை', grievances: ['ஆரம்ப சுகாதார நிலையம் சேவை / PHC/GH Service', 'மருந்து பற்றாக்குறை / Medicine Shortage', 'ஆம்புலன்ஸ் தாமதம் / Ambulance Delay', 'சுகாதாரம் / Cleanliness Issue', 'மருத்துவர் இல்லை / Doctor Not Available', '108 சேவை / 108 Service Issue', 'பொது புகார் / General Complaint'] },
    'HIGHEDU': { name: 'Higher Education Department', nameTA: 'உயர்கல்வித்துறை', grievances: ['கல்லூரி சேர்க்கை / College Admission', 'உதவித்தொகை / Scholarship', 'விடுதி வசதி / Hostel Facility', 'தேர்வு பிரச்சனை / Exam Issue', 'பொது புகார் / General Complaint'] },
    'HWY': { name: 'Highways and Minor Ports Department', nameTA: 'நெடுஞ்சாலை மற்றும் சிறு துறைமுகத்துறை', grievances: ['சாலை பள்ளம் / Road Pothole', 'மேம்பாலம் பராமரிப்பு / Flyover Maintenance', 'தேசிய/மாநில நெடுஞ்சாலை சீரமைப்பு / NH/SH Repair', 'வேக தடை தேவை / Speed Breaker Needed', 'சமிக்ஞை விளக்கு பழுது / Signal Malfunction', 'சாலை அகலப்படுத்தல் / Road Widening', 'பொது புகார் / General Complaint'] },
    'PAR': { name: 'Human Resources Management Department', nameTA: 'மனித வள மேலாண்மைத்துறை', grievances: ['அரசு ஊழியர் பிரச்சனை / Govt Staff Issue', 'இடமாற்றம்/பணி நியமனம் / Transfer/Posting', 'சேவை விவகாரம் / Service Matter', 'பொது புகார் / General Complaint'] },
    'HOMEEXC': { name: 'Home, Prohibition and Excise Department', nameTA: 'உள்துறை, தடை மற்றும் கலால்துறை', grievances: ['சட்டம்-ஒழுங்கு / Law and Order', 'மதுக்கடை புகார் / Liquor Shop Complaint', 'சத்தம் மாசு / Noise Pollution', 'சட்டவிரோத நடவடிக்கை / Illegal Activity', 'CCTV கோரிக்கை / CCTV Request', 'போதை ஒழிப்பு / Anti-Drug Complaint', 'பொது புகார் / General Complaint'] },
    'HUD': { name: 'Housing and Urban Development Department', nameTA: 'வீட்டு வசதி மற்றும் நகர்ப்புற வளர்ச்சித்துறை', grievances: ['PMAY வீட்டு திட்டம் / PMAY Housing', 'வீட்டு மனை பட்டா / Site Patta', 'குடிசை மாற்று வாரியம் / Slum Clearance Board', 'கட்டிட ஒப்புதல் / Building Approval', 'பொது புகார் / General Complaint'] },
    'IND': { name: 'Industries Department', nameTA: 'தொழில்துறை', grievances: ['தொழிற்சாலை உரிமம் / Industrial License', 'தொழிற்சாலை பிரச்சனை / Factory Issue', 'தொழில் பூங்கா / Industrial Estate', 'பொது புகார் / General Complaint'] },
    'IT': { name: 'Information Technology Department', nameTA: 'தகவல் தொழில்நுட்பத்துறை', grievances: ['e-ஆளுமை சேவை / e-Governance Service', 'இணைய தளம் பிரச்சனை / Online Portal Issue', 'டிஜிட்டல் சேவை புகார் / Digital Service Complaint', 'பொது புகார் / General Complaint'] },
    'LBREMP': { name: 'Labour Welfare and Skill Development Department', nameTA: 'தொழிலாளர் நலம் மற்றும் திறன் மேம்பாட்டுத்துறை', grievances: ['ESI பிரச்சனை / ESI Issue', 'PF புகார் / PF Complaint', 'தொழிற்சாலை பாதுகாப்பு / Factory Safety', 'திறன் பயிற்சி / Skill Training', 'பொது புகார் / General Complaint'] },
    'LAW': { name: 'Law Department', nameTA: 'சட்டத்துறை', grievances: ['இலவச சட்ட உதவி / Free Legal Aid', 'நீதிமன்ற தொடர்பான சேவை / Court Related Service', 'பொது புகார் / General Complaint'] },
    'LEGIS': { name: 'Legislative Assembly Department', nameTA: 'சட்டமன்றத்துறை', grievances: ['MLA அலுவலக புகார் / MLA Office Complaint', 'தொகுதி விவகாரம் / Constituency Matter', 'பொது புகார் / General Complaint'] },
    'MSME': { name: 'Micro, Small and Medium Enterprises Department', nameTA: 'நுண்ணிய, சிறு மற்றும் நடுத்தர தொழில்துறை', grievances: ['MSME கடன் / MSME Loan', 'உரிமம் / License Issue', 'மானிய திட்டம் / Subsidy Scheme', 'பொது புகார் / General Complaint'] },
    'MAWS': { name: 'Municipal Administration and Water Supply Department', nameTA: 'நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை', grievances: ['குடிநீர் பிரச்சனை / Drinking Water Issue', 'வடிகால் அடைப்பு / Drainage Overflow', 'குப்பை அகற்றல் / Garbage Collection', 'சாலை சீரமைப்பு / Road Repair', 'தெரு விளக்கு / Street Light', 'கட்டிட அனுமதி / Building Permit', 'சொத்து வரி / Property Tax', 'பொது புகார் / General Complaint'] },
    'ELECTION': { name: 'Public Elections Department', nameTA: 'பொது தேர்தல்துறை', grievances: ['வாக்காளர் அடையாள அட்டை / Voter ID Issue', 'வாக்காளர் பட்டியல் திருத்தம் / Electoral Roll Correction', 'பொது புகார் / General Complaint'] },
    'PUBLIC': { name: 'Public Department', nameTA: 'பொதுத்துறை', grievances: ['பொது புகார் / General Public Grievance', 'அரசு சேவை தாமதம் / Govt Service Delay', 'பொது புகார் / General Complaint'] },
    'PWD': { name: 'Public Works Department', nameTA: 'பொதுப்பணித்துறை', grievances: ['அரசு கட்டிடம் சீரமைப்பு / Govt Building Repair', 'பாலம் பராமரிப்பு / Bridge Maintenance', 'கால்வாய் / நீர்வழி / Canal/Waterway', 'பொது புகார் / General Complaint'] },
    'REV': { name: 'Revenue and Disaster Management Department', nameTA: 'வருவாய் மற்றும் பேரிடர் மேலாண்மைத்துறை', grievances: ['பட்டா/சிட்டா பிரச்சனை / Patta/Chitta Issue', 'நில அளவை / Land Survey', 'ஆக்கிரமிப்பு / Encroachment', 'இயற்கை பேரிடர் நிவாரணம் / Natural Disaster Relief', 'சான்றிதழ் வழங்கல் / Certificate Issue', 'வருவாய் சான்றிதழ் / Income Certificate', 'பொது புகார் / General Complaint'] },
    'RDPR': { name: 'Rural Development and Panchayat Raj Department', nameTA: 'ஊரக வளர்ச்சி மற்றும் பஞ்சாயத்து ராஜ்துறை', grievances: ['கிராம சாலை / Village Road', 'ஊரக குடிநீர் / Rural Water Supply', 'பஞ்சாயத்து புகார் / Panchayat Complaint', 'MGNREGA / MGNREGA Issue', 'ஊரக வீட்டு வசதி / Rural Housing', 'பொது புகார் / General Complaint'] },
    'SCHOOL': { name: 'School Education Department', nameTA: 'பள்ளிக்கல்வித்துறை', grievances: ['பள்ளி கட்டிடம் / School Building', 'ஆசிரியர் பற்றாக்குறை / Teacher Shortage', 'மதிய உணவு / Mid-Day Meal', 'பள்ளி பேருந்து / School Bus', 'சேர்க்கை பிரச்சனை / Admission Issue', 'பொது புகார் / General Complaint'] },
    'SWNM': { name: 'Social Welfare and Women Empowerment Department', nameTA: 'சமூக நலம் மற்றும் மகளிர் மேம்பாட்டுத்துறை', grievances: ['தொட்டில் குழந்தை திட்டம் / Cradle Baby Scheme', 'மகளிர் உதவி எண் / Women Helpline', 'முதியோர் இல்லம் / Old Age Home', 'திருமண உதவி / Marriage Assistance', 'பொது புகார் / General Complaint'] },
    'TAMINF': { name: 'Tamil Development and Information Department', nameTA: 'தமிழ் வளர்ச்சி மற்றும் தகவல்துறை', grievances: ['தமிழ் பெயர் பலகை / Tamil Signboard', 'மொழிபெயர்ப்பு சேவை / Translation Service', 'ஊடக புகார் / Media Complaint', 'பொது புகார் / General Complaint'] },
    'TOURCUL': { name: 'Tourism, Culture and Religious Endowments Department', nameTA: 'சுற்றுலா, கலாச்சாரம் மற்றும் அறநிலையத்துறை', grievances: ['கோவில் பராமரிப்பு / Temple Maintenance', 'சுற்றுலா தளம் / Tourist Spot Issue', 'திருவிழா ஏற்பாடு / Festival Arrangement', 'பொது புகார் / General Complaint'] },
    'TRANS': { name: 'Transport Department', nameTA: 'போக்குவரத்துத்துறை', grievances: ['பேருந்து வழித்தடம் கோரிக்கை / Bus Route Demand', 'பேருந்து நிறுத்தம் / Bus Stop Issue', 'MTC புகார் / MTC Complaint', 'ஓட்டுநர் உரிமம் / Driving License', 'வாகன அனுமதி / Vehicle Permit', 'பொது புகார் / General Complaint'] },
    'DIFFABLE': { name: 'Welfare of Differently Abled Persons Department', nameTA: 'மாற்றுத்திறனாளிகள் நலத்துறை', grievances: ['மாற்றுத்திறன் சான்றிதழ் / Disability Certificate', 'உதவி சாதனம் / Assistive Device', 'உதவித்தொகை / Scholarship', 'சரிவு வசதி / Ramp Facility', 'பொது புகார் / General Complaint'] },
    'YOUTHSP': { name: 'Youth Welfare and Sports Development Department', nameTA: 'இளைஞர் நலம் மற்றும் விளையாட்டு மேம்பாட்டுத்துறை', grievances: ['விளையாட்டு மைதானம் / Playground', 'விளையாட்டு உபகரணம் / Sports Equipment', 'இளைஞர் திட்டம் / Youth Scheme', 'விளையாட்டு வசதி / Sports Facility', 'பொது புகார் / General Complaint'] },
    'WRD': { name: 'Water Resources Department', nameTA: 'நீர்வளத்துறை', grievances: ['கால்வாய் பராமரிப்பு / Canal Maintenance', 'அணை நீர் திறப்பு / Dam Water Release', 'நீர்ப்பாசன பிரச்சனை / Irrigation Issue', 'வெள்ள கட்டுப்பாடு / Flood Control', 'பொது புகார் / General Complaint'] },
    'PLGDEV': { name: 'Planning and Development Department', nameTA: 'திட்டம் மற்றும் வளர்ச்சித்துறை', grievances: ['வளர்ச்சி திட்டம் / Development Scheme', 'பகுதி திட்டம் / Area Plan', 'பொது புகார் / General Complaint'] },
    'SPI': { name: 'Special Programme Implementation Department', nameTA: 'சிறப்பு திட்ட செயலாக்கத்துறை', grievances: ['சிறப்பு திட்டம் / Special Scheme', 'SPI திட்ட புகார் / SPI Project Grievance', 'பொது புகார் / General Complaint'] }
};

// ===== POPULATE DEPARTMENT DROPDOWN ON LOAD =====
function populateDepartmentDropdown() {
    const deptSelect = document.getElementById('govDepartment');
    if (!deptSelect) return;
    const savedValue = deptSelect.value;
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ta';
    const placeholder = lang === 'en' ? '-- Select Government Department --' : '-- அரசு துறையை தேர்வு செய்யுங்கள் --';
    deptSelect.innerHTML = `<option value="">${placeholder}</option>`;
    Object.entries(govDepartments).forEach(([code, dept]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = lang === 'en' ? `${dept.name} (${code})` : `${dept.nameTA || dept.name} (${code})`;
        deptSelect.appendChild(option);
    });
    if (savedValue) deptSelect.value = savedValue;
}

// ===== DEPARTMENT → GRIEVANCE TYPE CASCADING =====
function onDepartmentChange() {
    const deptSelect = document.getElementById('govDepartment');
    const grievanceSelect = document.getElementById('grievanceType');
    const selectedDept = deptSelect.value;
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ta';
    const savedGrievance = grievanceSelect.value;

    const placeholder = lang === 'en' ? '-- Select Grievance Type --' : '-- குறையின் வகையை தேர்வு செய்யுங்கள் --';
    grievanceSelect.innerHTML = `<option value="">${placeholder}</option>`;

    if (!selectedDept) {
        grievanceSelect.disabled = true;
        return;
    }

    const dept = govDepartments[selectedDept];
    if (dept && dept.grievances) {
        dept.grievances.forEach(grievance => {
            const option = document.createElement('option');
            option.value = grievance;
            // Grievance format: "Tamil / English" - show appropriate part based on lang
            if (lang === 'en' && grievance.includes(' / ')) {
                option.textContent = grievance.split(' / ')[1];
            } else if (lang === 'ta' && grievance.includes(' / ')) {
                option.textContent = grievance.split(' / ')[0];
            } else {
                option.textContent = grievance;
            }
            grievanceSelect.appendChild(option);
        });
        grievanceSelect.disabled = false;
    }
    if (savedGrievance) grievanceSelect.value = savedGrievance;
}

// Initialize department dropdown on page load
document.addEventListener('DOMContentLoaded', () => { populateDepartmentDropdown(); });

// ===== TAMBARAM 70 WARDS DATA =====
const wardAreaData = [
    { ward: 1, area: 'Anakaputhur' },
    { ward: 2, area: 'Anakaputhur' },
    { ward: 3, area: 'Anakaputhur' },
    { ward: 4, area: 'Anakaputhur' },
    { ward: 5, area: 'Anakaputhur & Pammal' },
    { ward: 6, area: 'Pammal' },
    { ward: 7, area: 'Pammal' },
    { ward: 8, area: 'Pammal' },
    { ward: 9, area: 'Issa Pallavaram' },
    { ward: 10, area: 'Pammal' },
    { ward: 11, area: 'Pammal' },
    { ward: 12, area: 'Pammal' },
    { ward: 13, area: 'Issa Pallavaram & Pallavaram' },
    { ward: 14, area: 'Pallavaram' },
    { ward: 15, area: 'Pallavaram' },
    { ward: 16, area: 'Pallavaram' },
    { ward: 17, area: 'Pallavaram' },
    { ward: 18, area: 'Keelkattalai' },
    { ward: 19, area: 'Keelkattalai' },
    { ward: 20, area: 'Keelkattalai' },
    { ward: 21, area: 'Nemilicheri & Pallavaram' },
    { ward: 22, area: 'Hasthinapuram, Nemilicheri & Pallavaram' },
    { ward: 23, area: 'Hasthinapuram, Nemilicheri & Pallavaram' },
    { ward: 24, area: 'Pallavaram' },
    { ward: 25, area: 'Hasthinapuram, Nemilicheri & Pallavaram' },
    { ward: 26, area: 'Pallavaram' },
    { ward: 27, area: 'Pallavaram' },
    { ward: 28, area: 'Pallavaram' },
    { ward: 29, area: 'Thiruneermalai' },
    { ward: 30, area: 'Thiruneermalai' },
    { ward: 31, area: 'Thiruneermalai' },
    { ward: 32, area: 'Kadapperi, Pulikoradu & Tambaram' },
    { ward: 33, area: 'Chitlapakkam & Kadapperi' },
    { ward: 34, area: 'Chitlapakkam' },
    { ward: 35, area: 'Hasthinapuram & Pallavaram' },
    { ward: 36, area: 'Hasthinapuram' },
    { ward: 37, area: 'Hasthinapuram' },
    { ward: 38, area: 'Hasthinapuram' },
    { ward: 39, area: 'Sembakkam' },
    { ward: 40, area: 'Gowrivakkam & Sembakkam' },
    { ward: 41, area: 'Gowrivakkam & Rajakilpakkam' },
    { ward: 42, area: 'Rajakilpakkam & Sembakkam' },
    { ward: 43, area: 'Chitlapakkam' },
    { ward: 44, area: 'Chitlapakkam' },
    { ward: 45, area: 'Selaiyur' },
    { ward: 46, area: 'Selaiyur' },
    { ward: 47, area: 'Selaiyur' },
    { ward: 48, area: 'Selaiyur & Tambaram' },
    { ward: 49, area: 'Tambaram' },
    { ward: 50, area: 'Kadapperi & Tambaram' },
    { ward: 51, area: 'Pulikoradu & Tambaram' },
    { ward: 52, area: 'Pulikoradu & Tambaram' },
    { ward: 53, area: 'Irumbuliyur & Tambaram' },
    { ward: 54, area: 'Tambaram' },
    { ward: 55, area: 'Perungalathur' },
    { ward: 56, area: 'Perungalathur' },
    { ward: 57, area: 'Perungalathur' },
    { ward: 58, area: 'Perungalathur' },
    { ward: 59, area: 'Peerkankaranai' },
    { ward: 60, area: 'Irumbuliyur & Tambaram' },
    { ward: 61, area: 'Peerkankaranai' },
    { ward: 62, area: 'Irumbuliyur' },
    { ward: 63, area: 'Irumbuliyur & Selaiyur' },
    { ward: 64, area: 'Selaiyur' },
    { ward: 65, area: 'Selaiyur' },
    { ward: 66, area: 'Rajakilpakkam' },
    { ward: 67, area: 'Madambakkam' },
    { ward: 68, area: 'Madambakkam & Selaiyur' },
    { ward: 69, area: 'Madambakkam' },
    { ward: 70, area: 'Madambakkam' }
];

// Legacy compatibility - zone names kept for backward compatibility with existing complaints
const zoneNames = { '1': 'Zone 1 - Pammal', '2': 'Zone 2 - Pallavaram', '3': 'Zone 3 - Sembakkam', '4': 'Zone 4 - Perungalathur', '5': 'Zone 5 - East Tambaram/Selaiyur', 'tambaram': 'Tambaram Constituency' };

// Legacy area name mapping (for backward compatibility with existing data)
const areaNames = {};
wardAreaData.forEach(w => { areaNames['ward-' + w.ward] = w.area; });

// ===== POPULATE WARD DROPDOWN ON LOAD =====
function populateWardDropdown() {
    const areaSelect = document.getElementById('area');
    if (!areaSelect) return;
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'ta';
    const placeholder = lang === 'en' ? '-- Select Ward --' : '-- வார்டு தேர்வு செய்யுங்கள் / Select Ward --';
    areaSelect.innerHTML = `<option value="">${placeholder}</option>`;
    wardAreaData.forEach(w => {
        const option = document.createElement('option');
        option.value = 'ward-' + w.ward;
        option.textContent = `Ward ${w.ward} - ${w.area}`;
        areaSelect.appendChild(option);
    });
}

// Initialize ward dropdown on page load (with fallback for already-loaded DOM)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { populateWardDropdown(); });
} else {
    populateWardDropdown();
}

// Legacy function - kept for backward compatibility (no-op now since zone is hidden)
function onZoneChange() {
    // Zone is now hidden with default value 'tambaram'
    // Ward dropdown is populated on page load
}

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
        const name = document.getElementById('citizenName'), mobile = document.getElementById('mobileNumber'), zone = document.getElementById('zone'), area = document.getElementById('area');
        if (!name || !name.value.trim()) { showNotification('உங்கள் பெயரை உள்ளிடுங்கள்!', 'error'); return; }
        if (!mobile || !mobile.value.trim() || mobile.value.trim().length < 10) { showNotification('சரியான தொலைபேசி எண்ணை உள்ளிடுங்கள்!', 'error'); return; }
        if (!zone || !zone.value) { showNotification('மண்டலத்தை (Zone) தேர்வு செய்யுங்கள்!', 'error'); return; }
        if (!area || !area.value) { showNotification('பகுதியை (Area) தேர்வு செய்யுங்கள்!', 'error'); return; }
    }
    if (currentStep === 2) {
        const dept = document.getElementById('govDepartment');
        const grievance = document.getElementById('grievanceType');
        if (!dept || !dept.value) { showNotification('அரசு துறையை தேர்வு செய்யுங்கள்!', 'error'); return; }
        if (!grievance || !grievance.value) { showNotification('குறையின் வகையை தேர்வு செய்யுங்கள்!', 'error'); return; }
        const title = document.getElementById('title');
        if (!title || !title.value.trim()) { showNotification('புகார் தலைப்பு எழுதுங்கள்!', 'error'); return; }
        const description = document.getElementById('description');
        if (!description || !description.value.trim()) { showNotification('விரிவான விளக்கம் எழுதுங்கள்!', 'error'); return; }
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
    const name = document.getElementById('citizenName'), mobile = document.getElementById('mobileNumber'), zone = document.getElementById('zone'), area = document.getElementById('area'), title = document.getElementById('title');
    const dept = document.getElementById('govDepartment'), grievance = document.getElementById('grievanceType');
    document.getElementById('reviewName').textContent = name ? name.value : '-';
    document.getElementById('reviewPhone').textContent = mobile ? '+91 ' + mobile.value : '-';
    const zoneTxt = zone && zone.value ? (zoneNames[zone.value] || zone.value) : 'Tambaram';
    const areaTxt = area && area.value ? area.options[area.selectedIndex].text : '';
    document.getElementById('reviewArea').textContent = areaTxt || '-';
    const deptTxt = dept && dept.value ? `${govDepartments[dept.value].name} (${dept.value})` : '-';
    const grievanceTxt = grievance && grievance.value ? grievance.value : '';
    document.getElementById('reviewCategory').textContent = deptTxt + (grievanceTxt ? ' → ' + grievanceTxt : '');
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
        const deptSelect = document.getElementById('govDepartment');
        const grievanceSelect = document.getElementById('grievanceType');
        const zoneSelect = document.getElementById('zone');
        const areaSelect = document.getElementById('area');
        if (!deptSelect || !deptSelect.value) { showNotification('அரசு துறையை தேர்வு செய்யுங்கள்!', 'error'); return; }
        if (!grievanceSelect || !grievanceSelect.value) { showNotification('குறையின் வகையை தேர்வு செய்யுங்கள்!', 'error'); return; }
        if (!areaSelect || !areaSelect.value) { showNotification('பகுதியை தேர்வு செய்யுங்கள்!', 'error'); return; }
        const title = document.getElementById('title').value;
        if (!title) { showNotification('புகார் தலைப்பு எழுதுங்கள்!', 'error'); return; }
        const description = document.getElementById('description').value;

        // Collect all new government fields
        const departmentCode = deptSelect.value;
        const departmentName = govDepartments[departmentCode] ? govDepartments[departmentCode].name : departmentCode;
        const departmentNameTA = govDepartments[departmentCode] ? govDepartments[departmentCode].nameTA : '';
        const grievanceValue = grievanceSelect.value;
        const zoneValue = zoneSelect ? zoneSelect.value : 'tambaram';
        const zoneName = zoneValue ? (zoneNames[zoneValue] || 'Tambaram Constituency') : 'Tambaram Constituency';
        const areaValue = areaSelect.value;
        const areaName = areaSelect.options[areaSelect.selectedIndex].text;
        // Get ward numbers if available
        const wardNumbersEl = document.getElementById('wardNumbers');
        const wardNumbers = wardNumbersEl ? wardNumbersEl.textContent : '';

        // Collect uploaded photos/videos as base64
        const attachments = [];
        const previewImages = document.querySelectorAll('#uploadPreview img');
        previewImages.forEach(img => { 
            if (img.src && img.src.startsWith('data:')) {
                // Limit each image to ~500KB for Firebase compatibility
                if (img.src.length < 700000) {
                    attachments.push(img.src);
                } else {
                    // Compress large images using canvas
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = 800;
                        canvas.height = 800 * (img.naturalHeight / img.naturalWidth);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        attachments.push(canvas.toDataURL('image/jpeg', 0.6));
                    } catch(e) {
                        attachments.push(img.src.substring(0, 700000)); // Fallback: truncate
                    }
                }
            }
        });
        console.log('📎 Attachments collected:', attachments.length, 'images');

        const citizenName = document.getElementById('citizenName') ? document.getElementById('citizenName').value.trim() : '';
        const mobileNumber = document.getElementById('mobileNumber') ? document.getElementById('mobileNumber').value.trim() : '';
        const manualAddress = document.getElementById('manualAddress') ? document.getElementById('manualAddress').value.trim() : '';
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
                title: title + (areaName ? ' - ' + areaName : ''),
                description: description || '',
                // Government standard fields
                department: departmentCode,
                departmentName: departmentName,
                departmentNameTA: departmentNameTA,
                grievanceType: grievanceValue,
                category: departmentName + ' (' + departmentCode + ')',
                // Location fields
                zone: zoneValue,
                zoneName: zoneName,
                area: areaValue,
                areaName: areaName,
                wardNumbers: wardNumbers,
                // Attachments (photos/videos)
                attachments: attachments,
                // Citizen details
                citizenName: citizenName,
                mobileNumber: mobileNumber,
                address: manualAddress || '',
                // Status & assignment
                assigned: '-', date: dateStr, status: 'புதியது', statusClass: 'badge-new', createdAt: now.toISOString(),
                timeline: [
                    { text: 'புகார் பதிவு செய்யப்பட்டது', time: `${dateStr} - ${timeStr}`, state: 'completed' },
                    { text: 'ஆய்வு செய்யப்படுகிறது', time: 'நிலுவையில்...', state: 'active' },
                    { text: `${departmentName}-க்கு ஒதுக்கப்படும்`, time: 'நிலுவையில்...', state: '' },
                    { text: 'பணி தொடங்கப்படும்', time: 'நிலுவையில்...', state: '' },
                    { text: 'தீர்வு & உறுதிப்படுத்தல்', time: 'நிலுவையில்...', state: '' }
                ]
            };

            const generatedIdEl = document.getElementById('generatedComplaintId');
            if (generatedIdEl) generatedIdEl.textContent = govStyleId;
            // Save to Firebase Firestore - NEVER include base64 attachments (too large for Firestore 1MB limit)
            if (firebaseReady && window.VoiceToMLA_DB) {
                const complaintForFirebase = { ...complaintsDB[lastComplaintId] };
                // ALWAYS remove base64 attachments - they will exceed Firestore 1MB doc limit
                delete complaintForFirebase.attachments;
                complaintForFirebase.hasAttachments = attachments.length > 0;
                complaintForFirebase.attachmentCount = attachments.length;
                complaintForFirebase.attachmentURLs = [];
                
                // Save complaint (without attachments) to Firestore
                const saved = await VoiceToMLA_DB.saveComplaint(complaintForFirebase);
                if (saved) {
                    console.log('✅ Complaint saved to Firebase successfully:', lastComplaintId);
                } else {
                    console.error('❌ FAILED to save complaint to Firebase:', lastComplaintId);
                }
                
                // Upload files to Firebase Storage in background (for cross-device photo access)
                if (uploadedFiles.length > 0) {
                    VoiceToMLA_DB.uploadAllAttachments(lastComplaintId, uploadedFiles).then(urls => {
                        if (urls.length > 0) {
                            VoiceToMLA_DB.updateComplaint(lastComplaintId, { attachmentURLs: urls });
                            console.log('📸 All attachments uploaded to Storage:', urls.length);
                        }
                    }).catch(e => console.log('Storage upload error:', e));
                }
            }
            // Also store base64 in localStorage as fallback
            if (attachments.length > 0) {
                try { localStorage.setItem('vtm_attachments_' + lastComplaintId, JSON.stringify(attachments)); } catch(e) { console.log('Attachment localStorage save error:', e); }
            }
            // Always save to localStorage as backup (for offline/cross-page sharing)
            localStorage.setItem('vtm_all_complaints', JSON.stringify(complaintsDB));
            localStorage.setItem('vtm_complaint_counter', String(complaintCounter));
            // Update logged-in user's name if they are "User" (generic) and typed their name
            if (loggedInUser && loggedInUser.name === 'User' && citizenName) {
                loggedInUser.name = citizenName;
                localStorage.setItem('vtm_loggedInUser', JSON.stringify(loggedInUser));
                updateLoginUI();
            }
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> புகார் சமர்ப்பி';
            submitBtn.disabled = false;
            document.getElementById('successModal').classList.add('active');
            complaintForm.reset();
            // Re-set hidden zone value and repopulate ward dropdown after reset
            document.getElementById('zone').value = 'tambaram';
            populateWardDropdown();
            document.querySelectorAll('.cat-card-new').forEach(c => c.classList.remove('selected'));
            currentStep = 1; updateWizardUI();
            updateDashboardStats();
        }, 2000);
    });
}

function trackNewComplaint() { document.getElementById('successModal').classList.remove('active'); navigateTo('track'); const ti = document.getElementById('trackInput'); if (ti) { ti.value = lastComplaintId; searchComplaint(); } }
function closeSuccessModalEnhanced() { document.getElementById('successModal').classList.remove('active'); navigateTo('track'); setTimeout(searchComplaint, 500); }

// ===== TRACK SEARCH =====
async function searchComplaint() {
    const input = document.getElementById('trackInput');
    const result = document.getElementById('trackResult');
    if (!input.value) { showNotification('Complaint ID enter செய்யுங்கள்!', 'error'); return; }
    result.style.opacity = '0.5';
    // Always fetch fresh data from Firebase AND localStorage before searching
    try {
        if (window.VoiceToMLA_DB) {
            const fc = await VoiceToMLA_DB.getAllComplaints();
            if (fc && Object.keys(fc).length > 0) Object.keys(fc).forEach(k => { complaintsDB[k] = fc[k]; });
        }
    } catch(e) { console.log('Fresh fetch error:', e); }
    // Also load from localStorage (admin updates are saved here)
    try {
        const localData = localStorage.getItem('vtm_all_complaints');
        if (localData) {
            const parsed = JSON.parse(localData);
            Object.keys(parsed).forEach(k => { complaintsDB[k] = parsed[k]; });
        }
    } catch(e) {}
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
        // First try to just get complaints (skip initializeDefaultComplaints if it fails)
        let fc = {};
        try {
            await VoiceToMLA_DB.initializeDefaultComplaints();
        } catch(initErr) {
            console.log('Init default skipped:', initErr.message);
        }
        fc = await VoiceToMLA_DB.getAllComplaints();
        if (fc && Object.keys(fc).length > 0) {
            Object.keys(fc).forEach(k => { complaintsDB[k] = fc[k]; });
        }
        try {
            const counterDoc = await db.collection('vtm_config').doc('counter').get();
            if (counterDoc.exists) complaintCounter = counterDoc.data().lastComplaintNumber + 1;
        } catch(ce) { console.log('Counter read error:', ce.message); }
        // Also merge localStorage data (test complaints that may not have saved to Firebase)
        try {
            const localData = localStorage.getItem('vtm_all_complaints');
            if (localData) {
                const parsed = JSON.parse(localData);
                Object.keys(parsed).forEach(k => { if (!complaintsDB[k]) complaintsDB[k] = parsed[k]; });
            }
        } catch(e) {}
        firebaseReady = true;
        updateDashboardStats();
        updateTrustIndex();
        refreshLoggedInUserName();
        console.log('🔥 Firebase loaded:', Object.keys(complaintsDB).length, 'complaints');
        showNotification('🔥 Database connected! ' + Object.keys(complaintsDB).length + ' complaints loaded.', 'success');
    } catch (error) {
        console.error('Firebase connection error:', error.message || error);
        // Still mark as ready if db object exists (might work for writes even if reads failed)
        if (typeof db !== 'undefined') {
            firebaseReady = true;
            console.log('⚠️ Firebase partially available - writes may still work');
            showNotification('⚠️ Database connection issue - using local data. Writes may still work.', 'info');
        } else {
            showNotification('⚠️ Offline mode - using local data', 'info');
        }
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
    
    // Build attachments section
    let attachmentsHTML = '';
    if (complaint.attachments && complaint.attachments.length > 0) {
        attachmentsHTML = `<div style="margin-top:15px;padding-top:12px;border-top:1px solid var(--light-gray);">
            <p style="font-size:0.8rem;font-weight:700;margin-bottom:10px;"><i class="fas fa-paperclip" style="color:var(--primary);margin-right:5px;"></i> Attachments (${complaint.attachments.length})</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                ${complaint.attachments.map((src, idx) => `<div style="width:100px;height:100px;border-radius:8px;overflow:hidden;border:2px solid var(--light-gray);cursor:pointer;" onclick="window.open('${src}','_blank')">
                    <img src="${src}" style="width:100%;height:100%;object-fit:cover;" alt="Attachment ${idx+1}">
                </div>`).join('')}
            </div>
        </div>`;
    } else {
        attachmentsHTML = `<div style="margin-top:15px;padding-top:12px;border-top:1px solid var(--light-gray);">
            <p style="font-size:0.8rem;color:var(--gray);"><i class="fas fa-paperclip" style="margin-right:5px;"></i> No attachments</p>
        </div>`;
    }

    const modal = document.createElement('div'); modal.className = 'modal active'; modal.id = 'detailModal';
    modal.innerHTML = `<div class="modal-overlay" onclick="document.getElementById('detailModal').remove()"></div><div class="modal-content" style="max-width:600px;max-height:85vh;overflow-y:auto;"><button class="modal-close" onclick="document.getElementById('detailModal').remove()">&times;</button><div style="padding:5px;"><div style="text-align:center;margin-bottom:20px;"><h3>📋 புகார் விவரம்</h3><code style="background:var(--primary-light);color:var(--primary);padding:4px 12px;border-radius:6px;font-weight:700;">${displayId}</code></div><div style="background:var(--light);padding:12px;border-radius:8px;margin-bottom:12px;"><p><strong>${complaint.title}</strong></p><p style="font-size:0.8rem;color:var(--gray);">${complaint.area} | ${complaint.category} | ${complaint.date}</p><p style="font-size:0.8rem;margin-top:5px;">👤 Citizen: <strong>${complaint.citizenName || '-'}</strong> | 📱 ${complaint.mobileNumber || '-'}</p><p style="font-size:0.8rem;margin-top:3px;">🏠 Address: ${complaint.address || '-'}</p><p style="font-size:0.8rem;margin-top:3px;">📝 Description: ${complaint.description || '-'}</p><p style="font-size:0.8rem;margin-top:5px;">Assigned: <strong>${complaint.assigned}</strong></p></div>${attachmentsHTML}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:15px;">${complaint.statusClass === 'badge-assigned' ? `<button class="btn" style="background:#f59e0b;color:white;font-size:0.75rem;padding:6px 12px;border-radius:6px;" onclick="updateComplaintStatus('${complaintId}','progress')"><i class="fas fa-wrench"></i> Start Work</button>` : ''}${complaint.statusClass === 'badge-progress' || complaint.statusClass === 'badge-assigned' ? `<button class="btn" style="background:#10b981;color:white;font-size:0.75rem;padding:6px 12px;border-radius:6px;" onclick="updateComplaintStatus('${complaintId}','resolved')"><i class="fas fa-check-circle"></i> Mark Resolved</button>` : ''}${complaint.statusClass === 'badge-resolved' ? '<span style="color:#10b981;font-weight:600;">✅ தீர்வு!</span>' : ''}<button class="btn" style="background:var(--warning);color:white;font-size:0.75rem;padding:6px 12px;border-radius:6px;" onclick="escalateComplaint('${complaintId}')"><i class="fas fa-exclamation-triangle"></i> Escalate</button><button class="btn btn-primary" style="font-size:0.75rem;padding:6px 12px;" onclick="document.getElementById('detailModal').remove();openAssignModal('${complaintId}')"><i class="fas fa-user-plus"></i> Assign</button></div></div></div>`;
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
async function loadCitizenComplaints() {
    const input = document.getElementById('citizenSearchInput'), statsSection = document.getElementById('citizenStats'), listSection = document.getElementById('citizenComplaintsList');
    if (!input || !input.value.trim()) { showNotification('Mobile Number உள்ளிடுங்கள்!', 'error'); return; }
    // Fetch fresh from Firebase AND localStorage before searching
    try {
        if (window.VoiceToMLA_DB) {
            const fc = await VoiceToMLA_DB.getAllComplaints();
            if (fc && Object.keys(fc).length > 0) Object.keys(fc).forEach(k => { complaintsDB[k] = fc[k]; });
        }
    } catch(e) { console.log('Citizen search: Firebase fetch error', e); }
    // Also read from localStorage (admin may have updated status/assignment)
    try {
        const localData = localStorage.getItem('vtm_all_complaints');
        if (localData) {
            const parsed = JSON.parse(localData);
            Object.keys(parsed).forEach(k => { complaintsDB[k] = parsed[k]; });
        }
    } catch(e) {}
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
let uploadedFiles = []; // Store actual File objects for Firebase Storage upload
const uploadArea = document.getElementById('uploadArea'), fileInput = document.getElementById('fileInput'), uploadPreview = document.getElementById('uploadPreview');
if (uploadArea) {
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        Array.from(e.target.files).forEach(file => {
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                uploadedFiles.push(file); // Keep reference to actual File object
                const reader = new FileReader();
                reader.onload = (ev) => { 
                    const p = document.createElement('div'); 
                    p.style.cssText = 'width:80px;height:80px;border-radius:8px;overflow:hidden;position:relative;'; 
                    p.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;"><button onclick="this.parentElement.remove();window.removeUploadedFile('${file.name}')" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:red;color:white;border:none;cursor:pointer;">&times;</button>`; 
                    uploadPreview.appendChild(p); 
                };
                reader.readAsDataURL(file);
            }
        });
    });
}
// Remove file from uploadedFiles array when X is clicked
window.removeUploadedFile = function(fileName) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
};

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
