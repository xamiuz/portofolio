document.addEventListener("DOMContentLoaded", () => {
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
    if (!rawData) return;
    
    currentTitle = element.getAttribute('data-title') || "";
    currentDesc = element.getAttribute('data-desc') || "";
    const rawTags = element.getAttribute('data-tags');
    currentTags = rawTags ? rawTags.split(',') : [];
    
    currentMediaList = JSON.parse(rawData);
    if (currentMediaList.length === 0) return;

    currentMediaIndex = 0;
    document.getElementById('lightbox').style.display = "block";
    updateLightboxContent();
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
    document.getElementById('lightbox-content').innerHTML = ""; // Stop video playback
}

function changeSlide(n) {
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
    const media = currentMediaList[currentMediaIndex];
    const contentDiv = document.getElementById('lightbox-content');
    const indicatorsDiv = document.getElementById('lightbox-indicators');
    
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
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
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
