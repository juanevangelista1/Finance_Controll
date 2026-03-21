<div align="center">

# 💸 DT Money

### Controle Financeiro Pessoal · Personal Finance Control

**Português** | [English](#-english-version)

---

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

</div>

---

## 🇧🇷 Versão em Português

### Sobre o Projeto

O **DT Money** é uma aplicação web de controle financeiro pessoal construída com **Next.js 15** e **React 19**. Permite registrar entradas e saídas financeiras, filtrar por mês e ano, visualizar relatórios com gráficos interativos e exportar os dados em PDF — tudo sem necessidade de backend, usando o **SessionStorage** do navegador para persistência.

---

### Funcionalidades

- **Dashboard completo** — Cards de resumo com total de entradas, saídas e saldo do período
- **Filtro por mês e ano** — Navegação intuitiva pelo período desejado (a partir de janeiro de 2026)
- **Busca de transações** — Pesquisa por descrição ou categoria em tempo real
- **Cadastro de transações** — Modal com validação de formulário (descrição, valor, categoria, tipo)
- **Relatórios anuais** — Página dedicada com análise detalhada por ano
- **Gráficos interativos** — Barras mensais, evolução do saldo e pizza por categoria
- **Exportação em PDF** — Geração e download do relatório completo
- **Dados persistidos** — Informações salvas no SessionStorage da sessão ativa
- **Design responsivo** — Mobile-first, funciona perfeitamente em qualquer dispositivo

---

### Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Linguagem | TypeScript 5.6 |
| Estilização | Tailwind CSS 3.4 |
| Gráficos | Recharts 2 |
| Formulários | React Hook Form + Zod |
| Componentes | Radix UI (Dialog) |
| Ícones | Lucide React |
| PDF Export | jsPDF + html2canvas |
| Utilitários | clsx + tailwind-merge |

---

### Arquitetura

O projeto segue os princípios de **DDD (Domain-Driven Design)**, **SOLID** e **DRY**, organizado em camadas:

```
src/
├── app/                          # Rotas Next.js (App Router)
│   ├── page.tsx                  # Dashboard (/)
│   ├── reports/page.tsx          # Relatórios (/reports)
│   ├── layout.tsx                # Layout raiz
│   └── globals.css               # Estilos globais
│
├── domain/                       # Camada de Domínio
│   └── transaction/
│       ├── entities/             # Entidade Transaction
│       ├── repositories/         # Interface ITransactionRepository
│       └── value-objects/        # TransactionType (income | outcome)
│
├── application/                  # Camada de Aplicação
│   └── transaction/
│       ├── use-cases/            # CreateTransactionUseCase, GetTransactionsUseCase, DeleteTransactionUseCase
│       └── dtos/                 # TransactionDTO, TransactionFilterDTO
│
├── infrastructure/               # Camada de Infraestrutura
│   └── repositories/             # SessionStorageTransactionRepository
│
├── presentation/                 # Camada de Apresentação
│   ├── components/               # Componentes React
│   │   ├── Charts/               # MonthlyBarChart, CategoryPieChart, BalanceLineChart
│   │   ├── Header/               # Navegação e botão nova transação
│   │   ├── Footer/               # Créditos e LinkedIn
│   │   ├── Summary/              # Cards de resumo financeiro
│   │   ├── MonthYearFilter/      # Seletor de mês e ano
│   │   ├── NewTransactionModal/  # Modal de cadastro
│   │   ├── SearchForm/           # Busca de transações
│   │   └── TransactionsList/     # Listagem de transações
│   ├── contexts/                 # TransactionsContext (useReducer)
│   └── hooks/                    # useSummary, useReports
│
└── shared/                       # Utilitários compartilhados
    └── utils/                    # formatter, cn, pdfExport
```

---

### Como Executar

**Pré-requisitos:** Node.js 18+ e npm/yarn/pnpm

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dt-money.git
cd dt-money

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

**Outros comandos:**

```bash
npm run build    # Build de produção
npm run start    # Iniciar servidor de produção
npm run lint     # Verificar lint
```

---

### Telas

| Rota | Descrição |
|---|---|
| `/` | Dashboard com resumo, filtros e listagem de transações |
| `/reports` | Relatórios anuais com gráficos e exportação em PDF |

---

### Categorias Disponíveis

Alimentação · Moradia · Transporte · Saúde · Educação · Lazer · Assinaturas · Trabalho · Freelance · Investimentos · Outros

---

### Observações

> Os dados são armazenados no **SessionStorage** do navegador. Ao fechar a aba ou o navegador, as informações são apagadas. Isso é intencional para manter a aplicação sem necessidade de backend.

---

### Desenvolvido por

<div align="center">

Desenvolvido com ♥ por **[Juan Evangelista](https://www.linkedin.com/in/juan-evangelista/)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Juan%20Evangelista-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/juan-evangelista/)

</div>

---
---

## 🇺🇸 English Version

### About

**DT Money** is a personal finance web application built with **Next.js 15** and **React 19**. It lets you record income and expenses, filter by month and year, view reports with interactive charts, and export data as PDF — all without a backend, using the browser's **SessionStorage** for data persistence.

---

### Features

- **Full dashboard** — Summary cards showing total income, expenses and balance for the selected period
- **Month & year filter** — Intuitive navigation through any period (starting from January 2026)
- **Transaction search** — Real-time search by description or category
- **Add transactions** — Modal with form validation (description, amount, category, type)
- **Annual reports** — Dedicated page with detailed year-level analysis
- **Interactive charts** — Monthly bar chart, balance evolution line chart, and category pie chart
- **PDF export** — Generate and download a full report
- **Persistent data** — Saved to SessionStorage for the active browser session
- **Responsive design** — Mobile-first, works perfectly on any device

---

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 |
| Charts | Recharts 2 |
| Forms | React Hook Form + Zod |
| Components | Radix UI (Dialog) |
| Icons | Lucide React |
| PDF Export | jsPDF + html2canvas |
| Utilities | clsx + tailwind-merge |

---

### Architecture

The project follows **DDD (Domain-Driven Design)**, **SOLID**, and **DRY** principles, organized in layers:

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard (/)
│   ├── reports/page.tsx          # Reports (/reports)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── domain/                       # Domain Layer
│   └── transaction/
│       ├── entities/             # Transaction entity
│       ├── repositories/         # ITransactionRepository interface
│       └── value-objects/        # TransactionType (income | outcome)
│
├── application/                  # Application Layer
│   └── transaction/
│       ├── use-cases/            # CreateTransactionUseCase, GetTransactionsUseCase, DeleteTransactionUseCase
│       └── dtos/                 # TransactionDTO, TransactionFilterDTO
│
├── infrastructure/               # Infrastructure Layer
│   └── repositories/             # SessionStorageTransactionRepository
│
├── presentation/                 # Presentation Layer
│   ├── components/               # React components
│   │   ├── Charts/               # MonthlyBarChart, CategoryPieChart, BalanceLineChart
│   │   ├── Header/               # Navigation and new transaction button
│   │   ├── Footer/               # Credits and LinkedIn link
│   │   ├── Summary/              # Financial summary cards
│   │   ├── MonthYearFilter/      # Month and year selector
│   │   ├── NewTransactionModal/  # Add transaction modal
│   │   ├── SearchForm/           # Transaction search
│   │   └── TransactionsList/     # Transactions list
│   ├── contexts/                 # TransactionsContext (useReducer)
│   └── hooks/                    # useSummary, useReports
│
└── shared/                       # Shared utilities
    └── utils/                    # formatter, cn, pdfExport
```

---

### Getting Started

**Requirements:** Node.js 18+ and npm/yarn/pnpm

```bash
# Clone the repository
git clone https://github.com/your-username/dt-money.git
cd dt-money

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Other commands:**

```bash
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run linter
```

---

### Pages

| Route | Description |
|---|---|
| `/` | Dashboard with summary, filters and transaction list |
| `/reports` | Annual reports with charts and PDF export |

---

### Available Categories

Food · Housing · Transport · Health · Education · Leisure · Subscriptions · Work · Freelance · Investments · Others

---

### Notes

> Data is stored in the browser's **SessionStorage**. Closing the tab or browser will clear all data. This is intentional to keep the app backend-free.

---

### Developed by

<div align="center">

Made with ♥ by **[Juan Evangelista](https://www.linkedin.com/in/juan-evangelista/)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Juan%20Evangelista-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/juan-evangelista/)

</div>
