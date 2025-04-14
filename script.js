const imagePairs = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg"]; // List all file names
let remainingPairs = [...imagePairs]; // Copy of imagePairs to track unused pairs
let correctAnswer = "";
let currentImageName = ""; // To track the current image for file matching

function loadNewImages() {
    if (remainingPairs.length === 0) {
        // All pairs have been used, show the "Congratulations" message
        document.body.innerHTML = `
            <div style="text-align: center; margin-top: 50px;">
                <h1>Congratulations, you finished the game!</h1>
                <button id="startOverButton" style="padding: 10px 20px; font-size: 1.2em; cursor: pointer;">Start Over</button>
            </div>
        `;
        document.getElementById("startOverButton").onclick = startOver;
        return;
    }

    // Pick a random pair from the remaining pairs
    const randomIndex = Math.floor(Math.random() * remainingPairs.length);
    currentImageName = remainingPairs[randomIndex]; // Store current image name
    remainingPairs.splice(randomIndex, 1); // Remove the used pair from the list

    // Construct paths
    const humanImg = `human_images/${currentImageName}`;
    const aiImg = `AI_images/${currentImageName}`;

    // Randomly assign left or right
    const isHumanLeft = Math.random() < 0.5;
    correctAnswer = isHumanLeft ? "left" : "right";

    // Get image elements
    const leftImage = document.getElementById("leftImage");
    const rightImage = document.getElementById("rightImage");

    // Set images
    leftImage.src = isHumanLeft ? humanImg : aiImg;
    rightImage.src = isHumanLeft ? aiImg : humanImg;

    // Log paths to check if images are correctly assigned
    console.log("Left Image Path:", leftImage.src);
    console.log("Right Image Path:", rightImage.src);

    leftImage.onclick = () => checkAnswer("left");
    rightImage.onclick = () => checkAnswer("right");

    // Reset result text
    document.getElementById("result").textContent = "";
}

async function checkAnswer(choice) {
    let resultText = "";
    let resultClass = "";
    let link = "";

    if (choice === correctAnswer) {
        resultText = await loadExplanation("success_explanation", currentImageName);
        resultClass = "correct"; // Green box for correct
    } else {
        resultText = await loadExplanation("failure_explanation", currentImageName);
        resultClass = "wrong"; // Red box for wrong
    }

    // Check if the explanation contains a URL for a clickable link
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlMatch = resultText.match(urlPattern);

    if (urlMatch) {
        link = `<a href="${urlMatch[0]}" target="_blank">Click here for more info</a>`;
        resultText = resultText.replace(urlPattern, ""); // Remove the URL from the explanation
    }

    // Apply result text and style
    document.getElementById("result").innerHTML = `${resultText} ${link}`;
    document.getElementById("result").className = resultClass;
}

async function loadExplanation(folder, imageName) {
    const fileName = imageName.replace('.jpg', '.txt'); // Replace .jpg with .txt to match file name
    const filePath = `${folder}/${fileName}`;

    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const text = await response.text();
            return text;
        } else {
            return "Default answer text: Could not load explanation.";
        }
    } catch (error) {
        return "Default answer text: An error occurred while loading the explanation.";
    }
}

function startOver() {
    // Reset the game state
    remainingPairs = [...imagePairs]; // Reset the remaining pairs
    correctAnswer = ""; // Clear the correct answer
    currentImageName = ""; // Clear the current image name

    // Clear the result text and reset the images
    document.getElementById("result").textContent = ""; // Clear the result box
    document.getElementById("result").className = ""; // Reset result styles
    loadNewImages(); // Load new images
}

// Load first set of images
window.onload = () => {
    loadNewImages(); // Load the first set of images
    document.getElementById("startOverButton").onclick = startOver; // Attach the start over functionality
};
