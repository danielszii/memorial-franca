# Memorial Franca

<p align="center">
  <img src="frontend/public/logo-fra.png" alt="Logo Franca" width="120" />
</p>

O Memorial Franca é uma plataforma web dedicada a registrar e preservar o legado histórico da comunidade Franca no ambiente FiveM, ativa desde 2020. O sistema documenta a evolução da mesma ao longo de suas seis versões de história, detalhando seus líderes, sublíderes, conquistas competitivas (como os títulos da Baguncinha) e os perfis de todos os membros que fizeram parte desta trajetória.

---

## Estrutura do Repositorio

O projeto está organizado no formato monorepo, contendo duas aplicações principais:

*   **`backend`**: API REST desenvolvida em Node.js com Express e TypeScript, integrada ao banco de dados PostgreSQL. Inclui serviços em segundo plano para monitoramento e sincronização de transmissões ao vivo de membros.
*   **`frontend`**: Interface interativa de usuário desenvolvida em React, Vite, TypeScript e Tailwind CSS.

```text
memorial-franca/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexões com banco de dados
│   │   ├── controllers/     # Controladores das rotas Express
│   │   ├── dtos/            # Objetos de Transferência de Dados
│   │   ├── errors/          # Classes de tratamento de exceções
│   │   ├── middlewares/     # Middlewares globais (ex: tratamento de erros)
│   │   ├── repositories/    # Camada de persistência/acesso ao banco (SQL)
│   │   ├── routes/          # Definições de rotas da API
│   │   ├── services/        # Regras de negócio e rotina de sincronização de lives
│   │   └── app.ts           # Inicialização do servidor Express
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── public/              # Ativos estáticos públicos (favicon, banners de títulos)
    ├── src/
    │   ├── components/      # Componentes React (eras, membros, widgets, layout)
    │   ├── constants/       # Valores estáticos e rotas de navegação
    │   ├── imports/         # Imagens integradas e banners locais
    │   ├── types/           # Interfaces de tipagem TypeScript
    │   ├── utils/           # Funções utilitárias (ex: scroll suave)
    │   ├── App.tsx          # Componente raiz da aplicação
    │   ├── index.css        # Configurações do Tailwind CSS v4 e fontes importadas
    │   └── main.tsx         # Ponto de entrada do React
    ├── tsconfig.json
    └── package.json
```

---

## Tecnologias Utilizadas

### Frontend
*   **React 18** e **TypeScript**
*   **Vite** para empacotamento rápido e servidor de desenvolvimento
*   **Tailwind CSS v4** para estilização utilitária e responsiva
*   **Axios** para consumo de rotas de leitura na API do backend

### Backend
*   **Node.js** com **TypeScript** e **Express**
*   **PostgreSQL** como banco de dados relacional
*   **pg** (node-postgres) para execução de consultas parametrizadas e transações SQL
*   **Node Fetch** para requisições externas na rotina de sincronização

---

## Funcionalidades Principais

*   **Linha do Tempo das Eras (EraTimeline):** Apresentação interativa com o histórico tático, servidores, conquistas e músicas temáticas de cada uma das seis eras da comunidade.
*   **Galeria de Conquistas e Títulos (HonorsSection):** Exibição detalhada dos títulos oficiais vencidos na BGC (BGC 2.0 e BGC 3.0), contendo a escalação dos elencos campeões e banners temáticos.
*   **Roster Completo de Membros:** Filtro de busca de integrantes em tempo real por nickname, era de participação ou cargo dentro da hierarquia (Fundador, Líder, Gerente, Membro).
*   **Métricas de Presença (OnlineWidget):** Integração para contagem aproximada de usuários ativos navegando no site simultaneamente.
*   **Sincronização de Transmissoes ao Vivo (LiveSyncService):** Rotina interna executada a cada 2 minutos no backend que consulta de forma assíncrona o status de lives dos membros nas plataformas:
    *   **Twitch:** Verifica transmissões usando a API oficial da Twitch (Helix) com autenticação de desenvolvedor. Possui suporte automático a fallback via GraphQL (GQL) caso as credenciais não estejam configuradas no ambiente.
    *   **YouTube:** Consulta transmissões ao vivo através de raspagem (scraping) do HTML público do canal do criador.
    *   **Kick:** Verifica o status de lives através da API pública da plataforma Kick.

---

## Configuracao do Banco de Dados

O banco de dados relacional utiliza PostgreSQL. O esquema de tabelas e as inserções de dados iniciais das eras e membros estão localizados em:
*   [memorial-franca.sql](file:///c:/Users/danie/Documents/memorial-franca/backend/memorial-franca.sql)

Para restaurar ou inicializar o banco de dados localmente:
1. Crie uma nova base de dados no PostgreSQL (ex: `memorial_franca`).
2. Execute as instruções contidas no arquivo SQL para criar as tabelas `eras`, `members` e `member_versions` e preencher os dados de semente.

---

## Como Executar o Projeto

### Backend

1.  Acesse o diretório do backend:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure o arquivo `.env` no diretório raiz do backend baseado nas variáveis de ambiente necessárias:
    ```env
    PORT=3001
    DATABASE_URL=postgresql://usuario:senha@localhost:5432/memorial_franca
    
    # Credenciais opcionais da Twitch para o LiveSync (apenas se desejar usar a API oficial)
    TWITCH_CLIENT_ID=seu_client_id
    TWITCH_CLIENT_SECRET=seu_client_secret
    ```

4.  Inicie o servidor em modo de desenvolvimento (executa `tsx watch` que reinicia ao detectar mudanças):
    ```bash
    npm run dev
    ```
    O servidor estará ativo em `http://localhost:3001` e iniciará automaticamente a rotina de sincronização de lives.

5.  Para compilar o código TypeScript em JavaScript de produção:
    ```bash
    npm run build
    ```

---

### Frontend

1.  Acesse o diretório do frontend:
    ```bash
    cd ../frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure o arquivo `.env` com a URL do backend:
    ```env
    VITE_API_URL=http://localhost:3001/franca
    ```

4.  Inicie o servidor de desenvolvimento do Vite:
    ```bash
    npm run dev
    ```
    A aplicação frontend estará rodando por padrão em `http://localhost:5173`.

5.  Para gerar a build otimizada de produção:
    ```bash
    npm run build
    ```
