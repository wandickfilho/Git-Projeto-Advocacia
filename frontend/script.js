//////////////////////////////
// 🔐 PROTEÇÃO DE ROTAS
//////////////////////////////
(() => {
  const path = window.location.pathname;
  const isPrivatePage = ["controle.html", "listagens.html"].some(page =>
    path.includes(page)
  );

  const token = localStorage.getItem("token");

  if (isPrivatePage && !token) {
    window.location.href = "../index.html";
  }
})();

//////////////////////////////
// 📦 CACHE GLOBAL
//////////////////////////////
let processosCache = [];

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

  if (!res.ok) {
    alert("Erro ao carregar processos");
    return;
  }

  processosCache = await res.json();
  renderizarProcessos(processosCache);
}

//////////////////////////////
// 🧾 RENDER LISTA
//////////////////////////////
function renderizarProcessos(lista) {
  const tbody = document.getElementById("corpoTabela");
  if (!tbody) return;

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center">Nenhum processo encontrado</td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(p => `
    <tr>
      <td>${p.numero_processo}</td>
      <td>${p.nome_cliente}</td>
      <td>${p.cpf_cliente}</td>
      <td>${p.tipo_acao}</td>
      <td>${p.status_processo}</td>
      <td>${p.data_protocolo}</td>
    </tr>
  `).join("");
}

//////////////////////////////
// 🚀 INICIALIZA LISTAGEM
//////////////////////////////
if (document.getElementById("corpoTabela")) {
  carregarProcessos();
}

//////////////////////////////
// 🔍 FILTRO
//////////////////////////////
document.getElementById("btnFiltrar")?.addEventListener("click", () => {
  const busca = (document.getElementById("filtroBusca")?.value || "")
    .toLowerCase()
    .trim();

  const status = (document.getElementById("filtroStatus")?.value || "")
    .toLowerCase()
    .trim();

  const filtrados = processosCache.filter(p => {
    const statusProcesso = (p.status_processo || "").toLowerCase().trim();
    const nome = (p.nome_cliente || "").toLowerCase();
    const numero = (p.numero_processo || "").toLowerCase();

    const matchStatus = status ? statusProcesso === status : true;

    const matchBusca = busca
      ? numero.includes(busca) || nome.includes(busca)
      : true;

    return matchStatus && matchBusca;
  });

  renderizarProcessos(filtrados);
});

//////////////////////////////
// 🧹 LIMPAR FILTRO
//////////////////////////////
document.getElementById("btnLimparFiltros")?.addEventListener("click", () => {
  const busca = document.getElementById("filtroBusca");
  const status = document.getElementById("filtroStatus");

  if (busca) busca.value = "";
  if (status) status.value = "";

  renderizarProcessos(processosCache);
});

//////////////////////////////
// ⚖️ CADASTRO PROCESSO
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
    adv_id: usuario.id
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
  alert(data.message || "Processo salvo com sucesso!");

  if (res.ok) {
    e.target.reset();
    carregarProcessos(); // atualiza lista
  }
});

//////////////////////////////
// 📌 MÁSCARA CPF
//////////////////////////////
document.getElementById("cpf_cliente")?.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);

  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  e.target.value = v;
});

//////////////////////////////
// 📌 MÁSCARA PROCESSO CNJ
//////////////////////////////
document.getElementById("numero_processo")?.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 20);

  v = v.replace(/^(\d{7})(\d)/, "$1-$2");
  v = v.replace(/^(\d{7}-\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, "$1.$2");
  v = v.replace(/^(\d{7}-\d{2}\.\d{4}\.\d{1})(\d)/, "$1.$2");
  v = v.replace(/^(\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2})(\d)/, "$1.$2");

  e.target.value = v;
});