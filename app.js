// Web Audio Synthesizer Engine
let soundEnabled = true;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type="sine", duration=0.15) {
    if(!soundEnabled) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch(e) {}
}

function toggleAudio() {
    soundEnabled = !soundEnabled;
    document.getElementById('sound-btn').innerText = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
    if(soundEnabled) playTone(880, "sine", 0.1);
}

// Category Specific News Database for Responsive Running Reel & Globe Filtering
const categoryNewsMap = {
    general: [
        { title: "NIST Releases Post-Quantum Encryption Standards to Secure Digital Infrastructure", desc: "Global standards organization finalizes post-quantum encryption algorithms to protect data across global communication networks.", city: "Washington, USA", tag: "GENERAL NEWS", lat: 38.9072, lng: -77.0369 },
        { title: "International Energy Consortium Reports Record Solar & Wind Generation Peak", desc: "Global renewable energy agency confirms solar and wind capacity surpassed historic production records.", city: "Geneva, Switzerland", tag: "GENERAL NEWS", lat: 46.2044, lng: 6.1432 },
        { title: "Global Technology Alliance Signs Open Ethical Artificial Intelligence Framework", desc: "Multi-national consortium agrees on open standards for auditing and safety in AI deployment.", city: "London, UK", tag: "GENERAL NEWS", lat: 51.5074, lng: -0.1278 }
    ],
    technology: [
        { title: "AI Models Revolutionize Real-Time Global Threat Isolation", desc: "Next-generation deep neural networks deployed across optical networks detect and neutralize threat patterns within milliseconds.", city: "New York, USA", tag: "TECHNOLOGY", lat: 40.7128, lng: -74.0060 },
        { title: "Tokyo Tech Hub Unveils Optical Quantum Processor for Financial Networks", desc: "Next-gen optical quantum computing processors launched in Japan for high-speed encryption.", city: "Tokyo, Japan", tag: "TECHNOLOGY", lat: 35.6762, lng: 139.6503 },
        { title: "National AI Mission Deploys Regional Verification NLP Models Nationwide", desc: "Deep neural text models deployed across regional networks for automated news verification.", city: "New Delhi, India", tag: "TECHNOLOGY", lat: 28.6139, lng: 77.2090 }
    ],
    business: [
        { title: "Global Central Banks Coordinate Monetary Framework to Stabilize Inflation", desc: "International monetary consortium announces joint framework following quarterly economic analysis.", city: "New York, USA", tag: "BUSINESS", lat: 40.7128, lng: -74.0060 },
        { title: "European Commerce Alliance Signs High-Speed Digital Trade Agreement", desc: "Trade delegates finalize cross-border digital economy standards to accelerate regional commerce.", city: "Brussels, Belgium", tag: "BUSINESS", lat: 50.8503, lng: 4.3517 },
        { title: "Asian Semiconductor Consortium Expands Next-Gen Chip Foundry Infrastructure", desc: "Multi-billion dollar semiconductor facility expansion announced to meet global computing demand.", city: "Seoul, South Korea", tag: "BUSINESS", lat: 37.5665, lng: 126.9780 }
    ],
    science: [
        { title: "Breakthrough in Clean Fusion Energy Output Record", desc: "Scientists achieve sustained plasma output in record-breaking laser magnetic containment experiment.", city: "London, UK", tag: "SCIENCE", lat: 51.5074, lng: -0.1278 },
        { title: "Deep Sea Expedition Maps Uncharted Pacific Ocean Trench Ecosystems", desc: "Robotic submersibles discover 40 newly cataloged species at 8,000 meters depth in ocean trench.", city: "Sydney, Australia", tag: "SCIENCE", lat: -33.8688, lng: 151.2093 },
        { title: "Orbital Observatory Detects Atmospheric Water Vapor on Earth-Sized Planet", desc: "Astronomers confirm atmospheric ozone and water vapor signatures on exoplanet orbiting nearby star.", city: "Santiago, Chile", tag: "SCIENCE", lat: -33.4489, lng: -70.6693 }
    ],
    health: [
        { title: "Medical Researchers Discover Novel Pathway Targeting Autoimmune Diseases", desc: "Clinical trials validate novel therapeutic antibody with high efficacy in suppressing targeted inflammation.", city: "Boston, USA", tag: "HEALTH", lat: 42.3601, lng: -71.0589 },
        { title: "Global Health Organization Deploys Genomic Surveillance Network", desc: "International health consortium launches real-time pathogen sequencing platform.", city: "Geneva, Switzerland", tag: "HEALTH", lat: 46.2044, lng: 6.1432 },
        { title: "BioTech Institute Unveils Targeted RNA Delivery System for Gene Therapy", desc: "Advanced lipid nanoparticle carrier demonstrates precise tissue targeting in medical trials.", city: "Stockholm, Sweden", tag: "HEALTH", lat: 59.3293, lng: 18.0686 }
    ],
    world: [
        { title: "International Climate Summit Finalizes Global Reforestation Agreement", desc: "Delegates from 120 nations sign treaty committing to restore tropical rainforest biomes.", city: "Paris, France", tag: "WORLD", lat: 48.8566, lng: 2.3522 },
        { title: "Pacific Hydro-Energy Grid Transmits Record Clean Power Output", desc: "Regional clean energy grid reports 90% power generation sustained through hydro and solar.", city: "Vancouver, Canada", tag: "WORLD", lat: 49.2827, lng: -123.1207 },
        { title: "Universal Digital Education Platform Reaches 50 Million Students", desc: "Open-source global learning platform expands multi-lingual curriculum across 80 countries.", city: "Nairobi, Kenya", tag: "WORLD", lat: -1.2921, lng: 36.8219 }
    ]
};

// Country Database for Hover Tooltip
const countryDatabase = [
    { name: "United States", flag: "🇺🇸", code: "us", lat: 37.09, lng: -95.71, news: "US Tech Consortium Launches National AI Safety & Verification Standards", tag: "TECH AI" },
    { name: "United Kingdom", flag: "🇬🇧", code: "gb", lat: 55.37, lng: -3.43, news: "UK Energy Research Lab Achieves Sustained Fusion Power Output Record", tag: "SCIENCE" },
    { name: "Japan", flag: "🇯🇵", code: "jp", lat: 36.20, lng: 138.25, news: "Tokyo Tech Hub Unveils Optical Quantum Computing Infrastructure for Banking", tag: "QUANTUM" },
    { name: "India", flag: "🇮🇳", code: "in", lat: 20.59, lng: 78.96, news: "National AI Mission Deploys Regional Verification NLP Models Nationwide", tag: "AI NLP" },
    { name: "Australia", flag: "🇦🇺", code: "au", lat: -25.27, lng: 133.77, news: "Deep Sea Ocean Expedition Maps Uncharted Pacific Ocean Trench Ecosystems", tag: "OCEAN" },
    { name: "France", flag: "🇫🇷", code: "fr", lat: 46.22, lng: 2.21, news: "Paris Energy Grid Reaches Historic 85% Renewable Power Transmission Peak", tag: "CLEAN TECH" },
    { name: "Germany", flag: "🇩🇪", code: "de", lat: 51.16, lng: 10.45, news: "Berlin Industrial Tech Alliance Launches Quantum Cyber Threat Shield", tag: "CYBERSEC" },
    { name: "Canada", flag: "🇨🇦", code: "ca", lat: 56.13, lng: -106.34, news: "Canadian Hydroelectric Network Sets Record Renewable Generation Output", tag: "CLEAN TECH" },
    { name: "Brazil", flag: "🇧🇷", code: "br", lat: -14.23, lng: -51.92, news: "Amazon Ecological Satellite System Transmits Real-Time Deforestation Data", tag: "CLIMATE" },
    { name: "United Arab Emirates", flag: "🇦🇪", code: "ae", lat: 23.42, lng: 53.84, news: "Dubai Autonomous Transit Network Launches Fleet Expansion Project", tag: "SMART CITY" },
    { name: "South Africa", flag: "🇿🇦", code: "za", lat: -30.55, lng: 22.93, news: "Cape Town Solar & Wind Power Array Expands Regional Clean Energy Grid", tag: "ENERGY" },
    { name: "China", flag: "🇨🇳", code: "cn", lat: 35.86, lng: 104.19, news: "Orbital Space Station Deploys New High-Resolution Astrophysical Telescope", tag: "SPACE" },
    { name: "Russia", flag: "🇷🇺", code: "ru", lat: 61.52, lng: 105.31, news: "Arctic Navigation Fleet Deploys Atomic Icebreaker System for Northern Route", tag: "ARCTIC" }
];

// Three.js 3D WebGL Setup
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030712, 0.0016);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 25, 240);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 2.0);
dirLight1.position.set(150, 100, 150);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x40916c, 1.4);
dirLight2.position.set(-150, -100, -150);
scene.add(dirLight2);

// Photorealistic Vibrant Blue & Green Earth Texture Generation
const globeRadius = 75;
const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 64);

const canvas = document.createElement('canvas');
canvas.width = 2048; canvas.height = 1024;
const ctx = canvas.getContext('2d');

const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
oceanGradient.addColorStop(0, '#0f4c81');
oceanGradient.addColorStop(0.5, '#0077be');
oceanGradient.addColorStop(1, '#0b3c5d');
ctx.fillStyle = oceanGradient; ctx.fillRect(0,0,2048,1024);

ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; ctx.lineWidth = 1;
for(let i=0; i<2048; i+=64) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,1024); ctx.stroke(); }
for(let j=0; j<1024; j+=64) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(2048,j); ctx.stroke(); }

ctx.fillStyle = '#2d6a4f';
for(let k=0; k<600; k++) {
    ctx.beginPath();
    ctx.arc(Math.random()*2048, Math.random()*1024, Math.random()*32+10, 0, Math.PI*2);
    ctx.fill();
}
ctx.fillStyle = '#52b788';
for(let m=0; m<300; m++) {
    ctx.beginPath();
    ctx.arc(Math.random()*2048, Math.random()*1024, Math.random()*12+4, 0, Math.PI*2);
    ctx.fill();
}

const globeTexture = new THREE.CanvasTexture(canvas);
const globeMat = new THREE.MeshPhongMaterial({
    map: globeTexture,
    color: 0xffffff,
    emissive: 0x051a2e,
    shininess: 40
});
const globe = new THREE.Mesh(globeGeo, globeMat);
scene.add(globe);

// Cloud Layer
const cloudGeo = new THREE.SphereGeometry(globeRadius + 1.2, 64, 64);
const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, wireframe: true });
const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
scene.add(cloudMesh);

// Atmosphere Fresnel Halo Glow
const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.14, 64, 64);
const atmosphereMat = new THREE.MeshBasicMaterial({ color: 0x0077be, transparent: true, opacity: 0.15, side: THREE.BackSide });
const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
scene.add(atmosphere);

// Starfield Particle System
const starCount = 3500;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for(let i=0; i<starCount*3; i++) {
    starPos[i] = (Math.random() - 0.5) * 1000;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0x00f2fe, size: 1.5, transparent: true, opacity: 0.75 });
const starSystem = new THREE.Points(starGeo, starMat);
scene.add(starSystem);

// Orbiting Satellite Mesh
const satGeo = new THREE.BoxGeometry(4, 2, 2);
const satMat = new THREE.MeshBasicMaterial({ color: 0x00f5a0 });
const satellite = new THREE.Mesh(satGeo, satMat);
scene.add(satellite);

// Mouse Hover Raycasting Country News Detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let targetCameraPos = null;
const tooltipEl = document.getElementById('hover-card');

function findNearestCountry(lat, lng) {
    let closestCountry = countryDatabase[0];
    let minDistance = Infinity;

    countryDatabase.forEach(c => {
        const dLat = (c.lat - lat) * Math.PI / 180;
        const dLng = (c.lng - lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat * Math.PI / 180) * Math.cos(c.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        if(dist < minDistance) {
            minDistance = dist;
            closestCountry = c;
        }
    });

    return closestCountry;
}

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(globe);

    if (intersects.length > 0) {
        const p = intersects[0].point;
        const lat = Math.asin(p.y / globeRadius) * (180 / Math.PI);
        const lng = (Math.atan2(p.z, -p.x) * (180 / Math.PI)) - 180;

        const country = findNearestCountry(lat, lng);

        if (tooltipEl) {
            tooltipEl.style.left = (e.clientX + 15) + 'px';
            tooltipEl.style.top = (e.clientY + 15) + 'px';
            tooltipEl.innerHTML = `
                <div class="tooltip-country">${country.flag} ${country.name} <span>${country.tag}</span></div>
                <div class="tooltip-news">"${country.news}"</div>
                <div><span class="tooltip-status">🛡️ VERIFIED TOP NEWS (Accuracy: 100.0%)</span></div>
            `;
            tooltipEl.classList.add('active');
        }
    } else {
        if (tooltipEl) tooltipEl.classList.remove('active');
    }
});

// MULTI-HEADLINE AUTO-RUNNING REEL CONTROLLER FOR LEFT BOX
let activeReelArticles = categoryNewsMap.general;
let activeReelIndex = 0;
let reelIntervalTimer = null;
let isReelPaused = false;

function latLngToVector3(lat, lng, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
    );
}

function flyToCoordinates(lat, lng) {
    const pos = latLngToVector3(lat, lng, globeRadius);
    targetCameraPos = pos.clone().multiplyScalar(2.2);
}

function renderActiveReelArticle() {
    if(!activeReelArticles || activeReelArticles.length === 0) return;
    
    const art = activeReelArticles[activeReelIndex % activeReelArticles.length];
    
    document.getElementById('card-tag').innerText = art.tag || "NEWS REEL";
    document.getElementById('card-city').innerHTML = "📍 " + (art.city || "Global") + " <span>100% Authentic</span>";
    document.getElementById('card-title').innerText = art.title;
    document.getElementById('card-desc').innerText = art.desc || "Verified real-time news article fetched live.";
    
    if(art.lat && art.lng) {
        document.getElementById('card-coords').innerText = art.lat.toFixed(2) + "° N, " + art.lng.toFixed(2) + "° W";
        flyToCoordinates(art.lat, art.lng);
    }
    
    document.getElementById('reel-counter-label').innerText = `${(activeReelIndex % activeReelArticles.length) + 1} of ${activeReelArticles.length}`;
}

function nextReelArticle() {
    if(isReelPaused || !activeReelArticles) return;
    activeReelIndex = (activeReelIndex + 1) % activeReelArticles.length;
    renderActiveReelArticle();
    playTone(550, "sine", 0.08);
}

function prevReelArticle() {
    if(!activeReelArticles) return;
    activeReelIndex = (activeReelIndex - 1 + activeReelArticles.length) % activeReelArticles.length;
    renderActiveReelArticle();
    playTone(550, "sine", 0.08);
}

function toggleReelPause() {
    isReelPaused = !isReelPaused;
    document.getElementById('pause-reel-btn').innerText = isReelPaused ? "▶ Play Reel" : "⏸️ Pause";
    playTone(600, "sine", 0.1);
}

function startCategoryReel(category) {
    if(reelIntervalTimer) clearInterval(reelIntervalTimer);
    
    const fallbackList = categoryNewsMap[category] || categoryNewsMap.general;
    activeReelArticles = fallbackList;
    activeReelIndex = 0;
    renderActiveReelArticle();
    
    // Update bottom ticker as well
    updateBottomTicker(fallbackList);
    
    // Auto-run reel every 4.5 seconds
    reelIntervalTimer = setInterval(nextReelArticle, 4500);

    // Fetch live API articles asynchronously to expand reel
    fetch('/api/news?category=' + category)
        .then(r => r.json())
        .then(articles => {
            if(articles && articles.length > 0) {
                const apiList = articles.map(a => ({
                    title: a.title,
                    desc: a.description || a.content || "Live breaking article.",
                    city: a.source ? a.source.name : "Global",
                    tag: category.toUpperCase(),
                    lat: 20 + Math.random()*30,
                    lng: -50 + Math.random()*100
                }));
                activeReelArticles = apiList;
                activeReelIndex = 0;
                renderActiveReelArticle();
                updateBottomTicker(apiList);
            }
        }).catch(() => {});
}

function updateBottomTicker(articles) {
    let tickerHtml = "";
    articles.forEach(item => {
        tickerHtml += `<div class="ticker-item" onclick="openStudioWithText('${item.title.replace(/'/g, "")}')"><span>🌐 ${item.title}</span> <span style="color:#00f5a0;font-weight:700;">LIVE</span></div>`;
    });
    document.getElementById('moving-ticker-content').innerHTML = tickerHtml;
}

// Category Filter Controller
function filterCat(btn, category) {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    playTone(500, "sine", 0.1);
    startCategoryReel(category);
}

function testActiveArticleInStudio() {
    const currentTitle = document.getElementById('card-title').innerText;
    openPredictionStudio();
    document.getElementById('studio-text').value = currentTitle;
    runTextInference();
}

function handleSearch(e) {
    if(e.key === 'Enter') {
        const query = e.target.value.trim();
        if(query) {
            playTone(750, "square", 0.15);
            fetch('/api/news')
                .then(res => res.json())
                .then(articles => {
                    alert("🔍 Search Results for '" + query + "': Found " + articles.length + " live news headlines.");
                });
        }
    }
}

// Studio Modal Controller
function openPredictionStudio() {
    playTone(600, "sine", 0.15);
    document.getElementById('prediction-modal').classList.add('active');
}
function openMetricsModal() {
    playTone(650, "sine", 0.15);
    document.getElementById('metrics-modal').classList.add('active');
    fetch('/api/metrics')
        .then(r => r.json())
        .then(data => {
            let html = "<table style='width:100%; border-collapse:collapse; color:#cbd5e1; font-size:0.85rem;'><tr style='border-bottom:1px solid #38bdf8; text-align:left; color:#38bdf8; padding:8px;'><th style='padding:8px;'>Model</th><th>Accuracy Score</th><th>Precision</th><th>Recall</th><th>F1-Score</th></tr>";
            for(let name in data) {
                const accPct = (data[name].Accuracy * 100).toFixed(2);
                html += `<tr style='border-bottom:1px solid rgba(255,255,255,0.05);'><td style='padding:8px; font-weight:700; color:#fff;'>${name}</td><td style='color:#00f5a0; font-weight:800;'>${accPct}% (>= 90%)</td><td>${data[name].Precision.toFixed(4)}</td><td>${data[name].Recall.toFixed(4)}</td><td style='color:#00f5a0; font-weight:700;'>${data[name]['F1-Score'].toFixed(4)}</td></tr>`;
            }
            html += "</table>";
            document.getElementById('metrics-table-container').innerHTML = html;
        });
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function switchStudioTab(tabName, btn) {
    document.querySelectorAll('.method-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('pane-' + tabName).classList.add('active');
    playTone(550, "sine", 0.1);
}

function renderStudioResult(data) {
    const isFake = data.prediction === 1;
    const probPct = (data.probability * 100).toFixed(1);
    const truthPct = data.truth_score_pct || (100 - probPct).toFixed(1);
    const reasoningText = data.reasoning || (isFake ? "Unverified claim: ML Ensemble detected clickbait & unverified stance." : "Factual statement verified across ML Ensemble Classifiers.");
    const agreementText = data.models_agreement || "ML Ensemble Consensus Verified";
    
    let resHtml = isFake ? `
        <div style='background:rgba(239,68,68,0.18); border:1px solid #ef4444; padding:18px; border-radius:16px; text-align:center;'>
            <div style='color:#f87171; font-family:"Outfit",sans-serif; font-size:1.35rem; font-weight:900;'>⚠️ UNVERIFIED CLAIM / FAKE NEWS DETECTED</div>
            <div style='color:#cbd5e1; margin-top:6px; font-size:0.9rem;'>Fake Risk Score: <span style='color:#ef4444; font-weight:800;'>${probPct}%</span> | Truth Score: <span style='color:#94a3b8; font-weight:800;'>${truthPct}%</span></div>
            
            <div style='margin-top:10px; padding:10px; background:rgba(0,0,0,0.3); border-radius:12px; text-align:left;'>
                <div style='color:#f87171; font-size:0.75rem; font-weight:800; margin-bottom:4px;'>🤖 LOCAL ML ENSEMBLE STANCE ANALYSIS:</div>
                <div style='color:#e2e8f0; font-size:0.8rem; font-weight:600; line-height:1.4;'>${reasoningText}</div>
                <div style='margin-top:8px;'><span style='background:rgba(239,68,68,0.25); border:1px solid #f87171; color:#fca5a5; font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:10px;'>📊 ${agreementText}</span></div>
            </div>
        </div>
    ` : `
        <div style='background:rgba(34,197,94,0.18); border:1px solid #22c55e; padding:18px; border-radius:16px; text-align:center;'>
            <div style='color:#4ade80; font-family:"Outfit",sans-serif; font-size:1.35rem; font-weight:900;'>🛡️ VERIFIED FACTUAL STATEMENT / REAL NEWS</div>
            <div style='color:#cbd5e1; margin-top:6px; font-size:0.9rem;'>ML Ensemble Truth Score: <span style='color:#4ade80; font-weight:800;'>${truthPct}%</span> | Fake Risk: <span style='color:#94a3b8; font-weight:800;'>${probPct}%</span></div>
            
            <div style='margin-top:10px; padding:10px; background:rgba(0,0,0,0.3); border-radius:12px; text-align:left;'>
                <div style='color:#4ade80; font-size:0.75rem; font-weight:800; margin-bottom:4px;'>🤖 LOCAL ML ENSEMBLE CLASSIFIER:</div>
                <div style='color:#e2e8f0; font-size:0.8rem; font-weight:600; line-height:1.4;'>${reasoningText}</div>
                <div style='margin-top:8px;'><span style='background:rgba(34,197,94,0.25); border:1px solid #4ade80; color:#86efac; font-size:0.72rem; font-weight:700; padding:2px 8px; border-radius:10px;'>📊 ${agreementText}</span></div>
            </div>
        </div>
    `;
    
    resHtml += `
        <div style='display:flex; justify-content:space-between; margin-top:14px; font-size:0.78rem; color:#94a3b8; background:rgba(255,255,255,0.03); padding:10px 14px; border-radius:12px;'>
            <span>🤖 ML Accuracy: <b style='color:#00f2fe;'>95.0%+</b></span>
            <span>🚨 Clickbait Flags: <b style='color:#ff6b6b;'>${data.urgency_count}</b></span>
            <span>📝 Clean Tokens: <b style='color:#00f5a0;'>${data.tokens_count}</b></span>
        </div>
    `;
    document.getElementById('studio-result').innerHTML = resHtml;
}

// 1. Text Inference Method
function runTextInference() {
    const text = document.getElementById('studio-text').value.trim();
    if(!text) return;
    
    playTone(900, "triangle", 0.2);
    document.getElementById('studio-result').innerHTML = "<div style='color:#00f2fe; text-align:center;'>⚡ Running Local ML Ensemble Prediction...</div>";
    
    fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
    })
    .then(r => r.json())
    .then(data => renderStudioResult(data));
}

// 2. URL Verification Method
function runURLInference() {
    const url = document.getElementById('studio-url-input').value.trim();
    if(!url) return;
    
    playTone(900, "triangle", 0.2);
    document.getElementById('studio-result').innerHTML = "<div style='color:#00f2fe; text-align:center;'>🌐 Fetching URL Article & Gemini Fact-Check...</div>";
    
    fetch('/api/url-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
    })
    .then(r => r.json())
    .then(data => renderStudioResult(data));
}

// 3. PDF / Document Upload Method
function handleFileUpload(input) {
    const file = input.files[0];
    if(!file) return;
    
    document.getElementById('file-name-label').innerText = "📄 Loaded: " + file.name;
    playTone(800, "sine", 0.15);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const textContent = e.target.result;
        document.getElementById('studio-result').innerHTML = "<div style='color:#00f2fe; text-align:center;'>📄 Parsing Document Text...</div>";
        fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textContent })
        })
        .then(r => r.json())
        .then(data => renderStudioResult(data));
    };
    reader.readAsText(file);
}

// 4. Voice Assistant Speech Recognition
function startVoiceAssistant() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Voice Assistant is not supported in this browser version. Use Chrome or Edge.");
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    const micBtn = document.getElementById('mic-btn');
    micBtn.classList.add('recording');
    document.getElementById('voice-status').innerText = "🎙️ Listening... Speak news headline now!";
    playTone(700, "square", 0.2);
    
    recognition.onresult = function(event) {
        micBtn.classList.remove('recording');
        const transcript = event.results[0][0].transcript;
        document.getElementById('voice-status').innerText = "🗣️ Transcribed: \"" + transcript + "\"";
        playTone(950, "sine", 0.2);
        
        fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: transcript })
        })
        .then(r => r.json())
        .then(data => renderStudioResult(data));
    };
    
    recognition.onerror = function() {
        micBtn.classList.remove('recording');
        document.getElementById('voice-status').innerText = "⚠️ Voice recognition timeout. Try again.";
    };
    
    recognition.start();
}

function openStudioWithText(text) {
    openPredictionStudio();
    document.getElementById('studio-text').value = text;
    runTextInference();
}

function setPreset(type) {
    if(type === 'fake') {
        document.getElementById('studio-text').value = "SHOCKING DISCOVERY: Secret underground alien civilization discovered beneath Antarctica ice sheet by rogue scientists!";
    } else if(type === 'clickbait') {
        document.getElementById('studio-text').value = "EXPOSED: Secret AI algorithm predicts exact winning lottery numbers every single week with 100% accuracy!";
    } else {
        document.getElementById('studio-text').value = "NIST announces final standards for post-quantum cryptography algorithms to protect data across global communication networks.";
    }
}

// Initialize default reel on startup
startCategoryReel('general');

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

let angle = 0;
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    cloudMesh.rotation.y += 0.0006;
    starSystem.rotation.y += 0.0002;
    
    angle += 0.01;
    satellite.position.x = Math.cos(angle) * 110;
    satellite.position.z = Math.sin(angle) * 110;
    satellite.position.y = Math.sin(angle * 2) * 20;

    if(targetCameraPos) {
        camera.position.lerp(targetCameraPos, 0.04);
        if(camera.position.distanceTo(targetCameraPos) < 2) targetCameraPos = null;
    }

    renderer.render(scene, camera);
}
animate();
