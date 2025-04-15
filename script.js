const imagePairs = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg"]; // List all file names
let remainingPairs = [...imagePairs]; // Copy of imagePairs to track unused pairs
let correctAnswer = "";
let currentImageName = ""; // To track the current image for file matching
let correctCount = 0; // Track the number of correct answers

function loadNewImages() {
    if (remainingPairs.length === 0) {
        // All pairs have been used, show the "Congratulations" message and Start Over button
        const resultContainer = document.getElementById("result");
        resultContainer.className = ""; // Clear any styling
        resultContainer.innerHTML = `
            <h1 style="color: blue;">Congratulations, you finished the game!</h1>
            <p style="color: blue;">You got <strong>${correctCount}</strong> out of ${imagePairs.length} correct.</p>
            <button id="startOverButton" style="padding: 10px 20px; font-size: 1.2em; cursor: pointer;">Start Over</button>
        `;
        document.getElementById("startOverButton").onclick = startOver;
        return;
    }

    // Pick a random pair from the remaining pairs
    const randomIndex = Math.floor(Math.random() * remainingPairs.length);
    currentImageName = remainingPairs[randomIndex];
    remainingPairs.splice(randomIndex, 1);

    // Construct paths
    const humanImg = `human_images/${currentImageName}`;
    const aiImg = `AI_images/${currentImageName}`;

    // Randomly assign left or right
    const isHumanLeft = Math.random() < 0.5;
    correctAnswer = isHumanLeft ? "left" : "right";

    // Get image elements
    const leftImage = document.getElementById("leftImage");
    const rightImage = document.getElementById("rightImage");

    // Set image sources
    leftImage.src = isHumanLeft ? humanImg : aiImg;
    rightImage.src = isHumanLeft ? aiImg : humanImg;

    // Assign click handlers
    leftImage.onclick = () => checkAnswer("left");
    rightImage.onclick = () => checkAnswer("right");

    // Reset result box
    const resultEl = document.getElementById("result");
    resultEl.textContent = "";
    resultEl.className = "";
}

async function checkAnswer(choice) {
    let resultText = "";
    let resultClass = "";
    let link = "";

    if (choice === correctAnswer) {
        correctCount++; // Increase correct count
        resultText = await loadExplanation("success_explanation", currentImageName);
        resultClass = "correct"; // Green box
    } else {
        resultText = await loadExplanation("failure_explanation", currentImageName);
        resultClass = "wrong"; // Red box
    }

    // Extract link if available
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlMatch = resultText.match(urlPattern);

    if (urlMatch) {
        link = `<a href="${urlMatch[0]}" target="_blank">Click here for more info</a>`;
        resultText = resultText.replace(urlPattern, ""); // Remove URL from explanation
    }

    // Update result display
    const resultBox = document.getElementById("result");
    resultBox.innerHTML = `${resultText} ${link}`;
    resultBox.className = resultClass;
}

async function loadExplanation(folder, imageName) {
    const fileName = imageName.replace('.jpg', '.txt');
    const filePath = `${folder}/${fileName}`;

    try {
        const response = await fetch(filePath);
        if (response.ok) {
            return await response.text();
        } else {
            return "Default answer text: Could not load explanation.";
        }
    } catch (error) {
        return "Default answer text: An error occurred while loading the explanation.";
    }
}

function startOver() {
    // Reset game state
    remainingPairs = [...imagePairs];
    correctAnswer = "";
    currentImageName = "";
    correctCount = 0;

    // Reset result box
    const resultBox = document.getElementById("result");
    resultBox.textContent = "";
    resultBox.className = "";

    loadNewImages();
}

// Load first round on page load
window.onload = () => {
    loadNewImages();
};
