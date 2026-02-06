/**
 * Hero Elegant Slider
 * Auto-slides every 15 seconds with indicator support
 * + Rotating subtitles every 4 seconds
 */
(function () {
    'use strict';

    const SLIDE_INTERVAL = 15000; // 15 seconds for background
    const SUBTITLE_INTERVAL = 4000; // 4 seconds for subtitles

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
    } else {
        init();
    }
})();
