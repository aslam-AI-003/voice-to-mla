// ===== PAGE NAVIGATION =====
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu
    document.getElementById('navLinks').classList.remove('active');
}

// Nav link click handlers
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        navigateTo(page);
    });
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ===== LOGIN MODAL =====
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');

loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
});

function closeModal() {
    loginModal.classList.remove('active');
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    });
});

// ===== OTP FUNCTIONALITY =====
function sendOTP() {
    const otpSection = document.getElementById('otpSection');
    otpSection.style.display = 'block';
    
    // Focus first OTP input
    setTimeout(() => {
        const firstInput = otpSection.querySelector('.otp-input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function verifyOTP() {
    // Simulate login success
    closeModal();
    loginBtn.innerHTML = '<i class="fas fa-user-circle"></i><span>User</span>';
    loginBtn.style.background = 'var(--primary)';
    loginBtn.style.color = 'white';
    loginBtn.style.border = 'none';
    
    // Show notification
    showNotification('வெற்றிகரமாக Login செய்யப்பட்டது!', 'success');
}

// OTP input auto-focus
document.querySelectorAll('.otp-input').forEach((input, index, inputs) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

// ===== CATEGORY SELECTOR =====
document.querySelectorAll('.cat-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// ===== FILE UPLOAD =====
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPreview = document.getElementById('uploadPreview');

if (uploadArea) {
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'var(--primary-light)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.createElement('div');
                preview.style.cssText = 'width:80px;height:80px;border-radius:8px;overflow:hidden;position:relative;';
                preview.innerHTML = `
                    <img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">
                    <button onclick="this.parentElement.remove()" style="position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:red;color:white;border:none;font-size:0.7rem;cursor:pointer;">&times;</button>
                `;
                uploadPreview.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
    showNotification('புகைப்படம் சேர்க்கப்பட்டது!', 'success');
}

// ===== LOCATION =====
const getLocationBtn = document.getElementById('getLocation');
const locationText = document.getElementById('locationText');
const mapPlaceholder = document.getElementById('mapPlaceholder');

if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
        getLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Simulate GPS fetch
        setTimeout(() => {
            const lat = 12.9249 + (Math.random() * 0.01);
            const lng = 80.1000 + (Math.random() * 0.01);
            locationText.textContent = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)} (Tambaram Area)`;
            locationText.style.color = '#10b981';
            getLocationBtn.innerHTML = '<i class="fas fa-check"></i> Location Set';
            getLocationBtn.style.borderColor = '#10b981';
            getLocationBtn.style.color = '#10b981';
            
            mapPlaceholder.innerHTML = `
                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 12px; padding: 30px; text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 2rem; color: #1565c0; margin-bottom: 8px;"></i>
                    <p style="font-size: 0.85rem; color: #1565c0; font-weight: 600;">📍 Location Captured</p>
                    <p style="font-size: 0.75rem; color: #666;">Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</p>
                    <p style="font-size: 0.75rem; color: #666;">Tambaram Constituency Area</p>
                </div>
            `;
            
            showNotification('Location captured successfully!', 'success');
        }, 1500);
    });
}

// ===== COMPLAINT FORM SUBMIT =====
const complaintForm = document.getElementById('complaintForm');

if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate category
        const selectedCat = document.querySelector('.cat-option.selected');
        if (!selectedCat) {
            showNotification('புகார் வகையை தேர்வு செய்யுங்கள்!', 'error');
            return;
        }

        const area = document.getElementById('area').value;
        if (!area) {
            showNotification('பகுதியை தேர்வு செய்யுங்கள்!', 'error');
            return;
        }

        const title = document.getElementById('title').value;
        if (!title) {
            showNotification('புகார் தலைப்பு எழுதுங்கள்!', 'error');
            return;
        }

        // Show loading
        const submitBtn = complaintForm.querySelector('.btn-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> புகார் Submit செய்';
            submitBtn.disabled = false;
            
            // Show success modal
            document.getElementById('successModal').classList.add('active');
            
            // Reset form
            complaintForm.reset();
            document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
            if (uploadPreview) uploadPreview.innerHTML = '';
        }, 2000);
    });
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    navigateTo('track');
}

// ===== TRACK SEARCH =====
function searchComplaint() {
    const input = document.getElementById('trackInput');
    const result = document.getElementById('trackResult');
    
    if (!input.value) {
        showNotification('Complaint ID அல்லது Mobile Number enter செய்யுங்கள்!', 'error');
        return;
    }

    // Show loading effect
    result.style.opacity = '0.5';
    
    setTimeout(() => {
        result.style.opacity = '1';
        showNotification('புகார் விவரங்கள் கிடைத்தது!', 'success');
    }, 1000);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 14px 20px;
        border-radius: 10px;
        color: white;
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-family: 'Noto Sans Tamil', sans-serif;
    `;

    let icon, bgColor;
    switch(type) {
        case 'success':
            icon = '✓';
            bgColor = '#10b981';
            break;
        case 'error':
            icon = '✗';
            bgColor = '#ef4444';
            break;
        default:
            icon = 'ℹ';
            bgColor = '#3b82f6';
    }

    notification.style.background = bgColor;
    notification.innerHTML = `<span style="font-size:1.1rem;">${icon}</span> ${message}`;

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);

// ===== DASHBOARD BAR ANIMATION =====
function animateBars() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 200);
    });
}

// Trigger bar animation when dashboard is visible
const dashboardPage = document.getElementById('page-dashboard');
const dashObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.target.classList.contains('active')) {
            setTimeout(animateBars, 300);
        }
    });
});

if (dashboardPage) {
    dashObserver.observe(dashboardPage, { attributes: true, attributeFilter: ['class'] });
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

console.log('🎯 Voice to MLA - Demo Platform Loaded Successfully!');
console.log('Pages: Home | Complaint | Track | Updates | Dashboard');
