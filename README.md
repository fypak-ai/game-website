# 🎮 CodePlay – Plataforma de Desenvolvimento Fictício

Site estático de jogo/demonstração com App Store fictícia, banco de dados de usuários, carteira virtual e playground de código.

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| **Homepage** | Hero responsivo, features grid, CTA |
| **Playground** | Criação de apps com logo automático, preço e código JS |
| **App Store** | Compra/venda de apps usando a carteira virtual |
| **Banco de Dados** | CRUD de usuários fictícios com simulação de login |
| **Comunidade** | Leaderboard e apps em destaque |

## Tecnologias

- HTML5 + CSS3 (sem frameworks)
- JavaScript vanilla (sem bibliotecas)
- LocalStorage para persistência de dados

## Como usar

Abra `index.html` em qualquer navegador. Todos os dados ficam salvos no `localStorage`.

### Fluxo típico
1. Vá ao **Playground** → Crie um app com nome, descrição, preço e código JS
2. Acesse a **Loja** → Compre apps com sua carteira de R$1.000,00 fictícios
3. Acesse o **Banco de Dados** → Crie usuários e simule login
4. Veja a **Comunidade** → Leaderboard e apps em destaque

## Deploy

Funciona em qualquer hosting estático:
- GitHub Pages: ative em Settings > Pages > branch `main`
- Netlify / Vercel: arraste a pasta ou conecte o repositório

> ⚠️ Todos os dados são 100% fictícios e armazenados apenas no navegador do usuário.
