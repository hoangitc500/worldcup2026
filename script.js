'use strict';
/* ════════════════════════════════════════
   FIFA WORLD CUP 2026 – script.js v4
   Data: worldcup26.ir  |  TZ: GMT+7
   ════════════════════════════════════════ */

const API = 'https://worldcup26.ir/get/games';
const REFRESH = 60_000;
const CARD_W = 236; // 220px card + 16px gap

// ── Timezone: stadium_id → UTC offset ──
const TZ = {
    "1": "-06:00", "2": "-06:00", "3": "-06:00",
    "4": "-05:00", "5": "-05:00", "6": "-05:00",
    "7": "-04:00", "8": "-04:00", "9": "-04:00",
    "10": "-04:00", "11": "-04:00", "12": "-04:00",
    "13": "-07:00", "14": "-07:00", "15": "-07:00", "16": "-07:00"
};

// ── Stadium names ──
const VENUE = {
    "1": "Estadio Azteca", "2": "Estadio Akron", "3": "Estadio BBVA",
    "4": "AT&T Stadium", "5": "NRG Stadium", "6": "Arrowhead Stadium",
    "7": "Mercedes-Benz Stadium", "8": "Hard Rock Stadium", "9": "Gillette Stadium",
    "10": "Lincoln Financial Field", "11": "MetLife Stadium", "12": "BMO Field",
    "13": "BC Place", "14": "Lumen Field", "15": "Levi's Stadium", "16": "SoFi Stadium"
};

// ── ISO codes for flagcdn.com ──
const ISO = {
    'Mexico': 'mx', 'Canada': 'ca', 'United States': 'us', 'USA': 'us',
    'South Africa': 'za', 'South Korea': 'kr', 'Czech Republic': 'cz',
    'Switzerland': 'ch', 'Bosnia and Herzegovina': 'ba', 'Qatar': 'qa',
    'Paraguay': 'py', 'Brazil': 'br', 'Morocco': 'ma', 'Haiti': 'ht',
    'Scotland': 'gb-sct', 'Australia': 'au', 'Turkey': 'tr', 'Ivory Coast': 'ci',
    'Ecuador': 'ec', 'Germany': 'de', 'Curaçao': 'cw', 'Netherlands': 'nl',
    'Japan': 'jp', 'Sweden': 'se', 'Tunisia': 'tn', 'Iran': 'ir',
    'New Zealand': 'nz', 'Spain': 'es', 'Cape Verde': 'cv', 'Belgium': 'be',
    'Egypt': 'eg', 'Saudi Arabia': 'sa', 'Uruguay': 'uy', 'France': 'fr',
    'Senegal': 'sn', 'Iraq': 'iq', 'Norway': 'no', 'Argentina': 'ar',
    'Algeria': 'dz', 'Austria': 'at', 'Jordan': 'jo', 'Portugal': 'pt',
    'Democratic Republic of the Congo': 'cd', 'England': 'gb-eng', 'Croatia': 'hr',
    'Uzbekistan': 'uz', 'Colombia': 'co', 'Ghana': 'gh', 'Panama': 'pa'
};

// ── Emoji flags (fallback) ──
const FE = {
    'Mexico': 'mx', 'Canada': 'ca', 'United States': 'us', 'USA': 'us',
    'South Africa': 'za', 'South Korea': 'kr', 'Czech Republic': 'cz',
    'Switzerland': 'ch', 'Bosnia and Herzegovina': 'ba', 'Qatar': 'qa',
    'Paraguay': 'py', 'Brazil': 'br', 'Morocco': 'ma', 'Haiti': 'ht',
    'Scotland': 'gb-sct', 'Australia': 'au', 'Turkey': 'tr', 'Ivory Coast': 'ci',
    'Ecuador': 'ec', 'Germany': 'de', 'Curaçao': 'cw', 'Netherlands': 'nl',
    'Japan': 'jp', 'Sweden': 'se', 'Tunisia': 'tn', 'Iran': 'ir',
    'New Zealand': 'nz', 'Spain': 'es', 'Cape Verde': 'cv', 'Belgium': 'be',
    'Egypt': 'eg', 'Saudi Arabia': 'sa', 'Uruguay': 'uy', 'France': 'fr',
    'Senegal': 'sn', 'Iraq': 'iq', 'Norway': 'no', 'Argentina': 'ar',
    'Algeria': 'dz', 'Austria': 'at', 'Jordan': 'jo', 'Portugal': 'pt',
    'Democratic Republic of the Congo': 'cd', 'England': 'gb-eng', 'Croatia': 'hr',
    'Uzbekistan': 'uz', 'Colombia': 'co', 'Ghana': 'gh', 'Panama': 'pa'
};

// ── Vietnamese Translations ──
const VI = {
    'Mexico': 'Mexico', 'Canada': 'Canada', 'United States': 'Mỹ', 'USA': 'Mỹ',
    'South Africa': 'Nam Phi', 'South Korea': 'Hàn Quốc', 'Czech Republic': 'Cộng hòa Séc',
    'Switzerland': 'Thụy Sĩ', 'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
    'Qatar': 'Qatar', 'Paraguay': 'Paraguay', 'Brazil': 'Brazil', 'Morocco': 'Maroc',
    'Haiti': 'Haiti', 'Scotland': 'Scotland', 'Australia': 'Úc', 'Turkey': 'Thổ Nhĩ Kỳ',
    'Ivory Coast': 'Bờ Biển Ngà', 'Ecuador': 'Ecuador', 'Germany': 'Đức', 'Curaçao': 'Curaçao',
    'Netherlands': 'Hà Lan', 'Japan': 'Nhật Bản', 'Sweden': 'Thụy Điển', 'Tunisia': 'Tunisia',
    'Iran': 'Iran', 'New Zealand': 'New Zealand', 'Spain': 'Tây Ban Nha', 'Cape Verde': 'Cape Verde',
    'Belgium': 'Bỉ', 'Egypt': 'Ai Cập', 'Saudi Arabia': 'Ả Rập Xê Út', 'Uruguay': 'Uruguay',
    'France': 'Pháp', 'Senegal': 'Senegal', 'Iraq': 'Iraq', 'Norway': 'Na Uy',
    'Argentina': 'Argentina', 'Algeria': 'Algeria', 'Austria': 'Áo', 'Jordan': 'Jordan',
    'Portugal': 'Bồ Đào Nha', 'Democratic Republic of the Congo': 'CHDC Congo',
    'England': 'Anh', 'Croatia': 'Croatia', 'Uzbekistan': 'Uzbekistan', 'Colombia': 'Colombia',
    'Ghana': 'Ghana', 'Panama': 'Panama'
};

// ── Helper: render flag for match card ──
function flag(name, w = 36, h = 26) {
    const iso = ISO[name];
    if (!iso) return `<span class="mc-flag-fb">🏳️</span>`;
    return `<img class="mc-flag" width="${w}" height="${h}"
        src="https://flagcdn.com/${iso}.svg"
        alt="${name}" loading="lazy"
        onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span class=\\'mc-flag-fb\\'>🏳️</span>')">`;
}

// ── Helper: render flag for upcoming slider ──
function flagSm(name) {
    const iso = ISO[name];
    if (!iso) return `<span class="uc-flag-fb">🏳️</span>`;
    return `<img class="uc-flag" width="28" height="20"
        src="https://flagcdn.com/${iso}.svg"
        alt="${name}" loading="lazy"
        onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span class=\\'uc-flag-fb\\'>🏳️</span>')">`;
}

// ── Group label ──
function glabel(m) {
    if (m.type === 'group') return 'Bảng ' + m.group;
    if (m.type === 'r32') return 'Vòng 32 đội';
    if (m.type === 'r16') return 'Vòng 16 đội';
    if (m.type === 'qf') return 'Tứ kết';
    if (m.type === 'sf') return 'Bán kết';
    if (m.type === 'third') return 'Tranh hạng 3';
    if (m.type === 'final') return 'Chung kết';
    return m.group || 'Khác';
}

function cleanS(s) { return (!s || s === 'null') ? '' : s.replace(/[\{\}"]/g, '').trim(); }

// ── Parse + enrich match ──
function enrich(m) {
    let ts = 0, vnDate = 'TBD', vnTime = '--:--';
    const { local_date, finished, stadium_id } = m;

    if (local_date) {
        const parts = local_date.split(' ');
        if (parts.length === 2) {
            const [mm, dd, yyyy] = parts[0].split('/');
            const tz = TZ[stadium_id] || '-05:00';
            const d = new Date(`${yyyy}-${mm}-${dd}T${parts[1]}:00${tz}`);
            if (!isNaN(d)) {
                ts = d.getTime();
                vnDate = d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
                vnTime = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
            }
        }
    }

    const now = Date.now(), elap = now - ts;
    let isPast = finished === 'TRUE', isLive = false;
    if (!isPast && ts > 0) {
        if (elap >= 0 && elap <= 7_200_000) isLive = true;
        else if (elap > 9_000_000) isPast = true;
    }

    return { ...m, _ts: ts, _p: isPast, _l: isLive, _d: vnDate, _t: vnTime, _g: glabel(m) };
}

// ── State ──
let matches = [], sliderOff = 0, sliderN = 0, viewMode = 'group';

// ── DOM shortcuts ──
const $ = id => document.getElementById(id);
const QA = sel => document.querySelectorAll(sel);

const schedWrap = $('schedWrap');
const skeleton = $('skeleton');
const noRes = $('noRes');
const liveWrap = $('liveWrap');
const liveEmpty = $('liveEmpty');
const resWrap = $('resWrap');
const resEmpty = $('resEmpty');
const navCd = $('navCd');
const liveStatItem = $('liveStatItem');
const liveStatVal = $('liveStatVal');
const liveCnt = $('liveCnt');
const searchInput = $('searchInput');
const groupFilter = $('groupFilter');

// ════════════════════════════════════════
// FETCH
// ════════════════════════════════════════
async function fetchData() {
    try {
        const r = await fetch(API);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const data = await r.json();
        if (data?.games) {
            matches = data.games.map(enrich);
            initFilters();
            renderAll();
            renderCalendar();
        }
    } catch (e) {
        console.error(e);
        skeleton.innerHTML = `<div class="empty"><span style="font-size:3rem">⚠️</span><p>Lỗi tải dữ liệu. Hãy tải lại trang.</p></div>`;
    }
}

// ── Init group filter dropdown ──
function initFilters() {
    const ORDER = ['Bảng A', 'Bảng B', 'Bảng C', 'Bảng D', 'Bảng E', 'Bảng F', 'Bảng G', 'Bảng H', 'Bảng I', 'Bảng J', 'Bảng K', 'Bảng L'];
    const seen = new Set(matches.map(m => m._g));
    while (groupFilter.options.length > 1) groupFilter.remove(1);
    ORDER.filter(g => seen.has(g)).forEach(g => {
        const o = document.createElement('option');
        o.value = o.textContent = g;
        groupFilter.appendChild(o);
    });
}

// ── Update live badge ──
function updateLiveBadge() {
    const n = matches.filter(m => m._l).length;
    if (liveStatItem) { liveStatItem.style.display = n > 0 ? '' : 'none'; liveStatVal.textContent = n; }
    if (liveCnt) { liveCnt.textContent = n; liveCnt.classList.toggle('hidden', n === 0); }
}

// ════════════════════════════════════════
// RENDER ALL
// ════════════════════════════════════════
function renderAll() {
    skeleton.classList.add('hidden');
    renderSchedule();
    renderBracket();
    renderLive();
    renderResults();
    renderTeams();
    updateLiveBadge();
    renderCountdown();
    if(typeof renderStats === 'function') renderStats();
    if(typeof renderStadiums === 'function') renderStadiums();
}

// ════════════════════════════════════════
// COUNTDOWN
// ════════════════════════════════════════
function renderCountdown() {
    const wc = new Date('2026-06-11T19:00:00Z'); // 13:00 CDT Mexico
    const now = new Date();
    const diff = wc - now;
    if (diff <= 0) {
        navCd.innerHTML = '';
        return;
    }
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const min = Math.floor((diff % 3_600_000) / 60_000);
    navCd.innerHTML = `<div class="cd-pill">
        <div class="cd-seg"><span class="cd-v">${d}</span><span class="cd-u">ngày</span></div>
        <span class="cd-dot"></span>
        <div class="cd-seg"><span class="cd-v">${h}</span><span class="cd-u">giờ</span></div>
        <span class="cd-dot"></span>
        <div class="cd-seg"><span class="cd-v">${min}</span><span class="cd-u">phút</span></div>
        <span style="font-size:.68rem;color:var(--t4);margin-left:.2rem">đến khai mạc</span>
    </div>`;
}

// ════════════════════════════════════════
// SCHEDULE
// ════════════════════════════════════════
const G_ORDER = ['Bảng A', 'Bảng B', 'Bảng C', 'Bảng D', 'Bảng E', 'Bảng F', 'Bảng G', 'Bảng H', 'Bảng I', 'Bảng J', 'Bảng K', 'Bảng L', 'Vòng 32 đội', 'Vòng 16 đội', 'Tứ kết', 'Bán kết', 'Tranh hạng 3', 'Chung kết'];

function renderSchedule() {
    schedWrap.innerHTML = '';
    const term = searchInput.value.toLowerCase().trim();
    const sel = groupFilter.value;
    
    // Check which stage is active
    const activeStgBtn = document.querySelector('.stg-btn.active');
    const isKnockout = activeStgBtn && activeStgBtn.dataset.stage === 'knockout';

    const list = matches.filter(m => {
        const t1 = (VI[m.home_team_name_en] || m.home_team_name_en || m.home_team_label || '').toLowerCase();
        const t2 = (VI[m.away_team_name_en] || m.away_team_name_en || m.away_team_label || '').toLowerCase();
        const isMatchTerm = (!term || t1.includes(term) || t2.includes(term));
        
        if (isKnockout) {
            return m.type !== 'group' && isMatchTerm;
        } else {
            return m.type === 'group' && isMatchTerm && (sel === 'all' || m._g === sel);
        }
    });

    if (!list.length) { noRes.classList.remove('hidden'); return; }
    noRes.classList.add('hidden');

    if (isKnockout) {
        // Knockout list view always grouped by round
        renderGrouped(schedWrap, list);
    } else {
        viewMode === 'group' ? renderGrouped(schedWrap, list) : renderByDate(schedWrap, list);
    }
}

function renderGrouped(wrap, list) {
    const map = {};
    list.forEach(m => { (map[m._g] = map[m._g] || []).push(m); });
    Object.keys(map)
        .sort((a, b) => { const ia = G_ORDER.indexOf(a), ib = G_ORDER.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); })
        .forEach(g => {
            const ms = map[g].sort((a, b) => a._ts - b._ts);

            const matchdays = { '1': [], '2': [], '3': [] };
            ms.forEach(m => {
                const md = m.matchday || '1';
                if (!matchdays[md]) matchdays[md] = [];
                matchdays[md].push(m);
            });

            let mdHtml = '';
            ['1', '2', '3'].forEach(md => {
                if (matchdays[md] && matchdays[md].length > 0) {
                    mdHtml += `
                        <div class="md-col">
                            <div class="md-title">Lượt ${md}</div>
                            ${matchdays[md].map(cardHTML).join('')}
                        </div>
                    `;
                }
            });

            let standingsHtml = '';
            if (g.startsWith('Bảng')) {
                const groupLetter = g.replace('Bảng ', '').trim();
                standingsHtml = getGroupStandingsHTML(groupLetter);
            }

            const sec = document.createElement('div');
            sec.className = 'g-wrap';
            sec.innerHTML = `
                <div class="g-hdr">${g}</div>
                <div class="g-matchdays">
                    ${mdHtml || ms.map(cardHTML).join('')}
                </div>
                ${standingsHtml}
            `;
            wrap.appendChild(sec);
        });
}

function renderByDate(wrap, list) {
    list.sort((a, b) => a._ts - b._ts);
    const map = {};
    list.forEach(m => { const k = m._d || 'TBD'; (map[k] = map[k] || []).push(m); });
    Object.entries(map).forEach(([date, ms]) => {
        const sec = document.createElement('div');
        sec.className = 'g-wrap';
        sec.innerHTML = `
            <div class="g-hdr">📅 ${date}</div>
            <div class="g-matchdays">
                ${ms.map(m => cardHTML(m)).join('')}
            </div>`;
        wrap.appendChild(sec);
    });
}

// ════════════════════════════════════════
// LIVE TAB
// ════════════════════════════════════════
function renderLive() {
    const live = matches.filter(m => m._l);
    if (!live.length) {
        liveWrap.innerHTML = '';
        liveEmpty.classList.remove('hidden');
    } else {
        liveEmpty.classList.add('hidden');
        liveWrap.innerHTML = live.map(m => cardHTML(m)).join('');
    }
}

// ════════════════════════════════════════
// RESULTS TAB
// ════════════════════════════════════════
function renderResults() {
    const done = matches.filter(m => m._p && !m._l).reverse();
    if (!done.length) {
        resWrap.innerHTML = '';
        resEmpty.classList.remove('hidden');
    } else {
        resEmpty.classList.add('hidden');
        resWrap.innerHTML = done.map(m => cardHTML(m)).join('');
    }
}

// ════════════════════════════════════════
// BRACKET UI
// ════════════════════════════════════════
function renderBracket() {
    const bracketWrap = $('bracketWrap');
    if (!bracketWrap) return;
    
    const r32 = matches.filter(m => m.type === 'r32').sort((a,b) => a.match - b.match);
    const r16 = matches.filter(m => m.type === 'r16').sort((a,b) => a.match - b.match);
    const qf = matches.filter(m => m.type === 'qf').sort((a,b) => a.match - b.match);
    const sf = matches.filter(m => m.type === 'sf').sort((a,b) => a.match - b.match);
    const final = matches.filter(m => m.type === 'final').sort((a,b) => a.match - b.match);
    const third = matches.filter(m => m.type === 'third').sort((a,b) => a.match - b.match);
    
    function brCard(m) {
        if (!m) return '';
        const t1_en = m.home_team_name_en || m.home_team_label || 'TBD';
        const t2_en = m.away_team_name_en || m.away_team_label || 'TBD';
        const t1 = VI[t1_en] || t1_en;
        const t2 = VI[t2_en] || t2_en;
        const isTBD1 = !m.home_team_name_en;
        const isTBD2 = !m.away_team_name_en;
        const s1 = m._p ? m.home_score : '-';
        const s2 = m._p ? m.away_score : '-';
        
        const w1 = m._p && m.home_score > m.away_score ? 'winner' : '';
        const w2 = m._p && m.away_score > m.home_score ? 'winner' : '';
        
        let connector = '';
        if (m.type !== 'final' && m.type !== 'third') {
            connector = (m.match % 2 === 1) ? 'conn-down' : 'conn-up';
        }

        const dateStr = m._ts ? new Date(m._ts).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '';
        
        return `
            <div class="br-match ${connector}" onclick="showMatchModal(${m.id})">
                <div class="br-date">${dateStr} · Trận ${m.match}</div>
                <div class="br-team ${w1}">
                    <div class="br-t-left">
                        ${isTBD1 ? '' : flag(m.home_team_name_en, 22, 16, 'br-flag')}
                        <span class="${isTBD1 ? 'br-tbd' : ''}">${t1}</span>
                    </div>
                    <span class="br-score">${s1}</span>
                </div>
                <div class="br-team ${w2}">
                    <div class="br-t-left">
                        ${isTBD2 ? '' : flag(m.away_team_name_en, 22, 16, 'br-flag')}
                        <span class="${isTBD2 ? 'br-tbd' : ''}">${t2}</span>
                    </div>
                    <span class="br-score">${s2}</span>
                </div>
            </div>
        `;
    }

    const colHTML = (title, matchArr) => {
        if (!matchArr.length) return '';
        return `
            <div class="br-col">
                <div class="br-col-title">${title}</div>
                ${matchArr.map(m => brCard(m)).join('')}
            </div>
        `;
    };

    bracketWrap.innerHTML = `
        <div class="bracket">
            ${colHTML('Vòng 32 đội', r32)}
            ${colHTML('Vòng 16 đội', r16)}
            ${colHTML('Tứ kết', qf)}
            ${colHTML('Bán kết', sf)}
            <div class="br-col">
                <div class="br-col-title">Chung kết & Hạng 3</div>
                ${final.length ? brCard(final[0]) : ''}
                <div style="height: 2rem;"></div> <!-- Spacing -->
                ${third.length ? brCard(third[0]) : ''}
            </div>
        </div>
    `;
    
    // Add horizontal scroll dragging logic
    let isDown = false;
    let startX;
    let scrollLeft;
    bracketWrap.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - bracketWrap.offsetLeft;
        scrollLeft = bracketWrap.scrollLeft;
    });
    bracketWrap.addEventListener('mouseleave', () => { isDown = false; });
    bracketWrap.addEventListener('mouseup', () => { isDown = false; });
    bracketWrap.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - bracketWrap.offsetLeft;
        const walk = (x - startX) * 2;
        bracketWrap.scrollLeft = scrollLeft - walk;
    });
}
// ════════════════════════════════════════
function getGroupStandingsHTML(g) {
    const groupData = {};
    matches.forEach(m => {
        if (!m.type || m.type !== 'group' || m.group !== g) return;
        const t1_en = m.home_team_name_en || m.home_team_label;
        const t2_en = m.away_team_name_en || m.away_team_label;
        if (!t1_en || !t2_en) return;

        if (!groupData[t1_en]) groupData[t1_en] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] };
        if (!groupData[t2_en]) groupData[t2_en] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] };

        if (m._p) {
            const s1 = parseInt(m.home_score), s2 = parseInt(m.away_score);
            if (!isNaN(s1) && !isNaN(s2)) {
                groupData[t1_en].p++; groupData[t2_en].p++;
                groupData[t1_en].gf += s1; groupData[t1_en].ga += s2;
                groupData[t2_en].gf += s2; groupData[t2_en].ga += s1;
                if (s1 > s2) {
                    groupData[t1_en].w++; groupData[t1_en].pts += 3; groupData[t1_en].form.push('w');
                    groupData[t2_en].l++; groupData[t2_en].form.push('l');
                } else if (s1 < s2) {
                    groupData[t2_en].w++; groupData[t2_en].pts += 3; groupData[t2_en].form.push('w');
                    groupData[t1_en].l++; groupData[t1_en].form.push('l');
                } else {
                    groupData[t1_en].d++; groupData[t1_en].pts += 1; groupData[t1_en].form.push('d');
                    groupData[t2_en].d++; groupData[t2_en].pts += 1; groupData[t2_en].form.push('d');
                }
            }
        }
    });

    const teams = Object.entries(groupData).map(([name, st]) => {
        return { name, ...st, gd: st.gf - st.ga };
    }).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return a.name.localeCompare(b.name);
    });

    if (!teams.length) return '';

    let trs = teams.map((t, i) => {
        const t_vi = VI[t.name] || t.name;
        const rankCls = (i === 0) ? ' r1' : (i === 1) ? ' r2' : (i === 2) ? ' r3' : '';
        const qual = (i < 2) ? ' qualifies' : '';
        const formHtml = t.form.slice(-5).map(f => `<span class="st-form-dot ${f}">${f.toUpperCase()}</span>`).join('');
        return `<tr class="${qual}">
            <td>
                <div class="st-team">
                    <span class="st-rank${rankCls}">${i + 1}</span>
                    ${flag(t.name, 26, 19)}
                    <span class="st-name">${t_vi}</span>
                </div>
            </td>
            <td>${t.p}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td>
            <td>${t.gf}</td><td>${t.ga}</td><td>${t.gd > 0 ? '+' + t.gd : t.gd}</td>
            <td class="st-pts">${t.pts}</td>
            <td><div class="st-form">${formHtml || '-'}</div></td>
        </tr>`;
    }).join('');

    return `
        <div class="st-group" style="margin-top: 1.5rem;">
            <div class="st-hdr" style="font-weight:800; font-size:.9rem; color:var(--gold); margin-bottom:.8rem; padding-left:.5rem; border-left:3px solid var(--gold);">Bảng xếp hạng Bảng ${g}</div>
            <div class="table-wrap" style="overflow-x:auto">
                <table class="st-table">
                    <thead>
                        <tr>
                            <th>Đội</th>
                            <th>ST</th><th>T</th><th>H</th><th>B</th>
                            <th>BT</th><th>SBT</th><th>HS</th>
                            <th>Điểm</th>
                            <th>Phong độ</th>
                        </tr>
                    </thead>
                    <tbody>${trs}</tbody>
                </table>
            </div>
        </div>`;
}

// ════════════════════════════════════════
// TEAMS TAB
// ════════════════════════════════════════
function renderTeams() {
    const wrap = $('teamsWrap');
    if (!wrap) return;

    const teamSet = new Set();
    matches.forEach(m => {
        if (m.home_team_name_en) teamSet.add(m.home_team_name_en);
        if (m.away_team_name_en) teamSet.add(m.away_team_name_en);
    });

    const confeds = {
        'CONCACAF': ['Mexico', 'Canada', 'United States', 'USA', 'Panama', 'Haiti', 'Jamaica', 'Costa Rica', 'Honduras', 'El Salvador'],
        'CONMEBOL': ['Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Ecuador', 'Paraguay', 'Chile', 'Peru', 'Venezuela', 'Bolivia'],
        'UEFA': ['Germany', 'Spain', 'France', 'England', 'Portugal', 'Netherlands', 'Croatia', 'Switzerland', 'Belgium', 'Austria', 'Czech Republic', 'Scotland', 'Sweden', 'Norway', 'Bosnia and Herzegovina', 'Turkey', 'Italy', 'Denmark', 'Serbia', 'Poland', 'Ukraine', 'Wales'],
        'AFC': ['Japan', 'Iran', 'South Korea', 'Australia', 'Saudi Arabia', 'Qatar', 'Iraq', 'Uzbekistan', 'Jordan', 'UAE', 'Oman', 'China', 'Syria', 'Bahrain'],
        'CAF': ['Morocco', 'Senegal', 'Egypt', 'Algeria', 'Tunisia', 'Ivory Coast', 'South Africa', 'Democratic Republic of the Congo', 'Ghana', 'Cape Verde', 'Nigeria', 'Cameroon', 'Mali', 'Burkina Faso'],
        'OFC': ['New Zealand', 'Fiji', 'Solomon Islands', 'Tahiti']
    };
    function getConfed(t) {
        for (const [c, arr] of Object.entries(confeds)) {
            if (arr.includes(t)) return c;
        }
        return 'FIFA';
    }

    const tArr = Array.from(teamSet).sort().filter(t => t !== 'TBD' && !t.includes('Winner'));
    if (!tArr.length) return;

    wrap.innerHTML = tArr.map(t => {
        const t_vi = VI[t] || t;
        const c = getConfed(t);
        const isFav = (typeof favTeam !== 'undefined' && favTeam === t);
        return `<div class="team-card ${isFav ? 'team-fav' : ''}" onclick="typeof openTeamModal === 'function' && openTeamModal('${t}')" style="cursor:pointer;">
            ${flag(t, 68, 50).replace('mc-flag', 'team-flag-lg')}
            <div class="team-name">${t_vi} ${isFav ? '⭐' : ''}</div>
            <div class="team-conf conf-${c}">${c}</div>
        </div>`;
    }).join('');
}

// ════════════════════════════════════════
// MATCH CARD HTML
// ════════════════════════════════════════
function cardHTML(m) {
    const idx = matches.indexOf(m);
    const t1_en = m.home_team_name_en || m.home_team_label || 'TBD';
    const t2_en = m.away_team_name_en || m.away_team_label || 'TBD';
    const t1 = VI[t1_en] || t1_en;
    const t2 = VI[t2_en] || t2_en;
    const { _p, _l, _d, _t, _g } = m;

    // Status
    let sc = 's-soon', bc = 'soon', bt = 'SẮP DIỄN RA';
    if (_l) { sc = 's-live'; bc = 'live'; bt = '🔴 TRỰC TIẾP'; }
    else if (_p) { sc = 's-done'; bc = 'done'; bt = '✓ KẾT THÚC'; }

    // Check fav
    if (typeof favTeam !== 'undefined' && favTeam && (t1_en === favTeam || t2_en === favTeam)) {
        sc += ' mc-fav';
    }

    // Scores
    const show = _p || _l;
    const s1 = show ? (m.home_score ?? '?') : null;
    const s2 = show ? (m.away_score ?? '?') : null;
    const n1 = parseInt(s1), n2 = parseInt(s2);
    const w1 = (!isNaN(n1) && !isNaN(n2) && n1 > n2) ? ' w' : '';
    const w2 = (!isNaN(n1) && !isNaN(n2) && n2 > n1) ? ' w' : '';

    const scoreHTML = show
        ? `<div class="mc-sc-area"><span class="mc-sc${w1}">${s1}</span><span class="mc-sep">–</span><span class="mc-sc${w2}">${s2}</span></div>`
        : `<div class="mc-sc-area"><span class="mc-sc vs">VS</span></div>`;

    // Scorers
    const h_sc = cleanS(m.home_scorers), a_sc = cleanS(m.away_scorers);
    const scorersHTML = (_p && (h_sc || a_sc))
        ? `<div class="mc-scorers">${h_sc ? `<span>⚽ ${h_sc}</span>` : ''}${a_sc ? `<span>⚽ ${a_sc}</span>` : ''}</div>`
        : '';

    const venue = VENUE[m.stadium_id] || `Sân #${m.stadium_id || '?'}`;

    return `<div class="mc ${sc}" onclick="openMatchModal(${idx})">
    <div class="mc-top">
        <span class="mc-grp">${_g}</span>
        <span class="mc-badge ${bc}">${bt}</span>
    </div>
    <div class="mc-duel">
        <div class="mc-t home">
            ${flag(t1_en)}
            <span class="mc-tname">${t1}</span>
        </div>
        ${scoreHTML}
        <div class="mc-t away">
            ${flag(t2_en)}
            <span class="mc-tname">${t2}</span>
        </div>
    </div>
    ${scorersHTML}
    <div class="mc-foot">
        <span class="mc-fi">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${_t} · ${_d}
        </span>
        <span class="mc-fi">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 21h18M9 21V7l-6 4v10M15 21V3l6 4v14"/></svg>
            ${venue}
        </span>
    </div>
</div>`;
}

// ════════════════════════════════════════
// UPCOMING CALENDAR
// ════════════════════════════════════════
function renderCalendar() {
    const calStrip = $('calStrip');
    const calMatches = $('calMatches');
    if (!calStrip || !calMatches) return;

    // Group all matches by date
    const dateMap = {};
    matches.forEach(m => {
        if (!m._ts) return;
        const dt = new Date(m._ts);
        const day = String(dt.getDate()).padStart(2, '0');
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const year = dt.getFullYear();
        const d = `${day}/${month}/${year}`;
        if (!dateMap[d]) dateMap[d] = [];
        dateMap[d].push(m);
    });

    const dates = Object.keys(dateMap).sort((a, b) => {
        const [d1, m1, y1] = a.split('/');
        const [d2, m2, y2] = b.split('/');
        return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });

    if (!dates.length) {
        calStrip.innerHTML = '';
        calMatches.innerHTML = '<p>Không có dữ liệu trận đấu.</p>';
        return;
    }

    // Default date logic: Try today first, otherwise nearest upcoming
    const now = new Date();
    const todayStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    let selectedDate = dates[0];
    
    if (dateMap[todayStr]) {
        selectedDate = todayStr;
    } else {
        const nowMs = Date.now();
        for (const d of dates) {
            if (dateMap[d].some(m => m._ts > nowMs || m._l)) {
                selectedDate = d;
                break;
            }
        }
    }

    window.selectCalDate = function (dateStr) {
        selectedDate = dateStr;

        // Render strip
        calStrip.innerHTML = dates.map(d => {
            const parts = d.split('/');
            const dt = new Date(parts[2], parts[1] - 1, parts[0]);
            const day = String(dt.getDate()).padStart(2, '0');
            const month = String(dt.getMonth() + 1).padStart(2, '0');
            const dow = dt.toLocaleDateString('vi-VN', { weekday: 'short' });
            return `<div class="cal-day ${d === selectedDate ? 'active' : ''}" onclick="selectCalDate('${d}')">
                <span class="cal-dow">${dow}</span>
                <span class="cal-date">${day}/${month}</span>
            </div>`;
        }).join('');

        // Scroll selected day into view in the strip
        setTimeout(() => {
            const activeDay = calStrip.querySelector('.cal-day.active');
            if (activeDay) {
                activeDay.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }, 50);

        // Render matches
        calMatches.innerHTML = dateMap[selectedDate].sort((a, b) => a._ts - b._ts).map(m => cardHTML(m)).join('');
    };

    selectCalDate(selectedDate);
}

// ════════════════════════════════════════
// MATCH MODAL
// ════════════════════════════════════════
function openMatchModal(idx) {
    const m = matches[idx];
    if (!m) return;

    const t1_en = m.home_team_name_en || m.home_team_label || 'TBD';
    const t2_en = m.away_team_name_en || m.away_team_label || 'TBD';
    const t1 = VI[t1_en] || t1_en;
    const t2 = VI[t2_en] || t2_en;

    const venue = VENUE[m.stadium_id] || `Sân #${m.stadium_id || '?'}`;

    // Status
    let stCls = 'soon', stText = 'SẮP DIỄN RA';
    if (m._l) { stCls = 'live'; stText = '🔴 ĐANG DIỄN RA'; }
    else if (m._p) { stCls = 'done'; stText = '✓ KẾT THÚC'; }

    // Scores
    const show = m._p || m._l;
    const s1 = show ? (m.home_score ?? '0') : '-';
    const s2 = show ? (m.away_score ?? '0') : '-';

    // Scorers
    const h_sc = cleanS(m.home_scorers);
    const a_sc = cleanS(m.away_scorers);
    let scorersHtml = '';
    if (m._p && (h_sc || a_sc)) {
        scorersHtml = `
            <div class="mm-scorers">
                <div class="mm-scorers-title">⚽ Cầu thủ ghi bàn</div>
                <div class="mm-scorer-list">
                    ${h_sc ? `<div><strong>${t1}:</strong> ${h_sc}</div>` : ''}
                    ${a_sc ? `<div><strong>${t2}:</strong> ${a_sc}</div>` : ''}
                </div>
            </div>`;
    }

    $('mmContainer').innerHTML = `
        <div class="mm-hdr">
            <div class="mm-grp">${m._g || 'Vòng đấu'} ${m.matchday ? `· Lượt ${m.matchday}` : ''}</div>
            <div class="mm-status ${stCls}">${stText}</div>
            <div class="mm-teams">
                <div class="mm-t">
                    ${flag(t1_en, 64, 48)}
                    <span class="mm-tname">${t1}</span>
                </div>
                <div class="mm-score ${!show ? 'vs' : ''}">${show ? `${s1} - ${s2}` : 'VS'}</div>
                <div class="mm-t">
                    ${flag(t2_en, 64, 48)}
                    <span class="mm-tname">${t2}</span>
                </div>
            </div>
        </div>
        <div class="mm-body">
            <div class="mm-info-row">
                <svg class="mm-info-icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${m._t} · ${m._d}
            </div>
            <div class="mm-info-row">
                <svg class="mm-info-icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 21h18M9 21V7l-6 4v10M15 21V3l6 4v14"/></svg>
                ${venue}
            </div>
            ${scorersHtml}
            <div class="mm-actions">
                <button class="mm-btn" onclick="typeof downloadICS === 'function' && downloadICS(${idx})">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="9" y1="16" x2="15" y2="16" /></svg>
                    Thêm lịch
                </button>
                <button class="mm-btn" onclick="typeof shareMatchResult === 'function' && shareMatchResult(${idx})">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    Chia sẻ ảnh
                </button>
            </div>
            <div style="margin-top:1.5rem; text-align:center;">
                <button class="btn-primary" onclick="jumpToGroup('${m._g}')" style="width:100%; padding:0.8rem; font-size:1rem;">Xem Bảng xếp hạng</button>
            </div>
        </div>
    `;

    $('matchModal').classList.add('active');
}

function setupFilters() {
    searchInput.addEventListener('input', () => {
        clearTimeout(window.sTimeout);
        window.sTimeout = setTimeout(() => {
            renderSchedule();
            $('sClear').classList.toggle('hidden', searchInput.value.trim() === '');
        }, 300);
    });
    $('sClear').addEventListener('click', () => { searchInput.value = ''; renderSchedule(); $('sClear').classList.add('hidden'); });
    groupFilter.addEventListener('change', renderSchedule);

    // Stage Sw logic
    const stgBtns = QA('.stg-btn');
    stgBtns.forEach(b => {
        b.addEventListener('click', () => {
            stgBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            const stg = b.dataset.stage;
            if (stg === 'knockout') {
                groupFilter.style.display = 'none';
                $('groupViewSw').classList.add('hidden');
                $('koViewSw').classList.remove('hidden');
                // Trigger koView logic
                const activeBtn = document.querySelector('#koViewSw .vsw-btn.active');
                const activeKoView = activeBtn ? activeBtn.dataset.view : 'bracket';
                if (activeKoView === 'bracket') {
                    schedWrap.classList.add('hidden');
                    $('bracketWrap').classList.remove('hidden');
                    renderBracket();
                } else {
                    $('bracketWrap').classList.add('hidden');
                    schedWrap.classList.remove('hidden');
                    renderSchedule();
                }
            } else {
                $('bracketWrap').classList.add('hidden');
                schedWrap.classList.remove('hidden');
                groupFilter.style.display = '';
                $('groupViewSw').classList.remove('hidden');
                $('koViewSw').classList.add('hidden');
                renderSchedule();
            }
        });
    });

    // Group View Switch logic
    const gvBtns = document.querySelectorAll('#groupViewSw .vsw-btn');
    gvBtns.forEach(b => {
        b.addEventListener('click', () => {
            gvBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            viewMode = b.dataset.view;
            renderSchedule();
        });
    });

    // Knockout View Switch logic
    const kvBtns = document.querySelectorAll('#koViewSw .vsw-btn');
    kvBtns.forEach(b => {
        b.addEventListener('click', () => {
            kvBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            const view = b.dataset.view;
            if (view === 'bracket') {
                schedWrap.classList.add('hidden');
                $('bracketWrap').classList.remove('hidden');
                renderBracket();
            } else {
                $('bracketWrap').classList.add('hidden');
                schedWrap.classList.remove('hidden');
                renderSchedule();
            }
        });
    });
}
setupFilters();

function jumpToGroup(group) {
    $('matchModal').classList.remove('active');
    switchTab('schedule');
    if (typeof viewMode !== 'undefined' && viewMode !== 'group') {
        viewMode = 'group';
        QA('.vsw-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'group'));
        renderSchedule();
    }
    // Find the group header and scroll to it
    setTimeout(() => {
        const hdrs = document.querySelectorAll('.st-hdr');
        for (const h of hdrs) {
            if (h.textContent.includes(group)) {
                h.scrollIntoView({ behavior: 'smooth', block: 'center' });
                h.style.background = 'var(--gold-bg)';
                setTimeout(() => h.style.background = '', 2000);
                break;
            }
        }
    }, 100);
}

if ($('mmClose')) $('mmClose').addEventListener('click', () => $('matchModal').classList.remove('active'));
if ($('matchModal')) $('matchModal').addEventListener('click', (e) => {
    if (e.target.id === 'matchModal') $('matchModal').classList.remove('active');
});

// ════════════════════════════════════════
// TABS  (nav-tab covers both desktop & mobile)
// ════════════════════════════════════════
function switchTab(tab) {
    // update all .nav-tab buttons
    document.querySelectorAll('.nav-tab').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
    });
    // update panes
    document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
    const pane = document.getElementById('pane-' + tab);
    if (pane) pane.classList.add('active');

    // filter bar visible only on schedule tab
    const fbar = document.getElementById('fbar');
    if (fbar) fbar.style.display = (tab === 'schedule') ? '' : 'none';

    // hide hero (banner + upcoming) on non-schedule tabs
    const hero = document.querySelector('.hero');
    if (hero) hero.style.display = (tab === 'schedule') ? '' : 'none';

    if (tab === 'live') renderLive();
    if (tab === 'results') renderResults();
    if (tab === 'teams') renderTeams();
    if (tab === 'stats' && typeof renderStats === 'function') renderStats();
    if (tab === 'stadiums' && typeof renderStadiums === 'function') renderStadiums();
}

document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ── View switch ──
QA('.vsw-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        QA('.vsw-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        viewMode = btn.dataset.view;
        renderSchedule();
    });
});

// ── Filters ──
searchInput.addEventListener('input', () => {
    $('sClear').classList.toggle('hidden', !searchInput.value);
    renderSchedule();
});
$('sClear').addEventListener('click', () => {
    searchInput.value = '';
    $('sClear').classList.add('hidden');
    renderSchedule();
});
groupFilter.addEventListener('change', renderSchedule);

// Voice search
const voiceBtn = $('voiceBtn');
if (voiceBtn) {
    const sr = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (sr) {
        const recognition = new sr();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            voiceBtn.classList.add('recording');
        };
        recognition.onresult = (e) => {
            searchInput.value = e.results[0][0].transcript;
            $('sClear').classList.remove('hidden');
            renderSchedule();
        };
        recognition.onend = () => {
            voiceBtn.classList.remove('recording');
        };
        recognition.onerror = () => {
            voiceBtn.classList.remove('recording');
        };

        voiceBtn.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        voiceBtn.style.display = 'none';
    }
}

// ════════════════════════════════════════
// THEME
// ════════════════════════════════════════
const themeBtn = $('themeBtn');
const themeIco = $('themeIco');
// moon SVG path
const MOON_PATH = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
// sun SVG path
const SUN_PATH = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';

function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    themeIco.innerHTML = t === 'dark' ? MOON_PATH : SUN_PATH;
    localStorage.setItem('wc26-theme', t);
}

themeBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ══ Navbar shadow on scroll ══
window.addEventListener('scroll', () => {
    document.getElementById('navbar').style.boxShadow =
        window.scrollY > 50 ? '0 4px 24px rgba(0,0,0,.6)' : 'none';
}, { passive: true });

// ══ Mobile tabbar: show/hide based on viewport ══
function updateMobileTabbar() {
    const mb = document.getElementById('mobileTabbar');
    if (!mb) return;
    mb.style.display = window.innerWidth <= 900 ? 'flex' : 'none';
}
updateMobileTabbar();
window.addEventListener('resize', updateMobileTabbar, { passive: true });

// ════════════════════════════════════════
// NOTIFY MODAL
// ════════════════════════════════════════
function openModal() { $('overlay').classList.remove('hidden'); }
function closeModal() { $('overlay').classList.add('hidden'); }

$('notifyBtn').addEventListener('click', openModal);
$('mClose').addEventListener('click', closeModal);
$('mCancel').addEventListener('click', closeModal);
$('overlay').addEventListener('click', e => { if (e.target === $('overlay')) closeModal(); });

$('mEnable').addEventListener('click', async () => {
    if (!('Notification' in window)) { showMsg('⚠️ Trình duyệt không hỗ trợ thông báo.', 'err'); return; }
    const p = await Notification.requestPermission();
    if (p === 'granted') {
        scheduleNotifs();
        showMsg('✅ Đã bật! Bạn sẽ được nhắc 15 phút trước mỗi trận.', 'ok');
        setTimeout(closeModal, 2200);
    } else {
        showMsg('❌ Quyền bị từ chối. Vui lòng bật trong cài đặt trình duyệt.', 'err');
    }
});

function showMsg(txt, cls) {
    const el = $('mMsg');
    el.textContent = txt;
    el.className = `m-msg ${cls}`;
    el.classList.remove('hidden');
}

function scheduleNotifs() {
    const now = Date.now();
    matches.filter(m => !m._p && !m._l && m._ts > now).slice(0, 20).forEach(m => {
        const t1_en = m.home_team_name_en || m.home_team_label || 'TBD';
        const t2_en = m.away_team_name_en || m.away_team_label || 'TBD';
        const t1 = VI[t1_en] || t1_en;
        const t2 = VI[t2_en] || t2_en;
        const delay = m._ts - now - 15 * 60_000;
        if (delay > 0 && delay < 24 * 3_600_000) {
            setTimeout(() => new Notification('⚽ 15 phút nữa bắt đầu!', {
                body: `${t1} vs ${t2} · ${m._t}\n${m._g}`
            }), delay);
        }
    });
}

// ════════════════════════════════════════
// SCROLL TO TOP
// ════════════════════════════════════════
const bttBtn = $('backToTopBtn');
window.addEventListener('scroll', () => {
    document.getElementById('navbar').style.boxShadow =
        window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,.5)' : 'none';

    // Back to top visibility
    if (window.scrollY > 300) {
        bttBtn.classList.add('show');
    } else {
        bttBtn.classList.remove('show');
    }
}, { passive: true });

// ════════════════════════════════════════
// AUTO REFRESH
// ════════════════════════════════════════
setInterval(async () => {
    try {
        const r = await fetch(API);
        if (!r.ok) return;
        const data = await r.json();
        if (data?.games) {
            matches = data.games.map(enrich);
            renderAll();
            renderCalendar();
        }
    } catch (_) { }
}, REFRESH);

// ════════════════════════════════════════
// NEW FEATURES: STATS, STADIUMS, TEAM MODAL, CALENDAR, SHARE
// ════════════════════════════════════════

let favTeam = localStorage.getItem('wc26-fav-team') || null;

function renderStats() {
    const wrap = $('statsWrap');
    if (!wrap) return;

    let totalMatches = 0;
    let totalGoals = 0;
    let biggestWin = null;
    let biggestWinDiff = -1;
    let scorers = {};

    matches.forEach(m => {
        if (!m._p) return;
        totalMatches++;
        
        let hs = parseInt(m.home_score) || 0;
        let as = parseInt(m.away_score) || 0;
        totalGoals += (hs + as);
        
        let diff = Math.abs(hs - as);
        if (diff > biggestWinDiff) {
            biggestWinDiff = diff;
            biggestWin = m;
        }

        // Parse scorers
        const parseScorers = (str, team) => {
            if (!str || str === 'null') return;
            // Remove {, }, ", “, ”
            str = str.replace(/[{}"“”]/g, '');
            const parts = str.split(',');
            let lastPlayer = "";
            parts.forEach(p => {
                p = p.trim();
                const match = p.match(/^([A-Za-z\u00C0-\u1EF9\s\.\-\']+?)(?=\s*\d)/);
                let playerName = "";
                if (match) {
                    playerName = match[1].trim();
                    lastPlayer = playerName;
                } else if (lastPlayer) {
                    playerName = lastPlayer;
                }
                
                if (playerName) {
                    let goals = (p.match(/\d+'/g) || []).length;
                    if (goals === 0) goals = 1; // Fallback
                    if (!scorers[playerName]) scorers[playerName] = { goals: 0, team: team };
                    scorers[playerName].goals += goals;
                }
            });
        };

        parseScorers(m.home_scorers, m.home_team_name_en);
        parseScorers(m.away_scorers, m.away_team_name_en);
    });

    const avgGoals = totalMatches ? (totalGoals / totalMatches).toFixed(2) : 0;
    
    // Process Top Scorers
    const sortedScorers = Object.entries(scorers)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10);

    const scorersHtml = sortedScorers.map((s, i) => {
        const rankCls = (i === 0) ? ' r1' : (i === 1) ? ' r2' : (i === 2) ? ' r3' : '';
        return `
            <div class="scorer-item">
                <div class="scorer-left">
                    <span class="scorer-rank${rankCls}">${i + 1}</span>
                    ${flag(s.team, 24, 18)}
                    <div>
                        <div class="scorer-name">${s.name}</div>
                        <div class="scorer-team">${VI[s.team] || s.team}</div>
                    </div>
                </div>
                <div class="scorer-goals">${s.goals}</div>
            </div>
        `;
    }).join('');

    let bwHtml = '-';
    if (biggestWin) {
        let t1 = VI[biggestWin.home_team_name_en] || biggestWin.home_team_name_en;
        let t2 = VI[biggestWin.away_team_name_en] || biggestWin.away_team_name_en;
        bwHtml = `${t1} ${biggestWin.home_score}-${biggestWin.away_score} ${t2}`;
    }

    wrap.innerHTML = `
        <div class="stats-grid">
            <div class="stat-box">
                <span class="stat-box-val">${totalMatches}</span>
                <span class="stat-box-lbl">Trận đã đấu</span>
            </div>
            <div class="stat-box">
                <span class="stat-box-val">${totalGoals}</span>
                <span class="stat-box-lbl">Bàn thắng</span>
            </div>
            <div class="stat-box">
                <span class="stat-box-val">${avgGoals}</span>
                <span class="stat-box-lbl">Bàn / Trận</span>
            </div>
            <div class="stat-box">
                <span class="stat-box-val" style="font-size:1.5rem; display:flex; align-items:center; height:100%;">${bwHtml}</span>
                <span class="stat-box-lbl" style="margin-top:auto;">Cách biệt lớn nhất</span>
            </div>
        </div>

        <div class="st-group" style="padding:1.5rem;">
            <div class="st-hdr" style="margin: -1.5rem -1.5rem 1.5rem; background:transparent;">
                <span style="font-size:1.5rem; margin-right:8px;">🏆</span> Bảng xếp hạng Vua phá lưới
            </div>
            <div class="scorer-list">
                ${scorersHtml || '<div style="color:var(--t3);text-align:center;">Chưa có dữ liệu bàn thắng</div>'}
            </div>
        </div>
    `;
}

function renderStadiums() {
    const wrap = $('stadiumsWrap');
    if (!wrap) return;

    const sData = [
        { id: 1, name: "Estadio Azteca", city: "Mexico City, Mexico", cap: "83,264", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Estadio_Azteca_2015.jpg/800px-Estadio_Azteca_2015.jpg" },
        { id: 2, name: "Estadio Akron", city: "Guadalajara, Mexico", cap: "49,850", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Estadio_Omnilife_1.jpg/800px-Estadio_Omnilife_1.jpg" },
        { id: 3, name: "Estadio BBVA", city: "Monterrey, Mexico", cap: "53,500", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Estadio_BBVA_Bancomer_Monterrey.jpg/800px-Estadio_BBVA_Bancomer_Monterrey.jpg" },
        { id: 4, name: "AT&T Stadium", city: "Dallas, USA", cap: "80,000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/AT%26T_Stadium_Dallas_Cowboys_vs._New_York_Giants_9-8-19_%2848714088266%29.jpg/800px-AT%26T_Stadium_Dallas_Cowboys_vs._New_York_Giants_9-8-19_%2848714088266%29.jpg" },
        { id: 5, name: "NRG Stadium", city: "Houston, USA", cap: "72,220", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/NRG_Stadium_Texas_Bowl_2015.jpg/800px-NRG_Stadium_Texas_Bowl_2015.jpg" },
        { id: 6, name: "Arrowhead Stadium", city: "Kansas City, USA", cap: "76,416", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Arrowhead_Stadium_2021.jpg/800px-Arrowhead_Stadium_2021.jpg" },
        { id: 7, name: "Mercedes-Benz Stadium", city: "Atlanta, USA", cap: "71,000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mercedes-Benz_Stadium_August_2017.jpg/800px-Mercedes-Benz_Stadium_August_2017.jpg" },
        { id: 8, name: "Hard Rock Stadium", city: "Miami, USA", cap: "64,767", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hard_Rock_Stadium_Dolphins_vs_Jets_2018.jpg/800px-Hard_Rock_Stadium_Dolphins_vs_Jets_2018.jpg" },
        { id: 9, name: "Gillette Stadium", city: "Boston, USA", cap: "65,878", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Gillette_Stadium_-_Foxborough%2C_MA_-_2017-09-07.jpg/800px-Gillette_Stadium_-_Foxborough%2C_MA_-_2017-09-07.jpg" },
        { id: 10, name: "Lincoln Financial Field", city: "Philadelphia, USA", cap: "69,796", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Lincoln_Financial_Field_Aerial.jpg/800px-Lincoln_Financial_Field_Aerial.jpg" },
        { id: 11, name: "MetLife Stadium", city: "New York/New Jersey, USA", cap: "82,500", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/MetLife_Stadium_-_NY_Giants_vs._Dallas_Cowboys_10.25.15.jpg/800px-MetLife_Stadium_-_NY_Giants_vs._Dallas_Cowboys_10.25.15.jpg" },
        { id: 12, name: "BMO Field", city: "Toronto, Canada", cap: "30,000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/BMO_Field_South_Stand_2016.jpg/800px-BMO_Field_South_Stand_2016.jpg" },
        { id: 13, name: "BC Place", city: "Vancouver, Canada", cap: "54,500", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/BC_Place_Stadium_2015.jpg/800px-BC_Place_Stadium_2015.jpg" },
        { id: 14, name: "Lumen Field", city: "Seattle, USA", cap: "69,000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Lumen_Field_2021.jpg/800px-Lumen_Field_2021.jpg" },
        { id: 15, name: "Levi's Stadium", city: "San Francisco Bay Area, USA", cap: "68,500", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Levi%27s_Stadium_2014.jpg/800px-Levi%27s_Stadium_2014.jpg" },
        { id: 16, name: "SoFi Stadium", city: "Los Angeles, USA", cap: "70,240", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/SoFi_Stadium_aerial_2021.jpg/800px-SoFi_Stadium_aerial_2021.jpg" }
    ];

    wrap.innerHTML = sData.map(s => `
        <div class="stadium-card">
            <div class="stadium-info">
                <div class="stadium-name">${s.name}</div>
                <div class="stadium-city">📍 ${s.city}</div>
                <div class="stadium-cap">👥 Sức chứa: ${s.cap}</div>
            </div>
        </div>
    `).join('');
}

function toggleFavTeam(team) {
    if (favTeam === team) {
        favTeam = null;
        localStorage.removeItem('wc26-fav-team');
    } else {
        favTeam = team;
        localStorage.setItem('wc26-fav-team', team);
    }
    renderAll();
    openTeamModal(team);
}

function openTeamModal(teamEn) {
    const t_vi = VI[teamEn] || teamEn;
    const isFav = (favTeam === teamEn);
    
    let p = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0;
    const teamMatches = matches.filter(m => {
        const isHome = m.home_team_name_en === teamEn;
        const isAway = m.away_team_name_en === teamEn;
        if (!isHome && !isAway) return false;

        if (m._p) {
            p++;
            let hs = parseInt(m.home_score) || 0;
            let as = parseInt(m.away_score) || 0;
            if (isHome) { gf += hs; ga += as; if(hs>as) w++; else if(hs<as) l++; else d++; }
            if (isAway) { gf += as; ga += hs; if(as>hs) w++; else if(as<hs) l++; else d++; }
        }
        return true;
    }).sort((a,b) => a._ts - b._ts);

    const matchHistoryHtml = teamMatches.map(m => {
        const t1 = VI[m.home_team_name_en] || m.home_team_name_en || 'TBD';
        const t2 = VI[m.away_team_name_en] || m.away_team_name_en || 'TBD';
        const showScore = m._p || m._l;
        const s1 = showScore ? m.home_score : '-';
        const s2 = showScore ? m.away_score : '-';
        let resClass = '';
        if (m._p) {
            let hs = parseInt(m.home_score)||0, as = parseInt(m.away_score)||0;
            if (m.home_team_name_en === teamEn) { resClass = hs>as ? 'w' : hs<as ? 'l' : 'd'; }
            else { resClass = as>hs ? 'w' : as<hs ? 'l' : 'd'; }
        }
        
        return `
            <div class="tm-match" onclick="openMatchModal(${matches.indexOf(m)}); $('teamModal').classList.remove('active');">
                <div>
                    <div class="tm-m-date">${m._d} · ${m._t}</div>
                    <div class="tm-m-teams">${t1} vs ${t2}</div>
                </div>
                <div class="tm-m-score ${resClass}">${s1} - ${s2}</div>
            </div>
        `;
    }).join('');

    $('tmTitle').textContent = `Chi tiết Đội tuyển`;
    $('tmBody').innerHTML = `
        <div class="tm-header">
            ${flag(teamEn, 80, 60).replace('mc-flag', 'tm-flag')}
            <div class="tm-name">${t_vi}</div>
            <button class="tm-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavTeam('${teamEn}')">
                ${isFav ? '⭐ Đội yêu thích' : '☆ Đánh dấu yêu thích'}
            </button>
        </div>
        <div class="tm-stats">
            <div class="tm-stat"><span class="tm-s-val">${p}</span><span class="tm-s-lbl">Trận</span></div>
            <div class="tm-stat"><span class="tm-s-val" style="color:var(--green)">${w}</span><span class="tm-s-lbl">Thắng</span></div>
            <div class="tm-stat"><span class="tm-s-val" style="color:var(--t3)">${d}</span><span class="tm-s-lbl">Hòa</span></div>
            <div class="tm-stat"><span class="tm-s-val" style="color:var(--red)">${l}</span><span class="tm-s-lbl">Thua</span></div>
            <div class="tm-stat"><span class="tm-s-val">${gf}:${ga}</span><span class="tm-s-lbl">Bàn thắng</span></div>
        </div>
        <div class="tm-history">
            ${matchHistoryHtml || '<p style="text-align:center; color:var(--t3); margin-top:1rem;">Chưa có dữ liệu trận đấu</p>'}
        </div>
    `;

    $('teamModal').classList.add('active');
}

if ($('tmClose')) $('tmClose').addEventListener('click', () => $('teamModal').classList.remove('active'));
if ($('teamModal')) $('teamModal').addEventListener('click', (e) => {
    if (e.target.id === 'teamModal') $('teamModal').classList.remove('active');
});

function downloadICS(idx) {
    const m = matches[idx];
    if (!m._ts) { alert('Chưa xác định thời gian thi đấu!'); return; }
    
    const t1 = VI[m.home_team_name_en] || m.home_team_name_en || 'TBD';
    const t2 = VI[m.away_team_name_en] || m.away_team_name_en || 'TBD';
    const venue = VENUE[m.stadium_id] || '';
    
    const startDate = new Date(m._ts);
    const endDate = new Date(m._ts + 2 * 3600 * 1000); // approx 2 hours
    
    const formatDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:⚽ ${t1} vs ${t2} - World Cup 2026`,
        `LOCATION:${venue}`,
        `DESCRIPTION:Trận đấu giữa ${t1} và ${t2} tại ${m._g}.`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `WC2026_${t1}_vs_${t2}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function shareMatchResult(idx) {
    if (typeof html2canvas === 'undefined') { alert('Đang tải công cụ tạo ảnh, vui lòng thử lại sau 1 giây.'); return; }
    const modalHdr = document.querySelector('.mm-hdr');
    if (!modalHdr) return;
    
    const oldRadius = modalHdr.style.borderRadius;
    modalHdr.style.borderRadius = '12px';
    
    html2canvas(modalHdr, {
        backgroundColor: '#0c162e',
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        modalHdr.style.borderRadius = oldRadius;
        const link = document.createElement('a');
        link.download = `WC2026-Result.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════

(function init() {
    const theme = localStorage.getItem('wc26-theme') || 'dark';
    applyTheme(theme);
    renderCountdown();
    setInterval(renderCountdown, 60_000);
    fetchData();
})();
