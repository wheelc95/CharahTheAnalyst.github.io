(() => {
    // Elements
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const mainContent = document.querySelector('.main-content');
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalSlideTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalSlideDescription');
    const closeModal = document.getElementById('closeModal');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');

    let scrollPosition = 0;
    let slides = [];
    let currentSlideIndex = 0;

    // Preserve Home content for SPA
    const homeHTML = mainContent.innerHTML;

    // SPA page templates
    const pages = {
        home: homeHTML,
        projects: `
      <header class="page-header">
        <p class="subtitle">Explore my work</p>
      </header>
      <section class="projects-grid">
        <div class="project-card">
          <img src="assets/images/us-job-market1.png" alt="Project 1 Screenshot">
          <h3>US Job Market and Education Overview (2023)</h3>
          <p>A Power BI dashboard for visualizing job market trends.</p>
          <a href="#" class="btn" data-slides='[
            { "image": "assets/images/us-job-market1.png","title": "US Job Market and Education Overview (2023)","description": "A comprehensive dashboard showing the overall health of the US job market with detailed educational attainment and unemployment rates."},
            {"image": "assets/images/us-job-market2.png","title": "US County Job Market Classification","description": "Visual map illustrating job market classifications by county, highlighting regions of concern, crisis, and stability. The bubble size indicate larger or smaller populations."},
            {"image": "assets/images/us-job-market3.png","title": "Education vs Unemployment Analysis","description": "Scatter plot depicting the relationship between adults with bachelor's degrees and unemployment rates across US counties."}
          ]'>View Project</a>
        </div>
        <div class="project-card">
          <img src="assets/images/lss1.png" alt="Project 2 Screenshot">
          <h3>Lean Six Sigma DMAIC Toolkit</h3>
          <p>A toolkit to streamline the DMAIC process.</p>
          <a href="#" class="btn" data-slides='[
            {"image":"assets/images/lss1.png","title":"Lean Six Sigma DMAIC Toolkit","description":"A Streamlit dashboard that walks you through every phase of Lean Six Sigma—Define, Measure, Analyze, Improve, and Control—using interactive modules like SIPOC, sigma calculator, Pareto charts, FMEA, and SPC charts. Generate visual insights and download reports at each step to drive data‑driven process improvements."},
            {"image":"assets/images/lss2.png","title":"Define Module: Project Charter","description":"Easily define your project’s name, scope, problem statement, goal, timeline, and team, then generate a polished Word charter in seconds—aligning stakeholders and setting clear success metrics from the start."},
            {"image":"assets/images/lss3.png","title":"Measure Module: Histogram/Boxplot","description":"Upload your data, pick a numeric variable, and instantly see its distribution and outliers side‑by‑side: a histogram for frequency patterns and a boxplot for spotting extreme values and spread. This quick visual check helps you understand your process variation at a glance."}
          ]'>View Project</a>
        </div>
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

    // Guided tour steps
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

    // Spotlight helpers
    function setSpotlightMask(target, opts = {}) {
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 + (opts.offsetX || 0);
        const cy = rect.top + rect.height / 2 + (opts.offsetY || 0);
        const r = opts.radius || Math.max(rect.width, rect.height) / 2 + 20;
        const ov = document.getElementById('spotlight');
        ov.style.setProperty('--spotlight-x', `${cx}px`);
        ov.style.setProperty('--spotlight-y', `${cy}px`);
        ov.style.setProperty('--spotlight-radius', `${r}px`);
    }
    function showSpotlight() {
        scrollPosition = window.scrollY;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('no-scroll');
        const ov = document.getElementById('spotlight');
        ov.style.display = 'block';
        ov.classList.add('active');
    }
    function hideSpotlight() {
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);
        const ov = document.getElementById('spotlight');
        ov.classList.remove('active', 'has-mask');
        setTimeout(() => ov.style.display = 'none', 500);
    }
    function updateBubble(msg, hasNext) {
        const bubble = document.querySelector('.speech-bubble');
        bubble.innerHTML = `
      <p>${msg}</p>
      <div class="bubble-buttons">
        ${hasNext
                ? '<button id="nextStepBtn" class="btn-bubble">Next</button>'
                : '<button id="endTourBtn" class="btn-bubble">Finish</button>'}
      </div>
    `;
    }
    function showStep(i) {
        if (i >= tourSteps.length) return hideSpotlight();
        const step = tourSteps[i];
        const el = document.querySelector(step.element);
        const ov = document.getElementById('spotlight');
        if (el) {
            if (step.element !== '.avatar-guide') {
                ov.classList.add('has-mask');
                setSpotlightMask(el, step);
            } else {
                ov.classList.remove('has-mask');
            }
            el.scrollIntoView({ behavior: 'smooth', block: step.scrollAlign });
        }
        updateBubble(step.message, i < tourSteps.length - 1);
        if (i === tourSteps.length - 1) document.querySelector('.speech-bubble').classList.add('left');
        const nextBtn = document.getElementById('nextStepBtn');
        if (nextBtn) nextBtn.addEventListener('click', () => showStep(i + 1), { once: true });
        const endBtn = document.getElementById('endTourBtn');
        if (endBtn) endBtn.addEventListener('click', hideSpotlight, { once: true });
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
        // 1) Tour only on desktop
        if (window.innerWidth > 768) {
            showSpotlight();
            document.getElementById('spotlight').classList.remove('has-mask');
            document.querySelector('.speech-bubble').innerHTML = `
        <p>👋 Hi, I’m Charah! Welcome to my portfolio. Ready to explore?</p>
        <div class="bubble-buttons">
          <button id="startTourBtn" class="btn-bubble">Start Tour</button>
          <button id="skipTourBtn" class="btn-bubble">Skip</button>
        </div>
      `;
            document.getElementById('startTourBtn').addEventListener('click', () => showStep(1));
            document.getElementById('skipTourBtn').addEventListener('click', hideSpotlight);
        }

        // 2) Home slider
        const slidesEls = document.querySelectorAll('.project-slider .slide');
        let sidx = 0;
        function showHome(i) {
            slidesEls.forEach((s, j) => s.classList.toggle('active', j === i));
        }
        document.querySelector('.next-slide').addEventListener('click', () => showHome(sidx = (sidx + 1) % slidesEls.length));
        document.querySelector('.prev-slide').addEventListener('click', () => showHome(sidx = (sidx - 1 + slidesEls.length) % slidesEls.length));

        // 3) SPA navigation
        sidebarItems.forEach(it => {
            it.addEventListener('click', () => {
                const pg = it.textContent.trim().toLowerCase();
                mainContent.style.opacity = 0;
                setTimeout(() => {
                    mainContent.innerHTML = pages[pg] || '<p>Page not found.</p>';
                    mainContent.style.opacity = 1;
                }, 300);
                sidebarItems.forEach(si => si.classList.toggle('active', si === it));
            });
        });

        // 4) Modal logic
        document.body.addEventListener('click', e => {
            if (e.target.matches('.btn') && e.target.textContent.trim() === 'View Project') {
                e.preventDefault();
                try { slides = JSON.parse(e.target.getAttribute('data-slides')); }
                catch { slides = []; }
                currentSlideIndex = 0;
                if (slides.length) {
                    modalImage.src = slides[0].image;
                    modalTitle.textContent = slides[0].title;
                    modalDescription.innerHTML = slides[0].description;
                    modal.style.display = 'block';
                }
            }
            if (e.target.matches('.btn-view-projects')) {
                e.preventDefault();
                sidebarItems[1].click(); // projects tab
            }
            if (e.target === modal) modal.style.display = 'none';
        });
        nextBtn.addEventListener('click', () => {
            if (!slides.length) return;
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            modalImage.src = slides[currentSlideIndex].image;
            modalTitle.textContent = slides[currentSlideIndex].title;
            modalDescription.innerHTML = slides[currentSlideIndex].description;
        });
        prevBtn.addEventListener('click', () => {
            if (!slides.length) return;
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            modalImage.src = slides[currentSlideIndex].image;
            modalTitle.textContent = slides[currentSlideIndex].title;
            modalDescription.innerHTML = slides[currentSlideIndex].description;
        });
        closeModal.addEventListener('click', () => modal.style.display = 'none');

        // 5) Hamburger toggle
        if (hamburgerBtn && sidebar) {
            hamburgerBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
            sidebarItems.forEach(si => si.addEventListener('click', () => sidebar.classList.remove('open')));
        }
    });
})();
