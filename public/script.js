// ==========================================
// 1. MOBILE MENU TOGGLE
// ==========================================
// MOBILE NAVIGATION
/* ===== MOBILE NAVIGATION ===== */

const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenu && navMenu) {
    // Open and close the navigation when the hamburger is clicked
    mobileMenu.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('active');

        mobileMenu.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute(
            'aria-label',
            isOpen ? 'Close navigation menu' : 'Open navigation menu'
        );
    });

    // Close the menu after a navigation option is selected
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-label', 'Open navigation menu');
        });
    });

    // Close the menu if the user clicks outside it
    document.addEventListener('click', function (event) {
        if (
            !navMenu.contains(event.target) &&
            !mobileMenu.contains(event.target)
        ) {
            navMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-label', 'Open navigation menu');
        }
    });

    // Close the menu with the Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            navMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-label', 'Open navigation menu');
        }
    });
}

// ==========================================
// 2. FOOD MENU FILTER TABS
// ==========================================
const tabButtons = document.querySelectorAll('.tab-btn');
const menuItems = document.querySelectorAll('.menu-item');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) activeTab.classList.remove('active');
        
        button.classList.add('active');
        const targetedCategory = button.getAttribute('data-filter');

        menuItems.forEach(item => {
            if (targetedCategory === 'all' || item.getAttribute('data-category') === targetedCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ==========================================
// 3. RESERVATION FORM SUBMISSION
// ==========================================
// Front-End Validation Handler for the Reservation Form

const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const responseBox = document.getElementById('form-response');
        const submitButton = bookingForm.querySelector(
            'button[type="submit"]'
        );

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value
        };

        responseBox.style.color = 'red';
        responseBox.textContent = '';

        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Unable to save reservation.'
                );
            }

            responseBox.style.color = 'green';
            responseBox.textContent =
                'Success! Your table reservation has been saved.';

            bookingForm.reset();

        } catch (error) {
            console.error('Reservation error:', error);

            responseBox.style.color = 'red';
            responseBox.textContent =
                'Could not save your reservation. Please try again.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Confirm Request';
        }
    });
}



// ==========================================
// 4. CENTRAL DYNAMIC LOCATION STORAGE
// ==========================================
// Changing text values here will update your physical webpage layouts instantly.
const restaurantConfig = {
    title: "VISIT OUR NEW SEAFOOD BAZAAR",
    address: "Aurora Dining, Plot 45, Near Marine Drive, Balipatana, Odisha, 752102, India",
    phone: "Phone: +91 94390 12345",
    email: "Email: orders@auroradining.com",
    hours: "Monday - Sunday: 11:00 AM - 11:00 PM",
    
    // ⚠️ NOTE: Make sure to change this to a real Google Maps Embed link later!
    googleMapsEmbedUrl: "https://google.com"
};

// ==========================================
// 5. AUTOMATED TEXT RENDERING MOTOR
// ==========================================
function forceRenderLocation() {
    try {
        const titleNode = document.getElementById('dynamic-title');
        const addressNode = document.getElementById('dynamic-address');
        const phoneNode = document.getElementById('dynamic-phone');
        const emailNode = document.getElementById('dynamic-email');
        const hoursNode = document.getElementById('dynamic-hours');
        const iframeNode = document.getElementById('dynamic-iframe');

        if (titleNode) titleNode.innerText = restaurantConfig.title;
        if (addressNode) addressNode.innerText = restaurantConfig.address;
        if (phoneNode) phoneNode.innerText = restaurantConfig.phone;
        if (emailNode) emailNode.innerText = restaurantConfig.email;
        if (hoursNode) hoursNode.innerText = restaurantConfig.hours;
        if (iframeNode) iframeNode.setAttribute('src', restaurantConfig.googleMapsEmbedUrl);
        
        console.log("All restaurant elements updated successfully!");
    } catch (error) {
        console.error("Layout text configuration failed:", error);
    }
}

// Run layout generator instantly when file reads, and as an explicit safety backup when full windows finalize loading
forceRenderLocation();
window.addEventListener('load', forceRenderLocation);

/* ==========================================
   PREMIUM SCROLL REVEAL ANIMATIONS
========================================== */

(function initScrollReveal() {
    const elements = document.querySelectorAll(
        '.about-image, .about-text, ' +
        '.section-header, .menu-item, ' +
        '.testimonial-card, .reserve-container, ' +
        '.location-info, .map-box, .footer-box'
    );

    // Avoid hiding content if the browser lacks support.
    if (
        !('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
        return;
    }

    elements.forEach(element => {
        element.classList.add('js-reveal');
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px'
    });

    elements.forEach(element => observer.observe(element));
})();
 