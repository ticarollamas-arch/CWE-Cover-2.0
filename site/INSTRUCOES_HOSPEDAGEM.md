# 🌐 Instruções para o Suporte da Hospedagem (Deploy do Site CWE-Cover 2.0)

**Domínio:** `https://cwe-discover.cyberhuntlab.com.br/`  
**Organização:** CyberHuntLab (Carol Lamas)  
**Projeto:** CWE-Cover 2.0 (`cwe-discover`)

---

## ⚡ Como Publicar o Site Atualizado (Passo a Passo)

Este projeto frontend é construído com **React 19 + TypeScript + Vite + Tailwind CSS**.

### 📁 Opção 1: Upload Direto do Arquivo ZIP Pronto (Mais Rápido & Sem Erros)

Basta pegar o arquivo ZIP gerado:
👉 **`cwe-discover-site-public_html.zip`** (ou **`site/public_html.zip`**)

No cPanel, Hostinger ou painel da hospedagem:
1. Abra o **Gerenciador de Arquivos** (File Manager) na pasta do subdomínio `cwe-discover.cyberhuntlab.com.br` (ex: `public_html/` ou `domains/cyberhuntlab.com.br/public_html/cwe-discover/`).
2. **Apague os arquivos antigos** da pasta para evitar cache de versão antiga.
3. Faça o **Upload** do arquivo `cwe-discover-site-public_html.zip`.
4. Clique com o botão direito e escolha **Extrair / Unzip**.

Estrutura extraída no servidor:
```text
public_html/
├── index.html
└── assets/
    ├── index-CzIeLk0j.js
    └── index-BSGqVEi9.css
```

---

### ⚙️ Opção 2: Compilação via Node.js / Vite no Servidor ou VPS

Se a sua hospedagem compila o projeto via Node.js (Vercel, Netlify, VPS Linux, Docker):

```bash
# 1. Entrar na pasta do site
cd site

# 2. Instalar dependências
npm install

# 3. Gerar a build de produção
npm run build

# O resultado será gerado na pasta dist/ pronto para servir.
```

---

## 🛡️ O que está incluído nesta versão atualizada:
1. **Árvore Arquitetural Completa:** Subfinder/OSINT, httpx/probing, Katana/crawling, Aquatone/screenshots, Nuclei/rules, CWE matcher, Evidence Collector, Validation Agent, Report Engine.
2. **Catálogo de Capacidades do Arsenal:** 9 motores nativos sem dependência de binários externos Go.
3. **Estúdio de Motores Autônomos:** Teste e visualização de parâmetros para `--subdomains`, `--probe`, `--rules`, `--crawl-native`, `--standalone-all`.
4. **Montador Oficial de Comandos CLI:** Presets para Bugcrowd, HackerOne, Intigriti, Termux e Multi-Agents com evidências.
5. **Gerador de Relatórios & Simulador de Scans:** Triagem VRT, passos de reprodução, cálculo CVSS v3.1 e pacotes de evidência.
6. **Deck de Apresentação Executiva & Manual Completo:** Mais de 50 tópicos de documentação, matriz MITRE CWE e calculadora de risco interativa.
