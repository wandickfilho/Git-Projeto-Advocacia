//localStorage.removeItem("cookieChoice");

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");

  if (banner && localStorage.getItem("cookieChoice")) {
    banner.style.display = "none";
  }

  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");

  if (acceptBtn) {
    acceptBtn.onclick = () => {
      localStorage.setItem("cookieChoice", "accepted");
      banner.style.display = "none";
    };
  }

  if (rejectBtn) {
    rejectBtn.onclick = () => {
      localStorage.setItem("cookieChoice", "rejected");
      banner.style.display = "none";
    };
  }
});
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // remove tudo que não for número
  value = value.replace(/\D/g, "");

  // aplica máscara
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  e.target.value = value;
});
const processoInput = document.getElementById("processo");

processoInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // remove tudo que não for número
  value = value.replace(/\D/g, "");

  // limita a 20 dígitos
  value = value.slice(0, 20);

  // aplica máscara CNJ
  value = value.replace(/^(\d{7})(\d)/, "$1-$2");
  value = value.replace(/^(\d{7}-\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, "$1.$2");
  value = value.replace(/^(\d{7}-\d{2}\.\d{4}\.\d)(\d)/, "$1.$2");
  value = value.replace(/^(\d{7}-\d{2}\.\d{4}\.\d\.\d{2})(\d)/, "$1.$2");

  e.target.value = value;
});
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = e.target.querySelectorAll("input");

  const nome = inputs[0].value;
  const email = inputs[1].value;
  const senha = inputs[2].value;
  const confirmar = inputs[3].value;

  if (senha !== confirmar) {
    alert("As senhas não coincidem!");
    return;
  }

  const res = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, senha })
  });

  const data = await res.json();

  alert(data.message || "Cadastro realizado!");
});
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputs = e.target.querySelectorAll("input");

  const email = inputs[0].value;
  const senha = inputs[1].value;

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();

  if (data.user) {
    alert("Login realizado com sucesso!");

    // guarda sessão (temporário)
    localStorage.setItem("usuarioLogado", JSON.stringify(data.user));

    window.location.href = "index.html";
  } else {
    alert(data.message || "Erro no login");
  }
});