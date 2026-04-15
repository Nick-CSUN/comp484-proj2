$(function () {
  // Runs when the page (DOM) is fully loaded

  // Array of possible pet images (randomly selected on start)
  const petImages = ["images/charmander.png", "images/Bulbasaur.png", "images/squirtle.png"];

  // Sound effects for each action
  const playSound = new Audio("effects/play.mp3");
  const eatSound = new Audio("effects/eat.mp3");
  const exerciseSound = new Audio("effects/exercise.mp3");
  const sleepSound = new Audio("effects/sleep.mp3");

  // Main object storing pet data
  var pet_info = {
    name: "",
    health: 100,
    happiness: 100,
    hunger: 100
  };

  // Hide the game screen initially (only show intro)
  $("#game").hide();

  // =========================
  // START GAME BUTTON
  // =========================
  $("#start-game").on("click", function () {

    /*
    =========================
    .val() EXPLANATION
    =========================
    - .val() is a jQuery method used to GET or SET the value of input fields.
    - Here, it retrieves whatever the user typed into the text box.
    
    Example:
      $("#input").val()        → gets value
      $("#input").val("John")  → sets value
    
    In this case:
      We grab the pet name entered by the user.
    */
    const nameInput = $("#pet-name-input").val();

    // Prevent empty names
    if (nameInput === "") {
      alert("Enter a name!");
      return;
    }

    // Save name into pet object
    pet_info.name = nameInput;

    // Pick a random pet image
    const randomPet = petImages[Math.floor(Math.random() * petImages.length)];
    $(".pet-image").prop("src", randomPet);

    /*
    =========================
    .hide() / .show() EXPLANATION
    =========================
    - .hide() → sets display: none (element disappears)
    - .show() → restores element (display: block or original value)

    These are commonly used to switch screens in simple apps.

    In this project:
      - Hide intro screen
      - Show game screen

    This simulates moving from a "menu" to the "game"
    */
    $("#intro-screen").hide();
    $("#game").show();

    // Update UI with initial values
    updatePetInfoInHtml();
    showMessage("Your pet is ready! 🐾");
  });

  // =========================
  // BUTTON EVENT LISTENERS
  // =========================
  $('.treat-button').on("click", clickedTreatButton);
  $('.play-button').on("click", clickedPlayButton);
  $('.exercise-button').on("click", clickedExerciseButton);
  $('.sleep-button').on("click", clickedSleepButton);

  // =========================
  // ACTION FUNCTIONS
  // =========================

  function clickedTreatButton() {
    // Feeding increases happiness & hunger, decreases health slightly
    pet_info.happiness += 10;
    pet_info.health -= 5;
    pet_info.hunger += 10;

    eatSound.play();              // play sound
    showMessage("Yum! 😋");       // show message
    animatePet("eat");            // animate pet
    flashColor("rgba(0, 255, 0, 0.2)"); // green flash

    checkAndUpdatePetInfoInHtml();
  }

  function clickedPlayButton() {
    // Playing increases happiness, decreases hunger
    pet_info.happiness += 15;
    pet_info.health += 5;
    pet_info.hunger -= 10;

    playSound.play();
    showMessage("That was fun! 🎾");
    animatePet("play");
    flashColor("rgba(0, 0, 255, 0.2)");

    checkAndUpdatePetInfoInHtml();
  }

  function clickedExerciseButton() {
    // Exercise increases health but lowers happiness & hunger
    pet_info.happiness -= 10;
    pet_info.health += 10;
    pet_info.hunger -= 15;

    exerciseSound.play();
    showMessage("So tired... 😓");
    animatePet("exercise");
    flashColor("rgba(255, 0, 0, 0.2)");

    checkAndUpdatePetInfoInHtml();
  }

  function clickedSleepButton() {
    // Sleep restores health and happiness slightly
    pet_info.happiness += 5;
    pet_info.health += 5;
    pet_info.hunger -= 5;

    sleepSound.play();
    showMessage("Zzz 😴");
    animatePet("sleep");
    flashColor("rgba(128, 0, 128, 0.2)");

    checkAndUpdatePetInfoInHtml();
  }

  // =========================
  // DATA VALIDATION
  // =========================

  function checkAndUpdatePetInfoInHtml() {
    checkValues();        // ensure valid values
    updatePetInfoInHtml();// update UI
  }

  function checkValues() {
    // Prevent stats from going below 0 or above 100
    if (pet_info.health < 0) pet_info.health = 0;
    if (pet_info.happiness < 0) pet_info.happiness = 0;
    if (pet_info.hunger < 0) pet_info.hunger = 0;

    if (pet_info.health > 100) pet_info.health = 100;
    if (pet_info.happiness > 100) pet_info.happiness = 100;
    if (pet_info.hunger > 100) pet_info.hunger = 100;
  }

  // =========================
  // UPDATE UI
  // =========================
  function updatePetInfoInHtml() {

    // Update text values
    $('.name').text(pet_info.name);
    $('.health').text(pet_info.health);
    $('.happiness').text(pet_info.happiness);
    $('.hunger').text(pet_info.hunger);

    // Update bar widths based on percentage
    $("#health-bar").css("width", pet_info.health + "%");
    $("#happiness-bar").css("width", pet_info.happiness + "%");
    $("#hunger-bar").css("width", pet_info.hunger + "%");

    // Change colors based on low/high values
    $("#health-bar").css("background-color", pet_info.health < 30 ? "red" : "green");
    $("#happiness-bar").css("background-color", pet_info.happiness < 30 ? "red" : "yellow");
    $("#hunger-bar").css("background-color", pet_info.hunger < 30 ? "red" : "blue");
  }

  // =========================
  // MESSAGE SYSTEM
  // =========================
  function showMessage(message) {
    const msg = $("#pet-message");

    // stop() prevents stacking animations if clicked repeatedly
    msg.stop(true, true)
      .text(message)
      .slideDown(200)
      .delay(900)
      .slideUp(200);
  }

  // =========================
  // SCREEN FLASH EFFECT
  // =========================
  function flashColor(color) {
    const overlay = $("#flash-overlay");

    overlay.css("background-color", color);

    setTimeout(function () {
      overlay.css("background-color", "transparent");
    }, 200);
  }

  // =========================
  // PET ANIMATIONS
  // =========================
  function animatePet(action) {

    const pet = $(".pet-image");

    // Clear any existing animation loop
    if (pet.data("animating")) {
      clearInterval(pet.data("animating"));
    }

    let count = 0;

    if (action === "play") {
      let direction = 1;

      const interval = setInterval(function () {
        pet.css("transform", `rotate(${15 * direction}deg)`);
        direction *= -1;
        count++;

        if (count > 6) {
          clearInterval(interval);
          pet.css("transform", "none");
        }
      }, 100);

      pet.data("animating", interval);
    }

    else if (action === "eat") {
      pet.css("transform", "scale(1.2)");

      setTimeout(function () {
        pet.css("transform", "none");
      }, 300);
    }

    else if (action === "exercise") {
      let direction = 1;

      const interval = setInterval(function () {
        pet.css("transform", `translateX(${20 * direction}px)`);
        direction *= -1;
        count++;

        if (count > 6) {
          clearInterval(interval);
          pet.css("transform", "none");
        }
      }, 100);

      pet.data("animating", interval);
    }

    else if (action === "sleep") {
      pet.css({
        transform: "scale(0.95)",
        filter: "brightness(0.6)"
      });

      setTimeout(function () {
        pet.css({
          transform: "none",
          filter: "brightness(1)"
        });
      }, 1300);
    }
  }

});