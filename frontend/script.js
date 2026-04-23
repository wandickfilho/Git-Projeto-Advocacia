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

/* =========================
   LOGIN / CADASTRO
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // alternar telas (caso tenha botões)
  window.showLogin = function () {
    loginForm?.classList.remove("hidden");
    registerForm?.classList.add("hidden");
  };

  window.showRegister = function () {
    registerForm?.classList.remove("hidden");
    loginForm?.classList.add("hidden");
  };

  /* =========================
     CADASTRO
  ========================= */
  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = registerForm.querySelectorAll("input");

    const nome = inputs[0].value;
    const email = inputs[1].value;
    const senha = inputs[2].value;
    const confirmar = inputs[3].value;

    if (senha !== confirmar) {
      alert("As senhas não coincidem!");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.find(u => u.email === email);

    if (existe) {
      alert("Esse email já está cadastrado!");
      return;
    }

    usuarios.push({ nome, email, senha });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");

    registerForm.reset();
    showLogin();
  });

  /* =========================
     LOGIN
  ========================= */
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = loginForm.querySelectorAll("input");

    const email = inputs[0].value;
    const senha = inputs[1].value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const user = usuarios.find(
      u => u.email === email && u.senha === senha
    );

    if (!user) {
      alert("Email ou senha incorretos!");
      return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(user));

    alert(`Bem-vindo, ${user.nome}!`);

    window.location.href = "index.html";
  });
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