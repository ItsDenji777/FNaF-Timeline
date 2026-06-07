document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. Load the JSON Lore Data ---
    let timelineLore = {};

    fetch('lore.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not load lore.json");
            return response.json();
        })
        .then(data => {
            timelineLore = data;
        })
        .catch(error => console.error("Error loading JSON:", error));

    // --- 1. Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: document.querySelector('.timeline-container'),
        rootMargin: '0px',
        threshold: 0.2
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // --- 2. Horizontal Scrolling with Mouse Wheel ---
    const container = document.querySelector('.timeline-container');
    container.addEventListener('wheel', (evt) => {
        if (!document.getElementById('lore-modal').classList.contains('active')) {
            evt.preventDefault();
            container.scrollLeft += evt.deltaY * 1.5; 
        }
    });

    // --- 3. Modal Logic & Data Injection ---
    const modalOverlay = document.getElementById('lore-modal');
    const modalBox = modalOverlay.querySelector('.modal-box');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeModalBtn = document.getElementById('close-modal');

    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            
            // Get mapping data
            const eraId = this.getAttribute('data-id');
            const contentBlock = this.closest('.content');
            
            const accentColor = contentBlock.closest('.timeline-item').style.getPropertyValue('--accent-color');
            const imgSrc = contentBlock.querySelector('img').src;
            const titleText = contentBlock.querySelector('h3').innerText;
            
            // Look up the deep lore from the loaded JSON
            const loreHTML = timelineLore[eraId] || "<p>Lore data could not be loaded. Ensure you are running this on a local web server (like VS Code Live Server) to allow JSON fetching.</p>";

            // Populate Modal
            modalImg.src = imgSrc;
            modalTitle.innerText = titleText;
            modalText.innerHTML = loreHTML;
            
            // Change the border highlight of the modal and blockquotes based on the Era color
            modalBox.style.borderTopColor = accentColor;
            modalBox.style.setProperty('--accent-color', accentColor);

            // Show Modal
            modalOverlay.classList.add('active');
        });
    });

    // Close Modal Events
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
        }
    });
});