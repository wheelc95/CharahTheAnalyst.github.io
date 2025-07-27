(() => {
    // ———————— grab all the bits ————————
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const mainContent = document.querySelector('.main-content');

    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalSlideTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalSlideDescription');
    const closeModal = document.getElementById('closeModal');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');

    const spotlight = document.getElementById('spotlight');
    const bubble = document.querySelector('.speech-bubble');

    let scrollPosition = 0;
    let slides = [];
    let currentSlideIndex = 0;

    // preserve original Home markup for SPA “back to Home”
    const homeHTML = mainContent.innerHTML;

    // —————— SPA page templates ——————
    const pages = {
        home: homeHTML,

        projects: `
      <header class="page-header">
        <p class="subtitle">Explore my work</p>
      </header>
      <section class="projects-grid">
        <!-- 1st card: US Job Market -->
        <div class="project-card">
          <img src="assets/images/us-job-market1.png" alt="Project 1 Screenshot">
          <h3>US Job Market &amp; Education Overview (2023)</h3>
          <p>A Power BI dashboard for visualizing job market trends.</p>
          <!-- make sure this JSON is valid and uses straight quotes -->
          <a href="#" class="btn" data-slides='[
            {"image":"assets/images/us-job-market1.png","title":"US Job Market & Education Overview (2023)","description":"A comprehensive dashboard showing the overall health of the US job market with detailed educational attainment and unemployment rates."},
            {"image":"assets/images/us-job-market2.png","title":"US County Job Market Classification","description":"Visual map illustrating job market classifications by county, highlighting regions of concern, crisis, and stability."},
            {"image":"assets/images/us-job-market3.png","title":"Education vs Unemployment Analysis","description":"Scatter plot depicting the relationship between adults with bachelor’s degrees and unemployment rates across US counties."}
          ]'>View Project</a>
        </div>

        <!-- 2nd card: Lean Six Sigma -->
        <div class="project-card">
          <img src="assets/images/lss1.png" alt="Project 2 Screenshot">
          <h3>Lean Six Sigma DMAIC Toolkit</h3>
          <p>A toolkit to streamline the DMAIC process.</p>
          <a href="#" class="btn" data-slides='[
            {"image":"assets/images/lss1.png","title":"Lean Six Sigma DMAIC Toolkit","description":"A Streamlit dashboard that walks you through every phase of Lean Six Sigma—Define, Measure, Analyze, Improve, and Control—using interactive modules like SIPOC, Pareto charts, FMEA, and SPC charts."},
            {"image":"assets/images/lss2.png","title":"Define Module: Project Charter","description":"Define your project’s scope, problem statement, goal, team and generate a polished Word charter in seconds."},
            {"image":"assets/images/lss3.png","title":"Measure Module: Histogram & Boxplot","description":"Upload your data, pick a variable, and instantly see its distribution and outliers side‑by‑side."}
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
            <p>I’m a data analyst and developer who combines analytics expertise with custom-built tools to uncover insights and deliver practical solutions.</p>
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
            <input id="name" name="name" type="text" placeholder="Your Name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" placeholder="Your message..." required></textarea>
          </div>
          <button type="submit" class="btn">Send Message</button>
        </form>
      </section>
    `
    };

    // —————— Guided‑tour steps (desktop only) ——————
    const tourSteps = [
        { element: '.avatar-guide', message: "👋 Hi, I’m Charah! Let me guide you through my portfolio.", radius: 250, offsetX: -200, offsetY: -50, scrollAlign: 'center' },
        { element: '.sidebar-menu', message: "📂 Use this menu to navigate sections.", radius: 200, offsetX: -20, offsetY: -30, scrollAlign: 'start' },
        { element: '.toolkit-list', message: "🛠 These are my daily tools.", radius: 180, offsetX: 0, offsetY: -10, scrollAlign: 'center' },
        { element: '.btn-download', message: "📄 Download my resume here.", radius: 180, offsetX: 0, offsetY: 20, scrollAlign: 'center' },
        { element: '.social-media', message: "🌐 Connect on LinkedIn, GitHub, YouTube & TikTok.", radius: 160, offsetX: 0, offsetY: -10, scrollAlign: 'start' },
        { element: '.project-slider', message: "🎯 Featured projects live here.", radius: 500, offsetX: 0, offsetY: 0, scrollAlign: 'center' }
    ];

    // —————— Spotlight helpers ——————
    function setSpotlightMask(target, opts = {}) {
        const r = target.getBoundingClientRect();
        const cx = r.left + r.width / 2 + (opts.offsetX || 0);
        const cy = r.top + r.height / 2 + (opts.offsetY || 0);
        const radius = opts.radius || Math.max(r.width, r.height) / 2 + 20;
        spotlight.style.setProperty('--spotlight-x', `${cx}px`);
        spotlight.style.setProperty('--spotlight-y', `${cy}px`);
        spotlight.style.setProperty('--spotlight-radius', `${radius}px`);
    }
    function showSpotlight() {
        scrollPosition = window.scrollY;
        document.body.classList.add('no-scroll');
        document.body.style.top = `-${scrollPosition}px`;
        spotlight.style.display = 'block';
        spotlight.classList.add('active');
    }
    function hideSpotlight() {
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);
        spotlight.classList.remove('active', 'has-mask');
        setTimeout(() => spotlight.style.display = 'none', 500);
    }
    function updateBubble(msg, hasNext) {
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
        const st = tourSteps[i];
        const el = document.querySelector(st.element);
        if (el) {
            if (st.element !== '.avatar-guide') {
                spotlight.classList.add('has-mask');
                setSpotlightMask(el, st);
            } else {
                spotlight.classList.remove('has-mask');
            }
            el.scrollIntoView({ behavior: 'smooth', block: st.scrollAlign });
        }
        updateBubble(st.message, i < tourSteps.length - 1);
        const nb = document.getElementById('nextStepBtn');
        const eb = document.getElementById('endTourBtn');
        if (nb) nb.addEventListener('click', () => showStep(i + 1), { once: true });
        if (eb) eb.addEventListener('click', hideSpotlight, { once: true });
    }

    // —————— initialize after DOM ready ——————
    window.addEventListener('DOMContentLoaded', () => {
        // 1) Guided tour (desktop only)
        if (window.innerWidth > 768 && spotlight) {
            showSpotlight();
            bubble.innerHTML = `
        <p>👋 Hi, I’m Charah! Welcome to my portfolio. Ready to explore?</p>
        <div class="bubble-buttons">
          <button id="startTourBtn" class="btn-bubble">Start Tour</button>
          <button id="skipTourBtn"  class="btn-bubble">Skip</button>
        </div>
      `;
            document.getElementById('startTourBtn')
                .addEventListener('click', () => showStep(1));
            document.getElementById('skipTourBtn')
                .addEventListener('click', hideSpotlight);
        }

        // 2) Homepage slider arrows
        document.querySelectorAll('.prev-slide, .next-slide').forEach(btn => {
            btn.addEventListener('click', () => {
                const all = Array.from(document.querySelectorAll('.project-slider .slide'));
                let idx = all.findIndex(s => s.classList.contains('active'));
                if (btn.classList.contains('next-slide')) idx = (idx + 1) % all.length;
                else idx = (idx - 1 + all.length) % all.length;
                all.forEach((s, i) => s.classList.toggle('active', i === idx));
            });
        });

        // 3) SPA sidebar navigation
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const key = item.textContent.trim().toLowerCase();
                mainContent.style.opacity = 0;
                setTimeout(() => {
                    mainContent.innerHTML = pages[key] || '<p>Page not found.</p>';
                    mainContent.style.opacity = 1;
                }, 300);
                sidebarItems.forEach(si => si.classList.toggle('active', si === item));
                sidebar.classList.remove('open');
            });
        });

        // 4) Modal open/close delegation
        document.body.addEventListener('click', e => {
            // open
            if (e.target.matches('.btn') && e.target.textContent.trim() === 'View Project') {
                e.preventDefault();
                try { slides = JSON.parse(e.target.dataset.slides) }
                catch { slides = [] }
                currentSlideIndex = 0;
                if (slides.length) {
                    modalImage.src = slides[0].image;
                    modalTitle.textContent = slides[0].title;
                    modalDesc.innerHTML = slides[0].description;
                    modal.classList.add('active');
                }
            }
            // “View All Projects”
            if (e.target.matches('.btn-view-projects')) {
                e.preventDefault();
                sidebarItems[1].click();
            }
            // click outside
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // 5) Modal arrows & close‑btn
        nextBtn.addEventListener('click', () => {
            if (!slides.length) return;
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            modalImage.src = slides[currentSlideIndex].image;
            modalTitle.textContent = slides[currentSlideIndex].title;
            modalDesc.innerHTML = slides[currentSlideIndex].description;
        });
        prevBtn.addEventListener('click', () => {
            if (!slides.length) return;
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            modalImage.src = slides[currentSlideIndex].image;
            modalTitle.textContent = slides[currentSlideIndex].title;
            modalDesc.innerHTML = slides[currentSlideIndex].description;
        });
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // 6) Hamburger menu (mobile)
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
    });
})();
