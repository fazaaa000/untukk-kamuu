const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ============================================================
// CANVAS
// ============================================================

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let DPR = Math.min(window.devicePixelRatio || 1, 2);

canvas.width = WIDTH * DPR;
canvas.height = HEIGHT * DPR;

canvas.style.width = WIDTH + "px";
canvas.style.height = HEIGHT + "px";

ctx.scale(DPR, DPR);

// ============================================================
// SETTINGS
// ============================================================

const isMobile = WIDTH <= 768;

const PARTICLE_COUNT = isMobile ? 2200 : 4500;

const CENTER_X = () => WIDTH / 2;
const CENTER_Y = () => HEIGHT / 2;

// ============================================================
// TIMELINE
// ============================================================

const TIME_GALAXY = 3;
const TIME_HEY = 8;
const TIME_PULSE = 9;
const TIME_COSMIC = 11;
const TIME_IYAA_END = 18;

const TIME_JANGAN_FORM_END = 21;
const TIME_JANGAN_END = 31;

const TIME_HEART_END = 34;
const TIME_ROTATE = 34;

// ============================================================
// PARTICLES
// ============================================================

let particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {

    const angle =
        Math.random() * Math.PI * 2;

    const radius =
        Math.pow(Math.random(), 0.65) *
        Math.min(WIDTH, HEIGHT) *
        0.75;

    particles.push({

        x:
            CENTER_X() +
            Math.cos(angle) * radius,

        y:
            CENTER_Y() +
            Math.sin(angle) * radius,

        baseX:
            CENTER_X() +
            Math.cos(angle) * radius,

        baseY:
            CENTER_Y() +
            Math.sin(angle) * radius,

        angle: angle,

        radius: radius,

        size:
            Math.random() * 1.8 + 0.4,

        speed:
            Math.random() * 0.7 + 0.2,

        alpha:
            Math.random() * 0.8 + 0.2,

        targetX: 0,
        targetY: 0
    });
}

// ============================================================
// TEXT TARGETS
// ============================================================

let currentText = "";
let textTargets = [];

function createTextTargets(text) {

    currentText = text;
    textTargets = [];

    const tempCanvas =
        document.createElement("canvas");

    const tempCtx =
        tempCanvas.getContext("2d");

    tempCanvas.width = WIDTH;
    tempCanvas.height = HEIGHT;

    let fontSize =
        Math.min(WIDTH * 0.11, 100);

    if (WIDTH < 600) {
        fontSize =
            Math.min(WIDTH * 0.14, 58);
    }

    if (text === "jangann berpaling yaaa") {

        fontSize =
            Math.min(WIDTH * 0.075, 68);

        if (WIDTH < 600) {
            fontSize =
                Math.min(WIDTH * 0.075, 38);
        }
    }

    tempCtx.font =
        `bold ${fontSize}px Arial`;

    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";
    tempCtx.fillStyle = "#fff";

    tempCtx.fillText(
        text,
        WIDTH / 2,
        HEIGHT / 2
    );

    const imageData =
        tempCtx.getImageData(
            0,
            0,
            WIDTH,
            HEIGHT
        );

    const data = imageData.data;

    let step = 5;

    if (text === "jangann berpaling yaaa") {
        step = 2;
    }

    for (
        let y = 0;
        y < HEIGHT;
        y += step
    ) {

        for (
            let x = 0;
            x < WIDTH;
            x += step
        ) {

            const index =
                (y * WIDTH + x) * 4;

            if (data[index + 3] > 100) {

                textTargets.push({
                    x: x,
                    y: y
                });
            }
        }
    }

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        if (textTargets.length > 0) {

            const target =
                textTargets[
                    i % textTargets.length
                ];

            particles[i].targetX =
                target.x;

            particles[i].targetY =
                target.y;
        }
    }
}

// ============================================================
// GALAXY
// ============================================================

function drawGalaxy(elapsed) {

    const cx = CENTER_X();
    const cy = CENTER_Y();

    const rotation =
        elapsed * 0.8;

    for (let p of particles) {

        const a =
            p.angle +
            rotation * p.speed;

        const x =
            cx +
            Math.cos(a) *
            p.radius;

        const y =
            cy +
            Math.sin(a) *
            p.radius *
            0.55;

        p.x +=
            (x - p.x) * 0.04;

        p.y +=
            (y - p.y) * 0.04;

        drawParticle(
            p.x,
            p.y,
            p.size,
            p.alpha
        );
    }
}

// ============================================================
// MOVE TO TEXT
// ============================================================

function moveToText(progress) {

    for (let p of particles) {

        const targetX = p.targetX;
        const targetY = p.targetY;

        p.x +=
            (targetX - p.x) *
            0.055 *
            progress;

        p.y +=
            (targetY - p.y) *
            0.055 *
            progress;

        drawParticle(
            p.x,
            p.y,
            p.size,
            p.alpha
        );
    }
}

// ============================================================
// DRAW TEXT
// ============================================================

function drawText(scale = 1) {

    for (let p of particles) {

        drawParticle(
            p.x,
            p.y,
            p.size * scale,
            p.alpha
        );
    }
}

// ============================================================
// COSMIC SWIRL
// ============================================================

function cosmicSwirl(progress) {

    const cx = CENTER_X();
    const cy = CENTER_Y();

    for (let p of particles) {

        const dx = p.x - cx;
        const dy = p.y - cy;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        const angle =
            Math.atan2(dy, dx);

        const swirl =
            progress *
            (1.5 + distance * 0.003);

        const newAngle =
            angle + swirl;

        const targetX =
            cx +
            Math.cos(newAngle) *
            distance *
            (1 - progress * 0.35);

        const targetY =
            cy +
            Math.sin(newAngle) *
            distance *
            (1 - progress * 0.35);

        p.x +=
            (targetX - p.x) *
            0.08;

        p.y +=
            (targetY - p.y) *
            0.08;

        drawParticle(
            p.x,
            p.y,
            p.size * 1.2,
            p.alpha
        );
    }
}

// ============================================================
// HEART
// ============================================================

let heartPoints = [];

function createHeart() {

    heartPoints = [];

    const scale =
        Math.min(WIDTH, HEIGHT) *
        0.018;

    for (
        let t = 0;
        t < Math.PI * 2;
        t += 0.015
    ) {

        const x =
            16 *
            Math.pow(Math.sin(t), 3);

        const y =
            -(
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t)
            );

        heartPoints.push({

            x:
                CENTER_X() +
                x * scale,

            y:
                CENTER_Y() +
                y * scale
        });
    }
}

// ============================================================
// WAWA
// ============================================================

let wawaTargets = [];

function createWawa() {

    wawaTargets = [];

    const tempCanvas =
        document.createElement("canvas");

    const tempCtx =
        tempCanvas.getContext("2d");

    tempCanvas.width = WIDTH;
    tempCanvas.height = HEIGHT;

    const fontSize =
        Math.min(WIDTH * 0.10, 80);

    tempCtx.font =
        `bold ${fontSize}px Arial`;

    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";
    tempCtx.fillStyle = "#ffffff";

    tempCtx.fillText(
        "wawa",
        WIDTH / 2,
        HEIGHT / 2
    );

    const imageData =
        tempCtx.getImageData(
            0,
            0,
            WIDTH,
            HEIGHT
        );

    const data = imageData.data;

    for (
        let y = 0;
        y < HEIGHT;
        y += 4
    ) {

        for (
            let x = 0;
            x < WIDTH;
            x += 4
        ) {

            const index =
                (y * WIDTH + x) * 4;

            if (data[index + 3] > 100) {

                wawaTargets.push({
                    x: x,
                    y: y
                });
            }
        }
    }
}

// ============================================================
// DRAW HEART
// ============================================================

function drawHeart(progress) {

    if (heartPoints.length === 0) {
        return;
    }

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        const target =
            heartPoints[
                i % heartPoints.length
            ];

        const offset =
            (Math.random() - 0.5) * 3;

        const targetX =
            target.x + offset;

        const targetY =
            target.y + offset;

        particles[i].x +=
            (targetX - particles[i].x) *
            0.08 *
            progress;

        particles[i].y +=
            (targetY - particles[i].y) *
            0.08 *
            progress;

        drawParticle(
            particles[i].x,
            particles[i].y,
            particles[i].size,
            particles[i].alpha
        );
    }
}

// ============================================================
// ROTATING 3D HEART
// ============================================================

function drawRotatingHeart(rotation) {

    const cx = CENTER_X();
    const cy = CENTER_Y();

    const scale =
        Math.min(WIDTH, HEIGHT) *
        0.018;

    const cosY =
        Math.cos(rotation);

    const sinY =
        Math.sin(rotation);

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        const t =
            (
                i /
                particles.length
            ) *
            Math.PI *
            2 *
            8;

        const x =
            16 *
            Math.pow(
                Math.sin(t),
                3
            );

        const y =
            -(
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t)
            );

        const z =
            Math.sin(t * 3) * 15;

        const rotatedX =
            x * cosY -
            z * sinY;

        const depth =
            x * sinY +
            z * cosY;

        const perspective =
            1 +
            depth * 0.015;

        const screenX =
            cx +
            rotatedX *
            scale *
            perspective;

        const screenY =
            cy +
            y *
            scale *
            perspective;

        const size =
            Math.max(
                0.5,
                particles[i].size *
                perspective
            );

        drawParticle(
            screenX,
            screenY,
            size,
            particles[i].alpha
        );
    }

    drawWawa();
}

// ============================================================
// DRAW WAWA
// ============================================================

function drawWawa() {

    for (
        let i = 0;
        i < wawaTargets.length;
        i++
    ) {

        const target =
            wawaTargets[i];

        ctx.beginPath();

        ctx.arc(
            target.x,
            target.y,
            1.3,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,255,255,0.9)";

        ctx.fill();
    }
}

// ============================================================
// PARTICLE
// ============================================================

function drawParticle(
    x,
    y,
    size,
    alpha
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        `rgba(
            255,
            ${120 + Math.random() * 80},
            ${180 + Math.random() * 75},
            ${alpha}
        )`;

    ctx.fill();
}

// ============================================================
// RESIZE
// ============================================================

function resizeCanvas() {

    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    DPR =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        WIDTH * DPR;

    canvas.height =
        HEIGHT * DPR;

    canvas.style.width =
        WIDTH + "px";

    canvas.style.height =
        HEIGHT + "px";

    ctx.setTransform(
        DPR,
        0,
        0,
        DPR,
        0,
        0
    );

    createHeart();
    createWawa();

    if (currentText) {
        createTextTargets(
            currentText
        );
    }
}

window.addEventListener(
    "resize",
    resizeCanvas
);

// ============================================================
// ANIMATION
// ============================================================

let startTime =
    performance.now();

function animate(now) {

    const elapsed =
        (
            now -
            startTime
        ) / 1000;

    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );

    // ========================================================
    // 0–3 DETIK
    // GALAXY
    // ========================================================

    if (
        elapsed <
        TIME_GALAXY
    ) {

        drawGalaxy(
            elapsed
        );
    }

    // ========================================================
    // 3–8 DETIK
    // HEY KAMU
    // ========================================================

    else if (
        elapsed <
        TIME_HEY
    ) {

        if (
            currentText !==
            "Hey kamu"
        ) {

            createTextTargets(
                "Hey kamu"
            );
        }

        const progress =
            Math.min(
                (
                    elapsed -
                    3
                ) / 2,
                1
            );

        moveToText(
            progress
        );
    }

    // ========================================================
    // 8–9 DETIK
    // PULSE
    // ========================================================

    else if (
        elapsed <
        TIME_PULSE
    ) {

        if (
            currentText !==
            "Hey kamu"
        ) {

            createTextTargets(
                "Hey kamu"
            );
        }

        const pulse =
            1 +
            Math.sin(
                (
                    elapsed -
                    8
                ) *
                Math.PI *
                4
            ) *
            0.08;

        drawText(
            pulse
        );
    }

    // ========================================================
    // 9–11 DETIK
    // COSMIC SWIRL
    // ========================================================

    else if (
        elapsed <
        TIME_COSMIC
    ) {

        const progress =
            Math.min(
                (
                    elapsed -
                    9
                ) / 2,
                1
            );

        cosmicSwirl(
            progress
        );
    }

    // ========================================================
    // 11–18 DETIK
    // IYAA KAMUU
    // ========================================================

    else if (
        elapsed <
        TIME_IYAA_END
    ) {

        if (
            currentText !==
            "iyaa kamuu"
        ) {

            createTextTargets(
                "iyaa kamuu"
            );
        }

        const progress =
            Math.min(
                (
                    elapsed -
                    11
                ) / 2,
                1
            );

        moveToText(
            progress
        );
    }

    // ========================================================
    // 18–21 DETIK
    // JANGANN BERPALING YAAA
    // PEMBENTUKAN
    // ========================================================

    else if (
        elapsed <
        TIME_JANGAN_FORM_END
    ) {

        if (
            currentText !==
            "jangann berpaling yaaa"
        ) {

            createTextTargets(
                "jangann berpaling yaaa"
            );
        }

        const progress =
            Math.min(
                (
                    elapsed -
                    18
                ) / 3,
                1
            );

        moveToText(
            progress
        );
    }

    // ========================================================
    // 21–31 DETIK
    // JANGANN BERPALING YAAA
    // DIAM 10 DETIK
    // ========================================================

    else if (
        elapsed <
        TIME_JANGAN_END
    ) {

        if (
            currentText !==
            "jangann berpaling yaaa"
        ) {

            createTextTargets(
                "jangann berpaling yaaa"
            );
        }

        drawText();
    }

    // ========================================================
    // 31–34 DETIK
    // MEMBENTUK LOVE
    // ========================================================

    else if (
        elapsed <
        TIME_HEART_END
    ) {

        const progress =
            Math.min(
                (
                    elapsed -
                    31
                ) / 3,
                1
            );

        drawHeart(
            progress
        );
    }

    // ========================================================
    // 34+ DETIK
    // LOVE 3D + WAWA
    // ========================================================

    else {

        const rotation =
            (
                elapsed -
                TIME_ROTATE
            ) *
            1.2;

        drawRotatingHeart(
            rotation
        );
    }

    requestAnimationFrame(
        animate
    );
}

// ============================================================
// START
// ============================================================

createTextTargets(
    "Hey kamu"
);

createHeart();

createWawa();

requestAnimationFrame(
    animate
);