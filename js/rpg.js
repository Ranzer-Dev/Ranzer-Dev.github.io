// Cálculos e interatividade da Ficha RPG D&D 5e
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cálculo de modificadores D&D 5e: floor((valor - 10) / 2)
    const atributos = {
        forca: 15,
        destreza: 15,
        constituicao: 15,
        inteligencia: 15,
        sabedoria: 15,
        carisma: 15
    };

    const proficiencia = 2; // Nível 1-4 = +2

    const calcMod = (val) => Math.floor((val - 10) / 2);
    const formatMod = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

    // Atualizar modificadores de atributos
    for (const [attr, val] of Object.entries(atributos)) {
        const mod = calcMod(val);
        const modEl = document.querySelector(`.modificador${attr.charAt(0).toUpperCase() + attr.slice(1)}`);
        if (modEl) {
            modEl.textContent = formatMod(mod);
        }
    }

    // 2. Configuração dos testes de resistência
    const resistenciaMap = {
        forca: 'pontosResistenciaForca',
        destreza: 'pontosResistenciaDestreza',
        constituicao: 'pontosResistenciaConstituicao',
        inteligencia: 'pontosResistenciaInteligencia',
        sabedoria: 'pontosResistenciaSabedoria',
        carisma: 'pontosResistenciaCarisma'
    };

    function atualizarResistencias() {
        for (const [attr, className] of Object.entries(resistenciaMap)) {
            const checkbox = document.getElementById(attr);
            const input = document.querySelector(`.${className}`);
            if (checkbox && input) {
                const baseMod = calcMod(atributos[attr]);
                const total = checkbox.checked ? baseMod + proficiencia : baseMod;
                input.value = formatMod(total);
            }
        }
    }

    // 3. Configuração das perícias
    const periciasMap = {
        acrobacia: { attr: 'destreza', class: 'pontosPericiaAcrobacia' },
        arcanismo: { attr: 'inteligencia', class: 'pontosPericiaArcanismo' },
        atletismo: { attr: 'forca', class: 'pontosPericiaAtletismo' },
        atuacao: { attr: 'carisma', class: 'pontosPericiaAtuacao' },
        blefar: { attr: 'carisma', class: 'pontosPericiaBlefar' },
        furtividade: { attr: 'destreza', class: 'pontosPericiaFurtividade' },
        historia: { attr: 'inteligencia', class: 'pontosPericiaHistoria' },
        intimidacao: { attr: 'carisma', class: 'pontosPericiaIntimidacao' },
        intuicao: { attr: 'sabedoria', class: 'pontosPericiaIntuicao' },
        investigacao: { attr: 'inteligencia', class: 'pontosPericiaInvestigacao' },
        lidarComAnimais: { attr: 'sabedoria', class: 'pontosPericiaLidarComAnimais' },
        medicina: { attr: 'sabedoria', class: 'pontosPericiaMedicina' },
        natureza: { attr: 'inteligencia', class: 'pontosPericiaNatureza' },
        percepcao: { attr: 'sabedoria', class: 'pontosPericiaPercepcao' },
        persuasao: { attr: 'carisma', class: 'pontosPericiaPersuasao' },
        prestidigitacao: { attr: 'destreza', class: 'pontosPericiaPrestidigitacao' },
        religiao: { attr: 'inteligencia', class: 'pontosPericiaReligiao' },
        sobrevivencia: { attr: 'sabedoria', class: 'pontosPericiaSobrevivencia' }
    };

    function atualizarPericias() {
        for (const [periciaKey, info] of Object.entries(periciasMap)) {
            const checkbox = document.getElementById(periciaKey);
            const input = document.querySelector(`.${info.class}`);
            if (checkbox && input) {
                const baseMod = calcMod(atributos[info.attr]);
                const total = checkbox.checked ? baseMod + proficiencia : baseMod;
                input.value = formatMod(total);
            }
        }
    }

    // Event listeners para checkboxes
    document.querySelectorAll('.caixaTesteDeResistencias input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', atualizarResistencias);
    });

    document.querySelectorAll('.caixaPericias input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', atualizarPericias);
    });

    // Perícias marcadas por padrão
    const defaultPericias = ['investigacao', 'arcanismo', 'percepcao'];
    defaultPericias.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = true;
    });

    // Iniciar valores
    atualizarResistencias();
    atualizarPericias();

    // 4. Rolador de Dados D20 Exclusivo no Dado
    const d20Dice = document.getElementById('d20Dice');
    const d20Value = document.getElementById('d20Value');
    const btnRolarD20 = document.getElementById('btnRolarD20');
    const d20ResultLabel = document.getElementById('d20ResultLabel');

    let rolando = false;

    function rolarD20() {
        if (rolando || !d20Dice || !d20Value) return;
        rolando = true;

        // Adiciona classe de animação APENAS no elemento do dado
        d20Dice.classList.add('girando-dado');
        d20Value.textContent = '🎲';
        if (d20ResultLabel) d20ResultLabel.textContent = 'Rolando o d20...';

        setTimeout(() => {
            const roll = Math.floor(Math.random() * 20) + 1;
            d20Value.textContent = roll;

            if (d20ResultLabel) {
                if (roll === 20) {
                    d20ResultLabel.textContent = 'Resultado: 20! Acerto Crítico! ⚡';
                    d20ResultLabel.style.color = '#059669';
                } else if (roll === 1) {
                    d20ResultLabel.textContent = 'Resultado: 1 (Falha Crítica! ⚠️)';
                    d20ResultLabel.style.color = '#dc2626';
                } else {
                    d20ResultLabel.textContent = `Resultado do D20: ${roll}`;
                    d20ResultLabel.style.color = '#111111';
                }
            }

            d20Dice.classList.remove('girando-dado');
            rolando = false;
        }, 500);
    }

    if (btnRolarD20) btnRolarD20.addEventListener('click', rolarD20);
    if (d20Dice) d20Dice.addEventListener('click', rolarD20);

    // 5. Interações de magias: Café e Pausa
    const cafeBtn = document.querySelector('.beberCafe');
    const pausaBtn = document.querySelector('.darUmaPausa');

    if (cafeBtn) {
        cafeBtn.addEventListener('click', () => {
            alert('☕ Você tomou um Café! +5 de Velocidade na digitação e foco renovado!');
        });
    }

    if (pausaBtn) {
        pausaBtn.addEventListener('click', () => {
            alert('🧘 Você fez uma pausa estratégica! Vitalidade recuperada e bugs resolvidos com clareza!');
        });
    }

    // 6. Reposicionamento da foto no Mobile / Pouco Espaço (Foto logo após o nome do herói)
    const fotoPersonagem = document.getElementById('blocoFotoPersonagem');
    const nomePersonagemBloco = document.getElementById('blocoNomePersonagem');
    const colunaCombate = document.querySelector('.caixaStatusDeCombateEAparenciaPersonagem');

    function reposicionarFotoParaMobile() {
        if (!fotoPersonagem || !nomePersonagemBloco || !colunaCombate) return;

        if (window.innerWidth <= 900) {
            // No mobile ou pouco espaço: a foto vem logo após o nome do personagem
            if (fotoPersonagem.previousElementSibling !== nomePersonagemBloco) {
                nomePersonagemBloco.insertAdjacentElement('afterend', fotoPersonagem);
            }
        } else {
            // No desktop: volta para a coluna 3 (antes de caixaStatusDeCombate)
            if (colunaCombate.firstElementChild !== fotoPersonagem) {
                colunaCombate.insertBefore(fotoPersonagem, colunaCombate.firstElementChild);
            }
        }
    }

    window.addEventListener('resize', reposicionarFotoParaMobile);
    reposicionarFotoParaMobile();
});
