document.addEventListener('DOMContentLoaded', () => {
    // Auto-Active Navbar Links
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
            link.classList.add('active');
            
            // If it's a dropdown item, also highlight the parent dropdown toggle
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const toggle = parentDropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        }
    });

    // Theme Toggle Logic
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-bs-theme', currentTheme);
    updateThemeIcons(currentTheme);

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-bs-theme');
            const target = current === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-bs-theme', target);
            localStorage.setItem('theme', target);
            updateThemeIcons(target);
        });
    });

    function updateThemeIcons(theme) {
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'bi bi-moon-stars' : 'bi bi-sun';
            }
        });
    }

    // RTL Toggle Logic
    const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    const currentDir = localStorage.getItem('direction') || 'ltr';
    
    function updateRtlButtonText(dir) {
        rtlToggleBtns.forEach(btn => {
            btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        });
    }
    
    document.documentElement.setAttribute('dir', currentDir);
    if(currentDir === 'rtl') {
        loadRTLStyles();
    }
    updateRtlButtonText(currentDir);

    rtlToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = document.documentElement.getAttribute('dir');
            const target = current === 'ltr' ? 'rtl' : 'ltr';
            
            document.documentElement.setAttribute('dir', target);
            localStorage.setItem('direction', target);
            updateRtlButtonText(target);
            
            if(target === 'rtl') {
                loadRTLStyles();
            } else {
                removeRTLStyles();
            }
        });
    });

    function loadRTLStyles() {
        if(!document.getElementById('rtl-css')) {
            const link = document.createElement('link');
            link.id = 'rtl-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';
            const customStyles = document.querySelector('link[href="assets/css/style.css"]');
            if(customStyles) {
                document.head.insertBefore(link, customStyles);
            } else {
                document.head.appendChild(link);
            }
        }
    }

    function removeRTLStyles() {
        const rtlCss = document.getElementById('rtl-css');
        if(rtlCss) rtlCss.remove();
    }

    // Navbar scroll effect
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Animated Counters
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length > 0) {
        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / 200;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(animateCounters, 10);
                } else {
                    counter.innerText = target;
                }
            });
        };

        // Trigger on scroll using IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
        
        observer.observe(counters[0]);
    }

    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Form Validation Simulation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault(); // Prevent real submission
                const successModal = document.getElementById('successModal');
                if (successModal) {
                    const modal = new bootstrap.Modal(successModal);
                    modal.show();
                } else {
                    alert('Form submitted successfully!');
                }
                form.reset();
                form.classList.remove('was-validated');
                return;
            }
            form.classList.add('was-validated');
        }, false);
    });
});

    // Newsletter Subscription Popup
    const subscribeForm = document.getElementById('subscribeForm');
    if(subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop page reload
            
            // Create modal HTML
            const modalHtml = `
            <div class="modal fade" id="subscribeModal" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                  <div class="modal-header border-0 bg-smoke-purple">
                    <h5 class="modal-title fw-bold text-dark"><i class="bi bi-check-circle-fill text-success me-2"></i>Subscribed!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-center py-4">
                    <p class="lead mb-0 text-dark">Thank you for subscribing to our newsletter! You'll receive our latest tips and updates soon.</p>
                  </div>
                  <div class="modal-footer border-0 justify-content-center bg-body-tertiary">
                    <button type="button" class="btn btn-primary px-4 rounded-pill" data-bs-dismiss="modal">Awesome</button>
                  </div>
                </div>
              </div>
            </div>`;
            
            // Remove old modal if exists
            const oldModal = document.getElementById('subscribeModal');
            if(oldModal) oldModal.remove();
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modalElement = document.getElementById('subscribeModal');
            const bsModal = new bootstrap.Modal(modalElement);
            bsModal.show();
            
            subscribeForm.reset();
        });
    }

    // Program Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const programItems = document.querySelectorAll('.program-item');

    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state styling
                filterBtns.forEach(b => {
                    b.classList.remove('btn-primary', 'active');
                    b.classList.add('btn-outline-primary');
                });
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary', 'active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide items
                programItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.classList.remove('d-none');
                    } else {
                        item.classList.add('d-none');
                    }
                });
            });
        });
    }

    // Blog Filtering & Search Logic
    const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
    const blogItems = document.querySelectorAll('.blog-item');
    const blogSearchInput = document.getElementById('blogSearchInput');

    function filterBlogs() {
        const activeBtn = document.querySelector('.blog-filter-btn.active');
        const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
        const searchQuery = blogSearchInput ? blogSearchInput.value.toLowerCase() : '';

        blogItems.forEach(item => {
            const matchesFilter = filterValue === 'all' || item.classList.contains(filterValue);
            
            // Search in title and excerpt
            const title = item.querySelector('.card-title').innerText.toLowerCase();
            const excerptEl = item.querySelector('.card-text') || item.querySelector('.text-muted.flex-grow-1');
            const excerpt = excerptEl ? excerptEl.innerText.toLowerCase() : '';
            const matchesSearch = title.includes(searchQuery) || excerpt.includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                item.classList.remove('d-none');
            } else {
                item.classList.add('d-none');
            }
        });
    }

    if(blogFilterBtns.length > 0) {
        blogFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                blogFilterBtns.forEach(b => {
                    b.classList.remove('btn-primary', 'active');
                    b.classList.add('btn-outline-primary');
                });
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary', 'active');
                
                filterBlogs();
            });
        });
    }

    if(blogSearchInput) {
        blogSearchInput.addEventListener('keyup', filterBlogs);
    }
