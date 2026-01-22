// DOM References
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const modeSelect = document.getElementById('modeSelect');

// Control Groups (Containers)
const timelapseControls = document.getElementById('timelapseControls');
const chaosControls = document.getElementById('chaosControls');
const polyControls = document.getElementById('polyControls');
const geoControls = document.getElementById('geoControls');
const stripSettings = document.getElementById('stripSettings');

// File Inputs
const inputMulti = document.getElementById('uploadMulti');
const inputChaos = document.getElementById('uploadChaos');
const uploadGeo1 = document.getElementById('uploadGeo1');
const uploadGeo2 = document.getElementById('uploadGeo2');

// Settings Inputs
const stripInput = document.getElementById('stripWidth');
const chaosRange = document.getElementById('chaosIntensity');
const polyColsInput = document.getElementById('polyCols');
const polyRowsInput = document.getElementById('polyRows');
const polyScatterInput = document.getElementById('polyScatter');
const geoShapeSelect = document.getElementById('geoShape');
const geoSizeInput = document.getElementById('geoSize');
const btnProcess = document.getElementById('processBtn');
const btnDownload = document.getElementById('downloadBtn');
const filterBW1 = document.getElementById('filterBW1');
const filterBW2 = document.getElementById('filterBW2');

// Global State
let img1 = new Image();
let img2 = new Image();
let imgChaos = new Image();
// Flags to check if images are ready
let img1Loaded = false, img2Loaded = false, imgChaosLoaded = false;
let frames = [];

// --- ---------------------------------------
// --- SHOW PREVIEW FUNCTION
// --- Displays uploaded image in the UI box
// --- ---------------------------------------
function updatePreview(input, imgElementId, placeholderId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgPreview = document.getElementById(imgElementId);
            const placeholder = document.getElementById(placeholderId);
            if (imgPreview) {
                imgPreview.src = e.target.result;
                imgPreview.classList.remove('hidden');
            }
            if (placeholder) {
                placeholder.classList.add('hidden');
            }
        }
        reader.readAsDataURL(file);
    }
}

// --- ---------------------------------------
// --- HANDLER: SINGLE UPLOAD
// --- Loads one image into memory and shows preview
// --- ---------------------------------------
function handleSingleUpload(e, imgObj, type) {
    if (!e.target.files[0]) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        imgObj.onload = function() {
            if (type === 'img1') img1Loaded = true;
            if (type === 'img2') img2Loaded = true;
            if (type === 'chaos') imgChaosLoaded = true;
            console.log(type + " loaded.");
        }
        imgObj.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);

    // Update UI based on type
    if (type === 'img1') updatePreview(e.target, 'previewGeo1', 'placeholderGeo1');
    if (type === 'img2') updatePreview(e.target, 'previewGeo2', 'placeholderGeo2');
    if (type === 'chaos') updatePreview(e.target, 'previewChaos', 'placeholderChaos');
}

// --- ---------------------------------------
// --- HANDLER: MULTI UPLOAD (TIMELAPSE)
// --- ---------------------------------------
if(inputMulti) inputMulti.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);

    // If canceled, do nothing (keep old files)
    if (files.length === 0) return;
    frames = [];

    const grid = document.getElementById('multiPreviewGrid');
    const textInfo = document.getElementById('multiPreviewText');

    // Reset UI
    if(grid) {
        grid.innerHTML = '';
        grid.classList.remove('hidden');
    }
    if(textInfo) {
        textInfo.textContent = `Loading ${files.length} photos...`;
        textInfo.classList.remove('hidden');
    }

    let loadedCount = 0;
    // Process all files
    files.forEach((file) => {
        // Load for algorithm
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                frames.push(img);
                loadedCount++;
                if (textInfo) textInfo.textContent = `Ready: ${loadedCount} / ${files.length} frames`;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);

        // Load thumbnail for UI
        const thumbReader = new FileReader();
        thumbReader.onload = (ev) => {
            const thumb = document.createElement('img');
            thumb.src = ev.target.result;
            thumb.className = 'mini-thumb';
            if (grid) grid.appendChild(thumb);
        }
        thumbReader.readAsDataURL(file);
    });
});

// --- EVENT LISTENERS ---
if(inputChaos) inputChaos.addEventListener('change', (e) => handleSingleUpload(e, imgChaos, 'chaos'));
if(uploadGeo1) uploadGeo1.addEventListener('change', (e) => handleSingleUpload(e, img1, 'img1'));
if(uploadGeo2) uploadGeo2.addEventListener('change', (e) => handleSingleUpload(e, img2, 'img2'));

// --- ---------------------------------------
// --- UI SYNC
// --- Connects slider values to text spans
// --- ---------------------------------------
function bindValueToText(inputId, textId) {
    const input = document.getElementById(inputId);
    const text = document.getElementById(textId);
    if (input && text) {
        text.textContent = input.value;
        input.addEventListener('input', (e) => text.textContent = e.target.value);
    }
}
bindValueToText('stripWidth', 'stripVal');
bindValueToText('chaosIntensity', 'chaosVal');
bindValueToText('polyCols', 'colVal');
bindValueToText('polyRows', 'rowVal');
bindValueToText('polyScatter', 'scatterVal');
bindValueToText('geoSize', 'geoSizeVal');

// --- ---------------------------------------
// --- MODE SWITCHING
// --- Shows/Hides controls based on dropdown selection
// --- ---------------------------------------
function updateUI() {
    // Hide all first
    if(timelapseControls) timelapseControls.classList.add('hidden');
    if(chaosControls) chaosControls.classList.add('hidden');
    if(polyControls) polyControls.classList.add('hidden');
    if(geoControls) geoControls.classList.add('hidden');
    if(stripSettings) stripSettings.classList.remove('hidden');

    const val = modeSelect.value;
    // Show selected
    if (val === 'timelapse') { if(timelapseControls) timelapseControls.classList.remove('hidden'); }
    else if (val === 'chaos') { if(chaosControls) chaosControls.classList.remove('hidden'); }
    else if (val === 'poly') {
        if(polyControls) polyControls.classList.remove('hidden');
        if(timelapseControls) timelapseControls.classList.remove('hidden');
        if(stripSettings) stripSettings.classList.add('hidden');
    }
    else if (val === 'geo') {
        if(geoControls) geoControls.classList.remove('hidden');
        if(stripSettings) stripSettings.classList.add('hidden');
    }
}
modeSelect.addEventListener('change', updateUI);
updateUI(); // Run once on load

// --- ACTION BUTTONS ---
btnProcess.addEventListener('click', () => {
    const mode = modeSelect.value;
    if (mode === 'timelapse') renderTimeLapse();
    else if (mode === 'chaos') renderChaos();
    else if (mode === 'poly') renderPolyekran();
    else if (mode === 'geo') renderGeometric();
});

btnDownload.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'digital_rollage.png';
    link.href = canvas.toDataURL();
    link.click();
});

// --- FILTER HELPER ---
function applyFilter(ctx, isBW) {
    ctx.filter = isBW ? 'grayscale(100%) contrast(1.2)' : 'none';
}

// --- SMART CROP (Object-fit: Cover) ---
function drawImageCover(ctx, img, x, y, w, h) {
    // Source
    let sW = img.width;
    let sH = img.height;
    // Destination
    let dW = w;
    let dH = h;

    let sRatio = sW / sH;
    let dRatio = dW / dH;
    let sX, sY, sWidth, sHeight;

    if (dRatio > sRatio) {
        sWidth = sW;
        sHeight = sW / dRatio;
        sX = 0;
        sY = (sH - sHeight) / 2;
    } else {
        sHeight = sH;
        sWidth = sH * dRatio;
        sY = 0;
        sX = (sW - sWidth) / 2;
    }
    ctx.drawImage(img, sX, sY, sWidth, sHeight, x, y, dW, dH);
}


// --- ---------------------------------------
// --- ----------- ALGORITHMS ----------------
// --- ---------------------------------------

// 1. TIMELAPSE
function renderTimeLapse() {
    if (frames.length < 2) { alert("Please upload at least 2 images!"); return; }
    const masterFrame = frames[0];
    canvas.width = masterFrame.width;
    canvas.height = masterFrame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const stripWidth = parseInt(stripInput.value);
    let frameIndex = 0;

    // Loop through width of canvas
    for (let x = 0; x < canvas.width; x += stripWidth) {
        let currentStripW = Math.min(stripWidth, canvas.width - x);
        let currentImg = frames[frameIndex % frames.length];

        // Calculate scaling
        const scaleX = currentImg.width / canvas.width;
        let sourceX = x * scaleX;
        if (sourceX + (currentStripW*scaleX) > currentImg.width) sourceX = currentImg.width - (currentStripW*scaleX);

        ctx.drawImage(currentImg, sourceX, 0, currentStripW*scaleX, currentImg.height, x, 0, currentStripW, canvas.height);
        frameIndex++;
    }
}

// 2. CHAOS
function renderChaos() {
    if (!imgChaosLoaded) { alert("Please upload an image!"); return; }
    canvas.width = imgChaos.width; canvas.height = imgChaos.height;
    ctx.fillStyle = "#000"; ctx.fillRect(0,0,canvas.width, canvas.height);
    const baseStripWidth = parseInt(stripInput.value);
    const intensity = parseInt(chaosRange.value);
    let x = 0;

    // Draw random strips
    while (x < canvas.width) {
        let randomW = Math.ceil(baseStripWidth + (Math.random() * baseStripWidth) - (baseStripWidth / 2));
        if (randomW < 1) randomW = 1;
        if (x + randomW > canvas.width) randomW = canvas.width - x;

        // Calculate random shifts
        let yShift = Math.floor((Math.random() * intensity * 2) - intensity);
        let xShift = (Math.random() > 0.7) ? Math.floor((Math.random() * intensity) - (intensity / 2)) : 0;

        let sx = x + xShift; if(sx<0) sx=0;
        if(sx+randomW > imgChaos.width) sx = imgChaos.width - randomW;
        let sHeight = imgChaos.height - Math.abs(yShift);

        ctx.drawImage(imgChaos, sx, Math.max(0, yShift), randomW, sHeight, x, 0, randomW + 1, canvas.height);
        x += randomW;
    }
}

// 3. POLYSCREEN
function renderPolyekran() {
    let sourceImages = frames.length > 0 ? frames : (img1Loaded ? [img1] : []);
    if (sourceImages.length === 0) { alert("Please upload images!"); return; }

    const masterImg = sourceImages[0];
    canvas.width = masterImg.width;
    canvas.height = masterImg.height;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const cols = parseInt(polyColsInput.value);
    const rows = parseInt(polyRowsInput.value);
    const scatter = parseInt(polyScatterInput.value);

    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    const canW = canvas.width;
    const canH = canvas.height;

    // Loop rows and columns
    for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
            let dx = Math.floor(c * cellW);
            let dy = Math.floor(r * cellH);
            let dw = Math.floor((c + 1) * cellW) - dx;
            let dh = Math.floor((r + 1) * cellH) - dy;

            // Image selection (Diagonal Shift)
            let imgIndex = (c + r) % sourceImages.length;
            let currentImg = sourceImages[imgIndex];

            let imgW = currentImg.width;
            let imgH = currentImg.height;

            // Reduction/enlargement ratio
            let ratioW = imgW / canW;
            let ratioH = imgH / canH;

            let factor = Math.min(ratioW, ratioH);

            let cropGlobalW = canW * factor;
            let cropGlobalH = canH * factor;

            let offsetGlobalX = (imgW - cropGlobalW) / 2;
            let offsetGlobalY = (imgH - cropGlobalH) / 2;

            // Calculation of the cutout for this specific cube
            let sx = offsetGlobalX + (dx * factor);
            let sy = offsetGlobalY + (dy * factor);
            let sw = dw * factor;
            let sh = dh * factor;

            // Apply scatter (random offset)
            let drawX = dx;
            let drawY = dy;
            if(scatter > 0) {
                drawX += (Math.random()-0.5)*scatter*20;
                drawY += (Math.random()-0.5)*scatter*20;
            }

            ctx.drawImage(currentImg, sx, sy, sw, sh, drawX, drawY, dw+0.5, dh+0.5);
        }
    }
}

// --- HELPER: PATTERN TILE ---
function createPatternCanvas(shape, size) {
    const pCanvas = document.createElement('canvas');
    const pCtx = pCanvas.getContext('2d');
    if (shape === 'checkerboard') {
        pCanvas.width = size*2;
        pCanvas.height = size*2;
        pCtx.fillStyle='#000';
        pCtx.fillRect(0,0,size,size);
        pCtx.fillRect(size,size,size,size);
    } else if (shape === 'diamonds') {
        const ts = size*2;
        pCanvas.width = ts;
        pCanvas.height = ts;
        pCtx.fillStyle='#000';
        pCtx.beginPath();
        pCtx.moveTo(size,0);
        pCtx.lineTo(ts,size);
        pCtx.lineTo(size,ts);
        pCtx.lineTo(0,size);
        pCtx.fill();
    } else if (shape === 'triangles') {
        const h = size*(Math.sqrt(3)/2);
        pCanvas.width=size;
        pCanvas.height=h*2;
        pCtx.fillStyle='#000';

        pCtx.beginPath();
        pCtx.moveTo(0,0);
        pCtx.lineTo(size,0);
        pCtx.lineTo(size/2,h);
        pCtx.fill();

        pCtx.beginPath();
        pCtx.moveTo(-size/2,h);
        pCtx.lineTo(size/2,h);
        pCtx.lineTo(0,h*2);
        pCtx.fill();

        pCtx.beginPath();
        pCtx.moveTo(size/2,h);
        pCtx.lineTo(size*1.5,h);
        pCtx.lineTo(size,h*2);
        pCtx.fill();
    } else if (shape === 'horizontal')
    {
        pCanvas.width=1; pCanvas.height=size*2;
        pCtx.fillStyle='#000';
        pCtx.fillRect(0,0,1,size);
    }
    else if (shape === 'vertical')
    {
        pCanvas.width=size*2; pCanvas.height=1;
        pCtx.fillStyle='#000';
        pCtx.fillRect(0,0,size,1);
    }
    return pCanvas;
}

// 4. GEOMETRIC (Masking two images)
function renderGeometric() {
    if (!img1Loaded) { alert("Please upload Background!"); return; }
    const imgObj2 = img2Loaded ? img2 : img1;
    canvas.width = img1.width;
    canvas.height = img1.height;

    // Draw Background
    applyFilter(ctx, filterBW1.checked);
    ctx.drawImage(img1, 0, 0);
    applyFilter(ctx, false);

    const shape = geoShapeSelect.value;
    const size = parseInt(geoSizeInput.value);

    // Create Mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width; maskCanvas.height = canvas.height;
    const mCtx = maskCanvas.getContext('2d');

    // Draw pattern on mask
    if (['checkerboard','diamonds','triangles','horizontal','vertical'].includes(shape)) {
        const tile = createPatternCanvas(shape, size);
        const pattern = mCtx.createPattern(tile, 'repeat');
        mCtx.fillStyle = pattern;
        mCtx.fillRect(0,0,maskCanvas.width,maskCanvas.height);
    } else {
        // Radial patterns
        mCtx.fillStyle = '#000';
        mCtx.beginPath();
        const cx = canvas.width/2;
        const cy = canvas.height/2;
        const maxR = Math.sqrt(cx*cx+cy*cy)*1.5;
        if (shape === 'circles') {
            for(let r=0; r<maxR; r+=size*2)
            {
                mCtx.arc(cx,cy,r+size,0,Math.PI*2,false);
                mCtx.arc(cx,cy,r,0,Math.PI*2,true);
                mCtx.closePath();
            }
            mCtx.fill();
        } else if (shape === 'spiral') {
            let aw = Math.max(1, Math.min(90, size/5));
            for(let a=0; a<360; a+=aw*2) {
                mCtx.moveTo(cx,cy);
                const r1=(a*Math.PI)/180;
                const r2=((a+aw)*Math.PI)/180;
                mCtx.lineTo(cx+Math.cos(r1)*maxR, cy+Math.sin(r1)*maxR);
                mCtx.arc(cx,cy,maxR,r1,r2,false);
                mCtx.lineTo(cx,cy);
            }
            mCtx.fill();
        }
    }

    // Apply composite (Source-In)
    mCtx.globalCompositeOperation = 'source-in';
    applyFilter(mCtx, filterBW2.checked);
    drawImageCover(mCtx, imgObj2, 0, 0, canvas.width, canvas.height);

    applyFilter(mCtx, false);

    // Draw masked image onto canvas
    ctx.drawImage(maskCanvas, 0, 0);
}

// --- SWAP BUTTON LOGIC ---
const btnSwapGeo = document.getElementById('btnSwapGeo');

if (btnSwapGeo) {
    btnSwapGeo.addEventListener('click', () => {
        if (!img1Loaded && !img2Loaded) return;

        // Swap Image Sources
        const tempSrc = img1.src;
        img1.src = img2.src;
        img2.src = tempSrc;

        // Swap Loaded Flags
        const tempLoaded = img1Loaded;
        img1Loaded = img2Loaded;
        img2Loaded = tempLoaded;

        // Swap UI Previews
        const prev1 = document.getElementById('previewGeo1');
        const prev2 = document.getElementById('previewGeo2');
        const place1 = document.getElementById('placeholderGeo1');
        const place2 = document.getElementById('placeholderGeo2');

        const tempPreviewSrc = prev1.src;
        prev1.src = prev2.src;
        prev2.src = tempPreviewSrc;

        updatePreviewVisibility(prev1, place1, img1Loaded);
        updatePreviewVisibility(prev2, place2, img2Loaded);

        // Re-render
        renderGeometric();
    });
}

function updatePreviewVisibility(imgEl, placeEl, isLoaded) {
    if (isLoaded && imgEl.src && imgEl.src !== window.location.href) {
        imgEl.classList.remove('hidden');
        placeEl.classList.add('hidden');
    } else {
        imgEl.classList.add('hidden');
        placeEl.classList.remove('hidden');
    }
}