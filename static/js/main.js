document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    const sunIcon = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
    const moonIcon = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeIcon) {
        themeIcon.innerHTML = savedTheme === 'light' ? moonIcon : sunIcon;
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (themeIcon) {
                themeIcon.innerHTML = newTheme === 'light' ? moonIcon : sunIcon;
            }
        });
    }

    const reveals = document.querySelectorAll(".reveal");

    const revealOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(
        entries,
        observer
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    },
    revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Project Filtering Logic
    const filterContainer = document.getElementById('project-filters');
    const projectItems = document.querySelectorAll('#projects .masonry-item');
    
    if (filterContainer && projectItems.length > 0) {
        let tagCounts = {};
        
        projectItems.forEach(item => {
            const rawTags = item.getAttribute('data-tags');
            if (rawTags) {
                rawTags.split(',').forEach(tag => {
                    const t = tag.trim();
                    if (t) {
                        tagCounts[t] = (tagCounts[t] || 0) + 1;
                    }
                });
            }
        });
        
        const tagsArray = Object.keys(tagCounts);
        if (tagsArray.length > 0) {
            let filterHtml = `<button class="filter-btn active" data-filter="all">Semua <span class="tag-count">${projectItems.length}</span></button>`;
            tagsArray.forEach(tag => {
                filterHtml += `<button class="filter-btn" data-filter="${tag}">${tag} <span class="tag-count">${tagCounts[tag]}</span></button>`;
            });
            filterContainer.innerHTML = filterHtml;
            
            // Add click events
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const filterValue = btn.getAttribute('data-filter');
                    
                    projectItems.forEach(item => {
                        item.classList.remove('filter-show'); // Reset animation
                        
                        let shouldShow = false;
                        if (filterValue === 'all') {
                            shouldShow = true;
                        } else {
                            const itemTags = item.getAttribute('data-tags') || "";
                            const tagsArray = itemTags.split(',').map(t => t.trim());
                            if (tagsArray.includes(filterValue)) {
                                shouldShow = true;
                            }
                        }
                        
                        if (shouldShow) {
                            item.style.display = 'block';
                            // Trigger reflow to restart animation
                            void item.offsetWidth;
                            item.classList.add('filter-show');
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        }
    }
});

// Lightbox Logic
let currentMediaIndex = 0;
let currentMediaList = [];
let currentTitle = "";
let currentDesc = "";
let currentTags = [];

function openLightbox(element) {
    const rawData = element.getAttribute('data-media');
    
    currentTitle = element.getAttribute('data-title') || "";
    currentDesc = element.getAttribute('data-desc') || "";
    const rawTags = element.getAttribute('data-tags');
    currentTags = rawTags ? rawTags.split(',') : [];
    
    currentMediaList = rawData ? JSON.parse(rawData) : [];

    currentMediaIndex = 0;
    document.getElementById('lightbox').style.display = "block";
    updateLightboxContent();
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
    document.getElementById('lightbox-content').innerHTML = ""; // Stop video playback
}

function changeSlide(n) {
    if (currentMediaList.length === 0) return;
    currentMediaIndex += n;
    if (currentMediaIndex >= currentMediaList.length) {
        currentMediaIndex = 0;
    }
    if (currentMediaIndex < 0) {
        currentMediaIndex = currentMediaList.length - 1;
    }
    updateLightboxContent();
}

function updateLightboxContent() {
    const contentDiv = document.getElementById('lightbox-content');
    const indicatorsDiv = document.getElementById('lightbox-indicators');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    if (currentMediaList.length > 0) {
        const media = currentMediaList[currentMediaIndex];
        
        // Build content
        if (media.type === 'video') {
            let videoUrl = media.url;
            
            // Cek apakah ini link Google Drive
            if (videoUrl.includes('drive.google.com')) {
                // Ubah /view menjadi /preview
                videoUrl = videoUrl.replace(/\/view.*$/, '/preview');
                contentDiv.innerHTML = `<iframe src="${videoUrl}" style="width:100%; height:100%; border:0; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.5);" allow="autoplay"></iframe>`;
            } 
            // Cek apakah YouTube
            else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                let videoId = "";
                if (videoUrl.includes('youtube.com/watch?v=')) {
                    videoId = videoUrl.split('v=')[1].split('&')[0];
                } else if (videoUrl.includes('youtu.be/')) {
                    videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
                }
                contentDiv.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" style="width:100%; height:100%; border:0; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.5);" allow="autoplay; fullscreen"></iframe>`;
            }
            // Video MP4 lokal
            else {
                contentDiv.innerHTML = `<video src="${videoUrl}" controls autoplay></video>`;
            }
        } else {
            contentDiv.innerHTML = `<img src="${media.url}" alt="Project Media">`;
        }

        // Hide arrows if only 1 item
        if (currentMediaList.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }

        // Build indicators
        let indicatorsHtml = "";
        for (let i = 0; i < currentMediaList.length; i++) {
            let activeClass = (i === currentMediaIndex) ? "active" : "";
            indicatorsHtml += `<span class="lightbox-indicator ${activeClass}" onclick="currentMediaIndex = ${i}; updateLightboxContent();"></span>`;
        }
        indicatorsDiv.innerHTML = indicatorsHtml;
    } else {
        contentDiv.innerHTML = "";
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        indicatorsDiv.innerHTML = "";
    }
    
    // Update title, desc, dan tags
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const tagsEl = document.getElementById('lightbox-tags');
    if (titleEl && descEl) {
        titleEl.textContent = currentTitle;
        descEl.textContent = currentDesc;
    }
    if (tagsEl) {
        let tagsHtml = "";
        currentTags.forEach(tag => {
            if (tag.trim() !== "") {
                tagsHtml += `<span class="badge">${tag.trim()}</span>`;
            }
        });
        tagsEl.innerHTML = tagsHtml;
    }
}

// === Full-Page Scroll Logic (Desktop Only) ===
document.addEventListener("DOMContentLoaded", () => {
    const sections = Array.from(document.querySelectorAll('section, footer'));
    if (sections.length === 0) return;

    let currentSectionIndex = 0;
    let isScrolling = false;
    
    // Circular Progress UI
    const progressCircle = document.querySelector('.progress-ring__circle');
    const radius = progressCircle ? progressCircle.r.baseVal.value : 0;
    const circumference = radius * 2 * Math.PI;
    
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }

    function setProgress(percent) {
        if (!progressCircle) return;
        const offset = circumference - percent / 100 * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }

    const circProgressBtn = document.getElementById('circular-progress');
    if (circProgressBtn) {
        circProgressBtn.addEventListener('click', () => {
            if (window.innerWidth >= 992) {
                if (currentSectionIndex > 0 && !isScrolling) {
                    scrollToSection(0); // go back to top
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    function initFullPageScroll() {
        if (window.innerWidth >= 992) {
            document.body.classList.add('fp-enabled');
            sections.forEach((sec, idx) => {
                sec.className = sec.className.replace(/fp-anim-[a-z-]+/g, '').trim();
                sec.classList.remove('fp-active');
                sec.style.transform = '';
            });
            sections[currentSectionIndex].classList.add('fp-active');
            updateProgress();
            triggerShine(currentSectionIndex);
        } else {
            document.body.classList.remove('fp-enabled');
            sections.forEach(sec => sec.style.transform = '');
        }
    }

    initFullPageScroll();
    window.addEventListener('resize', initFullPageScroll);

    function updateProgress() {
        const percent = (currentSectionIndex / (sections.length - 1)) * 100;
        setProgress(percent);
    }

    function triggerShine(index) {
        const section = sections[index];
        const title = section.querySelector('.cinematic-section-title');
        if (title) {
            title.classList.remove('shine-text');
            void title.offsetWidth; // trigger reflow
            title.classList.add('shine-text');
            
            setTimeout(() => {
                title.classList.remove('shine-text');
            }, 1500);
        }
    }

    // Define transition sequence
    const transitions = [
        { out: 'fp-anim-out-up', in: 'fp-anim-in-up', downOut: 'fp-anim-out-down', downIn: 'fp-anim-in-down' },
        { out: 'fp-anim-out-zoom', in: 'fp-anim-in-zoom', downOut: 'fp-anim-out-zoom', downIn: 'fp-anim-in-zoom' },
        { out: 'fp-anim-out-left', in: 'fp-anim-in-right', downOut: 'fp-anim-out-right', downIn: 'fp-anim-in-left' },
        { out: 'fp-anim-out-up', in: 'fp-anim-in-up', downOut: 'fp-anim-out-down', downIn: 'fp-anim-in-down' },
        { out: 'fp-anim-out-zoom', in: 'fp-anim-in-zoom', downOut: 'fp-anim-out-zoom', downIn: 'fp-anim-in-zoom' },
    ];
    
    // Define background transforms mapped to section index for synchronization
    const bgTransforms = [
        'translate(0, 0) scale(1)',                     // 0: Hero
        'translate(0, -5%) scale(1)',                   // 1: About
        'translate(0, -5%) scale(1.1)',                 // 2: Education
        'translate(-5%, -5%) scale(1.1)',               // 3: Experience
        'translate(-5%, -10%) scale(1.1)',              // 4: Awards
        'translate(-5%, -10%) scale(1.15)',             // 5: Projects
    ];

    window.addEventListener('wheel', (e) => {
        if (window.innerWidth < 992) return;
        
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display === 'flex') return;

        const scrollableDiv = e.target.closest('.scrollable-internal');
        if (scrollableDiv) {
            const isAtTop = scrollableDiv.scrollTop === 0;
            const isAtBottom = Math.abs(scrollableDiv.scrollHeight - scrollableDiv.clientHeight - scrollableDiv.scrollTop) <= 2;
            
            if (e.deltaY > 0 && !isAtBottom) return;
            if (e.deltaY < 0 && !isAtTop) return;
        }

        e.preventDefault(); 
        
        if (isScrolling) return;

        if (e.deltaY > 0) {
            if (currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        } else if (e.deltaY < 0) {
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    }, { passive: false });

    function scrollToSection(newIndex) {
        if (newIndex === currentSectionIndex) return;
        isScrolling = true;
        
        const currentSec = sections[currentSectionIndex];
        const nextSec = sections[newIndex];
        const isScrollingDown = newIndex > currentSectionIndex;
        
        // Use transition defined by the lower index
        const transIdx = Math.min(currentSectionIndex, newIndex) % transitions.length;
        const trans = transitions[transIdx];
        
        // Determine classes based on direction
        let outClass = isScrollingDown ? trans.out : trans.downOut;
        let inClass = isScrollingDown ? trans.in : trans.downIn;
        
        // Reset classes
        sections.forEach(sec => sec.className = sec.className.replace(/fp-anim-[a-z-]+/g, '').trim());
        
        // Setup incoming section
        nextSec.classList.add(inClass);
        
        // Force reflow
        void nextSec.offsetWidth;
        
        // Apply active and transition out
        currentSec.classList.add(outClass);
        currentSec.classList.remove('fp-active');
        
        nextSec.classList.add('fp-active');
        nextSec.classList.remove(inClass);
        
        currentSectionIndex = newIndex;
        updateProgress();
        
        // Sync background transition
        const bgLayer = document.getElementById('bg-layer');
        if (bgLayer && window.innerWidth >= 992) {
            bgLayer.style.transform = bgTransforms[currentSectionIndex % bgTransforms.length];
        }
        
        if (isScrollingDown) {
            triggerShine(currentSectionIndex);
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // matches CSS transition time
    }
    
    document.querySelectorAll('.nav-links a, .cta-group a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth < 992) return;
            const targetId = link.getAttribute('href').substring(1);
            const targetIndex = sections.findIndex(sec => sec.id === targetId);
            if (targetIndex !== -1) {
                e.preventDefault();
                scrollToSection(targetIndex);
            }
        });
    });
});

// === Interactive Particle Network Background ===
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Canvas covers 120vw / 120vh of bg-layer
    canvas.width = window.innerWidth * 1.2;
    canvas.height = window.innerHeight * 1.2;
    
    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height/8) * (canvas.width/8)
    };
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
        
        // Subtle Parallax for background ornaments
        const bgOrnaments = document.querySelector('.bg-ornaments');
        if (bgOrnaments) {
            const moveX = (event.x - window.innerWidth / 2) * -0.03;
            const moveY = (event.y - window.innerHeight / 2) * -0.03;
            bgOrnaments.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth * 1.2;
        canvas.height = window.innerHeight * 1.2;
        mouse.radius = ((canvas.height/8) * (canvas.width/8));
        initParticles();
    });
    
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            
            // Interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            // Move away from mouse slightly
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 1;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 1;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 1;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 1;
            }
            
            this.x += this.directionX * 0.7; // Speed factor
            this.y += this.directionY * 0.7;
            this.draw();
        }
    }
    
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 11000;
        if(numberOfParticles > 120) numberOfParticles = 120; // Cap to keep smooth
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1.5;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;
            
            // Mix of white and accent color
            let color = Math.random() > 0.85 ? 'rgba(229, 9, 20, 0.6)' : 'rgba(255, 255, 255, 0.3)';
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
    
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }
    
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width/8) * (canvas.height/8)) {
                    opacityValue = 1 - (distance/25000);
                    // Connection line color logic (faint)
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.12})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    initParticles();
    animateParticles();
});
