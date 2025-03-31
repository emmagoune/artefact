function checkAnswer(isAI) {
    const resultDiv = document.getElementById('result');
    
    if (isAI) {
        resultDiv.innerHTML = "<p>Correct! This is AI-generated.</p>";
    } else {
        resultDiv.innerHTML = "<p>Oops! This is human-generated.</p>";
    }

    // After a delay, load a new pair of images (for now, just reset)
    setTimeout(() => {
        resultDiv.innerHTML = "";
        // You can replace these with new images dynamically
        document.querySelector('.item img').src = "newImage1.jpg";
        document.querySelectorAll('.item img')[1].src = "newImage2.jpg";
    }, 2000);
}
