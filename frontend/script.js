//////////////////////////////
// 🔐 PROTEÇÃO DE ROTAS
//////////////////////////////
(() => {
  const path = window.location.pathname;
  const token = localStorage.getItem("token");

  const isPrivate = ["controle.html", "listagens.html"].some(p =>
    path.includes(p)
  );

  if (isPrivate && !token) {
    window.location.href = "../index.html";
  }
})();

//////////////////////////////
// 📦 CACHE
//////////////////////////////
let processosCache = [];
let idEditando = null;

//////////////////////////////
// 🔑 LOGIN
//////////////////////////////
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.user));

    window.location.href = "Pages/controle.html";

  } catch (err) {
    console.error(err);
    alert("Erro ao conectar");
  }
});

//////////////////////////////
// 🧾 CADASTRO
//////////////////////////////
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      window.location.href = "../index.html";
    }

  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar");
  }
});

//////////////////////////////
// 📄 CARREGAR PROCESSOS
//////////////////////////////
async function carregarProcessos() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/processos", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("Erro ao carregar processos");
    return;
  }

  processosCache = data;
  renderizarProcessos(data);
}

//////////////////////////////
// 🧾 RENDER TABELA
//////////////////////////////
function renderizarProcessos(lista) {
  const tbody = document.getElementById("corpoTabela");
  if (!tbody) return;

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="7">Nenhum processo</td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(p => {
    // ✅ FIX: normaliza o ID independente do nome do campo
    const id = p.id_processo ?? p.id ?? p.processo_id;
    return `
      <tr>
        <td>${p.numero_processo}</td>
        <td>${p.nome_cliente}</td>
        <td>${p.cpf_cliente}</td>
        <td>${p.tipo_acao}</td>
        <td>${p.status_processo}</td>
        <td>${(p.data_protocolo || "").split("T")[0]}</td>
        <td>
          <button onclick="editarProcesso(${id})">Editar</button>
        </td>
      </tr>
    `;
  }).join("");
}

//////////////////////////////
// 🚀 INIT
//////////////////////////////
if (document.getElementById("corpoTabela")) {
  carregarProcessos();
}

//////////////////////////////
// 🔍 FILTRO
//////////////////////////////
document.getElementById("btnFiltrar")?.addEventListener("click", () => {
  const busca = document.getElementById("filtroBusca").value.toLowerCase();
  const status = document.getElementById("filtroStatus").value.toLowerCase();

  const filtrados = processosCache.filter(p => {
    return (
      (!busca || p.nome_cliente.toLowerCase().includes(busca) || p.numero_processo.toLowerCase().includes(busca)) &&
      (!status || p.status_processo.toLowerCase() === status)
    );
  });

  renderizarProcessos(filtrados);
});

//////////////////////////////
// 🧹 LIMPAR FILTRO
//////////////////////////////
document.getElementById("btnLimparFiltros")?.addEventListener("click", () => {
  document.getElementById("filtroBusca").value = "";
  document.getElementById("filtroStatus").value = "";
  renderizarProcessos(processosCache);
});

//////////////////////////////
// ➕ CADASTRAR PROCESSO
//////////////////////////////
document.getElementById("processoForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  const payload = {
    numero_processo: document.getElementById("numero_processo").value,
    nome_cliente: document.getElementById("nome_cliente").value,
    cpf_cliente: document.getElementById("cpf_cliente").value,
    tipo_acao: document.getElementById("tipo_acao").value,
    status_processo: document.getElementById("status_processo").value,
    data_protocolo: document.getElementById("data_protocolo").value,
    descricao: document.getElementById("descricao").value,
    adv_id: usuario?.id
  };

  const res = await fetch("http://localhost:3000/processos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  alert(data.message);

  if (res.ok) {
    e.target.reset();
    carregarProcessos();
  }
});

//////////////////////////////
// ✏️ EDITAR PROCESSO
//////////////////////////////
function editarProcesso(id) {
  // ✅ FIX: usa == ao invés de === para evitar falha por tipo (string vs number)
  const p = processosCache.find(x =>
    x.id == id || x.id_processo == id || x.processo_id == id
  );

  if (!p) {
    console.error("Processo não encontrado no cache. ID:", id);
    return;
  }

  idEditando = id;

  document.getElementById("edit_numero").value = p.numero_processo || "";
  document.getElementById("edit_nome").value = p.nome_cliente || "";
  document.getElementById("edit_cpf").value = p.cpf_cliente || "";
  document.getElementById("edit_tipo").value = p.tipo_acao || "";
  document.getElementById("edit_status").value = p.status_processo || "";
  document.getElementById("edit_data").value = (p.data_protocolo || "").split("T")[0];

  document.getElementById("modalEditar").style.display = "flex";
}

//////////////////////////////
// 💾 SALVAR EDIÇÃO
//////////////////////////////
async function salvarEdicao() {
  if (!idEditando) {
    alert("Nenhum processo selecionado para editar.");
    return;
  }

  const token = localStorage.getItem("token");

  const payload = {
    numero_processo: document.getElementById("edit_numero").value,
    nome_cliente: document.getElementById("edit_nome").value,
    cpf_cliente: document.getElementById("edit_cpf").value,
    tipo_acao: document.getElementById("edit_tipo").value,
    status_processo: document.getElementById("edit_status").value,
    data_protocolo: document.getElementById("edit_data").value
  };

  const res = await fetch(`http://localhost:3000/processos/${idEditando}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  alert(data.message);

  fecharModal();
  carregarProcessos();
}

function fecharModal() {
  document.getElementById("modalEditar").style.display = "none";
  idEditando = null;
}

//////////////////////////////
// 🎭 MÁSCARAS
//////////////////////////////

// ✅ FIX: aplica máscara de CPF nos dois inputs (cadastro e edição)
["cpf_cliente", "edit_cpf"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    v = v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = v;
  });
});

// ✅ FIX: aplica máscara de número do processo nos dois inputs (cadastro e edição)
["numero_processo", "edit_numero"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 20);
    v = v
      .replace(/^(\d{7})(\d)/, "$1-$2")
      .replace(/^(\d{7}-\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, "$1.$2")
      .replace(/^(\d{7}-\d{2}\.\d{4}\.\d)(\d)/, "$1.$2")
      .replace(/^(\d{7}-\d{2}\.\d{4}\.\d\.\d{2})(\d+)/, "$1.$2");
    e.target.value = v;
  });
});