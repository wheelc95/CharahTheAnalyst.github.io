(() => {
    const spotlight = document.getElementById('spotlight');
    const avatarGuide = document.querySelector('.avatar-guide');
    const bubble = document.querySelector('.speech-bubble');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const mainContent = document.querySelector('.main-content');
    const modal = document.getElementById('projectModal'); // Modal element
    const modalTitle = document.getElementById('modalSlideTitle');
    const modalDescription = document.getElementById('modalSlideDescription');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    let currentStep = 0;
    let scrollPosition = 0;

    let slides = [];
    let currentSlideIndex = 0;

    // Store initial Home HTML for returning home
    const homeHTML = mainContent.innerHTML;

    // SPA page contents
    const pages = {
        home: homeHTML,
        projects: `
            <header class="page-header">
                <p class="subtitle">Explore my work</p>
            </header>
            <section class="projects-grid">
                <div class="project-card">
                    <img src="assets/images/us-job-market1.png" alt="Project 1 Screenshot">
                    <h3>US Job Markert and Education Overview (2023)</h3>
                    <p>A Power BI dashboard for visualizing job market trends.</p>
                    <a href="#" class="btn" data-slides='[
                        {"image": "assets/images/us-job-market1.png", "title": "US Job Market and Education Overview (2023)", "description": "A comprehensive dashboard showing the overall health of the US job market with detailed educational attainment and unemployment rates."},
                        {"image": "assets/images/us-job-market2.png", "title": "US County Job Market Classification", "description": "Visual map illustrating job market classifications by county, highlighting regions of concern, crisis, and stability. The bubble size indicate larger or smaller populations."},
                        {"image": "assets/images/us-job-market3.png", "title": "Education vs Unemployment Analysis", "description": "Scatter plot depicting the relationship between adults with bachelor&apos;s degrees and unemployment rates across US counties."}
                    ]'>View Project</a>
                </div>
                <div class="project-card">
                    <img src="assets/images/lss1.png" alt="Project 2 Screenshot">
                    <h3>Lean Six Sigma DMAIC Toolkit</h3>
                    <p>A toolkit to streamline the DMAIC process.</p>
                    <a href="#" class="btn" data-slides='[
                        {"image": "assets/images/lss1.png", "title": "Lean Six Sigma DMAIC Toolkit", "description": "A Streamlit dashboard that walks you through every phase of Lean Six Sigma—Define, Measure, Analyze, Improve, and Control—using interactive modules like SIPOC, sigma calculator, Pareto charts, FMEA, and SPC charts. Generate visual insights and download reports at each step to drive data‑driven process improvements."},
                        {"image": "assets/images/lss2.png", "title": "Define Module: Project Charter", "description": "Easily define your project’s name, scope, problem statement, goal, timeline, and team, then generate a polished Word charter in seconds—aligning stakeholders and setting clear success metrics from the start."},
                        {"image": "assets/images/lss3.png", "title": "Measure Module: Histogram/Boxplot", "description": "Upload your data, pick a numeric variable, and instantly see its distribution and outliers side‑by‑side: a histogram for frequency patterns and a boxplot for spotting extreme values and spread. This quick visual check helps you understand your process variation at a glance."}
                    ]'>View Project</a>
                </div>
                <!-- Add more projects here -->
            </section>
        `,
        about: `
            <header class="page-header">
                <p class="subtitle">Hi, I’m Charah 👋</p>
            </header>
            <section class="about-section">
                <div class="about-content">
                    <div class="about-image">
                        <img src="assets/images/avatar.png" alt="Charah Avatar">
                    </div>
                    <div class="about-text">
                        <p>I’m a data analyst and developer blending analytics with custom tools to create meaningful insights and solve real-world problems.</p>
                        <ul>
                            <li>Automate workflows with Excel & Python.</li>
                            <li>Build interactive dashboards in Power BI.</li>
                            <li>Develop web apps for business operations.</li>
                        </ul>
                    </div>
                </div>
            </section>
        `,
        contact: `
            <header class="page-header">
                <p class="subtitle">Have a question or want to work together? Send me a message!</p>
            </header>
            <section class="contact-section">
                <form class="contact-form">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" placeholder="Your message..." rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn">Send Message</button>
                </form>
            </section>
        `
    };

    // Guided Tour steps for spotlight
    const tourSteps = [
        {
            element: '.avatar-guide',
            message: "👋 Hi, I’m Charah! Let me guide you through my portfolio.",
            radius: 250,
            offsetX: -200,
            offsetY: -50,
            scrollAlign: "center"
        },
        {
            element: '.sidebar-menu',
            message: "📂 Use this menu to navigate my portfolio sections.",
            radius: 200,
            offsetX: -20,
            offsetY: -30,
            scrollAlign: "start"
        },
        {
            element: '.toolkit-list',
            message: "🛠 These are the tools I work with daily.",
            radius: 180,
            offsetX: 0,
            offsetY: -10,
            scrollAlign: "center"
        },
        {
            element: '.btn-download',
            message: "📄 You can download my resume here.",
            radius: 180,
            offsetX: 0,
            offsetY: 20,
            scrollAlign: "center"
        },
        {
            element: '.social-media',
            message: "🌐 Stay connected with me on LinkedIn, GitHub, YouTube, and TikTok.",
            radius: 160,
            offsetX: 0,
            offsetY: -10,
            scrollAlign: "start"
        },
        {
            element: '.project-slider',
            message: "🎯 Here are my featured projects. Take a closer look!",
            radius: 500,
            offsetX: 0,
            offsetY: 0,
            scrollAlign: "center"
        }
    ];

    // Set spotlight mask to highlight element
    function setSpotlightMask(targetElement, stepOptions = {}) {
        const rect = targetElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 + (stepOptions.offsetX || 0);
        const centerY = rect.top + rect.height / 2 + (stepOptions.offsetY || 0);
        const radius = stepOptions.radius || Math.max(rect.width, rect.height) / 2 + 20;

        spotlight.style.setProperty('--spotlight-x', `${centerX}px`);
        spotlight.style.setProperty('--spotlight-y', `${centerY}px`);
        spotlight.style.setProperty('--spotlight-radius', `${radius}px`);
    }

    // Show spotlight overlay and disable scroll
    function showSpotlight() {
        scrollPosition = window.scrollY || document.documentElement.scrollTop;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('no-scroll');

        spotlight.style.display = 'block';
        spotlight.classList.add('active');
    }

    // Hide spotlight and enable scroll
    function hideSpotlight() {
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);

        spotlight.classList.remove('active');
        spotlight.classList.remove('has-mask');
        setTimeout(() => {
            spotlight.style.display = 'none';
        }, 500);
    }

    // Update speech bubble content during tour
    function updateBubbleContent(message, hasNextStep) {
        bubble.innerHTML = `
            <p>${message}</p>
            <div class="bubble-buttons">
                ${hasNextStep
                ? '<button id="nextStepBtn" class="btn-bubble">Next</button>'
                : '<button id="endTourBtn" class="btn-bubble">Finish</button>'
            }
            </div>
        `;
    }

    // Show a step in the guided tour
    function showStep(index) {
        if (index >= tourSteps.length) {
            hideSpotlight();
            return;
        }
        const step = tourSteps[index];
        const targetElement = document.querySelector(step.element);

        if (targetElement) {
            if (step.element !== '.avatar-guide') {
                spotlight.classList.add('has-mask');
                setSpotlightMask(targetElement, step);
            } else {
                spotlight.classList.remove('has-mask');
            }

            targetElement.scrollIntoView({
                behavior: "smooth",
                block: step.scrollAlign || "center"
            });
        }

        updateBubbleContent(step.message, index < tourSteps.length - 1);

        if (index === tourSteps.length - 1) {
            bubble.classList.add('left');
        } else {
            bubble.classList.remove('left');
        }

        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => showStep(index + 1), { once: true });
        }
        const endTourBtn = document.getElementById('endTourBtn');
        if (endTourBtn) {
            endTourBtn.addEventListener('click', hideSpotlight, { once: true });
        }
    }

    // Switch page content in SPA fashion
    function switchPage(pageId) {
        mainContent.style.opacity = 0; // fade out
        setTimeout(() => {
            mainContent.innerHTML = pages[pageId] || "<p>Page not found.</p>";
            mainContent.style.opacity = 1; // fade in
        }, 300);

        sidebarItems.forEach((item) => {
            if (item.textContent.trim().toLowerCase() === pageId) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            } else {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            }
        });
    }

    // Show modal slide at index
    function showSlide(index) {
        if (!slides.length) return;
        const slide = slides[index];
        modalImage.src = slide.image;
        modalTitle.textContent = slide.title;
        modalDescription.innerHTML = slide.description;
    }

    // DOMContentLoaded event: set up everything
    window.addEventListener('DOMContentLoaded', () => {
        showSpotlight();
        // 🛑 Don't launch tour if on mobile
        if (window.innerWidth > 768) {
            showSpotlight();
            spotlight.classList.remove('has-mask');

            bubble.innerHTML = `
        <p>👋 Hi, I’m Charah! Welcome to my portfolio. I’ll give you a quick tour so you can see my work and what I do. Ready to explore?</p>
        <div class="bubble-buttons">
            <button id="startTourBtn" class="btn-bubble">Start Tour</button>
            <button id="skipTourBtn" class="btn-bubble">Skip</button>
        </div>
    `;

            document.getElementById('startTourBtn').addEventListener('click', () => {
                currentStep = 1;
                showStep(currentStep);
            });

            document.getElementById('skipTourBtn').addEventListener('click', hideSpotlight);
        }


        document.getElementById('startTourBtn').addEventListener('click', () => {
            currentStep = 1;
            showStep(currentStep);
        });

        document.getElementById('skipTourBtn').addEventListener('click', hideSpotlight);

        // Sidebar navigation clicks
        sidebarItems.forEach((item) => {
            item.addEventListener('click', () => {
                const targetPage = item.textContent.trim().toLowerCase();
                switchPage(targetPage);
            });
        });

        // Handle "View Project" buttons to open modal with slides
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn') && e.target.textContent.trim() === "View Project") {
                e.preventDefault();
                const slidesData = e.target.getAttribute('data-slides');
                if (!slidesData) {
                    // No slides data - just show modal empty
                    modal.style.display = 'block';
                    return;
                }
                try {
                    slides = JSON.parse(slidesData);
                } catch {
                    slides = [];
                }
                currentSlideIndex = 0;
                showSlide(currentSlideIndex);
                modal.style.display = 'block';
            }
        });

        // Modal navigation buttons
        nextBtn.addEventListener('click', () => {
            if (!slides.length) return;
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(currentSlideIndex);
        });

        prevBtn.addEventListener('click', () => {
            if (!slides.length) return;
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            showSlide(currentSlideIndex);
        });

        // Close modal with X button
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside content
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handle "View All Projects" button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-view-projects')) {
                e.preventDefault();
                switchPage('projects');
            }
        });

        // Toggle sidebar on hamburger click (mobile)
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const sidebar = document.querySelector('.sidebar');

        if (hamburgerBtn && sidebar) {
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });

            // Optional: hide sidebar when clicking a link (for smoother UX)
            sidebarItems.forEach(item => {
                item.addEventListener('click', () => {
                    sidebar.classList.remove('open');
                });
            });
        }

    });
    document.body.addEventListener('click', e => {
        // only run if the home slider exists
        const slides = Array.from(document.querySelectorAll('.project-slider .slide'));
        if (!slides.length) return;

        // next
        if (e.target.matches('.next-slide')) {
            let idx = slides.findIndex(s => s.classList.contains('active'));
            idx = (idx + 1) % slides.length;
            slides.forEach((s, i) => s.classList.toggle('active', i === idx));
        }

        // prev
        if (e.target.matches('.prev-slide')) {
            let idx = slides.findIndex(s => s.classList.contains('active'));
            idx = (idx - 1 + slides.length) % slides.length;
            slides.forEach((s, i) => s.classList.toggle('active', i === idx));
        }
    });
})();
