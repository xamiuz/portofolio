document.addEventListener("DOMContentLoaded", () => {
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
});

// Lightbox Logic
let currentMediaIndex = 0;
let currentMediaList = [];

function openLightbox(element) {
    const rawData = element.getAttribute('data-media');
    if (!rawData) return;
    
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
            contentDiv.innerHTML = `<iframe src="${videoUrl}" width="100%" height="80vh" style="border:0; border-radius:8px; min-width:600px; min-height:400px;" allow="autoplay"></iframe>`;
        } 
        // Cek apakah YouTube
        else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            let videoId = "";
            if (videoUrl.includes('youtube.com/watch?v=')) {
                videoId = videoUrl.split('v=')[1].split('&')[0];
            } else if (videoUrl.includes('youtu.be/')) {
                videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
            }
            contentDiv.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" width="100%" height="80vh" style="border:0; border-radius:8px; min-width:600px; min-height:400px;" allow="autoplay; fullscreen"></iframe>`;
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
}
