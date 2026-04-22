//localStorage.removeItem("cookieChoice");
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");

  // se já escolheu, esconde
  if (localStorage.getItem("cookieChoice")) {
    banner.style.display = "none";
    return;
  }

  // aceitar
  document.getElementById("accept-cookies").onclick = () => {
    localStorage.setItem("cookieChoice", "accepted");
    banner.style.display = "none";
  };

  // recusar
  document.getElementById("reject-cookies").onclick = () => {
    localStorage.setItem("cookieChoice", "rejected");
    banner.style.display = "none";
  };
});