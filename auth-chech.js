// auth-check.js
const token = localStorage.getItem("token");
if (!token) {
  alert("Acesso negado! Faça login primeiro.");
  window.location.href = "index.html";
}