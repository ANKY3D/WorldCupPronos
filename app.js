/* =============================================
   PRONOS CDM 2026 — APP.JS
   Site statique GitHub Pages + Firebase
============================================= */

// ============================================
// FIREBASE CONFIG
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyCE6gRMph03Z0Fk9OWr2xWeIr4r7oGWtMc",
    authDomain: "worldcup-pronos.firebaseapp.com",
    databaseURL: "https://worldcup-pronos-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "worldcup-pronos",
    storageBucket: "worldcup-pronos.firebasestorage.app",
    messagingSenderId: "510285789267",
    appId: "1:510285789267:web:cf290802d1e217d6186ea6"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============================================
// TEAMS DATA
// ============================================
const TEAMS = {
    "Mexique": "🇲🇽", "Afrique du Sud": "🇿🇦", "Corée du Sud": "🇰🇷", "Tchéquie": "🇨🇿",
    "Canada": "🇨🇦", "Bosnie-Herz.": "🇧🇦", "Qatar": "🇶🇦", "Suisse": "🇨🇭",
    "Brésil": "🇧🇷", "Maroc": "🇲🇦", "Haïti": "🇭🇹", "Ecosse": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "Etats-Unis": "🇺🇸", "Paraguay": "🇵🇾", "Australie": "🇦🇺", "Turquie": "🇹🇷",
    "Allemagne": "🇩🇪", "Curaçao": "🇨🇼", "Côte d'Ivoire": "🇨🇮", "Equateur": "🇪🇨",
    "Pays-Bas": "🇳🇱", "Japon": "🇯🇵", "Suède": "🇸🇪", "Tunisie": "🇹🇳",
    "Belgique": "🇧🇪", "Egypte": "🇪🇬", "Iran": "🇮🇷", "Nlle-Zélande": "🇳🇿",
    "Espagne": "🇪🇸", "Cap-Vert": "🇨🇻", "Arabie Saoudite": "🇸🇦", "Uruguay": "🇺🇾",
    "France": "🇫🇷", "Sénégal": "🇸🇳", "Irak": "🇮🇶", "Norvège": "🇳🇴",
    "Argentine": "🇦🇷", "Algérie": "🇩🇿", "Autriche": "🇦🇹", "Jordanie": "🇯🇴",
    "Portugal": "🇵🇹", "RD Congo": "🇨🇩", "Ouzbékistan": "🇺🇿", "Colombie": "🇨🇴",
    "Angleterre": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croatie": "🇭🇷", "Ghana": "🇬🇭", "Panama": "🇵🇦"
};

// Full names for Firebase storage (matching V2 app names)
const FULL_NAMES = {
    "Bosnie-Herz.": "Bosnie-et-Herzégovine",
    "Nlle-Zélande": "Nouvelle-Zélande"
};

const GROUPS = {
    "A": ["Mexique", "Afrique du Sud", "Corée du Sud", "Tchéquie"],
    "B": ["Canada", "Bosnie-Herz.", "Qatar", "Suisse"],
    "C": ["Brésil", "Maroc", "Haïti", "Ecosse"],
    "D": ["Etats-Unis", "Paraguay", "Australie", "Turquie"],
    "E": ["Allemagne", "Curaçao", "Côte d'Ivoire", "Equateur"],
    "F": ["Pays-Bas", "Japon", "Suède", "Tunisie"],
    "G": ["Belgique", "Egypte", "Iran", "Nlle-Zélande"],
    "H": ["Espagne", "Cap-Vert", "Arabie Saoudite", "Uruguay"],
    "I": ["France", "Sénégal", "Irak", "Norvège"],
    "J": ["Argentine", "Algérie", "Autriche", "Jordanie"],
    "K": ["Portugal", "RD Congo", "Ouzbékistan", "Colombie"],
    "L": ["Angleterre", "Croatie", "Ghana", "Panama"]
};

// Match pattern: indices within each group (same as V2)
// Pattern: [team_idx_1, team_idx_2] → matchday within group
// Matchday 1: (0,1), (2,3)
// Matchday 2: (0,2), (3,1)
// Matchday 3: (3,0), (1,2)
const MATCH_PATTERN = [[0, 1], [2, 3], [0, 2], [3, 1], [3, 0], [1, 2]];

// ============================================
// MATCH DATES — Real FIFA World Cup 2026 schedule
// Format: { "GROUP": ["date_matchday1", "date_matchday2", "date_matchday3"] }
// Each matchday has 2 matches per group.
// Dates are in YYYY-MM-DD format (Paris timezone, the matches happen
// during daytime US time = evening/night in Europe, so we use the US date).
// ============================================
const MATCH_DATES = {
    "A": ["2026-06-11", "2026-06-18", "2026-06-25"],
    "B": ["2026-06-12", "2026-06-18", "2026-06-24"],
    "C": ["2026-06-13", "2026-06-19", "2026-06-25"],
    "D": ["2026-06-12", "2026-06-19", "2026-06-26"],
    "E": ["2026-06-14", "2026-06-20", "2026-06-25"],
    "F": ["2026-06-14", "2026-06-20", "2026-06-26"],
    "G": ["2026-06-15", "2026-06-21", "2026-06-27"],
    "H": ["2026-06-15", "2026-06-21", "2026-06-27"],
    "I": ["2026-06-16", "2026-06-22", "2026-06-26"],
    "J": ["2026-06-17", "2026-06-22", "2026-06-27"],
    "K": ["2026-06-17", "2026-06-23", "2026-06-27"],
    "L": ["2026-06-17", "2026-06-23", "2026-06-27"]
};

// ============================================
// APP STATE
// ============================================
let currentPlayer = '';
let predictions = {};   // { matchId: { s1: '', s2: '' } }
let matches = [];       // Generated match list
let totalMatches = 0;   // Only counts playable (unlocked) matches

// ============================================
// GENERATE MATCHES
// ============================================
function generateMatches() {
    const result = [];
    let matchId = 1;
    for (const [group, teams] of Object.entries(GROUPS)) {
        MATCH_PATTERN.forEach(([idx1, idx2], patternIdx) => {
            // patternIdx 0,1 = matchday 1 | 2,3 = matchday 2 | 4,5 = matchday 3
            const matchday = Math.floor(patternIdx / 2); // 0, 0, 1, 1, 2, 2
            const date = MATCH_DATES[group][matchday];
            result.push({
                id: matchId,
                group: group,
                t1: teams[idx1],
                t2: teams[idx2],
                date: date
            });
            matchId++;
        });
    }

    // Sort chronologically by date, then by original match ID
    result.sort((a, b) => {
        const d1 = new Date(a.date);
        const d2 = new Date(b.date);
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return a.id - b.id;
    });

    return result;
}

/**
 * Check if a match is locked (already played or started).
 * A match is locked if its date is before today.
 */
function isMatchLocked(match) {
    if (!match.date) return false;
    const matchDate = new Date(match.date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return matchDate < today;
}

/** Format date for display: "11 juin" */
function formatDate(dateStr) {
    const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin',
                    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const d = new Date(dateStr + 'T12:00:00');
    return `${d.getDate()} ${months[d.getMonth()]}`;
}

// ============================================
// SCREEN MANAGEMENT
// ============================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    matches = generateMatches();

    // Count only playable (unlocked) matches
    const playableMatches = matches.filter(m => !isMatchLocked(m));
    totalMatches = playableMatches.length;

    // Initialize empty predictions for playable matches only
    matches.forEach(m => {
        if (!isMatchLocked(m)) {
            predictions[m.id] = { s1: '', s2: '' };
        }
    });

    // Check if already submitted
    if (localStorage.getItem('wcpronos_submitted') === 'true') {
        currentPlayer = localStorage.getItem('wcpronos_name') || '';
        document.getElementById('done-message').textContent =
            currentPlayer
                ? `Les pronos de ${currentPlayer} ont bien été envoyés.`
                : 'Tes pronostics ont bien été envoyés.';
        showScreen('screen-done');
        return;
    }

    // Check if there's saved progress
    const savedName = localStorage.getItem('wcpronos_name');
    const savedProgress = localStorage.getItem('wcpronos_progress');
    if (savedName && savedProgress) {
        try {
            currentPlayer = savedName;
            predictions = JSON.parse(savedProgress);
            document.getElementById('player-greeting').innerHTML = `⚽ <span>${currentPlayer}</span>`;
            renderMatches();
            updateProgress();
            showScreen('screen-pronos');
            return;
        } catch (e) {
            // Invalid saved data, start fresh
            localStorage.removeItem('wcpronos_name');
            localStorage.removeItem('wcpronos_progress');
        }
    }

    // Default: show name screen
    showScreen('screen-name');

    // Auto-focus name input
    setTimeout(() => {
        const input = document.getElementById('name-input');
        if (input) input.focus();
    }, 600);

    // Enter key on name input
    document.getElementById('name-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleNameSubmit();
    });
});

// ============================================
// NAME SCREEN LOGIC
// ============================================
async function handleNameSubmit() {
    const input = document.getElementById('name-input');
    const errorEl = document.getElementById('name-error');
    const btn = document.getElementById('name-btn');
    const name = input.value.trim();

    errorEl.textContent = '';

    // Validate
    if (!name) {
        errorEl.textContent = 'Entre ton prénom !';
        input.focus();
        return;
    }

    if (name.length < 2) {
        errorEl.textContent = 'Ton prénom doit faire au moins 2 caractères.';
        input.focus();
        return;
    }

    // Check for invalid Firebase characters
    if (/[.#$\[\]/]/.test(name)) {
        errorEl.textContent = 'Ton prénom ne peut pas contenir les caractères . # $ [ ] /';
        input.focus();
        return;
    }

    // Disable button while checking
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.6s linear infinite;"></span> Vérification...';

    try {
        // Check if name already taken in Firebase
        const snapshot = await db.ref('pronos/' + name + '/submitted').once('value');
        if (snapshot.val() === true) {
            errorEl.textContent = `"${name}" a déjà soumis ses pronos. Choisis un autre prénom !`;
            btn.disabled = false;
            btn.innerHTML = 'C\'est parti ! <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
            input.focus();
            return;
        }
    } catch (e) {
        // Firebase error — continue anyway (might be offline)
        console.warn('Firebase check failed, continuing anyway:', e);
    }

    // Success — proceed to pronos
    currentPlayer = name;
    localStorage.setItem('wcpronos_name', name);

    document.getElementById('player-greeting').innerHTML = `⚽ <span>${currentPlayer}</span>`;

    // Reset button
    btn.disabled = false;
    btn.innerHTML = 'C\'est parti ! <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

    renderMatches();
    updateProgress();
    showScreen('screen-pronos');
}

function goBackToName() {
    // Clear saved progress
    localStorage.removeItem('wcpronos_name');
    localStorage.removeItem('wcpronos_progress');
    currentPlayer = '';
    matches.forEach(m => {
        predictions[m.id] = { s1: '', s2: '' };
    });
    showScreen('screen-name');
    setTimeout(() => document.getElementById('name-input').focus(), 300);
}

// ============================================
// RENDER MATCHES
// ============================================
function renderMatches() {
    const content = document.getElementById('pronos-content');
    content.innerHTML = '';

    const uniqueDates = [...new Set(matches.map(m => m.date))];

    // Build match groups by date
    uniqueDates.forEach((dateStr, dateIdx) => {
        const dateMatches = matches.filter(m => m.date === dateStr);
        const formattedDate = formatDate(dateStr);

        const section = document.createElement('div');
        section.className = 'group-section';
        section.id = `date-${dateStr}`;
        section.style.animationDelay = `${dateIdx * 0.05}s`;

        // Date header
        const header = document.createElement('div');
        header.className = 'group-header';
        header.innerHTML = `
            <div class="group-label" style="font-size: 18px; margin-bottom: 4px;">📅 ${formattedDate}</div>
        `;
        section.appendChild(header);

        // Matches container
        const matchesDiv = document.createElement('div');
        matchesDiv.className = 'group-matches';

        dateMatches.forEach(m => {
            const row = document.createElement('div');
            row.className = 'match-row';
            row.id = `match-${m.id}`;

            const locked = isMatchLocked(m);
            const saved1 = predictions[m.id]?.s1 || '';
            const saved2 = predictions[m.id]?.s2 || '';
            const isFilled = saved1 !== '' && saved2 !== '';

            if (isFilled) row.classList.add('filled');
            if (locked) row.classList.add('locked');

            row.innerHTML = `
                <div class="team team-left">
                    <span class="team-name">${m.t1} <span style="color:var(--text-dim); font-size:11px; font-weight:600; margin-left:4px;">(Gr. ${m.group})</span></span>
                </div>
                ${locked
                    ? `<div class="locked-badge" title="Match déjà joué">🔒</div>
                       <div class="match-date-locked">${formattedDate}</div>
                       <div class="locked-badge">🔒</div>`
                    : `<input type="text" inputmode="numeric" maxlength="2" pattern="[0-9]*"
                           class="score-input ${saved1 !== '' ? 'has-value' : ''}"
                           data-match="${m.id}" data-pos="1"
                           value="${saved1}"
                           placeholder="–">
                       <span class="match-dash">-</span>
                       <input type="text" inputmode="numeric" maxlength="2" pattern="[0-9]*"
                           class="score-input ${saved2 !== '' ? 'has-value' : ''}"
                           data-match="${m.id}" data-pos="2"
                           value="${saved2}"
                           placeholder="–">`
                }
                <div class="team team-right">
                    <span class="team-name"><span style="color:var(--text-dim); font-size:11px; font-weight:600; margin-right:4px;">(Gr. ${m.group})</span> ${m.t2}</span>
                </div>
            `;

            matchesDiv.appendChild(row);
        });

        section.appendChild(matchesDiv);
        content.appendChild(section);
    });

    // Attach input listeners
    document.querySelectorAll('.score-input').forEach(input => {
        // Filter to only digits
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            handleScoreInput(e.target);
        });

        // Also save on blur
        input.addEventListener('blur', (e) => {
            handleScoreInput(e.target);
        });
    });
}

// ============================================
// SCORE INPUT HANDLING
// ============================================
function handleScoreInput(inputEl) {
    const matchId = parseInt(inputEl.dataset.match);
    const pos = inputEl.dataset.pos;
    const value = inputEl.value;

    // Update predictions
    if (pos === '1') {
        predictions[matchId].s1 = value;
    } else {
        predictions[matchId].s2 = value;
    }

    // Update visual state
    if (value !== '') {
        inputEl.classList.add('has-value');
    } else {
        inputEl.classList.remove('has-value');
    }

    // Check if both scores are filled for this match
    const row = document.getElementById(`match-${matchId}`);
    if (row) {
        const isFilled = predictions[matchId].s1 !== '' && predictions[matchId].s2 !== '';
        row.classList.toggle('filled', isFilled);
    }

    // Update progress
    updateProgress();

    // Save progress to localStorage
    saveProgressLocally();
}

function saveProgressLocally() {
    localStorage.setItem('wcpronos_progress', JSON.stringify(predictions));
}

// ============================================
// PROGRESS TRACKING
// ============================================
function updateProgress() {
    let filled = 0;

    matches.forEach(m => {
        const locked = isMatchLocked(m);
        if (locked) return;
        if (predictions[m.id]?.s1 !== '' && predictions[m.id]?.s2 !== '') {
            filled++;
        }
    });

    // Update progress bar
    const percent = totalMatches === 0 ? 100 : (filled / totalMatches) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${filled} / ${totalMatches}`;

    if (filled === totalMatches && totalMatches > 0) {
        progressFill.classList.add('complete');
        progressText.style.color = 'var(--success)';
    } else {
        progressFill.classList.remove('complete');
        progressText.style.color = '';
    }
}

// ============================================
// VALIDATION & SUBMIT
// ============================================
function handleValidate() {
    const errorEl = document.getElementById('validate-error');
    errorEl.textContent = '';

    // Count filled matches (only unlocked ones)
    let filled = 0;
    const playable = matches.filter(m => !isMatchLocked(m));
    playable.forEach(m => {
        if (predictions[m.id]?.s1 !== '' && predictions[m.id]?.s2 !== '') {
            filled++;
        }
    });

    if (filled < totalMatches) {
        const missing = totalMatches - filled;
        errorEl.textContent = `Il manque ${missing} match${missing > 1 ? 's' : ''} ! Remplis tous les scores avant de valider.`;

        // Scroll to first empty playable match
        const firstEmpty = playable.find(m =>
            predictions[m.id]?.s1 === '' || predictions[m.id]?.s2 === ''
        );
        if (firstEmpty) {
            const row = document.getElementById(`match-${firstEmpty.id}`);
            if (row) {
                const headerHeight = document.getElementById('pronos-header').offsetHeight;
                const top = row.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({ top, behavior: 'smooth' });

                // Flash the row
                row.style.background = 'rgba(239, 68, 68, 0.1)';
                setTimeout(() => { row.style.background = ''; }, 1500);
            }
        }
        return;
    }

    // All filled — show confirmation modal
    document.getElementById('confirm-modal').classList.add('show');
}

function closeConfirmModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('confirm-modal').classList.remove('show');
}

async function confirmSubmit() {
    const confirmBtn = document.getElementById('confirm-submit-btn');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span class="spinner"></span> Envoi...';

    try {
        // Build data for Firebase — human-readable format with team names
        const matchData = {};
        matches.forEach(m => {
            // Get full names for V2 compatibility
            const t1Full = FULL_NAMES[m.t1] || m.t1;
            const t2Full = FULL_NAMES[m.t2] || m.t2;

            if (isMatchLocked(m)) {
                // Don't include locked matches (already played)
                return;
            }

            matchData[String(m.id)] = {
                s1: predictions[m.id].s1,
                s2: predictions[m.id].s2,
                equipe1: t1Full,
                equipe2: t2Full,
                groupe: m.group,
                date: m.date,
                label: `${t1Full} ${predictions[m.id].s1}-${predictions[m.id].s2} ${t2Full}`
            };
        });

        await db.ref('pronos/' + currentPlayer).set({
            submitted: true,
            timestamp: new Date().toISOString(),
            joueur: currentPlayer,
            matches: matchData
        });

        // Success — mark as submitted
        localStorage.setItem('wcpronos_submitted', 'true');
        localStorage.removeItem('wcpronos_progress');

        // Close modal and show done screen
        document.getElementById('confirm-modal').classList.remove('show');

        document.getElementById('done-message').textContent =
            `Les pronos de ${currentPlayer} ont bien été envoyés.`;

        showScreen('screen-done');
    } catch (e) {
        console.error('Firebase submit error:', e);
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Valider !';

        // Show error in modal
        const errorMsg = document.createElement('p');
        errorMsg.style.cssText = 'color: var(--danger); font-size: 13px; margin-top: 12px; font-weight: 500;';
        errorMsg.textContent = 'Erreur de connexion ! Vérifie ta connexion internet et réessaie.';
        confirmBtn.parentElement.after(errorMsg);
        setTimeout(() => errorMsg.remove(), 4000);
    }
}

// ============================================
// DEV TOOLS
// ============================================
function resetAppForTesting() {
    if(confirm("Veux-tu vraiment réinitialiser l'application pour faire un nouveau test ?\n(Ceci effacera juste tes données locales pour te permettre de recommencer)")) {
        localStorage.removeItem('wcpronos_submitted');
        localStorage.removeItem('wcpronos_name');
        localStorage.removeItem('wcpronos_progress');
        window.location.reload();
    }
}
