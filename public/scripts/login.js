const form = document.querySelector("form");

//error display div
const emailError = document.querySelector(".error.email");
const passwordError = document.querySelector(".error.password");
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  //error display div

  emailError.textContent = "";
  passwordError.textContent = "";

  //form values

  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data);
    if (data.user) {
      location.assign("/");
    }

    if (data.errors) {
      const { email, password, username } = data.errors;
      emailError.textContent = email;
      passwordError.textContent = password;
    }
  } catch (err) {
    console.log(err);
  }
});
