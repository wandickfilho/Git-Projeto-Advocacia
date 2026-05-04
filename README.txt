# ⚖️ Sistema de Gestão para Advocacia

Sistema web para gerenciamento de processos jurídicos, clientes e autenticação de advogados.

---

Aplicação desenvolvida para simular um sistema real de escritório de advocacia, permitindo o controle de processos, cadastro de clientes e autenticação segura de usuários.

---

### Interface do sistema

**Login**  
![Login](./assets/login.png)

**Cadastro**  
![Cadastro](./assets/cadastro.png)

**Controle de Processos**  
![Controle](./assets/controle.png)

**Listagem de Processos**  
![Listagem](./assets/listagem.png)

---

### Funcionalidades

- Login e cadastro de advogados  
- Cadastro de clientes  
- Cadastro de processos jurídicos  
- Listagem de processos com dados do cliente (JOIN)  
- Filtros de busca  
- Proteção de rotas com JWT  
- Upload de arquivos  

---

### Tecnologias

**Backend**
- Node.js  
- Express  
- MySQL  
- JWT  
- Bcrypt  

**Frontend**
- HTML  
- CSS  
- JavaScript  

---

### Estrutura do projeto

**Estrutura do projeto**

```id="9kq1dx"
Git-Projeto-Advocacia/
├── backend/
├── frontend/
├── database/
└── README.md
```

---

**Como executar o projeto**

Pré-requisitos:

* Node.js instalado
* MySQL instalado

1. Clone o repositório

```bash id="0m0bwm"
git clone https://github.com/wandickfilho/Git-Projeto-Advocacia
cd Git-Projeto-Advocacia
```

2. Backend

```bash id="1q2d8o"
cd backend
npm install
node server.js
```

Servidor: http://localhost:3000

3. Banco de dados

* Criar banco `advocacia` no MySQL
* Executar o script da pasta `/database`

4. Frontend

Abrir o arquivo `frontend/index.html` no navegador

---

**Autenticação**

Sistema utiliza JWT.
Token armazenado no localStorage e usado para proteger páginas privadas.

---

**Melhorias futuras**

* Responsividade
* Validação de CPF
* Dashboard
* Deploy
* Controle de permissões

---

**Autores**

Wandick Wagner Oliveira Silva Filho
Anthonny de Lima Lucena
José Etelvino
---

Licença

Projeto para fins profissionais e educacionais.
