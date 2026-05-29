// ============================================================
//  TABLEAU JOIN FUSION LAB – app.js (FULL REWRITE)
//  Bug fixes: state management, challenge progression, assets
// ============================================================

// ───────────────────── WEB AUDIO ─────────────────────────────
let audioCtx = null;
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playSound(type) {
    try {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        const t = audioCtx.currentTime;
        if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.exponentialRampToValueAtTime(900, t + 0.35);
            gain.gain.setValueAtTime(0.12, t);
            gain.gain.linearRampToValueAtTime(0.001, t + 0.4);
            osc.start(t); osc.stop(t + 0.4);
        } else if (type === 'failure') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(380, t);
            osc.frequency.linearRampToValueAtTime(90, t + 0.5);
            gain.gain.setValueAtTime(0.08, t);
            gain.gain.linearRampToValueAtTime(0.001, t + 0.55);
            osc.start(t); osc.stop(t + 0.55);
        } else if (type === 'fusion') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, t);
            osc.frequency.exponentialRampToValueAtTime(750, t + 0.2);
            osc.frequency.exponentialRampToValueAtTime(200, t + 0.5);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.linearRampToValueAtTime(0.001, t + 0.5);
            osc.start(t); osc.stop(t + 0.5);
        }
    } catch(e) { /* silent */ }
}

// ───────────────────── NANO BANANA MASCOT ────────────────────
const bananaQuotes = [
    "טבלאות הן כמו בננות – אם לא עושים Join נכון, הכל נהיה סלט בננות מעוך! 🍌💥",
    "NULL היא רוח הרפאים של הנתונים. היא לא מרושעת, היא פשוט שכחה להביא את הנתונים שלה לכיתה! 👻",
    "הטיפ של ננו: ב-LEFT JOIN הטבלה השמאלית היא המלכה הבלתי מעורערת. מה שבימין לא מתאים? ישר לפח! 🗑️",
    "ב-INNER JOIN כולם חייבים להתאים בול. זה כמו למצוא קליפה שמתאימה בדיוק לרגל שלך! ⛸️",
    "FULL OUTER JOIN = אהבת חינם לנתונים. כולם נכנסים, אף אחד לא נזרק! 🧡",
    "RIGHT JOIN? הטבלה הימנית היא הבוסית. כל מה שבשמאל לא מתאים – נזרק לפח הקליפות! 🍌🗑️",
    "דאטה סיינס זה פשוט: לוקחים נתונים, שמים במיקסר, מוסיפים בננה ומקווים שזה לא יתפוצץ! 🧪✨",
    "Relationships = קשר נודל! הטבלאות נשארות נפרדות ומתחברות רק כשצריך. כמו זוג בריא! 🍜❤️",
    "האם ידעתם שפרופסור טבלו הוא קליפת בננה שעברה מוטציה גנטית? אל תגידו לו שאמרתי! 🤫",
    "NULL לא שווה ל-NULL! NULL != NULL. זה הדבר הכי מוזר שנוצר מאז הבננה הראשונה! 🤯"
];

let quoteCycle = 0;
function bananaTalk() {
    initAudio(); playSound('success');
    const bubble = document.getElementById('banana-bubble');
    bubble.textContent = bananaQuotes[quoteCycle % bananaQuotes.length];
    quoteCycle++;
    const mascot = document.getElementById('banana-mascot');
    mascot.style.transform = 'scale(1.3) rotate(-12deg)';
    bubble.style.animation = 'none';
    void bubble.offsetWidth; // reflow
    bubble.style.animation = 'bounceBubble 3s infinite ease-in-out';
    setTimeout(() => { mascot.style.transform = ''; }, 250);
}

// ───────────────────── SANDBOX DATA ──────────────────────────
const studentsData = [
    { id: 1, name: "בני", attribute: "אוכל פיצה עם קטשופ 🍕" },
    { id: 2, name: "דנה", attribute: "ישנה 14 שעות ביום 😴" },
    { id: 3, name: "גל",  attribute: "רושם קוד ב-Notepad 💻" },
    { id: 5, name: "עמית", attribute: "מדבר עם חתולי רחוב 🐈" },
    { id: 7, name: "ננו בננה 🍌", attribute: "מחליק על קליפות ⛸️" }
];
const coursesData = [
    { id: 2, course: "מדעי הנתונים 📊",      difficulty: "קשה רצח 🔥" },
    { id: 3, course: "מבוא לשינה 🛌",         difficulty: "קל ורגוע 💤" },
    { id: 4, course: "קריפטו לחתולים 🐈",    difficulty: "הזוי 🚀" },
    { id: 7, course: "אסטרופיזיקת בננות 🌌", difficulty: "מפוצץ מוחות 🧠" },
    { id: 8, course: "מבוא לקליפות 🎓",      difficulty: "חלקלק מאוד 🛹" }
];
const joinExplanations = {
    inner: { title:"🧬 INNER JOIN", desc:"רק שורות עם ID תואם בשני הצדדים עוברות. שאר השורות עפות לפח! IDs: 2,3,7 מתמזגים." },
    left:  { title:"🔵 LEFT JOIN",  desc:"כל שורות הטבלה השמאלית נשמרות. שורות ללא התאמה מקבלות NULL מהימין." },
    right: { title:"🔴 RIGHT JOIN", desc:"כל שורות הטבלה הימנית נשמרות. שורות ללא התאמה מקבלות NULL מהשמאל." },
    full:  { title:"🟣 FULL OUTER", desc:"כולם בפנים! גם שמאל בלי ימין, גם ימין בלי שמאל – כולם מקבלים NULL ידידותי." }
};

// ───────────────────── GAME STATE ────────────────────────────
// IMPORTANT: challengeProgress = מספר האתגרים שהושלמו בהצלחה (0 בהתחלה).
// שלב idx נגיש אם idx < challengeProgress OR idx === 0 (השלב הראשון תמיד פתוח).
// כשמשלימים שלב idx: challengeProgress = max(challengeProgress, idx+1).
// isAnsweredCorrectly מוגדר רק AFTER submitChallengeAnswer – מתאפס בכל loadChallenge.

let currentMode          = 'sandbox';
let activeJoinType       = 'inner';
let challengeProgress    = 0;       // how many challenges completed
let currentChallengeIdx  = 0;       // which challenge is showing
let isAnsweredCorrectly  = null;    // null=not yet answered, true=correct, false=wrong

// ───────────────────── CHALLENGES DATA ───────────────────────
const challenges = [
    {
        id: 0,
        emoji: "🎉",
        title: "מסיבת הבננה הסודית",
        story: `ננו בננה מארגן מסיבה מטורפת 🎉 אבל יש בעיה: רק סטודנטים שיש להם קורס בתקף מקבלים כרטיס כניסה!
<br><br>
<strong>🎯 המטרה:</strong> חברו את שתי הטבלאות כך שתישאר <em>רק</em> טבלת מיזוג שבה <strong>כל שורה מכילה גם סטודנט וגם קורס</strong> – אין NULL, אין חצי שורות.
<br><br>
💡 <em>רמז של ננו:</em> "אם לסטודנט אין קורס – הוא לא בפנים. אם לקורס אין סטודנט – גם הוא בחוץ. רק הקבוצה המשותפת!"`,
        leftLabel: "👦 סטודנטים (שמאל)",
        rightLabel: "📚 קורסים (ימין)",
        leftData:  [
            { ID: 10, שם: "ליאור 🔨" },
            { ID: 20, שם: "ננו בננה ג'וניור 🍌" },
            { ID: 30, שם: "רועי השותק 🤫" }
        ],
        rightData: [
            { ID: 20, קורס: "שייק בננה מולקולרי 🧪" },
            { ID: 30, קורס: "טיגון קליפות מתקדם 🍳" },
            { ID: 40, קורס: "אפיית עוגת בננות 🍰" }
        ],
        goalLabel: "🎯 טבלת היעד – בדיוק זה צריך לצאת:",
        goalNote:  "שימו לב: ליאור (ID 10) ו'אפיית עוגות' (ID 40) לא מופיעים כלל!",
        goalHeaders: ["ID סטודנט", "שם סטודנט", "ID קורס", "שם קורס"],
        goalData: [
            { a: 20, b: "ננו בננה ג'וניור 🍌", c: 20, d: "שייק בננה מולקולרי 🧪" },
            { a: 30, b: "רועי השותק 🤫",      c: 30, d: "טיגון קליפות מתקדם 🍳" }
        ],
        correctAnswer: "inner",
        successMsg: `🎉 <strong>INNER JOIN!</strong> נכון בול! רק שורות עם ID תואם בשני הצדדים עוברות. ליאור (ID 10) אין קורס – נזרק לפח. קורס 40 (אפייה) אין סטודנט – גם נזרק לפח. רק 20 ו-30 שרדו!`
    },
    {
        id: 1,
        emoji: "📋",
        title: "אף בננה לא נשארת מאחור!",
        story: `הנהלת המעבדה רוצה לשלוח דרישת תשלום לכל הסטודנטים 💸
<br><br>
<strong>🎯 המטרה:</strong> חברו את הטבלאות כך ש<strong>כל הסטודנטים מהטבלה השמאלית יופיעו</strong>, גם אם אין להם קורס. סטודנטים בלי קורס יקבלו <span style="color:#22c55e;font-weight:900">NULL</span> בעמודת הקורס.
<br><br>
💡 <em>רמז של ננו:</em> "מי שכותב LEFT – הטבלה השמאלית היא המלכה! כולה נשמרת!"`,
        leftLabel: "👦 כל הסטודנטים (שמאל)",
        rightLabel: "📚 קורסים (ימין)",
        leftData: [
            { ID: 1, שם: "מיקה המרחפת 🎈" },
            { ID: 2, שם: "דניאל הבננה 🏃" },
            { ID: 3, שם: "תומר העייף 😴" }
        ],
        rightData: [
            { ID: 1, קורס: "אינטרפולציה של בננות 📈" },
            { ID: 3, קורס: "תורת הקליפה החלקלקה 🛹" },
            { ID: 4, קורס: "ניהול מריבות חתולים 🐈" }
        ],
        goalLabel: "🎯 טבלת היעד – בדיוק זה צריך לצאת:",
        goalNote:  "שימו לב: דניאל (ID 2) מופיע עם NULL בקורס! קורס ID=4 לא מופיע כלל.",
        goalHeaders: ["ID", "שם סטודנט", "קורס"],
        goalData: [
            { a: 1, b: "מיקה המרחפת 🎈", c: "אינטרפולציה של בננות 📈" },
            { a: 2, b: "דניאל הבננה 🏃",  c: "NULL" },
            { a: 3, b: "תומר העייף 😴",   c: "תורת הקליפה החלקלקה 🛹" }
        ],
        correctAnswer: "left",
        successMsg: `✅ <strong>LEFT JOIN!</strong> מושלם! כל הסטודנטים (טבלה שמאלית) מופיעים. דניאל (ID 2) אין לו קורס אז הוא מקבל NULL. קורס 4 (ניהול מריבות חתולים) אין לו סטודנט אז הוא נעלם!`
    },
    {
        id: 2,
        emoji: "😰",
        title: "המרצים בחרדות קיומיות",
        story: `ועדת המל"ג בודקת אילו קורסים נסגרים 😰 הם רוצים לראות את <em>כל הקורסים</em>, גם אם אף סטודנט לא נרשם!
<br><br>
<strong>🎯 המטרה:</strong> חברו את הטבלאות כך ש<strong>כל הקורסים מהטבלה הימנית יופיעו</strong>. קורסים ללא סטודנט יקבלו <span style="color:#22c55e;font-weight:900">NULL</span> בעמודת הסטודנט.
<br><br>
💡 <em>רמז של ננו:</em> "מי שכותב RIGHT – הטבלה הימנית היא המלכה! כולה נשמרת!"`,
        leftLabel: "👦 סטודנטים (שמאל)",
        rightLabel: "📚 כל הקורסים (ימין)",
        leftData: [
            { ID: 2, שם: "אורן הבננה הזוהרת 🌟" },
            { ID: 3, שם: "קרן הארנבת 🐰" }
        ],
        rightData: [
            { ID: 1, קורס: "פילוסופיה של בננות מיובשות 💭" },
            { ID: 2, קורס: "הנדסת כריכי קליפות 🥪" },
            { ID: 3, קורס: "שפת הקופים המתקדמת 🐒" }
        ],
        goalLabel: "🎯 טבלת היעד – בדיוק זה צריך לצאת:",
        goalNote:  "שימו לב: קורס ID=1 (פילוסופיה) מופיע עם NULL בסטודנט! אורן וקרן מופיעים רק כי יש להם קורס תואם.",
        goalHeaders: ["שם סטודנט", "ID קורס", "שם קורס"],
        goalData: [
            { a: "NULL", b: 1, c: "פילוסופיה של בננות מיובשות 💭" },
            { a: "אורן הבננה הזוהרת 🌟", b: 2, c: "הנדסת כריכי קליפות 🥪" },
            { a: "קרן הארנבת 🐰", b: 3, c: "שפת הקופים המתקדמת 🐒" }
        ],
        correctAnswer: "right",
        successMsg: `✅ <strong>RIGHT JOIN!</strong> מצוין! כל הקורסים (טבלה ימנית) מופיעים. קורס 1 (פילוסופיה) אין לו סטודנט – מקבל NULL. שאר הסטודנטים מופיעים כי יש להם קורס תואם!`
    },
    {
        id: 3,
        emoji: "🌪️",
        title: "דוח הכאוס המוחלט!",
        story: `המזכירה שוברת את הקיר ורוצה <em>הכל</em>! כל סטודנט, כל קורס, בלי יוצא מן הכלל 🌪️
<br><br>
<strong>🎯 המטרה:</strong> חברו את הטבלאות כך ש<strong>כל שורה משתי הטבלאות תופיע</strong>, גם אם אין התאמה. ייווצרו שורות עם NULL משני הצדדים.
<br><br>
💡 <em>רמז של ננו:</em> "FULL OUTER = אהבת חינם לכל הנתונים. אף אחד לא נזרק לפח!"`,
        leftLabel: "👦 סטודנטים (שמאל)",
        rightLabel: "📚 קורסים (ימין)",
        leftData: [
            { ID: 5, שם: "שירה הבננה המנגנת 🎵" },
            { ID: 6, שם: "אסף מלך הבננות 👑" }
        ],
        rightData: [
            { ID: 6, קורס: "שיגור בננות לחלל 🚀" },
            { ID: 7, קורס: "שינה אקטיבית על קליפה 💤" }
        ],
        goalLabel: "🎯 טבלת היעד – בדיוק זה צריך לצאת:",
        goalNote:  "שימו לב: שירה (ID 5) אין לה קורס → NULL קורס. קורס 7 אין לו סטודנט → NULL סטודנט!",
        goalHeaders: ["ID סטודנט", "שם סטודנט", "ID קורס", "שם קורס"],
        goalData: [
            { a: 5,      b: "שירה הבננה המנגנת 🎵", c: "NULL", d: "NULL" },
            { a: 6,      b: "אסף מלך הבננות 👑",    c: 6,      d: "שיגור בננות לחלל 🚀" },
            { a: "NULL", b: "NULL",                   c: 7,      d: "שינה אקטיבית על קליפה 💤" }
        ],
        correctAnswer: "full",
        successMsg: `🌪️ <strong>FULL OUTER JOIN!</strong> הצלחתם לארגן את הכאוס! שירה (ID 5) ללא קורס → NULL. קורס 7 ללא סטודנט → NULL. אסף (ID 6) ← → קורס 6: התאמה מושלמת!`
    },
    {
        id: 4,
        emoji: "🍜",
        title: "בונוס: פילוסופיית הנודל (Relationship)",
        story: `ננו בננה שולף בננה מוזהבת ✨ "עצור! ב-Tableau המודרני כמעט לא עושים Joins פיזיים קשיחים שמכפילים שורות!
<br><br>
<strong>🎯 השאלה:</strong> איך לקשר טבלאות בצורה <em>לוגית וגמישה</em>, כך שהן יישארו נפרדות ויתחברו רק לפי מה שבונים בדשבורד?
<br><br>
💡 <em>הסוד הגדול:</em> Tableau Relationship = 'קשר נודל' 🍜. הטבלאות לא מתמזגות פיזית – הן נקשרות בחוט לוגי ו-Tableau יוצר את ה-SQL הנכון בזמן אמת!`,
        leftLabel: "👦 טבלה שמאלית",
        rightLabel: "📚 טבלה ימנית",
        leftData:  [{ ID: 1, שם: "ננו בננה 🍌" }],
        rightData: [{ ID: 1, קורס: "מדעי הנודל המתקדמים 🍜" }],
        goalLabel: "🎯 מה שצריך לבחור:",
        goalNote:  "לא Join! אלא Relationship – קשר לוגי ללא מיזוג פיזי",
        goalHeaders: ["סוג הקשר", "תיאור"],
        goalData: [
            { a: "Relationship 🍜", b: "קשר לוגי גמיש – ללא כפל שורות, ללא NULL מיותרים" }
        ],
        correctAnswer: "relationship",
        successMsg: `🍜 <strong>Relationship!</strong> גאון! Tableau Relationships לא ממזגים פיזית. הן יוצרות שאילתות SQL חכמות בזמן אמת. אין כפל שורות, אין NULL מיותרים – הנתונים שלכם נשארים נקיים!`
    }
];

// ───────────────────── GAME STATE HELPERS ─────────────────────

/** 
 * האם השלב עם index idx נגיש לשחקן?
 * שלב 0 תמיד פתוח. שאר השלבים נפתחים לאחר השלמת הקודם.
 */
function isChallengeUnlocked(idx) {
    if (idx === 0) return true;
    return idx <= challengeProgress;
}

/**
 * מסמן שלב כהושלם ועדכן progress
 */
function markChallengeComplete(idx) {
    if (idx + 1 > challengeProgress) {
        challengeProgress = idx + 1;
    }
}

// ───────────────────── INIT ───────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    renderSourceTables();
    selectJoinType('inner');
    renderChallengeList();
    loadChallenge(0);

    // Warm up audio on first click
    document.body.addEventListener('click', () => initAudio(), { once: true });

    // Banana mascot intro
    setTimeout(() => {
        const bubble = document.getElementById('banana-bubble');
        if (bubble) bubble.textContent = "לחצו עליי לטיפים! 🍌✨";
    }, 1800);
});

// ───────────────────── TAB SWITCHING ─────────────────────────
function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.nav-tab-bright-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `tab-${mode}`);
        btn.setAttribute('aria-selected', btn.id === `tab-${mode}`);
    });
    document.querySelectorAll('.mode-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === `${mode}-section`);
    });
    if (mode === 'sandbox') selectJoinType(activeJoinType);
}

// ───────────────────── SANDBOX ───────────────────────────────
function renderSourceTables() {
    document.querySelector("#table-students tbody").innerHTML =
        studentsData.map(st =>
            `<tr id="left-row-${st.id}">
              <td><strong>${st.id}</strong></td>
              <td>${st.name}</td>
              <td>${st.attribute}</td>
            </tr>`
        ).join('');

    document.querySelector("#table-courses tbody").innerHTML =
        coursesData.map(co =>
            `<tr id="right-row-${co.id}">
              <td><strong>${co.id}</strong></td>
              <td>${co.course}</td>
              <td>${co.difficulty}</td>
            </tr>`
        ).join('');
}

function selectJoinType(joinType) {
    activeJoinType = joinType;
    document.querySelectorAll('.btn-join-select-bright').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${joinType}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update venn
    const venn = document.getElementById('interactive-venn');
    venn.className.baseVal = "";
    const map = {
        inner: ['active-intersection'],
        left:  ['active-left','active-intersection','active-left-only'],
        right: ['active-right','active-intersection'],
        full:  ['active-left','active-right','active-intersection']
    };
    (map[joinType] || []).forEach(c => venn.classList.add(c));

    // Update explanation
    const exp = joinExplanations[joinType];
    document.getElementById('join-explanation').innerHTML =
        `<div><strong>${exp.title}</strong><br><span style="font-size:0.83rem">${exp.desc}</span></div>`;

    const rows = calculateJoin(studentsData, coursesData, joinType);
    renderResultTable(rows);
    runFusionAnimation(studentsData, coursesData, joinType);
}

function calculateJoin(leftTab, rightTab, type) {
    if (type === 'inner') {
        return leftTab.flatMap(st => {
            const m = rightTab.find(co => co.id === st.id);
            return m ? [{ id_left: st.id, name: st.name, attribute: st.attribute, id_right: m.id, course: m.course, difficulty: m.difficulty }] : [];
        });
    }
    if (type === 'left') {
        return leftTab.map(st => {
            const m = rightTab.find(co => co.id === st.id);
            return m
                ? { id_left: st.id, name: st.name, attribute: st.attribute, id_right: m.id, course: m.course, difficulty: m.difficulty }
                : { id_left: st.id, name: st.name, attribute: st.attribute, id_right:'NULL', course:'NULL', difficulty:'NULL' };
        });
    }
    if (type === 'right') {
        return rightTab.map(co => {
            const m = leftTab.find(st => st.id === co.id);
            return m
                ? { id_left: m.id, name: m.name, attribute: m.attribute, id_right: co.id, course: co.course, difficulty: co.difficulty }
                : { id_left:'NULL', name:'NULL', attribute:'NULL', id_right: co.id, course: co.course, difficulty: co.difficulty };
        });
    }
    if (type === 'full') {
        const ids = [...new Set([...leftTab.map(s=>s.id),...rightTab.map(c=>c.id)])].sort((a,b)=>a-b);
        return ids.map(id => {
            const st = leftTab.find(s=>s.id===id);
            const co = rightTab.find(c=>c.id===id);
            return {
                id_left:   st ? st.id        : 'NULL',
                name:      st ? st.name      : 'NULL',
                attribute: st ? st.attribute : 'NULL',
                id_right:  co ? co.id        : 'NULL',
                course:    co ? co.course    : 'NULL',
                difficulty:co ? co.difficulty: 'NULL'
            };
        });
    }
    return [];
}

function renderResultTable(rows) {
    const nullCell = v => v==='NULL' ? `<span class="null-cell">NULL 👻</span>` : v;
    document.getElementById('result-row-count').textContent = `${rows.length} שורות`;
    document.getElementById('result-table-headers').innerHTML =
        `<th>ID (שמאל)</th><th>שם סטודנט</th><th>תכונה</th><th>ID (ימין)</th><th>קורס</th><th>קושי</th>`;

    if (!rows.length) {
        document.getElementById('result-table-body').innerHTML =
            `<tr><td colspan="6" class="placeholder-row-bright">אין התאמות – המכונה ריקה! 🍌</td></tr>`;
        return;
    }
    document.getElementById('result-table-body').innerHTML = rows.map(r => {
        let cls = 'result-row-inner';
        if (r.id_left  === 'NULL') cls = 'result-row-right-null';
        if (r.id_right === 'NULL') cls = 'result-row-left-null';
        return `<tr class="${cls}">
          <td>${nullCell(r.id_left)}</td><td>${nullCell(r.name)}</td>
          <td>${nullCell(r.attribute)}</td><td>${nullCell(r.id_right)}</td>
          <td>${nullCell(r.course)}</td><td>${nullCell(r.difficulty)}</td>
        </tr>`;
    }).join('');
}

// ───────────────────── FUSION ANIMATION ──────────────────────
function runFusionAnimation(leftTab, rightTab, type) {
    const floor = document.getElementById('fusion-animation-floor');
    const status = document.getElementById('chamber-status-text');
    const reactor = document.getElementById('reactor-core');

    // Clear animated items (keep structure)
    Array.from(floor.children).forEach(c => {
        if (!c.classList.contains('quantum-tunnel-bright') && c.id !== 'reactor-core' && !c.classList.contains('trash-bin-indicator')) {
            c.remove();
        }
    });

    playSound('fusion');
    reactor.style.animation = 'rotateSymbol 0.4s infinite linear';
    status.textContent = "🚨 ננו בננה מפעיל את התנור! מיזוג בננות בעיצומו...";

    document.querySelectorAll('#table-students tbody tr, #table-courses tbody tr').forEach(r => r.className = "");

    const spawnParticle = (id, label, side, hasMatch) => {
        const isLeft = side === 'left';
        const rowDOM = document.getElementById(isLeft ? `left-row-${id}` : `right-row-${id}`);
        if (rowDOM) rowDOM.className = isLeft ? "row-active-left" : "row-active-right";

        const p = document.createElement('div');
        p.className = `particle-item ${isLeft ? 'particle-left fly-to-center-left' : 'particle-right fly-to-center-right'}`;
        p.innerHTML = `<span>ID:${id}</span> <strong>${label}</strong>`;
        floor.appendChild(p);

        setTimeout(() => {
            if (hasMatch) {
                createImpactRipple();
            } else if ((isLeft && (type==='inner'||type==='right')) || (!isLeft && (type==='inner'||type==='left'))) {
                p.style.animation = 'throwToTrash 0.8s forwards ease-in-out';
                showTrashBin(isLeft ? 'left' : 'right');
            } else {
                spawnNullGhost(isLeft ? 'right' : 'left');
            }
        }, 620);
    };

    leftTab.forEach((st, i) => setTimeout(() => {
        spawnParticle(st.id, st.name, 'left', rightTab.some(co => co.id === st.id));
    }, i * 220));

    rightTab.forEach((co, i) => setTimeout(() => {
        spawnParticle(co.id, co.course.split(' ')[0], 'right', leftTab.some(st => st.id === co.id));
    }, i * 220 + 130));

    setTimeout(() => {
        reactor.style.animation = 'rotateSymbol 4s infinite linear';
        status.textContent = "✅ המיזוג הושלם! ננו בננה מרוצה.";
        document.querySelectorAll('#table-students tbody tr, #table-courses tbody tr').forEach(r => r.className = "");
    }, 2200);
}

function createImpactRipple() {
    const floor = document.getElementById('fusion-animation-floor');
    const rip = document.createElement('div');
    Object.assign(rip.style, {
        position:'absolute', width:'28px', height:'28px',
        borderRadius:'50%', border:'3px solid var(--border-dark)',
        background:'var(--pop-yellow)', left:'45%', top:'40%',
        transform:'translate(-50%,-50%)', animation:'impactAnim 0.6s forwards ease-out',
        zIndex:'6', pointerEvents:'none'
    });
    floor.appendChild(rip);
    const st = document.createElement('style');
    st.textContent = `@keyframes impactAnim{0%{width:28px;height:28px;opacity:1;transform:translate(-50%,-50%) scale(1)}100%{width:130px;height:130px;opacity:0;transform:translate(-50%,-50%) scale(1.5)}}`;
    document.head.appendChild(st);
    setTimeout(() => { rip.remove(); }, 700);
}

function spawnNullGhost(side) {
    const floor = document.getElementById('fusion-animation-floor');
    const tmpl  = document.getElementById('null-ghost-template');
    if (!tmpl || !tmpl.firstElementChild) return;
    const ghost = tmpl.firstElementChild.cloneNode(true);
    ghost.classList.remove('hidden');
    ghost.classList.add(side === 'left' ? 'ghost-spawn-left' : 'ghost-spawn-right');
    floor.appendChild(ghost);
}

function showTrashBin(side) {
    let bin = document.querySelector(`.trash-bin-${side}`);
    if (!bin) {
        bin = document.createElement('div');
        bin.className = `trash-bin-indicator trash-bin-${side}`;
        bin.textContent = '🗑️';
        document.getElementById('fusion-animation-floor').appendChild(bin);
    }
    bin.style.opacity = '1';
    bin.style.transform = 'scale(1.5) rotate(18deg)';
    setTimeout(() => { bin.style.opacity='0'; bin.style.transform=''; }, 1000);
}

// ───────────────────── CHALLENGES ────────────────────────────

function renderChallengeList() {
    const ul = document.getElementById('challenge-list-container');
    ul.innerHTML = challenges.map((ch, idx) => {
        const unlocked  = isChallengeUnlocked(idx);
        const completed = idx < challengeProgress;
        const active    = idx === currentChallengeIdx;

        let badge = unlocked
            ? (completed ? '<span class="ch-badge-status ch-badge-check">✓</span>'
                         : `<span class="ch-badge-status ch-badge-active">${idx+1}</span>`)
            : '<span class="ch-badge-status ch-badge-lock">🔒</span>';

        let cls = 'challenge-list-item';
        if (active)    cls += ' active';
        if (completed) cls += ' completed';
        if (!unlocked) cls += ' locked-item';

        return `<li class="${cls}" onclick="selectChallenge(${idx})">
          <span style="font-size:1.1rem">${ch.emoji}</span>
          <span class="ch-title-text" style="flex:1;font-weight:800;margin-right:0.5rem">${ch.title}</span>
          ${badge}
        </li>`;
    }).join('');

    const pct = (challengeProgress / challenges.length) * 100;
    document.getElementById('challenge-progress-fill').style.width = `${pct}%`;
    document.getElementById('challenge-progress-text').textContent = `${challengeProgress} / ${challenges.length} הושלמו`;
}

function selectChallenge(idx) {
    if (!isChallengeUnlocked(idx)) {
        playSound('failure');
        alert(`🔒 השלב "${challenges[idx].title}" עדיין נעול! השלימו את השלב הקודם קודם.`);
        return;
    }
    currentChallengeIdx = idx;
    loadChallenge(idx);
    renderChallengeList();
}

function loadChallenge(idx) {
    const ch = challenges[idx];

    // ── Reset state ──────────────────────────────────────────
    isAnsweredCorrectly = null;   // ← CRITICAL: reset before any new challenge

    // ── Header ──────────────────────────────────────────────
    document.getElementById('curr-challenge-level').textContent = `משימה ${idx+1} / ${challenges.length}`;
    document.getElementById('curr-challenge-title').textContent = ch.title;
    document.getElementById('curr-challenge-desc').innerHTML  = ch.story;

    // ── Table titles ─────────────────────────────────────────
    document.getElementById('left-mini-title').textContent  = ch.leftLabel;
    document.getElementById('right-mini-title').textContent = ch.rightLabel;

    // ── Render tables ─────────────────────────────────────────
    renderMiniTable('mini-table-left',  'mini-left-headers',  Object.keys(ch.leftData[0]),  ch.leftData);
    renderMiniTable('mini-table-right', 'mini-right-headers', Object.keys(ch.rightData[0]), ch.rightData);
    renderGoalTable(ch);

    // ── Goal box labels ───────────────────────────────────────
    const goalBox = document.getElementById('challenge-goal-box-label');
    if (goalBox) goalBox.innerHTML = ch.goalLabel;
    const goalNote = document.getElementById('challenge-goal-note');
    if (goalNote) goalNote.textContent = ch.goalNote;

    // ── Noodle / Join buttons ─────────────────────────────────
    const noodleBtn = document.getElementById('btn-noodle-ch');
    if (noodleBtn) noodleBtn.classList.toggle('hidden', idx !== 4);

    // ── Hide feedback overlay ─────────────────────────────────
    document.getElementById('challenge-feedback').classList.add('hidden');
    document.getElementById('noodle-animation-container').classList.add('hidden');

    // ── Highlight join buttons to show what's available ───────
    document.querySelectorAll('.btn-challenge-action-bright').forEach(b => {
        b.classList.remove('selected-answer');
    });
}

function renderMiniTable(tableId, headerId, keys, data) {
    const hdr  = document.getElementById(headerId);
    const body = document.querySelector(`#${tableId} tbody`);
    hdr.innerHTML  = keys.map(k => `<th>${k}</th>`).join('');
    body.innerHTML = data.map(row =>
        `<tr>${Object.values(row).map(v =>
            v === 'NULL'
                ? `<td class="null-cell">NULL 👻</td>`
                : `<td>${v}</td>`
        ).join('')}</tr>`
    ).join('');
}

function renderGoalTable(ch) {
    const hdr  = document.getElementById('mini-goal-headers');
    const body = document.querySelector('#mini-table-goal tbody');
    hdr.innerHTML  = ch.goalHeaders.map(h => `<th>${h}</th>`).join('');
    body.innerHTML = ch.goalData.map(row =>
        `<tr>${Object.values(row).map(v =>
            String(v) === 'NULL'
                ? `<td class="null-cell">NULL 👻</td>`
                : `<td>${v}</td>`
        ).join('')}</tr>`
    ).join('');
}

// ─────────── SUBMIT ANSWER ───────────────────────────────────
function submitChallengeAnswer(selectedAnswer) {
    initAudio();

    // Prevent double-answering if already answered correctly
    if (isAnsweredCorrectly === true) return;

    const ch = challenges[currentChallengeIdx];

    // Highlight which button was pressed
    document.querySelectorAll('.btn-challenge-action-bright').forEach(b => b.classList.remove('selected-answer'));
    const pressedBtn = document.querySelector(`.btn-${selectedAnswer}-ch`);
    if (pressedBtn) pressedBtn.classList.add('selected-answer');

    const isCorrect = (selectedAnswer === ch.correctAnswer);
    isAnsweredCorrectly = isCorrect;

    const overlay  = document.getElementById('challenge-feedback');
    const fIcon    = document.getElementById('feedback-icon');
    const fTitle   = document.getElementById('feedback-title');
    const fText    = document.getElementById('feedback-text');
    const nextBtn  = document.getElementById('btn-next-level');

    overlay.classList.remove('hidden');

    if (isCorrect) {
        playSound('success');
        fIcon.textContent  = "🍌🎉";
        fTitle.textContent = "תשובה בננה! כל הכבוד!";
        fTitle.style.color = "var(--pop-null)";
        fText.innerHTML    = ch.successMsg;

        // Mark complete ONLY now
        markChallengeComplete(currentChallengeIdx);

        if (selectedAnswer === 'relationship') {
            document.getElementById('noodle-animation-container').classList.remove('hidden');
        }

        const isLast = currentChallengeIdx === challenges.length - 1;
        nextBtn.textContent = isLast ? "🏆 סיימתם את כל האתגרים!" : "המשך לשלב הבא ➔";
    } else {
        playSound('failure');
        fIcon.textContent  = "🍌❌";
        fTitle.textContent = "אופס! החלקתם על בננה!";
        fTitle.style.color = "var(--pop-right)";

        const labels = {
            inner:'INNER JOIN', left:'LEFT JOIN', right:'RIGHT JOIN',
            full:'FULL OUTER JOIN', relationship:'Relationship'
        };
        fText.innerHTML = `
          <strong>${labels[selectedAnswer] || selectedAnswer}</strong> לא ייצר בדיוק את טבלת היעד המבוקשת.<br><br>
          חזרו לבדוק: האם יש NULL בטבלת היעד? אם כן – אחת הטבלאות "שולטת". 
          אם אין NULL כלל – רק ההתאמות נשארות. 💡
        `;
        nextBtn.textContent = "נסו שוב 🔄";
    }

    renderChallengeList();
}

// ─────────── NEXT CHALLENGE (called from HTML button) ────────
function nextChallenge() {
    initAudio();
    document.getElementById('challenge-feedback').classList.add('hidden');

    if (isAnsweredCorrectly !== true) {
        // Wrong answer – just close modal, try again
        return;
    }

    const isLast = currentChallengeIdx === challenges.length - 1;
    if (isLast) {
        playSound('success');
        showVictoryScreen();
        return;
    }

    // Move to next
    currentChallengeIdx++;
    loadChallenge(currentChallengeIdx);   // ← this resets isAnsweredCorrectly = null
    renderChallengeList();
}

// ─────────── VICTORY SCREEN ──────────────────────────────────
function showVictoryScreen() {
    const overlay = document.getElementById('challenge-feedback');
    overlay.classList.remove('hidden');
    document.getElementById('feedback-icon').textContent  = "🏆🍌🎊";
    document.getElementById('feedback-title').textContent = "מאסטרים של Tableau Joins!";
    document.getElementById('feedback-title').style.color = "var(--pop-purple)";
    document.getElementById('feedback-text').innerHTML = `
        <strong>השלמתם את כל 5 האתגרים!</strong><br><br>
        ✅ INNER JOIN – רק התאמות מושלמות<br>
        ✅ LEFT JOIN – כל הטבלה השמאלית<br>
        ✅ RIGHT JOIN – כל הטבלה הימנית<br>
        ✅ FULL OUTER – כולם בפנים<br>
        ✅ Relationship – הקשר הלוגי של Tableau<br><br>
        ננו בננה גאה בכם! 🍌✨
    `;
    document.getElementById('btn-next-level').textContent = "שחקו שוב! 🔄";
    document.getElementById('btn-next-level').onclick = () => {
        challengeProgress   = 0;
        currentChallengeIdx = 0;
        isAnsweredCorrectly = null;
        overlay.classList.add('hidden');
        loadChallenge(0);
        renderChallengeList();
        document.getElementById('btn-next-level').onclick = nextChallenge; // restore
    };
}
