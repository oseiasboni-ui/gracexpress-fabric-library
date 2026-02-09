/**
 * Hero Elegant Slider
 * Auto-slides every 15 seconds with indicator support
 * + Rotating subtitles every 4 seconds
 */
(function () {
    'use strict';

    const SLIDE_INTERVAL = 5000; // 5 seconds (reduced for better visibility)
    const SUBTITLE_INTERVAL = 3500; // 3.5 seconds for subtitles

    let currentSlide = 0;
    let currentSubtitle = 0;
    let slideInterval;
    let subtitleInterval;
    let slides;
    let indicators;
    let subtitles;

    function init() {
        slides = document.querySelectorAll('.hero-elegant .hero-slide');
        indicators = document.querySelectorAll('.hero-elegant .indicator');
        subtitles = document.querySelectorAll('.hero-elegant .hero-subtitle');

        if (slides.length === 0) return;

        // Add click handlers to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        // Start auto-slide for backgrounds
        startAutoSlide();

        // Start subtitle rotation
        if (subtitles.length > 1) {
            startSubtitleRotation();
        }

        // Pause on hover
        const heroSection = document.querySelector('.hero-elegant');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                stopAutoSlide();
                stopSubtitleRotation();
            });
            heroSection.addEventListener('mouseleave', () => {
                startAutoSlide();
                startSubtitleRotation();
            });
        }
    }

    // ========== BACKGROUND SLIDES ==========
    function goToSlide(index) {
        if (index === currentSlide || index < 0 || index >= slides.length) return;

        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');

        // Toggle Content Visibility: Only show on Slide 1 (Index 0)
        const heroContent = document.querySelector('.hero-content');
        const heroBtn = document.querySelector('.hero-btn'); // Link Portfolio

        if (index === 0) {
            // Show Content
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.visibility = 'visible';

                // Restart Title Animations
                const titles = heroContent.querySelectorAll('.title-gracex, .title-press');
                titles.forEach(el => {
                    el.style.animation = 'none';
                    void el.offsetWidth; // Trigger reflow
                    el.style.animation = null; // Re-apply CSS animation
                });
            }
            if (heroBtn) {
                heroBtn.style.opacity = '1';
                heroBtn.style.visibility = 'visible';
            }
        } else {
            // Hide Content
            if (heroContent) {
                heroContent.style.opacity = '0';
                heroContent.style.visibility = 'hidden';
            }
            if (heroBtn) {
                heroBtn.style.opacity = '0';
                heroBtn.style.visibility = 'hidden';
            }
        }

        if (slideInterval) {
            stopAutoSlide();
            startAutoSlide();
        }
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startAutoSlide() {
        if (slideInterval) return;
        slideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    // ========== SUBTITLE ROTATION ==========
    function nextSubtitle() {
        if (subtitles.length === 0) return;

        subtitles[currentSubtitle].classList.remove('active');
        currentSubtitle = (currentSubtitle + 1) % subtitles.length;
        subtitles[currentSubtitle].classList.add('active');
    }

    function startSubtitleRotation() {
        if (subtitleInterval) return;
        subtitleInterval = setInterval(nextSubtitle, SUBTITLE_INTERVAL);
    }

    function stopSubtitleRotation() {
        if (subtitleInterval) {
            clearInterval(subtitleInterval);
            subtitleInterval = null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        // Arrow Navigation
        const prevBtn = document.querySelector('.hero-arrow.prev');
        const nextBtn = document.querySelector('.hero-arrow.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                const prev = (currentSlide - 1 + slides.length) % slides.length;
                goToSlide(prev);
                startAutoSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            });
        }
    } else {
        init();
    }
    // Listen for custom update event from Admin Manager
    window.addEventListener('heroSlidesUpdated', () => {
        // Re-select elements
        slides = document.querySelectorAll('.hero-elegant .hero-slide');
        indicators = document.querySelectorAll('.hero-elegant .indicator');

        // Re-attach listeners to new indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        // Reset state
        currentSlide = 0;
        if (slideInterval) stopAutoSlide();
        startAutoSlide();

        console.log('Hero Slider re-initialized via Admin Update');
    });

})();
