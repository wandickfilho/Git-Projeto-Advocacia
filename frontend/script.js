//localStorage.removeItem("cookieChoice");
console.log("SCRIPT CARREGOU");
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

if (cpfInput) {
  cpfInput.addEventListener("input", (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = value;
  });
}
const processoInput = document.getElementById("processo");

if (processoInput) {
  processoInput.addEventListener("input", (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");
    value = value.slice(0, 20);

    value = value.replace(/^(\d{7})(\d)/, "$1-$2");
    value = value.replace(/^(\d{7}-\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, "$1.$2");
    value = value.replace(/^(\d{7}-\d{2}\.\d{4}\.\d)(\d)/, "$1.$2");
    value = value.replace(/^(\d{7}-\d{2}\.\d{4}\.\d\.\d{2})(\d)/, "$1.$2");

    e.target.value = value;
  });
}
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("CLICOU EM CADASTRAR");
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
document.getElementById("processoForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const numero_processo = document.getElementById("processo").value;
  const nome_cliente = document.getElementById("nomeCliente").value;
  const tipo_acao = document.getElementById("tipoAcao").value;
  const data_protocolo = document.getElementById("dataProtocolo").value;
  const cpf_cliente = document.getElementById("cpf").value.replace(/\D/g, "");

  // ⚠️ depois vamos pegar isso do login
  const adv_id = 1;

  console.log("ENVIANDO PROCESSO:", {
    numero_processo,
    nome_cliente,
    tipo_acao,
    data_protocolo,
    cpf_cliente,
    adv_id
  });

  try {
    const res = await fetch("http://localhost:3000/processos/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        numero_processo,
        nome_cliente,
        tipo_acao,
        data_protocolo,
        cpf_cliente,
        adv_id
      })
    });

    const data = await res.json();

    console.log("RESPOSTA:", data);

    alert(data.message);

  } catch (error) {
    console.error("ERRO AO SALVAR PROCESSO:", error);
  }
});
async function listarProcessos() {
  try {
    const res = await fetch("http://localhost:3000/processos");
    const processos = await res.json();

    const lista = document.getElementById("lista-processos");

    if (!lista) return;

    lista.innerHTML = "";

    processos.forEach(p => {
      lista.innerHTML += `
        <div class="card">
          <strong>${p.numero_processo}</strong><br>
          Cliente: ${p.nome_cliente}<br>
          Tipo: ${p.tipo_acao}<br>
          Status: ${p.status_processo}<br>
          Data: ${p.data_protocolo}<br><br>
        </div>
      `;
    });

  } catch (error) {
    console.error("Erro ao listar:", error);
  }
}
if (document.getElementById("lista-processos")) {
  listarProcessos();
}