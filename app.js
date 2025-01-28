// Alphabet Writing Game Prototype
// Using HTML Canvas API for rendering guidelines and path detection

// HTML Setup:
// <canvas id="gameCanvas" width="800" height="600" style="border:1px solid black;"></canvas>

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define the guideline for the alphabet (example: 'A')
const guidelines = [
    { x: 400, y: 100 },  // Top point
    { x: 300, y: 400 },  // Bottom left
    { x: 500, y: 400 },  // Bottom right
    { x: 350, y: 250 },  // Middle left
    { x: 450, y: 250 }   // Middle right
];

// Game variables
let isDrawing = false;
let userPath = [];

// Draw the alphabet guidelines
function drawGuidelines() {
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#cccccc";
    ctx.beginPath();
    ctx.moveTo(guidelines[0].x, guidelines[0].y);

    for (let i = 1; i < guidelines.length; i++) {
        ctx.lineTo(guidelines[i].x, guidelines[i].y);
    }

    ctx.closePath();
    ctx.stroke();
}

// Handle touch or mouse input
function startDrawing(event) {
    isDrawing = true;
    userPath = [];
    const { x, y } = getCursorPosition(event);
    userPath.push({ x, y });
}

function drawPath(event) {
    if (!isDrawing) return;

    const { x, y } = getCursorPosition(event);
    userPath.push({ x, y });

    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(0, 150, 255, 0.5)";
    ctx.lineCap = "round";

    ctx.beginPath();
    const lastPoint = userPath[userPath.length - 2];
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    validatePath();
}

// Get cursor position relative to canvas
function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX || event.touches[0].clientX) - rect.left;
    const y = (event.clientY || event.touches[0].clientY) - rect.top;
    return { x, y };
}

// Validate the user's path
function validatePath() {
    let correct = true;
    userPath.forEach(point => {
        const closestDistance = guidelines.reduce((min, guidePoint) => {
            const dist = Math.hypot(point.x - guidePoint.x, point.y - guidePoint.y);
            return Math.min(min, dist);
        }, Infinity);

        if (closestDistance > 100) { // Tolerance for deviation
            correct = false;
        }
    });

    if (correct) {
        alert("Correct stroke!");
    } else {
        alert("Try again. Stay closer to the guideline.");
    }

    clearCanvas();
    drawGuidelines();
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawPath);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", drawPath);
canvas.addEventListener("touchend", stopDrawing);

// Initial setup
clearCanvas();
drawGuidelines();
