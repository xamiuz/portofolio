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
        contentDiv.innerHTML = `<video src="${media.url}" controls autoplay></video>`;
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
