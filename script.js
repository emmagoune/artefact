const imagePairs = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg"];
let remainingPairs = [...imagePairs];
let correctAnswer = "";
let currentImageName = "";
let correctCount = 0;

function loadNewImages() {
    if (remainingPairs.length === 0) {
        showFinalMessage();
        return;
    }

    const randomIndex = Math.floor(Math.random() * remainingPairs.length);
    currentImageName = remainingPairs[randomIndex];
    remainingPairs.splice(randomIndex, 1);

    const humanImg = `human_images/${currentImageName}`;
    const aiImg = `AI_images/${currentImageName}`;
    const isHumanLeft = Math.random() < 0.5;
    correctAnswer = isHumanLeft ? "left" : "right";

    const leftImage = document.getElementById("leftImage");
    const rightImage = document.getElementById("rightImage");
    leftImage.src = isHumanLeft ? humanImg : aiImg;
    rightImage.src = isHumanLeft ? aiImg : humanImg;

    leftImage.onclick = () => checkAnswer("left");
    rightImage.onclick = () => checkAnswer("right");

    // Clear previous result
    const resultEl = document.getElementById("result");
    resultEl.textContent = "";
    resultEl.className = "";

    // Hide final message if it was shown
    document.getElementById("finalMessage").style.display = "none";
}

async function checkAnswer(choice) {
    // Prevent further clicks
    document.getElementById("leftImage").onclick = null;
    document.getElementById("rightImage").onclick = null;
    
    let resultText = "";
    let resultClass = "";
    let link = "";

    if (choice === correctAnswer) {
        correctCount++;
        resultText = await loadExplanation("success_explanation", currentImageName);
        resultClass = "correct";
    } else {
        resultText = await loadExplanation("failure_explanation", currentImageName);
        resultClass = "wrong";
    }

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urlMatch = resultText.match(urlPattern);

    if (urlMatch) {
        link = `<a href="${urlMatch[0]}" target="_blank">Click here for more info</a>`;
        resultText = resultText.replace(urlPattern, "");
    }

    resultText = resultText.replace(/\n/g, "<br>");

    const resultBox = document.getElementById("result");
    resultBox.innerHTML = `${resultText} ${link}`;
    resultBox.className = resultClass;
}

async function loadExplanation(folder, imageName) {
    const fileName = imageName.replace('.jpg', '.txt');
    const filePath = `${folder}/${fileName}`;
    try {
        const response = await fetch(filePath);
        return response.ok ? await response.text() : "Could not load explanation.";
    } catch {
        return "An error occurred while loading the explanation.";
    }
}

function showFinalMessage() {
    const scorePercentage = (correctCount / imagePairs.length) * 100;
    let finalMessage = "";

    if (scorePercentage === 100) {
        finalMessage = "You're a true expert! Keep engaging critically with AI and its impacts.";
    } else if (scorePercentage >= 80) {
        finalMessage = "You're on the right track! Explore the resources linked in each round to deepen your understanding.";
    } else if (scorePercentage >= 50) {
        finalMessage = "The topics you missed are worth revisiting. Stay curious and keep learning about AI’s real-world effects!";
    } else {
        finalMessage = "The topics you missed are worth revisiting. Take time to explore the issues and stay informed!";
    }

    // Hide the gameplay result box
    const resultBox = document.getElementById("result");
    resultBox.textContent = "";
    resultBox.className = "";

    // Hide the "Next Round" button
    const nextRoundButton = document.querySelector("button[onclick='loadNewImages()']");
    if (nextRoundButton) {
        nextRoundButton.style.display = "none";
    }

    // Show the final screen
    const finalMessageBox = document.getElementById("finalMessage");
    finalMessageBox.style.display = "block";
    finalMessageBox.innerHTML = `
        <div class="congrats">
            <h1>Congratulations, you finished the game!</h1>
            <p>${finalMessage}</p>
            <p>You scored <strong>${correctCount}</strong> out of ${imagePairs.length}.</p>
        </div>
        <button id="startOverButton" style="padding: 10px 20px; font-size: 1.2em; cursor: pointer;">Start Over</button>
    `;

    document.getElementById("startOverButton").onclick = startOver;
}

function startOver() {
    remainingPairs = [...imagePairs];
    correctAnswer = "";
    currentImageName = "";
    correctCount = 0;

    document.getElementById("result").textContent = "";
    document.getElementById("result").className = "";

    loadNewImages();
}

window.onload = loadNewImages;
