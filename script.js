// ===================================
// MAIN INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    console.log('🚀 Aashiyana Prime website loading...');
    
    // ===================================
    // NAVBAR ELEMENTS
    // ===================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const dropdowns = document.querySelectorAll('.dropdown');

    // ===================================
    // HAMBURGER MENU TOGGLE
    // ===================================
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // ===================================
    // DROPDOWN MENU - MOBILE
    // ===================================
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ===================================
    // NAVBAR SCROLL EFFECT
    // ===================================
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (navbar) {
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        lastScroll = currentScroll;
    });

    // ===================================
    // HERO SLIDER
    // ===================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const heroSection = document.querySelector('.hero');
    
    // Only run slider code if slides exist (homepage only)
    if (slides.length > 0 && dots.length > 0) {
        let currentSlide = 0;
        const slideCount = slides.length;
        
        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = (n + slideCount) % slideCount;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        // Auto slide every 5 seconds
        let autoSlide = setInterval(nextSlide, 5000);
        
        function resetAutoSlide() {
            clearInterval(autoSlide);
            autoSlide = setInterval(nextSlide, 5000);
        }
        
        // Event listeners for slider controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetAutoSlide();
            });
        });
        
        // Pause auto slide on hover
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                clearInterval(autoSlide);
            });
            
            heroSection.addEventListener('mouseleave', () => {
                autoSlide = setInterval(nextSlide, 5000);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoSlide();
            }
        });
        
        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (heroSection) {
            heroSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            heroSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                    resetAutoSlide();
                }
            }
        }
        
        // Show first slide
        showSlide(0);
        
        console.log('✅ Hero slider initialized');
    } else {
        console.log('ℹ️ No slider on this page (expected for product pages)');
    }

    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                if (navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // LAZY LOADING FOR IMAGES
    // ===================================
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });

    // ===================================
    // WHATSAPP ENQUIRY - PRODUCT PAGES
    // ===================================
    
    const productCards = document.querySelectorAll('.product-detail-section .product-card');
    
    let buttonsActivated = 0;
    
    productCards.forEach((card, index) => {
        const enquireBtn = card.querySelector('.product-btn');
        const productImage = card.querySelector('.product-image img');
        const productNameElement = card.querySelector('.product-name');
        
        if (enquireBtn && enquireBtn.tagName === 'BUTTON' && productImage && productNameElement) {
            
            enquireBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get product details
                const productName = productNameElement.textContent.trim();
                let imageUrl = productImage.src;
                
                // If local image, create full URL
                if (!imageUrl.startsWith('http')) {
                    imageUrl = `${window.location.origin}/${productImage.getAttribute('src')}`;
                }
                
                console.log('🎯 Enquiry button clicked!', { productName, imageUrl });
                
                // Create WhatsApp message - Image URL FIRST for preview
                const message = `${imageUrl}

━━━━━━━━━━━━━━━━━━━━━
Hello Aashiyana Prime! 👋

I'm interested in:
*${productName}*

Please share:
✓ Price & Payment options
✓ Available sizes & colors
✓ Customization options
✓ Delivery timeline

Thank you!`;
                
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/918700310657?text=${encodedMessage}`;
                
                console.log('📱 Opening WhatsApp...');
                window.open(whatsappUrl, '_blank');
            });
            
            buttonsActivated++;
        }
    });
    
    if (buttonsActivated > 0) {
        console.log(`✅ WhatsApp integration ready! ${buttonsActivated} enquiry buttons activated.`);
    }

    // ===================================
    // WINDOW RESIZE HANDLER
    // ===================================
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }, 250);
    });

    // ===================================
    // PAGE LOADED
    // ===================================
    document.body.classList.add('loaded');
    console.log('✅ Aashiyana Prime website initialized successfully!');

});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedScroll = debounce(() => {
    // Scroll-based effects can go here
}, 100);

window.addEventListener('scroll', debouncedScroll, { passive: true });

console.log('📜 Script.js loaded successfully!');