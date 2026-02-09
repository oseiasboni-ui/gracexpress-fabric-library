document.addEventListener('DOMContentLoaded', () => {
    // Initialize Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% is visible
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target); // Run only once

                // Check for number counters inside
                const counters = entry.target.querySelectorAll('.count-up');
                counters.forEach(counter => {
                    animateValue(counter);
                });
            }
        });
    }, observerOptions);

    // Observe elements
    const targets = document.querySelectorAll('.fade-in-up, .slide-in-short, .stagger-container, .reveal-width, .slide-in-long');
    targets.forEach(el => observer.observe(el));

    // Number Animation Function
    function animateValue(obj) {
        const targetStr = obj.innerText;
        const target = parseInt(targetStr.replace(/\D/g, '')); // Extract number
        if (isNaN(target)) return;

        const suffix = targetStr.replace(/[0-9]/g, ''); // Extract suffix like "+" or "%"

        let startTimestamp = null;
        const duration = 1500; // 1.5s duration

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            obj.innerHTML = Math.floor(easeProgress * target) + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = targetStr; // Ensure final value is exact
            }
        };

        window.requestAnimationFrame(step);
    }
});
