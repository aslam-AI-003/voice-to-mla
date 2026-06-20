// ===== LANGUAGE TOGGLE SYSTEM =====
// Tamil (ta) is default, English (en) is toggle option

const TRANSLATIONS = {
    // Navbar
    'nav_home': { ta: 'முகப்பு', en: 'Home' },
    'nav_complaint': { ta: 'புகார் செய்', en: 'File Complaint' },
    'nav_mycomplaints': { ta: 'என் புகார்கள்', en: 'My Complaints' },
    'nav_updates': { ta: 'Updates', en: 'Updates' },
    'nav_dashboard': { ta: 'Minister Dashboard', en: 'Minister Dashboard' },

    // Hero Section
    'hero_title': { ta: 'உங்கள் குரல்,<br>நேரடியாக அமைச்சருக்கு', en: 'Your Voice,<br>Directly to the Minister' },
    'hero_desc': { ta: 'தாம்பரம் தொகுதியின் பிரச்சனைகளை நேரடியாக தெரிவியுங்கள். புகார் செய்யுங்கள், நிலையை track செய்யுங்கள்.', en: 'Report issues in Tambaram constituency directly. File complaints and track their status.' },
    'hero_btn_complaint': { ta: '<i class="fas fa-plus-circle"></i> புகார் செய்', en: '<i class="fas fa-plus-circle"></i> File Complaint' },
    'hero_btn_track': { ta: '<i class="fas fa-search"></i> நிலை காண', en: '<i class="fas fa-search"></i> Track Status' },

    // Stats
    'stat_total': { ta: 'மொத்த புகார்கள்', en: 'Total Complaints' },
    'stat_resolved': { ta: 'தீர்வு செய்யப்பட்டவை', en: 'Resolved' },
    'stat_pending': { ta: 'நிலுவையில்', en: 'Pending' },
    'stat_avg_time': { ta: 'சராசரி நேரம்', en: 'Avg Time' },

    // Thirukkural Section
    'thirukkural_title': { ta: 'இன்றைய திருக்குறள்', en: "Today's Thirukkural" },

    // CM Section
    'under_leadership': { ta: 'UNDER THE LEADERSHIP OF', en: 'UNDER THE LEADERSHIP OF' },
    'cm_title': { ta: 'முதலமைச்சர் | Chief Minister', en: 'Chief Minister' },
    'cm_govt': { ta: 'Government of Tamil Nadu', en: 'Government of Tamil Nadu' },
    'cm_party': { ta: 'தமிழக வெற்றி கழகம் (TVK)', en: 'Tamilaga Vettri Kazhagam (TVK)' },

    // MLA Section
    'mla_title_role': { ta: 'Cabinet Minister - Human Resources Management', en: 'Cabinet Minister - Human Resources Management' },
    'mla_govt_title': { ta: 'Government of Tamil Nadu | MLA - தாம்பரம் தொகுதி', en: 'Government of Tamil Nadu | MLA - Tambaram Constituency' },
    'mla_party_line': { ta: 'தமிழக வெற்றி கழகம் (TVK) | CM: C. Joseph Vijay', en: 'Tamilaga Vettri Kazhagam (TVK) | CM: C. Joseph Vijay' },
    'mla_quote': { ta: '"மக்கள் சேவையே மகேசன் சேவை. அமைச்சராக இருந்தாலும் உங்கள் தொகுதி பிரச்சனைகள் எனது முன்னுரிமை."', en: '"Service to people is service to God. Even as a Minister, your constituency issues are my priority."' },

    // Complaint Form
    'form_title': { ta: 'புகார் பதிவு செய்யுங்கள்', en: 'Register Your Complaint' },
    'form_subtitle': { ta: 'உங்கள் பகுதி பிரச்சனையை 3 எளிய படிகளில் பதிவு செய்யுங்கள்', en: 'Register your area issue in 3 simple steps' },
    'step1_title': { ta: 'உங்கள் தகவல்கள்', en: 'Your Information' },
    'step1_subtitle': { ta: 'புகார் செய்பவரின் விவரங்கள்', en: 'Complainant details' },
    'step2_title': { ta: 'புகார் விவரங்கள்', en: 'Complaint Details' },
    'step2_subtitle': { ta: 'பிரச்சனை என்ன என்பதை தெரிவிக்கவும்', en: 'Describe the issue' },
    'step3_title': { ta: 'சரிபார்த்து சமர்ப்பிக்கவும்', en: 'Review & Submit' },
    'step3_subtitle': { ta: 'தகவல்களை உறுதி செய்யுங்கள்', en: 'Confirm your information' },

    // Form Labels
    'label_name': { ta: 'பெயர் (Name) <span class="required">*</span>', en: 'Name <span class="required">*</span>' },
    'label_mobile': { ta: 'தொலைபேசி எண் (Mobile) <span class="required">*</span>', en: 'Mobile Number <span class="required">*</span>' },
    'label_zone': { ta: 'மண்டலம் (Zone) <span class="required">*</span>', en: 'Zone <span class="required">*</span>' },
    'label_area': { ta: 'பகுதி (Area) <span class="required">*</span>', en: 'Area <span class="required">*</span>' },
    'label_address': { ta: 'முகவரி (விருப்பம்)', en: 'Address (Optional)' },
    'label_category': { ta: 'புகார் வகை', en: 'Complaint Category' },
    'label_title': { ta: 'புகார் தலைப்பு <span class="required">*</span>', en: 'Complaint Title <span class="required">*</span>' },
    'label_description': { ta: 'விரிவான விளக்கம்', en: 'Detailed Description' },
    'label_photo': { ta: 'புகைப்படம் / வீடியோ இணைக்க', en: 'Attach Photo / Video' },
    'label_location': { ta: 'இடம்', en: 'Location' },
    'label_dept': { ta: 'Government Department / குறை தொடர்புடைய அரசு துறை <span class="required">*</span>', en: 'Government Department <span class="required">*</span>' },
    'label_grievance': { ta: 'Grievance Type / குறையின் வகை <span class="required">*</span>', en: 'Grievance Type <span class="required">*</span>' },
    // Placeholders
    'ph_name': { ta: 'உங்கள் முழு பெயர்', en: 'Your full name' },
    'ph_title': { ta: 'உதா: சாலையில் பள்ளம், Street light வேலை செய்யல', en: 'E.g.: Pothole on road, Street light not working' },
    'ph_description': { ta: 'பிரச்சனையை விரிவாக எழுதுங்கள்...', en: 'Describe the issue in detail...' },
    'ph_address': { ta: 'சாலை பெயர், அடையாளம் (Landmark)', en: 'Street name, Landmark' },

    // Categories
    'cat_road': { ta: 'சாலைகள்', en: 'Roads' },
    'cat_water': { ta: 'குடிநீர்', en: 'Water' },
    'cat_drainage': { ta: 'வடிகால்', en: 'Drainage' },
    'cat_electricity': { ta: 'மின்சாரம்', en: 'Electricity' },
    'cat_garbage': { ta: 'குப்பை', en: 'Garbage' },
    'cat_streetlight': { ta: 'தெரு விளக்கு', en: 'Street Light' },
    'cat_park': { ta: 'பூங்கா', en: 'Park' },
    'cat_other': { ta: 'பிற', en: 'Others' },

    // Buttons
    'btn_next': { ta: 'அடுத்து', en: 'Next' },
    'btn_back': { ta: 'பின்', en: 'Back' },
    'btn_submit': { ta: 'புகார் சமர்ப்பி', en: 'Submit Complaint' },
    'btn_track': { ta: 'நிலை காண', en: 'Track Status' },
    'btn_home': { ta: 'முகப்பு', en: 'Home' },
    'btn_refresh': { ta: 'Refresh', en: 'Refresh' },
    'btn_get_location': { ta: 'இடம் கண்டறிய', en: 'Get Location' },

    // Track Page
    'track_title': { ta: 'புகார் நிலை காண', en: 'Track Complaint Status' },
    'track_subtitle': { ta: 'உங்கள் புகார் எந்த நிலையில் உள்ளது என பாருங்கள்', en: 'Check the current status of your complaint' },
    'track_placeholder': { ta: 'Complaint ID or Mobile Number', en: 'Complaint ID or Mobile Number' },
    'track_btn': { ta: 'தேடு', en: 'Search' },

    // My Complaints
    'mycomp_title': { ta: 'என் புகார்கள்', en: 'My Complaints' },
    'mycomp_subtitle': { ta: 'உங்கள் அனைத்து புகார்களின் நிலையை இங்கே பாருங்கள்', en: 'View status of all your complaints here' },
    'mycomp_enter_mobile': { ta: 'Mobile Number enter செய்தால் உங்கள் அனைத்து புகார்களும் தெரியும்', en: 'Enter your Mobile Number to see all your complaints' },

    // Success Modal
    'success_title': { ta: 'புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!', en: 'Complaint Registered Successfully!' },
    'success_status': { ta: 'நிலை: நிலுவையில் (Pending)', en: 'Status: Pending' },
    'success_info': { ta: 'உங்கள் புகார் அமைச்சர் அலுவலகத்திற்கு அனுப்பப்பட்டது. விரைவில் அதிகாரிக்கு ஒதுக்கப்படும்.', en: 'Your complaint has been sent to the Minister\'s office. It will be assigned to an official soon.' },

    // Updates Page
    'updates_title': { ta: 'தொகுதி Updates', en: 'Constituency Updates' },
    'updates_subtitle': { ta: 'அமைச்சர் அலுவலக அறிவிப்புகள் & முன்னேற்றங்கள்', en: 'Minister office announcements & progress' },

    // Dashboard
    'dash_title': { ta: 'Minister Dashboard - தாம்பரம்', en: 'Minister Dashboard - Tambaram' },
    'dash_subtitle': { ta: 'புகார்கள் நிர்வாக பேனல்', en: 'Complaints Management Panel' },
    'dash_total': { ta: 'மொத்த புகார்கள்', en: 'Total Complaints' },
    'dash_resolved': { ta: 'தீர்வு', en: 'Resolved' },
    'dash_pending': { ta: 'நிலுவையில்', en: 'Pending' },
    'dash_progress': { ta: 'நடப்பில்', en: 'In Progress' },

    // Footer
    'footer_brand': { ta: 'Voice to Minister', en: 'Voice to Minister' },
    'footer_desc': { ta: 'மக்கள் குரல் - தாம்பரம் தொகுதி', en: 'People\'s Voice - Tambaram Constituency' },
    'footer_links': { ta: 'Links', en: 'Links' },
    'footer_contact': { ta: 'தொடர்பு', en: 'Contact' },
    'footer_qr': { ta: 'QR Scan செய்யுங்கள்', en: 'Scan QR Code' },

    // Review Summary
    'review_title': { ta: 'உங்கள் புகார் சுருக்கம்', en: 'Your Complaint Summary' },
    'review_name': { ta: 'பெயர்:', en: 'Name:' },
    'review_mobile': { ta: 'தொலைபேசி:', en: 'Phone:' },
    'review_area': { ta: 'பகுதி:', en: 'Area:' },
    'review_category': { ta: 'வகை:', en: 'Category:' },
    'review_complaint': { ta: 'புகார்:', en: 'Complaint:' },

    // Misc
    'voice_btn_tooltip': { ta: 'குரல் பதிவு', en: 'Voice Record' },
    'upload_text': { ta: 'புகைப்படம் பதிவேற்ற Click செய்யவும்', en: 'Click to upload photo' },
    'upload_formats': { ta: 'JPG, PNG (அதிகபட்சம் 5MB)', en: 'JPG, PNG (Max 5MB)' },

    // Admin specific
    'admin_dashboard': { ta: 'Dashboard', en: 'Dashboard' },
    'admin_complaints': { ta: 'Complaints', en: 'Complaints' },
    'admin_volunteers': { ta: 'Volunteers', en: 'Volunteers' },
    'admin_analytics': { ta: 'Analytics', en: 'Analytics' },
    'admin_post_updates': { ta: 'Post Updates', en: 'Post Updates' },
    'admin_notifications': { ta: 'Notifications', en: 'Notifications' },
    'admin_public_site': { ta: 'Public Site', en: 'Public Site' },
    'admin_logout': { ta: 'Logout', en: 'Logout' },
    'admin_total': { ta: 'Total Complaints', en: 'Total Complaints' },
    'admin_pending': { ta: 'Pending', en: 'Pending' },
    'admin_resolved': { ta: 'Resolved', en: 'Resolved' },
    'admin_today': { ta: "Today's Complaints", en: "Today's Complaints" },
    'admin_volunteers_active': { ta: 'Active Volunteers', en: 'Active Volunteers' },
    'admin_escalated': { ta: 'Escalated', en: 'Escalated' },
    'admin_resolution_rate': { ta: 'Resolution Rate', en: 'Resolution Rate' },
    'admin_area_wise': { ta: 'Area-wise Complaints', en: 'Area-wise Complaints' },
    'admin_category_wise': { ta: 'Category-wise Complaints', en: 'Category-wise Complaints' },
    'admin_latest': { ta: 'Latest Complaints (Live)', en: 'Latest Complaints (Live)' },
    'admin_all_complaints': { ta: 'All Complaints', en: 'All Complaints' },
    'admin_filter_all_status': { ta: 'All Status', en: 'All Status' },
    'admin_filter_all_areas': { ta: 'All Areas', en: 'All Areas' },
    'admin_assign': { ta: 'Assign', en: 'Assign' },
    'admin_view': { ta: 'View', en: 'View' },
};

// Current language state
let currentLang = localStorage.getItem('vtm_lang') || 'ta';

// Get translation
function t(key) {
    if (TRANSLATIONS[key]) {
        return TRANSLATIONS[key][currentLang] || TRANSLATIONS[key]['ta'];
    }
    return key;
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'ta' ? 'en' : 'ta';
    localStorage.setItem('vtm_lang', currentLang);
    applyLanguage();
    updateToggleButton();
}

// Update toggle button text
function updateToggleButton() {
    const toggleBtns = document.querySelectorAll('.lang-toggle-btn');
    toggleBtns.forEach(btn => {
        if (currentLang === 'ta') {
            btn.innerHTML = '<span style="font-size:0.7rem;">EN</span>';
            btn.title = 'Switch to English';
        } else {
            btn.innerHTML = '<span style="font-size:0.7rem;">த</span>';
            btn.title = 'தமிழுக்கு மாற்ற';
        }
    });
}

// Text replacement map for bulk translation (Tamil -> English)
const TEXT_REPLACEMENTS = {
    // Form labels and text
    'பெயர் (Name)': 'Name',
    'தொலைபேசி எண் (Mobile)': 'Mobile Number',
    'மண்டலம் (Zone)': 'Zone',
    'பகுதி (Area)': 'Area',
    'முகவரி (விருப்பம்)': 'Address (Optional)',
    'புகார் தலைப்பு': 'Complaint Title',
    'விரிவான விளக்கம்': 'Detailed Description',
    'புகைப்படம் / வீடியோ இணைக்க': 'Attach Photo / Video',
    'Government Department / குறை தொடர்புடைய அரசு துறை': 'Government Department',
    'Grievance Type / குறையின் வகை': 'Grievance Type',
    'வார்டு எண் (Ward Number)': 'Ward Number',
    // Wizard steps
    '👤 உங்கள் தகவல்கள்': '👤 Your Information',
    'புகார் செய்பவரின் விவரங்கள்': 'Complainant details',
    '📋 புகார் விவரங்கள்': '📋 Complaint Details',
    'பிரச்சனை என்ன என்பதை தெரிவிக்கவும்': 'Describe the issue',
    '📍 இடம் & சமர்ப்பிப்பு': '📍 Location & Submit',
    'சரியான இடத்தை குறிப்பிடவும்': 'Specify the correct location',
    // Buttons
    'அடுத்து': 'Next',
    'முந்தைய': 'Previous',
    'புகார் சமர்ப்பி': 'Submit Complaint',
    'தேடு': 'Search',
    // Track page
    'புகார் நிலை காண': 'Track Complaint Status',
    'உங்கள் புகார் எந்த நிலையில் உள்ளது என பாருங்கள்': 'Check the current status of your complaint',
    // My Complaints
    'என் புகார்கள்': 'My Complaints',
    'உங்கள் அனைத்து புகார்களின் நிலையை இங்கே பாருங்கள்': 'View status of all your complaints here',
    'Mobile Number enter செய்தால் உங்கள் அனைத்து புகார்களும் தெரியும்': 'Enter your Mobile Number to see all your complaints',
    // Success modal
    'புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!': 'Complaint Registered Successfully!',
    'நிலை: நிலுவையில் (Pending)': 'Status: Pending',
    'உங்கள் புகார் அமைச்சர் அலுவலகத்திற்கு அனுப்பப்பட்டது. விரைவில் அதிகாரிக்கு ஒதுக்கப்படும்.': 'Your complaint has been sent to the Minister\'s office. It will be assigned to an official soon.',
    'நிலை காண': 'Track Status',
    // Review summary
    'உங்கள் புகார் சுருக்கம்': 'Your Complaint Summary',
    'பெயர்:': 'Name:',
    'தொலைபேசி:': 'Phone:',
    'பகுதி:': 'Area:',
    'வகை:': 'Category:',
    'தலைப்பு:': 'Title:',
    // Stats
    'மொத்த புகார்கள்': 'Total Complaints',
    'நிலுவையில்': 'Pending',
    'தீர்வு': 'Resolved',
    'மொத்தம்': 'Total',
    'இன்று புதிய': 'New Today',
    'மொத்த தீர்வு': 'Total Resolved',
    'இன்று தீர்வு': 'Resolved Today',
    'நிலுவை': 'Pending',
    // Footer
    'மக்கள் குரல் - தாம்பரம் தொகுதி': 'People\'s Voice - Tambaram Constituency',
    'தொடர்பு': 'Contact',
    'QR Scan செய்யுங்கள்': 'Scan QR Code',
    // Timeline
    'புகார் பதிவு செய்யப்பட்டது': 'Complaint Registered',
    'ஆய்வு செய்யப்படுகிறது': 'Under Review',
    'பணி தொடங்கப்பட்டது': 'Work Started',
    'தீர்வு & உறுதிப்படுத்தல்': 'Resolution & Confirmation',
    'நிலுவையில்...': 'Pending...',
    // Progress steps
    'யார்?': 'Who?',
    'என்ன?': 'What?',
    'எங்கே?': 'Where?',
    // Dashboard
    'Area-wise புகார்கள்': 'Area-wise Complaints',
    'Category-wise பிரிவு': 'Category-wise Breakdown',
    'Weekly Resolution Graph - வாரவாரி தீர்வு': 'Weekly Resolution Graph',
    'Minister Updates & அறிவிப்புகள்': 'Minister Updates & Announcements',
    // Placeholders
    'உங்கள் முழு பெயர்': 'Your full name',
    'உதா: சாலையில் பள்ளம், Street light வேலை செய்யல': 'E.g.: Pothole on road, Street light not working',
    'பிரச்சனையை விரிவாக எழுதுங்கள்...': 'Describe the issue in detail...',
    'சாலை பெயர், அடையாளம் (Landmark)': 'Street name, Landmark',
    '-- மண்டலத்தை தேர்வு செய்யுங்கள் --': '-- Select Zone --',
    '-- முதலில் மண்டலத்தை தேர்வு செய்யுங்கள் --': '-- Select Zone first --',
    '-- அரசு துறையை தேர்வு செய்யுங்கள் --': '-- Select Government Department --',
    '-- முதலில் அரசு துறையை தேர்வு செய்யுங்கள் --': '-- Select Department first --',
    'உங்கள் Mobile Number அல்லது Complaint ID': 'Your Mobile Number or Complaint ID',
};

// Store original text for reverting back to Tamil
const originalTexts = new WeakMap();

// Apply language to all elements with data-lang attribute
function applyLanguage() {
    // 1. Apply data-lang tagged elements
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (TRANSLATIONS[key]) {
            const text = TRANSLATIONS[key][currentLang];
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });

    // 2. Apply bulk text replacements for non-tagged elements
    if (currentLang === 'en') {
        applyBulkTranslation();
    } else {
        revertBulkTranslation();
    }

    // Update html lang attribute
    document.documentElement.lang = currentLang === 'ta' ? 'ta' : 'en';
}

function applyBulkTranslation() {
    // Translate labels, headings, paragraphs, buttons, spans
    const selectors = 'label, h1, h2, h3, h4, p, button, span, a, option';
    document.querySelectorAll(selectors).forEach(el => {
        // Skip elements already handled by data-lang
        if (el.hasAttribute('data-lang')) return;
        // Skip script/style elements
        if (el.closest('script') || el.closest('style')) return;

        const text = el.textContent.trim();
        // Check placeholders for inputs
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            const ph = el.placeholder;
            if (ph && TEXT_REPLACEMENTS[ph]) {
                if (!originalTexts.has(el)) originalTexts.set(el, { placeholder: ph });
                el.placeholder = TEXT_REPLACEMENTS[ph];
            }
            return;
        }

        // For options in select
        if (el.tagName === 'OPTION') {
            const optText = el.textContent.trim();
            if (TEXT_REPLACEMENTS[optText]) {
                if (!originalTexts.has(el)) originalTexts.set(el, { text: el.textContent });
                el.textContent = TEXT_REPLACEMENTS[optText];
            }
            return;
        }

        // For text elements - only replace if it's a direct match (no nested elements with complex structure)
        if (el.children.length === 0 || (el.children.length === 1 && el.children[0].tagName === 'I')) {
            for (const [tamilText, englishText] of Object.entries(TEXT_REPLACEMENTS)) {
                if (text === tamilText || text === '✅ ' + tamilText || text === '⏳ ' + tamilText) {
                    if (!originalTexts.has(el)) originalTexts.set(el, { html: el.innerHTML });
                    // Preserve icons
                    const iconMatch = el.innerHTML.match(/^(<i[^>]*><\/i>)\s*/);
                    if (iconMatch) {
                        el.innerHTML = iconMatch[1] + ' ' + englishText;
                    } else {
                        el.innerHTML = el.innerHTML.replace(tamilText, englishText);
                    }
                    break;
                }
            }
        }
    });

    // Also translate input/textarea placeholders
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
        if (el.hasAttribute('data-lang')) return;
        const ph = el.placeholder;
        if (TEXT_REPLACEMENTS[ph]) {
            if (!originalTexts.has(el)) originalTexts.set(el, { placeholder: ph });
            el.placeholder = TEXT_REPLACEMENTS[ph];
        }
    });
}

function revertBulkTranslation() {
    // Revert all stored originals
    const selectors = 'label, h1, h2, h3, h4, p, button, span, a, option, input, textarea';
    document.querySelectorAll(selectors).forEach(el => {
        if (el.hasAttribute('data-lang')) return;
        const orig = originalTexts.get(el);
        if (orig) {
            if (orig.html !== undefined) el.innerHTML = orig.html;
            if (orig.text !== undefined) el.textContent = orig.text;
            if (orig.placeholder !== undefined) el.placeholder = orig.placeholder;
            originalTexts.delete(el);
        }
    });
}

// Initialize language on page load
function initLanguage() {
    updateToggleButton();
    applyLanguage();
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
} else {
    initLanguage();
}
