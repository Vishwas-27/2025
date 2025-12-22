// ============================================
// SNOWFALL SYSTEM
// ============================================
const snowfallContainer = document.getElementById('snowfall');
const isMobileDevice = window.innerWidth <= 768;
const snowflakeCount = isMobileDevice ? 30 : 50;

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.fontSize = (Math.random() * 1.5 + 0.5) + 'em';
    snowflake.style.opacity = Math.random() * 0.8 + 0.2;
    
    const drift = (Math.random() - 0.5) * 100;
    snowflake.style.setProperty('--drift', drift + 'px');
    
    const duration = Math.random() * 10 + 10;
    snowflake.style.animationDuration = duration + 's';
    snowflake.style.animationDelay = Math.random() * 5 + 's';
    
    snowfallContainer.appendChild(snowflake);
    
    setTimeout(() => {
        snowflake.remove();
        createSnowflake();
    }, (duration + 5) * 1000);
}

for (let i = 0; i < snowflakeCount; i++) {
    setTimeout(() => createSnowflake(), i * 200);
}

// ============================================
// LOCK/UNLOCK SYSTEM
// ============================================
let isUnlocked = false;
const devUnlockBtn = document.getElementById('devUnlock');
const slides = document.querySelectorAll('.slide');

// Show dev button on triple-click top-left corner
let clickCount = 0;
let clickTimer;

document.addEventListener('click', (e) => {
    if (e.clientX < 100 && e.clientY < 100) {
        clickCount++;
        clearTimeout(clickTimer);
        
        if (clickCount === 3) {
            devUnlockBtn.style.opacity = '0.5';
            clickCount = 0;
        }
        
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 1000);
    }
});

// Developer unlock functionality
devUnlockBtn.addEventListener('click', () => {
    const code = prompt('Enter developer code:');
    if (code === 'VISHWAS2026' || code === 'vishwas2026') {
        isUnlocked = true;
        unlockAllSlides();
        devUnlockBtn.innerHTML = '🔓';
        devUnlockBtn.style.opacity = '0.7';
        alert('Developer mode activated! All slides unlocked.');
    } else if (code !== null) {
        alert('Invalid code. Try again!');
    }
});

function unlockAllSlides() {
    slides.forEach(slide => {
        slide.classList.remove('locked');
    });
}

// ============================================
// COUNTDOWN TIMER
// ============================================
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const timerTitle = document.querySelector('.timer-title');

let countdownComplete = false;

function updateCountdown() {
    const now = new Date().getTime();
    const newYear = new Date('December 31, 2025 23:59:59').getTime();
    const distance = newYear - now;
    
    if (distance < 0 && !countdownComplete) {
    countdownComplete = true;
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    
    // INSTANT transition to slide 2 for cinematic effect
    unlockAllSlides();
    
    // Immediately go to slide 2 to show the year transition
    setTimeout(() => {
        updateSlide(1, 'next');
        
        // Trigger the cinematic 2025->2026 animation
        const slide2 = document.getElementById('slide2');
        if (slide2) {
            slide2.classList.add('cinematic-start');
        }
    }, 100); // Very short delay for smooth transition
    
    return;
}
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================
// NAVIGATION SYSTEM
// ============================================
let currentSlide = 0;
const totalSlides = 9;
const scrollContainer = document.getElementById('scrollContainer');
const navDots = document.querySelectorAll('.nav-dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const scrollHint = document.getElementById('scrollHint');
const birthdayLink = document.getElementById('birthdayLink');

function updateSlide(index, direction = 'next') {
    // Check if slide is locked
    if (slides[index].classList.contains('locked') && !isUnlocked) {
        alert('❄️ This chapter is still frozen in time. Wait for midnight or unlock with developer code!');
        return;
    }
    
    if (index < 0 || index >= totalSlides) return;
    
    currentSlide = index;
    scrollContainer.style.transform = `translateX(-${currentSlide * 100}vw)`;
    
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) {
            slide.classList.add('active');
        }
    });
    
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
    
    prevBtn.classList.toggle('disabled', currentSlide === 0);
    nextBtn.classList.toggle('disabled', currentSlide === totalSlides - 1);
    
    // Show birthday button only on last slide
    if (currentSlide === totalSlides - 1 && !slides[currentSlide].classList.contains('locked')) {
        setTimeout(() => {
            birthdayLink.classList.add('visible');
        }, 1000);
    } else {
        birthdayLink.classList.remove('visible');
    }
    
    if (currentSlide > 0) {
        scrollHint.style.display = 'none';
    }
    
    // Trigger fireworks on slide 3 (Happy New Year)
    if (currentSlide === 2) {
        setTimeout(() => {
            createFireworks();
            startNameSequence();
        }, 500);
    }
}

function autoTransitionToSlide2() {
    setTimeout(() => {
        updateSlide(1, 'next');
        scrollHint.textContent = 'Navigate';
        scrollHint.style.display = 'flex';
    }, 1000);
}

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) updateSlide(currentSlide - 1, 'prev');
});

nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) updateSlide(currentSlide + 1, 'next');
});

navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        const direction = index > currentSlide ? 'next' : 'prev';
        updateSlide(index, direction);
    });
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentSlide > 0) {
        updateSlide(currentSlide - 1, 'prev');
    } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
        updateSlide(currentSlide + 1, 'next');
    }
});

// ============================================
// MOUSE WHEEL NAVIGATION
// ============================================
let isScrolling = false;

document.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    isScrolling = true;
    
    if (e.deltaY > 0 && currentSlide < totalSlides - 1) {
        updateSlide(currentSlide + 1, 'next');
    } else if (e.deltaY < 0 && currentSlide > 0) {
        updateSlide(currentSlide - 1, 'prev');
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, 1200);
});

// ============================================
// TOUCH SWIPE
// ============================================
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSlide < totalSlides - 1) {
            updateSlide(currentSlide + 1, 'next');
        } else if (diff < 0 && currentSlide > 0) {
            updateSlide(currentSlide - 1, 'prev');
        }
    }
}

// ============================================
// SEQUENTIAL NAME CHANGES FOR SLIDE 3 - IMPROVED & SMOOTHER
// ============================================
let nameChangeInterval;
let nameIndex = 0;
const names = ['Saachiiiii', 'Bacche', 'Madam Ji', 'Risk Taker', 'Saachi Agarwal'];

function startNameSequence() {
    const nameTextElement = document.getElementById('nameText');
    if (!nameTextElement) return;
    
    // Clear any existing interval
    if (nameChangeInterval) {
        clearInterval(nameChangeInterval);
    }
    
    // Reset to first name
    nameIndex = 0;
    nameTextElement.textContent = names[nameIndex];
    
    // Start changing names every 4 seconds with SMOOTH transitions
    nameChangeInterval = setInterval(() => {
        nameIndex = (nameIndex + 1) % names.length;
        
        // Step 1: Fade out current name smoothly
        nameTextElement.classList.add('fade-out');
        
        // Step 2: Change text after fade-out completes (0.5s)
        setTimeout(() => {
            nameTextElement.textContent = names[nameIndex];
            nameTextElement.classList.remove('fade-out');
            nameTextElement.classList.add('fade-in');
        }, 500);
        
        // Step 3: Remove fade-in class after animation completes (0.6s)
        setTimeout(() => {
            nameTextElement.classList.remove('fade-in');
        }, 1100);
        
    }, 1000);
}

// Stop name sequence when leaving slide 3
const observerSlide3 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'slide3') {
            if (!mutation.target.classList.contains('active')) {
                // Slide 3 is no longer active, stop the name sequence
                if (nameChangeInterval) {
                    clearInterval(nameChangeInterval);
                    nameChangeInterval = null;
                }
            }
        }
    });
});

const slide3Element = document.getElementById('slide3');
if (slide3Element) {
    observerSlide3.observe(slide3Element, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// ============================================
// INITIALIZE
// ============================================
updateSlide(0);

// ============================================
// PARTICLE EXPLOSION FOR SLIDE 2
// ============================================
function createParticleExplosion() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Reduce particle count on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = isMobile ? 80 + Math.random() * 100 : 100 + Math.random() * 150;
        const size = isMobile ? 3 + Math.random() * 5 : 4 + Math.random() * 8;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = '50%';
        particle.style.top = '50%';
        
        const endX = Math.cos(angle) * velocity;
        const endY = Math.sin(angle) * velocity;
        
        const duration = 1 + Math.random() * 0.5;
        
        particle.style.animation = `particleExplode${i} ${duration}s ease-out forwards`;
        
        const keyframes = `
            @keyframes particleExplode${i} {
                0% {
                    transform: translate(-50%, -50%) translate(0, 0) scale(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) translate(${endX}px, ${endY}px) scale(1);
                    opacity: 0;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
            styleSheet.remove();
        }, duration * 1000 + 100);
    }
}

// Trigger particle explosion when slide 2 becomes active
const observerSlide2 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'slide2' && mutation.target.classList.contains('active')) {
            setTimeout(() => {
                createParticleExplosion();
            }, 3800);
        }
    });
});

const slide2Element = document.getElementById('slide2');
if (slide2Element) {
    observerSlide2.observe(slide2Element, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// ============================================
// FIREWORKS FOR SLIDE 3 (Happy New Year)
// ============================================
function createFireworks() {
    const fireworkContainer = document.getElementById('fireworkContainer');
    if (!fireworkContainer) return;
    
    const isMobile = window.innerWidth <= 768;
    const fireworkCount = isMobile ? 5 : 8;
    
    function launchFirework() {
        const startX = Math.random() * 80 + 10; // 10-90%
        const startY = Math.random() * 30 + 60; // 60-90% (bottom area)
        const endX = Math.random() * 60 + 20; // 20-80%
        const endY = Math.random() * 30 + 10; // 10-40% (top area)
        
        const colors = ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#FF6347', '#32CD32', '#9370DB'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create trail
        const trail = document.createElement('div');
        trail.className = 'firework';
        trail.style.left = startX + '%';
        trail.style.top = startY + '%';
        trail.style.background = color;
        fireworkContainer.appendChild(trail);
        
        // Animate to explosion point
        trail.animate([
            { left: startX + '%', top: startY + '%', opacity: 1 },
            { left: endX + '%', top: endY + '%', opacity: 1 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            trail.remove();
            explodeFirework(endX, endY, color);
        };
    }
    
    function explodeFirework(x, y, color) {
        const particleCount = isMobile ? 20 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework';
            particle.style.left = x + '%';
            particle.style.top = y + '%';
            particle.style.background = color;
            fireworkContainer.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 50 + Math.random() * 100;
            const endX = x + (Math.cos(angle) * velocity / window.innerWidth * 100);
            const endY = y + (Math.sin(angle) * velocity / window.innerHeight * 100);
            
            particle.animate([
                { 
                    left: x + '%', 
                    top: y + '%', 
                    opacity: 1,
                    transform: 'scale(1)'
                },
                { 
                    left: endX + '%', 
                    top: endY + '%', 
                    opacity: 0,
                    transform: 'scale(0.5)'
                }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }
    
    // Launch multiple fireworks with delays
    for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
            launchFirework();
        }, i * 600);
    }
    
    // Continue launching fireworks every 2 seconds for slide 3
    const fireworkInterval = setInterval(() => {
        if (currentSlide === 2) {
            launchFirework();
        } else {
            clearInterval(fireworkInterval);
        }
    }, 2000);
}

// ============================================
// ENHANCED SPARKLE EFFECTS
// ============================================
function createSparkles() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
        // Add random sparkles to active slides
        if (slide.classList.contains('active')) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = '1rem';
            sparkle.innerHTML = '✨';
            sparkle.style.opacity = '0';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '5';
            sparkle.style.animation = 'sparkleFloat 3s ease-out forwards';
            
            slide.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 3000);
        }
    });
}

// Create sparkles periodically
setInterval(createSparkles, 5000);

// Add sparkle float animation dynamically
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFloat {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0) rotate(0deg);
        }
        20% {
            opacity: 1;
        }
        80% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5) rotate(360deg);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Disable animations for reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// Throttle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle resize if needed
        updateSlide(currentSlide);
    }, 250);
});

// ============================================
// CONSOLE MESSAGE FOR DEVELOPER
// ============================================
console.log('%c🎆 Happy New Year 2026! 🎆', 'font-size: 24px; font-weight: bold; color: #87CEEB; text-shadow: 0 0 10px #87CEEB;');
console.log('%cDeveloper Code: VISHWAS2026', 'font-size: 14px; color: #FFD700;');
console.log('%cTriple-click top-left corner to reveal unlock button', 'font-size: 12px; color: #B0E5FC;');

