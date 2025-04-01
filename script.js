const imagePairs = ["1.jpg", "3.jpg", "6.jpg"]; // List all file names 

let correctAnswer = "";
let currentImageName = ""; // To track the current image for file matching

function loadNewImages() {
    // Pick a random pair
    const randomIndex = Math.floor(Math.random() * imagePairs.length);
    currentImageName = imagePairs[randomIndex];  // Store current image name

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
    if (choice === correctAnswer) {
        resultText = await loadExplanation("success_explanation", currentImageName);
    } else {
        resultText = await loadExplanation("failure_explanation", currentImageName);
    }

    // Display the result text
    document.getElementById("result").textContent = resultText;
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

// Load first set of images
window.onload = loadNewImages;
