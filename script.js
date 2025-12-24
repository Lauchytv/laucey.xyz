let hasUserInteracted = false;

function initMedia() {
    const backgroundMusic = document.getElementById('background-music');
    const backgroundVideo = document.getElementById('background');
    if (!backgroundMusic || !backgroundVideo) return;
    
    backgroundMusic.volume = 0.3;
    backgroundVideo.muted = true; 
}

document.addEventListener('DOMContentLoaded', () => {
    initMedia();

    const startScreen = document.getElementById('start-screen');
    const startText = document.getElementById('start-text');
    const profileName = document.getElementById('profile-name');
    const profileBio = document.getElementById('profile-bio');
    const visitorCount = document.getElementById('visitor-count');
    
    const backgroundMusic = document.getElementById('background-music');
    const volumeSlider = document.getElementById('volume-slider');
    const transparencySlider = document.getElementById('transparency-slider');
    
    const backgroundVideo = document.getElementById('background');
    const profileBlock = document.getElementById('profile-block');
    const skillsBlock = document.getElementById('skills-block');
    const cursor = document.querySelector('.custom-cursor');
    const topControls = document.querySelector('.top-controls');

    function handleTilt(e, element) {
        if (!element || window.getComputedStyle(element).display === 'none' || window.getComputedStyle(element).opacity === "0") return;
        
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 50; 
        const rotateY = (centerX - x) / 50;
        
        gsap.to(element, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000
        });
    }

    function resetTilt(element) {
        gsap.to(element, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    function startExperience() {
        if (hasUserInteracted) return;
        hasUserInteracted = true;
        startScreen.classList.add('hidden');

        backgroundMusic.muted = false;
        backgroundMusic.play().catch(err => console.error("Audio error:", err));
        backgroundVideo.play();

        const resultsBtnContainer = document.getElementById('results-button-container');
        if (resultsBtnContainer) {
            resultsBtnContainer.classList.remove('hidden');
            gsap.to(resultsBtnContainer, { 
                opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power2.out',
                onStart: () => { resultsBtnContainer.style.pointerEvents = 'all'; }
            });
        }

        gsap.fromTo(profileBlock, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
        if(visitorCount) visitorCount.textContent = (777).toLocaleString('de-DE');
        
        typeWriterName();
        typeWriterBio();
    }

    startScreen.addEventListener('click', startExperience);

    const nameStr = "Laucey";
    let nameIndex = 0;
    function typeWriterName() {
        if (nameIndex <= nameStr.length) {
            profileName.textContent = nameStr.slice(0, nameIndex) + '|';
            nameIndex++;
            setTimeout(typeWriterName, 200);
        }
    }

    const bioMessages = ["You forget a thousand things every day ~Bilal", "\"Owner of Jostar Service!\""];
    let bioMsgIdx = 0;
    function typeWriterBio() {
        let msg = bioMessages[bioMsgIdx];
        let i = 0;
        const interval = setInterval(() => {
            profileBio.textContent = msg.slice(0, i) + '|';
            i++;
            if (i > msg.length) {
                clearInterval(interval);
                setTimeout(() => {
                    bioMsgIdx = (bioMsgIdx + 1) % bioMessages.length;
                    typeWriterBio();
                }, 3000);
            }
        }, 100);
    }

    const viewResultsBtn = document.getElementById('results-theme');

    if (viewResultsBtn && skillsBlock) {
        viewResultsBtn.addEventListener('click', () => {
            const isHidden = skillsBlock.classList.contains('hidden') || window.getComputedStyle(skillsBlock).display === 'none';

            if (isHidden) {
                gsap.to(profileBlock, { opacity: 0, y: -30, duration: 0.5, ease: "power2.inOut" });
                
                if (topControls) gsap.to(topControls, { y: 80, duration: 0.3, ease: "power2.out" });

                skillsBlock.classList.remove('hidden');
                skillsBlock.style.display = 'block';
                gsap.set(".skill-progress", { width: "0%" });

                gsap.fromTo(skillsBlock, 
                    { opacity: 0, scale: 0.9, y: 50 }, 
                    { opacity: 1, scale: 1, y: 0, duration: 0.7, delay: 0.2, ease: "back.out(1.7)" }
                );

                const skillsData = [
                    { id: "#chatgpt-bar", target: 100 },
                    { id: "#python-bar", target: 78 },
                    { id: "#cpp-bar", target: 13 },
                    { id: "#lua-bar", target: 89 },
                    { id: "#js-bar", target: 87 }
                ];

                skillsData.forEach((skill, index) => {
                    const barElement = document.querySelector(skill.id);
                    if (barElement) {
                        gsap.to(skill.id, { width: skill.target + "%", duration: 1.5, ease: "power2.out", delay: 0.5 + (index * 0.1) });
                        const percentSpan = barElement.closest('.skill-item').querySelector('.skill-percentage');
                        let counter = { val: 0 };
                        gsap.to(counter, {
                            val: skill.target, duration: 1.5, delay: 0.5 + (index * 0.1),
                            onUpdate: () => { percentSpan.innerText = Math.floor(counter.val) + "%"; }
                        });
                    }
                });
            } else {
                gsap.to(skillsBlock, { 
                    opacity: 0, scale: 0.9, y: 50, duration: 0.4, 
                    onComplete: () => {
                        skillsBlock.classList.add('hidden');
                        skillsBlock.style.display = 'none';
                        gsap.to(profileBlock, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
                        
                        if (topControls) gsap.to(topControls, { y: 0, duration: 0.3, ease: "power2.out" });
                    }
                });
            }
        });
    }

    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
        handleTilt(e, profileBlock);
        handleTilt(e, skillsBlock);
    });

    document.addEventListener('mouseleave', () => {
        resetTilt(profileBlock);
        resetTilt(skillsBlock);
    });

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => { backgroundMusic.volume = volumeSlider.value; });
    }
    if (transparencySlider) {
        transparencySlider.addEventListener('input', () => { backgroundVideo.style.opacity = transparencySlider.value; });
    }

    const startMsg = "Click here to enter...";
    let sIdx = 0;
    function typeWriterStart() {
        if (sIdx < startMsg.length) {
            startText.textContent = startMsg.slice(0, sIdx + 1) + '|';
            sIdx++;
            setTimeout(typeWriterStart, 100);
        }
    }
    typeWriterStart();

});


