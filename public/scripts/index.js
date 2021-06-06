const toggle = document.querySelector(".toggle");
const links = document.querySelector(".nav-links");
const list = links.querySelectorAll("li");
const profile = document.querySelector(".profile");
// const profile_card = document.querySelector(".profile-card");

//show profile
profile.addEventListener("click", function () {
  profile.classList.toggle("show-profile");
});

toggle.addEventListener("click", function () {
  links.classList.toggle("show-links");
});

list.forEach(li => {
  li.addEventListener("click", function () {
    links.classList.remove("show-links");
  });
});
