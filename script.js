document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM yüklendi, script başlıyor.");
    const githubUsername = 'Adil-Can-Kural'; // Kullanıcı adını kontrol et
    console.log("Kullanılacak GitHub kullanıcı adı:", githubUsername);

    // Element Seçimleri
    const profileInfoContainer = document.getElementById('profile-info');
    const projectsListContainer = document.getElementById('projects-list');
    const animatedElements = document.querySelectorAll('.animate-on-load');
    const jokerMask = document.getElementById('joker-mask');

    if (!profileInfoContainer) console.error("HATA: profile-info elementi bulunamadı!");
    if (!projectsListContainer) console.error("HATA: projects-list elementi bulunamadı!");
    if (!jokerMask) console.warn("UYARI: joker-mask elementi bulunamadı!");

    // Fare Takibi ve Maske için Değişkenler
    let idleTimer = null;
    const idleDelay = 5000; // 5 saniye hareketsizlik
    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;
    const maskOffsetX = 25;
    const maskOffsetY = -25;

    // --- Glitch Efekti Zamanlama Sabitleri ---
    const initialGlitchDelay = 1000;    // Glitch'in hover'dan ne kadar sonra başlayacağı (ms)
    const glitchRepeatInterval = 2500;  // Tekrarlama aralığı (ms)
    // DİKKAT: glitchDuration, simple-pulse animasyonunun süresiyle eşleşmeli (0.5s = 500ms)
    const glitchDuration = 350;

    // --- Joker Maskesi Fonksiyonları ---
    function showJokerMask() {
        if (jokerMask) {
            jokerMask.style.left = `${lastMouseX + maskOffsetX}px`;
            jokerMask.style.top = `${lastMouseY + maskOffsetY}px`;
            jokerMask.classList.remove('hidden');
            jokerMask.classList.add('visible');
        }
    }

    function hideJokerMask() {
         if (jokerMask && jokerMask.classList.contains('visible')) {
            jokerMask.classList.remove('visible');
            jokerMask.classList.add('hidden');
        }
    }

    // --- Fare Hareketsizliği ve Konum Takibi ---
    function resetIdleTimer(event) {
        if (event && event.type === 'mousemove') {
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            if (jokerMask && jokerMask.classList.contains('visible')) {
                 jokerMask.style.left = `${lastMouseX + maskOffsetX}px`;
                 jokerMask.style.top = `${lastMouseY + maskOffsetY}px`;
            }
        }
        hideJokerMask();
        clearTimeout(idleTimer);
        idleTimer = setTimeout(showJokerMask, idleDelay);
    }

    function setupIdleDetection() {
        window.addEventListener('mousemove', resetIdleTimer, false);
        const resetOnly = () => { clearTimeout(idleTimer); hideJokerMask(); idleTimer = setTimeout(showJokerMask, idleDelay); };
        window.addEventListener('mousedown', resetOnly, false);
        window.addEventListener('keypress', resetOnly, false);
        window.addEventListener('scroll', resetOnly, false);
        window.addEventListener('touchstart', resetOnly, false);
        window.addEventListener('touchmove', resetOnly, false);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(showJokerMask, idleDelay);
    }

    // --- Glitch Efekti Mantığı ---

    // Tek bir glitch'i tetikleyen fonksiyon (GÜNCELLENDİ: reflow ve clip-path reset kaldırıldı)
    function triggerSingleGlitch(cardElement) {
        if (!cardElement || cardElement.classList.contains('is-glitching')) {
            return;
        }
        // console.log("Glitch triggered on:", cardElement.querySelector('h3 a')?.textContent);
        cardElement.classList.remove('card-hovered'); // Normal hover'ı glitch sırasında kaldır
        cardElement.classList.add('is-glitching');

        // GEREKSİZ: Reflow trigger kaldırıldı
        // void cardElement.offsetHeight;

        // Glitch animasyonu bittiğinde sınıfı kaldır (Süre CSS ile eşleşmeli)
        setTimeout(() => {
            cardElement.classList.remove('is-glitching');
            // GEREKSİZ: clip-path reset kaldırıldı
            // cardElement.style.clipPath = 'none';

            // Glitch bittikten SONRA, eğer fare HALA kartın üzerindeyse normal hover'ı GERİ EKLE
            if (cardElement.dataset.isMouseOver === 'true') {
                 cardElement.classList.add('card-hovered');
                 // console.log("Glitch ended, hover restored for:", cardElement.querySelector('h3 a')?.textContent);
            }
        }, glitchDuration); // Sürenin CSS ile aynı olduğundan emin ol (500ms)
    }

    // Fare karta girdiğinde çalışacak fonksiyon (Değişiklik yok)
    function handleCardMouseEnter(event) {
        const card = event.currentTarget;
        card.dataset.isMouseOver = 'true';
        card.classList.add('card-hovered');

        clearTimeout(parseInt(card.dataset.initialGlitchTimeoutId || '0'));
        clearInterval(parseInt(card.dataset.repeatingGlitchIntervalId || '0'));
        delete card.dataset.initialGlitchTimeoutId;
        delete card.dataset.repeatingGlitchIntervalId;

        const initialTimeoutId = setTimeout(() => {
            if (card.dataset.isMouseOver === 'true') {
                triggerSingleGlitch(card);
                const repeatingIntervalId = setInterval(() => {
                    if (card.dataset.isMouseOver === 'true') {
                        triggerSingleGlitch(card);
                    } else {
                        clearInterval(repeatingIntervalId);
                        delete card.dataset.repeatingGlitchIntervalId;
                    }
                }, glitchRepeatInterval);
                card.dataset.repeatingGlitchIntervalId = repeatingIntervalId;
            }
            delete card.dataset.initialGlitchTimeoutId;
        }, initialGlitchDelay);
        card.dataset.initialGlitchTimeoutId = initialTimeoutId;
    }

    // Fare karttan çıktığında çalışacak fonksiyon (Değişiklik yok)
    function handleCardMouseLeave(event) {
        const card = event.currentTarget;
        card.dataset.isMouseOver = 'false';
        card.classList.remove('card-hovered');

        const initialTimeoutId = card.dataset.initialGlitchTimeoutId;
        if (initialTimeoutId) {
            clearTimeout(parseInt(initialTimeoutId));
            delete card.dataset.initialGlitchTimeoutId;
        }

        const repeatingIntervalId = card.dataset.repeatingGlitchIntervalId;
        if (repeatingIntervalId) {
            clearInterval(parseInt(repeatingIntervalId));
            delete card.dataset.repeatingGlitchIntervalId;
        }

        if (card.classList.contains('is-glitching')) {
            card.classList.remove('is-glitching');
        }
    }

    // --- API İstekleri ve İçerik Gösterimi (Değişiklik yok) ---
    async function fetchProfileInfo() {
        if (!profileInfoContainer) return;
        const profileLoadingIndicator = profileInfoContainer.querySelector('.loading');
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}`);
            if (!response.ok) {
                let errorMsg = `API hatası: ${response.status}`;
                // ... (hata mesajı detaylandırması aynı) ...
                throw new Error(errorMsg);
            }
            const data = await response.json();
            displayProfileInfo(data);
        } catch (error) {
            console.error('Profil bilgileri alınamadı:', error);
            if (profileLoadingIndicator) profileLoadingIndicator.remove();
            const errorElement = document.createElement('p');
            errorElement.classList.add('error');
            errorElement.textContent = `Profil bilgileri yüklenemedi. (${error.message})`;
            profileInfoContainer.innerHTML = '';
            profileInfoContainer.appendChild(errorElement);
             if (profileInfoContainer.classList.contains('animate-on-load')) {
                 profileInfoContainer.classList.add('visible');
             }
        }
    }

    async function fetchProjects() {
        if (!projectsListContainer) return;
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12&type=owner`);
             if (!response.ok) {
                let errorMsg = `API hatası: ${response.status}`;
                // ... (hata mesajı detaylandırması aynı) ...
                throw new Error(errorMsg);
             }
            const data = await response.json();
            displayProjects(data);
        } catch (error) {
            console.error('Projeler alınamadı:', error);
            projectsListContainer.innerHTML = `<p class="error">Projeler yüklenemedi. (${error.message})</p>`;
             const mainElement = projectsListContainer.parentElement;
             if (mainElement && mainElement.classList.contains('animate-on-load')) {
                 mainElement.classList.add('visible');
             }
        }
    }

    function displayProfileInfo(profile) {
        if (!profileInfoContainer) return;
         const profileLoadingIndicator = profileInfoContainer.querySelector('.loading');
         if (profileLoadingIndicator) profileLoadingIndicator.remove();
         const bioText = profile.bio ? profile.bio : 'Henüz bir biyografi eklenmemiş.';
         profileInfoContainer.innerHTML = `
            <img src="${profile.avatar_url}" alt="${profile.name || profile.login} Avatar" class="profile-avatar">
            <h1>${profile.name || profile.login}</h1>
            <p>${bioText}</p>
            <a href="${profile.html_url}" target="_blank" rel="noopener noreferrer" class="profile-link">
                GitHub Profilini Ziyaret Et
            </a>`;
         if (profileInfoContainer.classList.contains('animate-on-load')) {
             profileInfoContainer.classList.add('visible');
         }
    }

    // Proje Gösterimi (Olay dinleyiciler aynı)
    function displayProjects(projects) {
        if (!projectsListContainer) return;
        projectsListContainer.innerHTML = '';

        if (!projects || projects.length === 0) {
            projectsListContainer.innerHTML = '<p>Gösterilecek herkese açık proje bulunamadı.</p>';
        } else {
            projects.forEach(repo => {
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.addEventListener('mouseenter', handleCardMouseEnter);
                projectCard.addEventListener('mouseleave', handleCardMouseLeave);

                const descriptionText = repo.description ? repo.description : 'Açıklama eklenmemiş.';
                const updatedDate = new Date(repo.updated_at).toLocaleDateString('tr-TR', {
                    year: 'numeric', month: 'short', day: 'numeric'
                });

                projectCard.innerHTML = `
                    <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" title="${repo.name}">${repo.name}</a></h3>
                    <p>${descriptionText}</p>
                    <div class="project-meta">
                        ${repo.language ? `<span title="Ana dil: ${repo.language}">${repo.language}</span>` : '<span title="Dil belirtilmemiş">Dil Yok</span>'}
                        <span title="${repo.stargazers_count} yıldız">⭐ ${repo.stargazers_count}</span>
                        <span title="${repo.forks_count} fork">Fork: ${repo.forks_count}</span>
                        <span title="Son güncelleme">Güncelleme: ${updatedDate}</span>
                    </div>
                `;
                projectsListContainer.appendChild(projectCard);
            });
        }
        const mainElement = projectsListContainer.parentElement;
         if (mainElement && mainElement.classList.contains('animate-on-load')) {
             mainElement.classList.add('projects-grid-loaded');
             mainElement.classList.add('visible');
         }
    }

    // --- Başlatma ---
    console.log("Başlatma fonksiyonları çağrılıyor...");
    fetchProfileInfo();
    fetchProjects();
    setupIdleDetection(); // Maske için fare takibi ve hareketsizlik algılama

});