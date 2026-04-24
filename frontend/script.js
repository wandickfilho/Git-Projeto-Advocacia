//////////////////////////////
// 🔐 PROTEÇÃO DE ROTAS
//////////////////////////////
(() => {
  const path = window.location.pathname.toLowerCase();
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

function normalizarTexto(valor) {
  return (valor || "").toString().trim().toLowerCase();
}

function statusClass(status) {
  const key = normalizarTexto(status);
  if (key === "em andamento") return "status-andamento";
  if (key === "concluído" || key === "concluido") return "status-concluido";
  if (key === "arquivado") return "status-arquivado";
  if (key === "pendente") return "status-pendente";
  return "status-default";
}

function ensureDialogRoot() {
  let root = document.getElementById("customDialogRoot");
  if (root) return root;

  root = document.createElement("div");
  root.id = "customDialogRoot";
  root.className = "custom-dialog-root is-hidden";
  root.innerHTML = `
    <div class="custom-dialog-overlay"></div>
    <div class="custom-dialog-box" role="dialog" aria-modal="true" aria-live="polite">
      <h3 class="custom-dialog-title"></h3>
      <p class="custom-dialog-message"></p>
      <div class="custom-dialog-actions"></div>
    </div>
  `;
  document.body.appendChild(root);
  return root;
}

function abrirDialogo({ title, message, buttons }) {
  return new Promise((resolve) => {
    const root = ensureDialogRoot();
    const titleEl = root.querySelector(".custom-dialog-title");
    const messageEl = root.querySelector(".custom-dialog-message");
    const actionsEl = root.querySelector(".custom-dialog-actions");

    titleEl.textContent = title || "Aviso";
    messageEl.textContent = message || "";
    actionsEl.innerHTML = "";

    buttons.forEach((btn) => {
      const el = document.createElement("button");
      el.type = "button";
      el.textContent = btn.label;
      el.className = `custom-dialog-btn ${btn.variant || "primary"}`;
      el.addEventListener("click", () => {
        root.classList.add("is-hidden");
        resolve(btn.value);
      });
      actionsEl.appendChild(el);
    });

    root.classList.remove("is-hidden");
  });
}

function notify(message, title = "Aviso") {
  return abrirDialogo({
    title,
    message,
    buttons: [{ label: "OK", value: true, variant: "primary" }]
  });
}

function askConfirm(message, title = "Confirmar") {
  return abrirDialogo({
    title,
    message,
    buttons: [
      { label: "Cancelar", value: false, variant: "ghost" },
      { label: "Confirmar", value: true, variant: "danger" }
    ]
  });
}

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
    let data = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(text || "Resposta invalida do servidor");
    }

    if (!res.ok) {
      notify(data?.message || `Falha no login (HTTP ${res.status})`, "Login");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.user));

    window.location.href = "Pages/controle.html";

  } catch (err) {
    console.error(err);
    notify("Nao foi possivel conectar no backend em http://localhost:3000. Inicie o servidor e tente novamente.", "Login");
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
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  
  if (senha !== confirmarSenha){
    alert ("Senhas não correspondem! ");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    let data = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(text || "Resposta invalida do servidor");
    }

    notify(data?.message || "Falha ao cadastrar", "Cadastro");

    if (res.ok) {
      window.location.href = "../index.html";
    }

  } catch (err) {
    console.error(err);
    notify("Nao foi possivel conectar no backend para cadastrar.", "Cadastro");
  }
});

//////////////////////////////
// 📄 CARREGAR PROCESSOS
//////////////////////////////
async function carregarProcessos() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:3000/processos", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : [];

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "../index.html";
        return;
      }
      notify(data?.message || "Erro ao carregar processos", "Processos");
      return;
    }

    processosCache = Array.isArray(data) ? data : [];
    renderizarProcessos(processosCache);
  } catch (err) {
    console.error(err);
    notify("Falha ao buscar processos. Verifique se o backend esta ligado.", "Processos");
  }
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
    const id = p.id_processo ?? p.id ?? p.processo_id;
    const status = p.status_processo || "Nao informado";
    return `
      <tr>
        <td>${p.numero_processo}</td>
        <td>${p.nome_cliente}</td>
        <td>${p.cpf_cliente}</td>
        <td>${p.tipo_acao}</td>
        <td><span class="status-badge ${statusClass(status)}">${status}</span></td>
        <td>${(p.data_protocolo || "").split("T")[0]}</td>
        <td>
          <button onclick="editarProcesso(${id})">Editar</button>
          <button class="btn-excluir" onclick="excluirProcesso(${id})">Excluir</button>
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
  const busca = normalizarTexto(document.getElementById("filtroBusca").value);
  const status = normalizarTexto(document.getElementById("filtroStatus").value);

  const filtrados = processosCache.filter(p => {
    const nome = normalizarTexto(p.nome_cliente);
    const numero = normalizarTexto(p.numero_processo);
    const statusProcesso = normalizarTexto(p.status_processo);
    return (
      (!busca || nome.includes(busca) || numero.includes(busca)) &&
      (!status || statusProcesso === status)
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
  if (!token || !usuario?.id) {
    notify("Sua sessao expirou. Faca login novamente.", "Sessao");
    window.location.href = "../index.html";
    return;
  }

  // ✅ Usa FormData para suportar arquivos (fotos + documentos)
  const formData = new FormData();
  formData.append("numero_processo", document.getElementById("numero_processo").value);
  formData.append("nome_cliente",    document.getElementById("nome_cliente").value);
  formData.append("cpf_cliente",     document.getElementById("cpf_cliente").value);
  formData.append("tipo_acao",       document.getElementById("tipo_acao").value);
  formData.append("status_processo", document.getElementById("status_processo").value);
  formData.append("data_protocolo",  document.getElementById("data_protocolo").value);
  formData.append("descricao",       document.getElementById("descricao").value);
  formData.append("adv_id",          usuario?.id ?? "");

  // Anexa fotos e documentos se a função estiver disponível (página de controle)
  if (typeof window.getArquivosSelecionados === "function") {
    const { fotos, documentos } = window.getArquivosSelecionados();
    fotos.forEach(f       => formData.append("fotos", f));
    documentos.forEach(d  => formData.append("documentos", d));
  }

  // ⚠️ Não definir Content-Type manualmente — o browser seta o boundary do multipart
  try {
    const res = await fetch("http://localhost:3000/processos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    let data;
    try {
      data = await res.json();
    } catch {
      notify(`Erro no servidor (${res.status}). Verifique o backend.`, "Processos");
      return;
    }

    notify(data.message, "Processos");

    if (res.ok) {
      e.target.reset();
      carregarProcessos();
    }
  } catch (err) {
    console.error(err);
    notify("Nao foi possivel salvar o processo.", "Processos");
  }
});

//////////////////////////////
// ✏️ EDITAR PROCESSO
//////////////////////////////
function editarProcesso(id) {
  const p = processosCache.find(x =>
    x.id == id || x.id_processo == id || x.processo_id == id
  );

  if (!p) {
    console.error("Processo não encontrado no cache. ID:", id);
    return;
  }

  idEditando = id;

  document.getElementById("edit_numero").value = p.numero_processo || "";
  document.getElementById("edit_nome").value   = p.nome_cliente    || "";
  document.getElementById("edit_cpf").value    = p.cpf_cliente     || "";
  document.getElementById("edit_tipo").value   = p.tipo_acao       || "";
  document.getElementById("edit_status").value = p.status_processo || "";
  document.getElementById("edit_data").value   = (p.data_protocolo || "").split("T")[0];

  // Renderiza fotos e documentos no modal (listagens.html)
  if (typeof window.renderArquivosModal === "function") {
    const fotos = typeof p.fotos === "string" ? JSON.parse(p.fotos || "[]") : (p.fotos || []);
    const docs  = typeof p.documentos === "string" ? JSON.parse(p.documentos || "[]") : (p.documentos || []);
    window.renderArquivosModal(fotos, docs);
  }

  document.getElementById("modalEditar").classList.add("active");
}

//////////////////////////////
// 💾 SALVAR EDIÇÃO
//////////////////////////////
async function salvarEdicao() {
  if (!idEditando) {
    notify("Nenhum processo selecionado para editar.", "Edicao");
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

  try {
    const res = await fetch(`http://localhost:3000/processos/${idEditando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    notify(data.message, "Edicao");

    if (res.ok) {
      fecharModal();
      carregarProcessos();
    }
  } catch (err) {
    console.error(err);
    notify("Nao foi possivel salvar a edicao.", "Edicao");
  }
}

function fecharModal() {
  document.getElementById("modalEditar").classList.remove("active");
  idEditando = null;
}

//////////////////////////////
// 🗑️ EXCLUIR PROCESSO
//////////////////////////////
async function excluirProcesso(id) {
  const confirmou = await askConfirm(
    "Tem certeza que deseja excluir este processo? Esta acao nao pode ser desfeita.",
    "Excluir processo"
  );
  if (!confirmou) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:3000/processos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    let data;
    try { data = await res.json(); } catch { data = { message: "Erro inesperado" }; }

    notify(data.message, "Exclusao");

    if (res.ok) carregarProcessos();

  } catch (err) {
    console.error(err);
    notify("Erro ao excluir processo", "Exclusao");
  }
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