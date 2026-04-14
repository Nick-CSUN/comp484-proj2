$(function () {

  const petImages = ["images/charmander.png", "images/Bulbasaur.png", "images/squirtle.png"];
  //const happySound = new Audio("happy.mp3");

  var pet_info = {
    name: "",
    health: 100,
    happiness: 100,
    hunger: 100
  };

  // Start with game hidden
  $("#game").hide();

  // START GAME (using .on instead of .click)
  $("#start-game").on("click", function () {

    const nameInput = $("#pet-name-input").val(); // .val()

    if (nameInput === "") {
      alert("Enter a name!");
      return;
    }

    pet_info.name = nameInput;

    // Random image
    const randomPet = petImages[Math.floor(Math.random() * petImages.length)];
    $(".pet-image").prop("src", randomPet); // using .prop instead of .attr

    // Hide intro, show game
    $("#intro-screen").hide();
    $("#game").show();

    updatePetInfoInHtml();
    showMessage("Your pet is ready! 🐾");
  });

  // BUTTON EVENTS (using .on)
  $('.treat-button').on("click", clickedTreatButton);
  $('.play-button').on("click", clickedPlayButton);
  $('.exercise-button').on("click", clickedExerciseButton);
  $('.sleep-button').on("click", clickedSleepButton);

  function clickedTreatButton() {
    pet_info.happiness += 10;
    pet_info.health -= 5;
    pet_info.hunger += 10;

    //happySound.play();
    showMessage("Yum! 😋");
    animatePet("eat");
    flashColor("rgba(0, 255, 0, 0.2)");

    checkAndUpdatePetInfoInHtml();
  }

  function clickedPlayButton() {
    pet_info.happiness += 15;
    pet_info.health += 5;
    pet_info.hunger -= 10;

    showMessage("That was fun! 🎾");
    animatePet("play");
    flashColor("rgba(0, 0, 255, 0.2)");

    checkAndUpdatePetInfoInHtml();
  }

  function clickedExerciseButton() {
    pet_info.happiness -= 10;
    pet_info.health += 10;
    pet_info.hunger -= 15;

    showMessage("So tired... 😓");
    animatePet("exercise");
    flashColor("rgba(255, 0, 0, 0.2)");

    checkAndUpdatePetInfoInHtml();
  }

  function clickedSleepButton() {
    pet_info.happiness += 5;
    pet_info.health += 5;
    pet_info.hunger -= 5;

    showMessage("Zzz 😴");
    animatePet("sleep");
    flashColor("rgba(128, 0, 128, 0.2)");

    checkAndUpdatePetInfoInHtml();
  }

  function checkAndUpdatePetInfoInHtml() {
    checkValues();
    updatePetInfoInHtml();
  }

  function checkValues() {
    if (pet_info.health < 0) pet_info.health = 0;
    if (pet_info.happiness < 0) pet_info.happiness = 0;
    if (pet_info.hunger < 0) pet_info.hunger = 0;

    if (pet_info.health > 100) pet_info.health = 100;
    if (pet_info.happiness > 100) pet_info.happiness = 100;
    if (pet_info.hunger > 100) pet_info.hunger = 100;
  }

  function updatePetInfoInHtml() {
    $('.name').text(pet_info.name);
    $('.health').text(pet_info.health);
    $('.happiness').text(pet_info.happiness);
    $('.hunger').text(pet_info.hunger);

    // Update bars using .css()
    // Convert values into percentages (max = 100)
    $("#health-bar").css("width", pet_info.health + "%");
    $("#happiness-bar").css("width", pet_info.happiness + "%");
    $("#hunger-bar").css("width", pet_info.hunger + "%");

    // Color changes based on level
    if (pet_info.health < 30) {
      $("#health-bar").css("background-color", "red");
    } else {
      $("#health-bar").css("background-color", "green");
    }

    if (pet_info.happiness < 30) {
      $("#happiness-bar").css("background-color", "red");
    } else {
      $("#happiness-bar").css("background-color", "yellow");
    }

    if (pet_info.hunger < 30) {
      $("#hunger-bar").css("background-color", "red");
    } else {
      $("#hunger-bar").css("background-color", "blue");
    }
  }

  // MESSAGE SYSTEM using slideDown/slideUp
  function showMessage(message) {

    const msg = $("#pet-message");

    msg.stop(true, true)   // prevents animation queue buildup
      .text(message)
      .slideDown(200)
      .delay(900)
      .slideUp(200);
  }

  // VISUAL EFFECT using .css()
  function flashColor(color) {
  const overlay = $("#flash-overlay");

  overlay.css("background-color", color);

  setTimeout(function () {
    overlay.css("background-color", "transparent");
  }, 200);
}

  function animatePet(action) {

    const pet = $(".pet-image");

    // STOP any previous animation loop
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

        if (count > 6) { // number of wiggles
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

  /*
  ===== NEW JQUERY METHODS USED =====

  1. .on()
     - Attaches event listeners (modern alternative to .click())

  2. .val()
     - Gets user input from the text box

  3. .prop()
     - Sets properties like image source (alternative to .attr())

  4. .hide() / .show()
     - Controls visibility of intro/game screens

  5. .slideDown() / .slideUp()
     - Smooth animation for messages

  6. .css()
     - Dynamically changes styles (background flash effect)

  */
});