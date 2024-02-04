document.addEventListener("keydown", function(event) {
    const cards = document.querySelectorAll(".profile-card");
    const currentIndex = Array.from(cards).findIndex(card => getComputedStyle(card).display !== "none");
    let nextIndex;
    arrow_dir = null
    switch(event.key) {
        case "ArrowLeft":
            arrow_dir= "left";
            nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
            break;
        case "ArrowRight":
            arrow_dir= "right";
            nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
            break;
        default:
            return; // Exit function for other keys
    }

    const currentCard = cards[currentIndex];
    const nextCard = cards[nextIndex];

    currentCard.style.transform = arrow_dir == "right" ? "translateX(100%)" : "translateX(-100%)";
    setTimeout(() => {
        currentCard.classList.add("hidden");
        nextCard.classList.remove("hidden");
        nextCard.style.transform = "translateX(0)";
    }, 300);
});