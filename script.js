document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const sections = document.querySelectorAll('main section');

    // Sayfa yüklendiğinde ve scroll olduğunda aktif bölümü kontrol et
    function setActiveLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Header yüksekliğini hesaba kat (varsa)
            const headerHeight = document.getElementById('header') ? document.getElementById('header').offsetHeight : 0;
            
            // Kullanıcının mevcut scroll pozisyonu + header'ın biraz altı aktif bölümü belirlesin
            if (pageYOffset >= (sectionTop - headerHeight - sectionHeight / 3)) { 
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Sayfa ilk yüklendiğinde çalıştır
});