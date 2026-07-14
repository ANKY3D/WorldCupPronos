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
// Each group has exactly 6 matches. The dates are mapped to MATCH_PATTERN.
// ============================================
const MATCH_DATES = {
    "A": ["2026-06-11T21:00", "2026-06-12T04:00", "2026-06-19T03:00", "2026-06-18T18:00", "2026-06-25T03:00", "2026-06-25T03:00"],
    "B": ["2026-06-12T21:00", "2026-06-13T21:00", "2026-06-19T00:00", "2026-06-18T21:00", "2026-06-24T21:00", "2026-06-24T21:00"],
    "C": ["2026-06-14T00:00", "2026-06-14T03:00", "2026-06-20T02:30", "2026-06-20T00:00", "2026-06-25T00:00", "2026-06-25T00:00"],
    "D": ["2026-06-13T03:00", "2026-06-14T06:00", "2026-06-19T21:00", "2026-06-20T05:00", "2026-06-26T04:00", "2026-06-26T04:00"],
    "E": ["2026-06-14T19:00", "2026-06-15T01:00", "2026-06-20T22:00", "2026-06-21T02:00", "2026-06-25T22:00", "2026-06-25T22:00"],
    "F": ["2026-06-14T22:00", "2026-06-15T04:00", "2026-06-20T19:00", "2026-06-21T06:00", "2026-06-26T01:00", "2026-06-26T01:00"],
    "G": ["2026-06-15T21:00", "2026-06-16T03:00", "2026-06-21T21:00", "2026-06-22T03:00", "2026-06-27T05:00", "2026-06-27T05:00"],
    "H": ["2026-06-15T18:00", "2026-06-16T00:00", "2026-06-21T18:00", "2026-06-22T00:00", "2026-06-27T02:00", "2026-06-27T02:00"],
    "I": ["2026-06-16T21:00", "2026-06-17T00:00", "2026-06-22T23:00", "2026-06-23T02:00", "2026-06-26T21:00", "2026-06-26T21:00"],
    "J": ["2026-06-17T03:00", "2026-06-17T06:00", "2026-06-22T19:00", "2026-06-23T05:00", "2026-06-28T04:00", "2026-06-28T04:00"],
    "K": ["2026-06-17T19:00", "2026-06-18T04:00", "2026-06-23T19:00", "2026-06-24T04:00", "2026-06-28T01:30", "2026-06-28T01:30"],
    "L": ["2026-06-17T22:00", "2026-06-18T01:00", "2026-06-23T22:00", "2026-06-24T01:00", "2026-06-27T23:00", "2026-06-27T23:00"]
};

// ============================================
// KNOCKOUT MATCHES
// ============================================
const KNOCKOUT_MATCHES = [
    { id: 73, phase: "16èmes", t1: "Afrique du Sud", t2: "Canada", date: "2026-06-28T21:00" },
    { id: 74, phase: "16èmes", t1: "Brésil", t2: "Japon", date: "2026-06-29T19:00" },
    { id: 75, phase: "16èmes", t1: "Allemagne", t2: "Paraguay", date: "2026-06-29T22:30" },
    { id: 76, phase: "16èmes", t1: "Pays-Bas", t2: "Maroc", date: "2026-06-30T03:00" },
    { id: 77, phase: "16èmes", t1: "Côte d'Ivoire", t2: "Norvège", date: "2026-06-30T19:00" },
    { id: 78, phase: "16èmes", t1: "France", t2: "Suède", date: "2026-06-30T23:00" },
    { id: 79, phase: "16èmes", t1: "Mexique", t2: "Equateur", date: "2026-07-01T03:00" },
    { id: 80, phase: "16èmes", t1: "Angleterre", t2: "RD Congo", date: "2026-07-01T18:00" },
    { id: 81, phase: "16èmes", t1: "Belgique", t2: "Sénégal", date: "2026-07-01T22:00" },
    { id: 82, phase: "16èmes", t1: "Etats-Unis", t2: "Bosnie-Herz.", date: "2026-07-02T02:00" },
    { id: 83, phase: "16èmes", t1: "Espagne", t2: "Autriche", date: "2026-07-02T21:00" },
    { id: 84, phase: "16èmes", t1: "Portugal", t2: "Croatie", date: "2026-07-03T01:00" },
    { id: 85, phase: "16èmes", t1: "Suisse", t2: "Algérie", date: "2026-07-03T05:00" },
    { id: 86, phase: "16èmes", t1: "Australie", t2: "Egypte", date: "2026-07-03T20:00" },
    { id: 87, phase: "16èmes", t1: "Argentine", t2: "Cap-Vert", date: "2026-07-04T00:00" },
    { id: 88, phase: "16èmes", t1: "Colombie", t2: "Ghana", date: "2026-07-04T03:30" },
    { id: 89, phase: "8èmes", t1: "Canada", t2: "Maroc", date: "2026-07-04T19:00" },
    { id: 90, phase: "8èmes", t1: "Paraguay", t2: "France", date: "2026-07-04T23:00" },
    { id: 91, phase: "8èmes", t1: "Brésil", t2: "Norvège", date: "2026-07-05T22:00" },
    { id: 92, phase: "8èmes", t1: "Mexique", t2: "Angleterre", date: "2026-07-06T02:00" },
    { id: 93, phase: "8èmes", t1: "Portugal", t2: "Espagne", date: "2026-07-06T21:00" },
    { id: 94, phase: "8èmes", t1: "Etats-Unis", t2: "Belgique", date: "2026-07-07T02:00" },
    { id: 95, phase: "8èmes", t1: "Argentine", t2: "Egypte", date: "2026-07-07T18:00" },
    { id: 96, phase: "8èmes", t1: "Suisse", t2: "Colombie", date: "2026-07-07T22:00" },
    { id: 97, phase: "Quarts", t1: "France", t2: "Maroc", date: "2026-07-09T22:00" },
    { id: 98, phase: "Quarts", t1: "Espagne", t2: "Belgique", date: "2026-07-10T21:00" },
    { id: 99, phase: "Quarts", t1: "Norvège", t2: "Angleterre", date: "2026-07-11T23:00" },
    { id: 100, phase: "Quarts", t1: "Argentine", t2: "Suisse", date: "2026-07-12T03:00" },
    { id: 101, phase: "Demis", t1: "France", t2: "Espagne", date: "2026-07-14T21:00" },
    { id: 102, phase: "Demis", t1: "Angleterre", t2: "Argentine", date: "2026-07-15T21:00" }
];

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
    let result = [];
    let matchId = 1;

    for (let groupId in GROUPS) {
        const groupTeams = GROUPS[groupId];
        
        MATCH_PATTERN.forEach((pattern, index) => {
            const dateStr = MATCH_DATES[groupId][index];

            result.push({
                id: matchId,
                phase: 'Poules',
                group: groupId,
                t1: groupTeams[pattern[0]],
                t2: groupTeams[pattern[1]],
                date: dateStr
            });
            matchId++;
        });
    }

    // Sort group matches chronologically by date, then by original match ID
    result.sort((a, b) => {
        const d1 = new Date(a.date);
        const d2 = new Date(b.date);
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return a.id - b.id;
    });

    // Append Knockout Matches
    KNOCKOUT_MATCHES.forEach(km => {
        result.push({
            id: km.id,
            phase: km.phase,
            group: km.phase, // Fallback for V2 grouping/display if needed
            t1: km.t1,
            t2: km.t2,
            date: km.date
        });
    });

    return result;
}

/**
 * Check if a match is locked (already played or started).
 * A match is locked if the exact current time has passed the match start time.
 */
function isMatchLocked(match) {
    if (!match.date) return false;
    // The dates are stored as "2026-06-11T21:00". Append +02:00 to force parsing as Paris/European Summer Time.
    const matchDate = new Date(match.date + ':00+02:00');
    const now = new Date();
    return matchDate <= now;
}

/** Format date for display: "11 juin" */
function formatDate(dateStr) {
    const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin',
                    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const d = new Date(dateStr + 'T12:00:00');
    return `${d.getDate()} ${months[d.getMonth()]}`;
}

/** Format time for display: "21h00" */
function formatTime(isoStr) {
    const timePart = isoStr.split('T')[1]; // "21:00"
    return timePart.replace(':', 'h');
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
    updateThemeToggleIcons();
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



    // Check if there's saved progress
    const savedName = localStorage.getItem('wcpronos_name');
    const savedProgress = localStorage.getItem('wcpronos_progress');
    if (savedName && savedProgress) {
        try {
            currentPlayer = savedName;
            const parsedProgress = JSON.parse(savedProgress);
            Object.assign(predictions, parsedProgress);
            
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

    // Group matches by phase first
    const uniquePhases = [...new Set(matches.map(m => m.phase))];

    uniquePhases.forEach(phase => {
        const phaseMatches = matches.filter(m => m.phase === phase);
        
        // Create Phase Container
        const phaseSection = document.createElement('div');
        phaseSection.className = 'phase-section';
        // Generate an ID based on phase name for navigation (e.g., "phase-poules", "phase-16emes")
        const phaseIdText = phase.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
        phaseSection.id = `phase-${phaseIdText}`;
        
        // Phase Header
        const phaseHeader = document.createElement('h2');
        phaseHeader.className = 'phase-divider';
        phaseHeader.innerHTML = phase === 'Poules' ? '🏆 Phase de Groupes' : `🏆 ${phase}`;
        phaseSection.appendChild(phaseHeader);

        // Extract unique days within this phase
        const uniqueDays = [...new Set(phaseMatches.map(m => m.date.split('T')[0]))];

        // Build match groups by day
        uniqueDays.forEach((dayStr, dateIdx) => {
            const dateMatches = phaseMatches.filter(m => m.date.startsWith(dayStr));
            const formattedDate = formatDate(dayStr);

            const section = document.createElement('div');
            section.className = 'group-section';
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

                const isTbd = m.t1 === 'À définir' || m.t2 === 'À définir';
                const locked = isMatchLocked(m) || isTbd; // Force lock if TBD
                const saved1 = predictions[m.id]?.s1 || '';
                const saved2 = predictions[m.id]?.s2 || '';
                const isFilled = saved1 !== '' && saved2 !== '';
                
                const matchTime = formatTime(m.date);

                const validated = predictions[m.id]?.validated === true;

                if (isFilled) row.classList.add('filled');
                if (locked) row.classList.add('locked');
                if (validated) row.classList.add('validated');
                if (isTbd) row.classList.add('tbd');

                const displayGroup = m.phase === 'Poules' ? `(Gr. ${m.group})` : '';

                let inputsHtml = '';
                if (isTbd) {
                    inputsHtml = `<div style="grid-column: 3 / 6; display:flex; align-items:center; justify-content:center; gap:10px; color:var(--text-dim); font-weight:800; font-size:12px; letter-spacing:0.5px;">
                                   <span style="font-size:14px;">⏳</span>
                                   <span>En attente</span>
                                   <span style="font-size:14px;">⏳</span>
                               </div>`;
                } else if (locked) {
                    inputsHtml = `<div style="grid-column: 3 / 6; display:flex; align-items:center; justify-content:center; gap:10px; color:var(--text-dim); font-weight:800; font-size:13px; letter-spacing:0.5px;">
                                   <span title="Match déjà joué" style="font-size:14px;">🔒</span>
                                   <span>${saved1 !== '' ? `${saved1} - ${saved2}` : 'Terminé'}</span>
                                   <span style="font-size:14px;">🔒</span>
                               </div>`;
                } else if (validated) {
                    inputsHtml = `<div style="grid-column: 3 / 6; display:flex; align-items:center; justify-content:center; gap:10px; color:var(--success); font-weight:900; font-size:15px; letter-spacing:1px;">
                                   <span style="font-size:14px;">✅</span>
                                   <span>${saved1} - ${saved2}</span>
                                   <span style="font-size:14px;">✅</span>
                               </div>`;
                } else {
                    inputsHtml = `<input type="text" inputmode="numeric" maxlength="2" pattern="[0-9]*"
                                   class="score-input ${saved1 !== '' ? 'has-value' : ''}"
                                   data-match="${m.id}" data-pos="1"
                                   value="${saved1}"
                                   placeholder="–">
                               <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                   <span class="match-dash">-</span>
                               </div>
                               <input type="text" inputmode="numeric" maxlength="2" pattern="[0-9]*"
                                   class="score-input ${saved2 !== '' ? 'has-value' : ''}"
                                   data-match="${m.id}" data-pos="2"
                                   value="${saved2}"
                                   placeholder="–">`;
                }

                row.innerHTML = `
                    <div class="match-time-side" style="display:flex; flex-direction:column; align-items:center; justify-content:center; line-height:1.2; padding:4px 2px;">
                        <span style="font-size: 9px; opacity: 0.7; font-weight: 600;">N°${m.id}</span>
                        <span style="font-size: 11px; font-weight: 800; margin-top: 1px;">${matchTime}</span>
                    </div>
                    <div class="team team-left">
                        <span class="team-name">${m.t1} <span class="team-group">${displayGroup}</span></span>
                    </div>
                    ${inputsHtml}
                    <div class="team team-right">
                        <span class="team-name"><span class="team-group">${displayGroup}</span> ${m.t2}</span>
                    </div>
                    ${locked || validated || isTbd
                        ? `<div style="width:32px;"></div>`
                        : `<button class="match-validate-btn" id="btn-val-${m.id}" onclick="validateSingleMatch(${m.id})" ${isFilled ? '' : 'disabled'}>
                               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                           </button>`
                    }
                `;

                matchesDiv.appendChild(row);
            });

            section.appendChild(matchesDiv);
            phaseSection.appendChild(section);
        });

        content.appendChild(phaseSection);
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
    const isFilled = predictions[matchId].s1 !== '' && predictions[matchId].s2 !== '';
    if (row) {
        row.classList.toggle('filled', isFilled);
    }
    
    // Toggle validate button state
    const btn = document.getElementById(`btn-val-${matchId}`);
    if (btn) {
        btn.disabled = !isFilled;
    }

    // Save to local storage automatically
    localStorage.setItem('wcpronos_progress', JSON.stringify(predictions));

    // Update progress
    updateProgress();
}

// ============================================
// PROGRESS TRACKING
// ============================================
function updateProgress() {
    let validated = 0;

    matches.forEach(m => {
        if (predictions[m.id]?.validated) {
            validated++;
        }
    });

    // Update progress bar based on validated matches
    const percent = totalMatches === 0 ? 100 : (validated / totalMatches) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${validated} / ${totalMatches} validés`;

    if (validated === totalMatches && totalMatches > 0) {
        progressFill.classList.add('complete');
        progressText.style.color = 'var(--success)';
    } else {
        progressFill.classList.remove('complete');
        progressText.style.color = '';
    }
}

// ============================================
// SINGLE MATCH VALIDATION
// ============================================
async function validateSingleMatch(matchId) {
    const btn = document.getElementById(`btn-val-${matchId}`);
    if (!btn || btn.disabled) return;
    
    const s1 = predictions[matchId].s1;
    const s2 = predictions[matchId].s2;
    if (s1 === '' || s2 === '') return;

    // Show loading
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.6s linear infinite;"></span>';

    const match = matches.find(m => m.id === matchId);

    try {
        // Envoi sur Firebase pour ce match
        await db.ref(`pronos/${currentPlayer}/matches/${matchId}`).set({
            equipe1: match.t1,
            equipe2: match.t2,
            phase: match.phase,
            s1: s1,
            s2: s2,
            date: match.date,
            label: `${match.t1} vs ${match.t2} (${s1} - ${s2})`
        });

        // Met à jour la timestamp globale
        await db.ref(`pronos/${currentPlayer}/timestamp`).set(firebase.database.ServerValue.TIMESTAMP);

        // Save local state
        predictions[matchId].validated = true;
        localStorage.setItem('wcpronos_progress', JSON.stringify(predictions));

        // Re-render
        renderMatches();
        updateProgress();

    } catch (e) {
        console.error('Firebase error:', e);
        alert('Erreur de connexion ! Vérifie ton internet et réessaie.');
        btn.disabled = false;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    }
}

// ============================================
// THEME MANAGEMENT (LIGHT/DARK)
// ============================================
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeToggleIcons();
}

function updateThemeToggleIcons() {
    const isLight = document.body.classList.contains('light-mode');
    const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.innerHTML = isLight ? moonIcon : sunIcon;
    });
}

// ============================================
// PHASE NAVIGATION
// ============================================
function scrollToPhase(phaseIdText) {
    const section = document.getElementById(`phase-${phaseIdText}`);
    if (section) {
        // Adjust for sticky header height
        const headerOffset = document.getElementById('pronos-header').offsetHeight + 10;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
        });

        // Update active nav button
        document.querySelectorAll('.phase-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`.phase-nav-btn[onclick="scrollToPhase('${phaseIdText}')"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
}
