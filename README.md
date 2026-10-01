# Broadcast — Teste Técnico

Aplicação desenvolvida como parte do processo seletivo para **Desenvolvedor Full Stack**, com o objetivo de implementar uma solução simplificada de Broadcast utilizando React, TypeScript e Firebase.

## 🔗 Aplicação

**Aplicação publicada:**
[(https://samydayautogroup.web.app)]

**Código-fonte:**
[(https://github.com/yago0901/broadcast.git)]

---

## 🎯 Sobre o projeto

O projeto consiste em uma aplicação SaaS multi-tenant para gerenciamento de conexões, contatos e mensagens de Broadcast.

A aplicação permite que cada usuário gerencie seus próprios dados, mantendo o isolamento entre diferentes clientes.

### Principais funcionalidades

* Cadastro e autenticação de usuários;
* Gerenciamento de conexões;
* CRUD de conexões;
* Gerenciamento de contatos por conexão;
* CRUD de contatos;
* Seleção de contatos para envio;
* Envio de mensagens de forma simulada;
* Agendamento de mensagens;
* Visualização de mensagens;
* Filtro entre mensagens enviadas e agendadas;
* Edição de mensagens;
* Exclusão de mensagens;
* Atualização em tempo real utilizando Firestore.

---

## 🛠️ Tecnologias utilizadas

### Frontend

* React
* TypeScript
* Vite
* React Router
* Material UI
* Tailwind CSS
* Firebase SDK
* Firebase Authentication
* Cloud Firestore

### Backend

* Firebase Cloud Functions
* TypeScript

### Infraestrutura

* Firebase Hosting
* Firebase Authentication
* Cloud Firestore

---

## 📁 Estrutura do projeto

O projeto foi separado entre frontend e backend conforme solicitado no teste:

```text
/
├── functions/
│   └── src/
│       └── ...
│
├── web/
│   ├── src/
│   │   ├── auth/
│   │   ├── connections/
│   │   ├── contacts/
│   │   ├── messages/
│   │   ├── components/
│   │   └── ...
│   │
│   └── ...
│
├── firebase.json
├── firestore.rules
└── README.md
```

A aplicação frontend utiliza uma organização orientada por funcionalidades, mantendo componentes, hooks, APIs e tipos separados conforme suas responsabilidades.

---

## 🏗️ Arquitetura

A aplicação segue uma arquitetura SaaS multi-tenant.

O relacionamento dos dados é estruturado utilizando referências entre documentos, sem utilização de subcoleções:

```text
User
 │
 ├── Connections
 │      │
 │      ├── Contacts
 │      │
 │      └── Messages
 │
 └── ...
```

As collections principais são:

```text
users
connections
contacts
messages
```

Os documentos possuem informações de identificação do proprietário e relacionamento entre as entidades.

Exemplo simplificado:

```text
connections
├── id
├── ownerId
├── name
└── createdAt

contacts
├── id
├── ownerId
├── connectionId
├── name
└── phone

messages
├── id
├── ownerId
├── connectionId
├── contactIds
├── content
├── status
├── scheduledAt
└── createdAt
```

---

## 🔐 Isolamento entre clientes

O isolamento dos dados é realizado utilizando as regras de segurança do Firestore.

Cada registro possui a identificação do usuário proprietário (`ownerId`) e as regras verificam a identidade do usuário autenticado antes de permitir operações sobre os dados.

Dessa forma, um cliente não deve conseguir acessar ou modificar registros pertencentes a outro cliente.

Além da validação no frontend, o controle de acesso é realizado nas regras de segurança do Firestore, evitando que a proteção dependa apenas da interface.

---

## ⚡ Atualização em tempo real

O Firestore é utilizado com listeners em tempo real (`onSnapshot`) nas áreas em que essa atualização é relevante.

Isso permite que alterações realizadas nos documentos sejam refletidas na interface sem a necessidade de atualização manual da página.

---

## ☁️ Mensagens agendadas e Cloud Functions

A aplicação possui a lógica necessária para trabalhar com o ciclo de vida das mensagens agendadas.

Uma mensagem agendada é criada inicialmente com o status:

```text
scheduled
```

Quando o horário programado é atingido, a lógica de backend prevista para a aplicação deve identificar a mensagem e atualizar seu status para:

```text
sent
```

Essa responsabilidade foi estruturada utilizando **Firebase Cloud Functions**, permitindo que a alteração ocorra no backend sem depender da aplicação frontend estar aberta.

### Observação sobre o ambiente Firebase utilizado

A implementação das Cloud Functions foi incluída no projeto e está estruturada em:

```text
/functions
```

Entretanto, a execução dessa rotina em ambiente hospedado depende de recursos do Firebase que exigem um projeto com faturamento habilitado.

Por esse motivo, no ambiente Firebase utilizado para a entrega, **não foi possível habilitar a execução da rotina agendada em produção sem ativar um plano de faturamento**.

A limitação é de infraestrutura/plano do Firebase, e não da implementação da funcionalidade no código.

O restante do fluxo de criação, armazenamento, visualização, edição e exclusão das mensagens permanece disponível na aplicação.

---

## 🧪 Execução local

### Pré-requisitos

* Node.js
* npm
* Firebase CLI

### Instalação

Na raiz do projeto:

```bash
npm install
```

Para instalar as dependências do frontend:

```bash
cd web
npm install
```

Para instalar as dependências das Functions:

```bash
cd ../functions
npm install
```

### Frontend

```bash
cd web
npm run dev
```

### Functions

```bash
cd functions
npm run build
```

Caso seja utilizado o Firebase Emulator Suite:

```bash
firebase emulators:start
```

---

## 🔒 Variáveis e configurações

Informações sensíveis e configurações específicas de ambiente não são versionadas no repositório.

Para executar o projeto em outro ambiente, devem ser configuradas as respectivas credenciais e configurações do Firebase.

---

## 📌 Decisões técnicas

### Firebase Authentication

Utilizado para autenticação dos clientes da aplicação e identificação do usuário responsável pelos dados.

### Firestore

Utilizado como banco de dados principal, aproveitando:

* persistência;
* consultas;
* regras de segurança;
* listeners em tempo real.

### Cloud Functions

Utilizadas para concentrar comportamentos que precisam ser executados no backend, especialmente o processamento de mensagens agendadas.

### React + TypeScript

Utilizados para construção do frontend com tipagem estática e organização baseada em componentes e hooks.

### Material UI + Tailwind CSS

Material UI foi utilizado para componentes de interface, enquanto Tailwind CSS foi utilizado para composição e estilização das telas.

---

## 📋 Requisitos do teste

| Requisito                                | Implementação                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Firebase Authentication                  | ✅                                                                                                     |
| Cadastro e login                         | ✅                                                                                                     |
| CRUD de conexões                         | ✅                                                                                                     |
| CRUD de contatos                         | ✅                                                                                                     |
| Broadcast simulado                       | ✅                                                                                                     |
| Agendamento de mensagens                 | ✅                                                                                                     |
| Visualização de mensagens                | ✅                                                                                                     |
| Filtro de mensagens                      | ✅                                                                                                     |
| Edição de mensagens                      | ✅                                                                                                     |
| Exclusão de mensagens                    | ✅                                                                                                     |
| SaaS multi-tenant                        | ✅                                                                                                     |
| Isolamento entre clientes                | ✅                                                                                                     |
| Material UI                              | ✅                                                                                                     |
| Tailwind CSS                             | ✅                                                                                                     |
| Arquitetura funcional                    | ✅                                                                                                     |
| Firestore em tempo real                  | ✅                                                                                                     |
| Vite                                     | ✅                                                                                                     |
| Sem subcoleções                          | ✅                                                                                                     |
| `/web` e `/functions`                    | ✅                                                                                                     |
| Firebase Hosting                         | ✅                                                                                                     |
| Alteração automática via Cloud Functions | ⚠️ Implementada, porém depende de plano Firebase com faturamento habilitado para execução em produção |

---

## 👨‍💻 Autor

**Yago Santos Gigeck**

Desenvolvedor Front-end / Full Stack

* React
* TypeScript
* Next.js
* Node.js
* Firebase

[GitHub](https://github.com/yagogigeck)
