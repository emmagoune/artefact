const imagePairs = ["1.jpg", "2.jpg", "3.jpg"]; // List all file names

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

function checkAnswer(choice) {
    if (choice === correctAnswer) {
        document.getElementById("result").textContent = "✅ Correct! This is human-made.";
    } else {
        document.getElementById("result").textContent = "❌ Wrong! This is AI-generated.";
    }
}

// Load first set of images
window.onload = loadNewImages;
