const userName = document.getElementById("userName");
const userPassword = document.getElementById("userPassword");
const loginBtn = document.getElementById("loginBtn");
const myModal = document.getElementById("my_modal_5");
// get value from input By Id
const getInputValueById = (id) => {
  return id.value;
};

// Event listener on Login Btn
loginBtn.addEventListener("click", () => {
  const userNameValue = getInputValueById(userName).trim();
  const userPasswordValue = getInputValueById(userPassword).trim();

  if (userNameValue === "admin" && userPasswordValue === "admin123") {
    window.location.href = "home.html";
  } else {
    myModal.showModal();
  }
});
