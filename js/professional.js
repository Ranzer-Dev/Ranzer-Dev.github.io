// Script para o Portfólio Profissional de Rodolfo Antunes
document.addEventListener('DOMContentLoaded', () => {
    // 1. Gerenciamento e Filtro de Certificados
    const searchInput = document.getElementById('searchCertificados');
    const filterButtons = document.querySelectorAll('.cert-filter-btn');
    const certGrid = document.getElementById('certificadosGrid');
    const certCountBadge = document.getElementById('certCountBadge');
    const emptyState = document.getElementById('emptyCertState');

    let currentCategory = 'all';
    let searchQuery = '';

    const certificates = window.CERTIFICADOS_DATA || [];

    function renderCertificates() {
        if (!certGrid) return;

        const filtered = certificates.filter(cert => {
            const matchesCategory = currentCategory === 'all' || cert.category === currentCategory;
            const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  cert.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // Atualizar contador
        if (certCountBadge) {
            certCountBadge.textContent = `${filtered.length} certificados`;
        }

        // Limpar grade
        certGrid.innerHTML = '';

        if (filtered.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        } else {
            if (emptyState) emptyState.style.display = 'none';
        }

        filtered.forEach(cert => {
            const card = document.createElement('article');
            card.className = 'cert-card';
            card.dataset.category = cert.category;

            const categoryIconMap = {
                java: '☕',
                node: '🟢',
                cloud: '☁️',
                ai: '🤖',
                dotnet: '🔷',
                outros: '📜'
            };

            const icon = categoryIconMap[cert.category] || '🎓';

            card.innerHTML = `
                <div class="cert-header">
                    <span class="cert-icon">${icon}</span>
                    <span class="cert-tag cert-tag-${cert.category}">${cert.tag}</span>
                </div>
                <h4 class="cert-title">${cert.title}</h4>
                <div class="cert-meta">
                    <span class="cert-issuer">Emitido por: <strong>${cert.issuer}</strong></span>
                    <span class="cert-date">📅 ${cert.date}</span>
                </div>
                <div class="cert-actions">
                    <a href="https://web.dio.me/certificates" target="_blank" rel="noopener" class="cert-btn" title="Verificar no Portal DIO">
                        Validar na DIO ↗
                    </a>
                </div>
            `;
            certGrid.appendChild(card);
        });
    }

    // Busca por texto
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderCertificates();
        });
    }

    // Filtros por Categoria
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderCertificates();
        });
    });

    // Render inicial dos certificados
    renderCertificates();

    // 2. Copiar e-mail / telefone ao clicar
    const copyBtns = document.querySelectorAll('.btn-copy');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<span>✓ Copiado!</span>';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // 3. Menu Mobile Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            mobileMenuBtn.classList.toggle('active');
        });

        // Fechar ao clicar em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // 4. Efeito de Scroll Suave e Navbar Ativa
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    });
});
