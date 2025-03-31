const imagePairs = ["image1.jpg", "image2.jpg", "image3.jpg"]; // List all file names

let correctAnswer = "";

function loadNewImages() {
    // Pick a random pair
    const randomIndex = Math.floor(Math.random() * imagePairs.length);
    const imageName = imagePairs[randomIndex];

    // Construct paths
    const humanImg = `human_images/${imageName}`;
    const aiImg = `AI_images/${imageName}`;

    // Randomly assign left or right
    const isHumanLeft = Math.random() < 0.5;
    correctAnswer = isHumanLeft ? "left" : "right";

    // Set images
    document.getElementById("leftImage").src = isHumanLeft ? humanImg : aiImg;
    document.getElementById("rightImage").src = isHumanLeft ? aiImg : humanImg;

    // Reset result text
    document.getElementById("result").textContent = "";
}

function checkAnswer(choice) {
    if (choice === correctAnswer) {
        document.getElementById("result").textContent = "✅ Correct! This is human-made.";
    } else {
        document.getElementById("result").textContent = "❌ Wrong! This is AI-generated.";
    }
}

// Load first set of images
window.onload = loadNewImages;
