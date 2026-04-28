const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

// Tracking variables
let focusedTime = 0;
let unfocusedTime = 0;
let distractionCount = 0;

// Start camera
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        alert("Camera permission required!");
    }
}

startVideo();

// Load model
faceapi.nets.tinyFaceDetector.loadFromUri('./models').then(startDetection);

function startDetection() {

    video.addEventListener('loadeddata', () => {

        const displaySize = {
            width: video.videoWidth,
            height: video.videoHeight
        };

        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {

            const detections = await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions()
            );

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const status = document.getElementById("status");

            // No face case
            if (resizedDetections.length === 0) {
                status.innerText = "Unfocused (No Face) ❌";
                unfocusedTime++;
                distractionCount++;
                updateStats();
                return;
            }

            resizedDetections.forEach(det => {

                const box = det.box;
                const faceX = box.x + box.width / 2;
                const width = canvas.width;

                let color = "green";

                if (faceX < width * 0.3) {
                    status.innerText = "Unfocused (Left) ❌";
                    color = "red";
                    unfocusedTime++;
                    distractionCount++;
                } 
                else if (faceX > width * 0.7) {
                    status.innerText = "Unfocused (Right) ❌";
                    color = "red";
                    unfocusedTime++;
                    distractionCount++;
                } 
                else {
                    status.innerText = "Focused ✅";
                    color = "green";
                    focusedTime++;
                }

                // Mirror box
                const mirroredBox = {
                    x: canvas.width - box.x - box.width,
                    y: box.y,
                    width: box.width,
                    height: box.height
                };

                const drawBox = new faceapi.draw.DrawBox(mirroredBox, {
                    label: "",
                    boxColor: color
                });

                drawBox.draw(canvas);
            });

            updateStats();

        }, 1000);
    });
}

// 🔥 UPDATE UI + PROGRESS
function updateStats() {

    // Update numbers
    document.getElementById("focusTime").innerText = focusedTime + " sec";
    document.getElementById("unfocusTime").innerText = unfocusedTime + " sec";
    document.getElementById("distractions").innerText = distractionCount;

    // Progress %
    let totalTime = focusedTime + unfocusedTime;

    if (totalTime > 0) {
        let percent = Math.round((focusedTime / totalTime) * 100);

        document.getElementById("focusPercent").innerText = percent + "%";
        document.getElementById("progressBar").style.width = percent + "%";
    }
}