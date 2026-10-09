(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");
  const cartDialog = document.querySelector("#cart-dialog");
  const cartTrigger = document.querySelector(".cart-trigger");
  const cartItemsContainer = document.querySelector("#cart-items");
  const cartEmpty = document.querySelector("#cart-empty");
  const cartCount = document.querySelector(".cart-count");
  const cartTotal = document.querySelector("#cart-total");
  const checkoutButton = document.querySelector("#checkout-button");
  const cartFeedback = document.querySelector("#cart-feedback");
  const toast = document.querySelector("#toast");
  const cart = new Map();
  let toastTimer;

  function toggleMobileMenu(forceOpen) {
    const isOpen = forceOpen ?? menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Menu sluiten" : "Menu openen");
    siteNav.classList.toggle("is-open", isOpen);
  }

  menuToggle.addEventListener("click", () => toggleMobileMenu());
  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) toggleMobileMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") toggleMobileMenu(false);
  });

  function formatPrice(value) {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(value);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function addToCart(name, price) {
    const item = cart.get(name);
    if (item) item.quantity += 1;
    else cart.set(name, { name, price, quantity: 1 });
    updateCart();
    showToast(`${name} toegevoegd aan je winkelmand`);
  }

  function removeFromCart(name) {
    const item = cart.get(name);
    if (!item) return;
    if (item.quantity > 1) item.quantity -= 1;
    else cart.delete(name);
    updateCart();
  }

  function updateCart() {
    const quantity = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
    const total = [...cart.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = String(quantity);
    cartCount.setAttribute("aria-label", `${quantity} ${quantity === 1 ? "product" : "producten"}`);
    cartTotal.textContent = formatPrice(total);
    cartEmpty.hidden = cart.size > 0;
    checkoutButton.disabled = cart.size === 0;
    cartItemsContainer.replaceChildren();
    for (const item of cart.values()) {
      const row = document.createElement("div");
      row.className = "cart-item";
      const name = document.createElement("span");
      name.className = "cart-item-name";
      name.textContent = item.name;
      const detail = document.createElement("span");
      detail.className = "cart-item-detail";
      detail.textContent = `${item.quantity} × ${formatPrice(item.price)}`;
      name.append(detail);
      const subtotal = document.createElement("strong");
      subtotal.className = "cart-item-subtotal";
      subtotal.textContent = formatPrice(item.price * item.quantity);
      const remove = document.createElement("button");
      remove.className = "remove-item";
      remove.type = "button";
      remove.textContent = "−";
      remove.setAttribute("aria-label", `${item.name} verwijderen`);
      remove.addEventListener("click", () => removeFromCart(item.name));
      row.append(name, subtotal, remove);
      cartItemsContainer.append(row);
    }
  }

  document.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.name, Number(button.dataset.price)));
  });
  cartTrigger.addEventListener("click", () => {
    cartFeedback.textContent = "";
    cartDialog.showModal();
  });
  document.querySelector(".dialog-close").addEventListener("click", () => cartDialog.close());
  cartDialog.addEventListener("click", (event) => {
    if (event.target === cartDialog) cartDialog.close();
  });
  checkoutButton.addEventListener("click", () => {
    if (cart.size === 0) return;
    cart.clear();
    updateCart();
    cartFeedback.textContent = "Dit is een demo-bestelling. Bedankt voor je bestelling!";
  });

  const memorySymbols = ["🎄", "🎅", "🎁", "⭐", "❄️", "🍪"];
  const memoryGrid = document.querySelector("#memory-grid");
  const memoryMoves = document.querySelector("#memory-moves");
  const memoryPairs = document.querySelector("#memory-pairs");
  const memoryMessage = document.querySelector("#memory-message");
  let firstCard = null;
  let memoryLocked = false;
  let moves = 0;
  let pairs = 0;
  let memoryTimer;

  function startMemoryGame() {
    window.clearTimeout(memoryTimer);
    firstCard = null;
    memoryLocked = false;
    moves = 0;
    pairs = 0;
    memoryMoves.textContent = "0";
    memoryPairs.textContent = "0";
    memoryMessage.textContent = "Klaar voor de start? Kies een kaart!";
    const deck = [...memorySymbols, ...memorySymbols].sort(() => Math.random() - 0.5);
    memoryGrid.replaceChildren();
    deck.forEach((symbol, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card-face";
      card.textContent = "?";
      card.setAttribute("aria-label", `Kaart ${index + 1}, gesloten`);
      card.dataset.symbol = symbol;
      card.addEventListener("click", () => revealMemoryCard(card));
      memoryGrid.append(card);
    });
  }

  function revealMemoryCard(card) {
    if (memoryLocked || card.disabled || card.classList.contains("is-open")) return;
    card.textContent = card.dataset.symbol;
    card.classList.add("is-open");
    card.setAttribute("aria-label", `Kaart: ${card.dataset.symbol}`);
    if (!firstCard) {
      firstCard = card;
      return;
    }
    moves += 1;
    memoryMoves.textContent = String(moves);
    if (firstCard.dataset.symbol === card.dataset.symbol) {
      firstCard.classList.replace("is-open", "is-matched");
      card.classList.replace("is-open", "is-matched");
      firstCard.disabled = true;
      card.disabled = true;
      firstCard = null;
      pairs += 1;
      memoryPairs.textContent = String(pairs);
      if (pairs === memorySymbols.length) memoryMessage.textContent = "🎉 Goed gedaan! Je hebt alle kerstkaarten gevonden!";
      else memoryMessage.textContent = "Goed gevonden! Zoek nog een duo.";
      return;
    }
    memoryLocked = true;
    memoryMessage.textContent = "Geen paar, probeer het nog eens!";
    const previousCard = firstCard;
    firstCard = null;
    memoryTimer = window.setTimeout(() => {
      [previousCard, card].forEach((item) => {
        item.classList.remove("is-open");
        item.textContent = "?";
        item.setAttribute("aria-label", "Gesloten kaart");
      });
      memoryLocked = false;
    }, 850);
  }

  document.querySelector("#memory-reset").addEventListener("click", startMemoryGame);
  startMemoryGame();

  const giftField = document.querySelector("#gift-field");
  const giftPlayer = document.querySelector("#gift-player");
  const giftScoreDisplay = document.querySelector("#gift-score");
  const giftLivesDisplay = document.querySelector("#gift-lives");
  const giftMessage = document.querySelector("#gift-message");
  const giftHint = document.querySelector("#gift-hint");
  const giftStartButton = document.querySelector("#gift-start");
  let giftRunning = false;
  let giftAnimation;
  let giftLastFrame = 0;
  let giftSpawnElapsed = 0;
  let giftScore = 0;
  let giftLives = 3;
  let giftPosition = 50;
  let gifts = [];

  function moveGiftPlayer(clientX) {
    const bounds = giftField.getBoundingClientRect();
    giftPosition = Math.max(6, Math.min(94, ((clientX - bounds.left) / bounds.width) * 100));
    giftPlayer.style.left = `calc(${giftPosition}% - 21px)`;
  }

  function createGift() {
    const element = document.createElement("span");
    element.className = "gift-item";
    element.textContent = ["🎁", "🎀", "🧸"][Math.floor(Math.random() * 3)];
    const x = Math.random() * (giftField.clientWidth - 30);
    element.style.left = `${x}px`;
    giftField.append(element);
    gifts.push({ element, x, y: -32, speed: 90 + Math.random() * 45 });
  }

  function endGiftGame() {
    giftRunning = false;
    window.cancelAnimationFrame(giftAnimation);
    gifts.forEach(({ element }) => element.remove());
    gifts = [];
    giftHint.hidden = false;
    giftHint.textContent = "Game over!";
    giftMessage.textContent = `Game over! Je score is ${giftScore}.`;
    giftStartButton.textContent = "Opnieuw spelen ↻";
  }

  function giftFrame(timestamp) {
    if (!giftRunning) return;
    const delta = Math.min((timestamp - (giftLastFrame || timestamp)) / 1000, 0.05);
    giftLastFrame = timestamp;
    giftSpawnElapsed += delta;
    if (giftSpawnElapsed >= 1.05) {
      giftSpawnElapsed = 0;
      createGift();
    }
    const fieldHeight = giftField.clientHeight;
    const basketLeft = giftField.clientWidth * giftPosition / 100 - 21;
    gifts = gifts.filter((gift) => {
      gift.y += gift.speed * delta;
      gift.element.style.transform = `translateY(${gift.y}px)`;
      const caught = gift.y + 24 >= fieldHeight - 35 && gift.y < fieldHeight - 8 && gift.x + 25 > basketLeft && gift.x < basketLeft + 42;
      if (caught) {
        gift.element.remove();
        giftScore += 1;
        giftScoreDisplay.textContent = String(giftScore);
        giftMessage.textContent = "Goed gevangen! +1 punt";
        return false;
      }
      if (gift.y + 24 >= fieldHeight - 3) {
        gift.element.remove();
        giftLives -= 1;
        giftLivesDisplay.textContent = String(giftLives);
        giftMessage.textContent = "Oeps, eentje gemist!";
        if (giftLives <= 0) {
          endGiftGame();
          return false;
        }
        return false;
      }
      return true;
    });
    if (giftRunning) giftAnimation = window.requestAnimationFrame(giftFrame);
  }

  function startGiftGame() {
    window.cancelAnimationFrame(giftAnimation);
    gifts.forEach(({ element }) => element.remove());
    gifts = [];
    giftScore = 0;
    giftLives = 3;
    giftPosition = 50;
    giftLastFrame = 0;
    giftSpawnElapsed = 0;
    giftRunning = true;
    giftScoreDisplay.textContent = "0";
    giftLivesDisplay.textContent = "3";
    giftPlayer.style.left = "calc(50% - 21px)";
    giftHint.hidden = true;
    giftMessage.textContent = "Vang de cadeautjes!";
    giftStartButton.textContent = "Opnieuw starten ↻";
    giftAnimation = window.requestAnimationFrame(giftFrame);
    giftField.focus({ preventScroll: true });
  }

  giftStartButton.addEventListener("click", startGiftGame);
  giftField.addEventListener("pointermove", (event) => {
    if (giftRunning) moveGiftPlayer(event.clientX);
  });
  giftField.addEventListener("pointerdown", (event) => {
    if (giftRunning) moveGiftPlayer(event.clientX);
  });
  giftField.addEventListener("keydown", (event) => {
    if (!giftRunning || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    giftPosition = Math.max(6, Math.min(94, giftPosition + (event.key === "ArrowLeft" ? -7 : 7)));
    giftPlayer.style.left = `calc(${giftPosition}% - 21px)`;
  });

  const quizQuestions = [
    { question: "Welke kleur heeft de klassieke kerstman meestal?", answers: ["Blauw", "Rood", "Paars", "Groen"], correct: 1 },
    { question: "Wat staat vaak bovenop een kerstboom?", answers: ["Een schoen", "Een klok", "Een ster", "Een strik"], correct: 2 },
    { question: "Wanneer vieren we Kerstmis?", answers: ["In december", "In april", "In juli", "In september"], correct: 0 },
    { question: "Welk dier wordt vaak met de kerstman verbonden?", answers: ["Een rendier", "Een leeuw", "Een pinguïn", "Een paard"], correct: 0 },
    { question: "Wat krijg je vaak onder de kerstboom?", answers: ["Een paraplu", "Een cadeau", "Een strandbal", "Een fietsbel"], correct: 1 }
  ];
  const quizCount = document.querySelector("#quiz-count");
  const quizQuestion = document.querySelector("#quiz-question");
  const quizAnswers = document.querySelector("#quiz-answers");
  const quizMessage = document.querySelector("#quiz-message");
  const quizProgressFill = document.querySelector("#quiz-progress-fill");
  const quizResetButton = document.querySelector("#quiz-reset");
  let quizIndex = 0;
  let quizScore = 0;
  let quizComplete = false;
  let quizTimer;

  function startQuiz() {
    window.clearTimeout(quizTimer);
    quizIndex = 0;
    quizScore = 0;
    quizComplete = false;
    quizResetButton.textContent = "Opnieuw spelen ↻";
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    quizCount.textContent = `Vraag ${quizIndex + 1} van ${quizQuestions.length}`;
    quizProgressFill.style.width = `${(quizIndex / quizQuestions.length) * 100}%`;
    quizQuestion.textContent = quizQuestions[quizIndex].question;
    quizMessage.textContent = "Kies je antwoord!";
    quizAnswers.replaceChildren();
    quizQuestions[quizIndex].answers.forEach((answer, answerIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-answer";
      button.textContent = answer;
      button.addEventListener("click", () => answerQuizQuestion(answerIndex));
      quizAnswers.append(button);
    });
  }

  function answerQuizQuestion(answerIndex) {
    if (quizComplete) return;
    const question = quizQuestions[quizIndex];
    const answerButtons = [...quizAnswers.children];
    answerButtons.forEach((button) => { button.disabled = true; });
    if (answerIndex === question.correct) {
      quizScore += 1;
      answerButtons[answerIndex].classList.add("is-correct");
      quizMessage.textContent = "Helemaal goed! ⭐";
    } else {
      answerButtons[answerIndex].classList.add("is-wrong");
      answerButtons[question.correct].classList.add("is-correct");
      quizMessage.textContent = "Bijna! Het goede antwoord staat groen.";
    }
    quizTimer = window.setTimeout(() => {
      quizIndex += 1;
      if (quizIndex === quizQuestions.length) {
        quizComplete = true;
        quizCount.textContent = "Quiz afgerond";
        quizProgressFill.style.width = "100%";
        quizQuestion.textContent = `Je hebt ${quizScore} van de 5 vragen goed!`;
        quizAnswers.replaceChildren();
        quizMessage.textContent = quizScore === 5 ? "Fantastisch, jij bent een echte kerstkenner! 🎉" : "Goed gespeeld! Zin in nog een rondje?";
        quizResetButton.focus({ preventScroll: true });
      } else {
        renderQuizQuestion();
      }
    }, 850);
  }

  quizResetButton.addEventListener("click", startQuiz);
  startQuiz();

  document.querySelector("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    document.querySelector("#form-status").textContent = "Bedankt voor je bericht!";
    form.reset();
  });
})();
