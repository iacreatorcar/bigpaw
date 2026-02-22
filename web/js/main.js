// file: web/js/main.js
const API_URL = 'http://localhost:3000/api';

// Carica le statistiche
async function caricaStatistiche() {
    try {
        const strutture = await fetch(`${API_URL}/structures`).then(r => r.json());
        document.getElementById('statStrutture').textContent = strutture.length;
        
        // Per ora statistiche fittizie
        document.getElementById('statVerifiche').textContent = '0';
        document.getElementById('statCaniGrandi').textContent = '0';
        
        // Carica le strutture
        caricaStrutture(strutture);
    } catch (error) {
        console.error('Errore nel caricamento statistiche:', error);
    }
}

// Carica le strutture nella pagina
function caricaStrutture(strutture) {
    const container = document.getElementById('struttureList');
    container.innerHTML = '';
    
    strutture.slice(0, 6).forEach(struttura => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card card-struttura">
                <div class="card-body">
                    <h5 class="card-title">${struttura.nome}</h5>
                    <p class="tipo-struttura">${struttura.tipo}</p>
                    <p class="card-text">
                        <small class="text-muted">${struttura.indirizzo}</small>
                    </p>
                    <p class="card-text">
                        <span class="badge ${getBadgeClass(struttura.certificazione?.livello)}">
                            ${struttura.certificazione?.livello || 'non certificata'}
                        </span>
                    </p>
                    <a href="#" class="btn btn-primary btn-sm">Vedi dettagli</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Helper per il badge
function getBadgeClass(livello) {
    switch(livello) {
        case 'gold': return 'badge-gold';
        case 'silver': return 'badge-silver';
        case 'bronze': return 'badge-bronze';
        default: return 'bg-secondary';
    }
}

// Avvia tutto quando la pagina è caricata
document.addEventListener('DOMContentLoaded', caricaStatistiche);