# 🛡️ CWE-Cover 2.0 • CyberHuntLab
**Suite Profissional de Triagem, Reconhecimento Passivo, Mapeamento MITRE CWE & Pacote de Evidências**

- **Website:** https://cyberhuntlab.com.br/

---

## 🏛️ Arquitetura Modular da Suite

```text
CWE-Cover-2.0
│
├── Subfinder/OSINT
├── httpx/probing
├── Katana/crawling
├── Aquatone/screenshots + relatório visual
├── Nuclei/rules
├── CWE matcher
├── Evidence Collector
├── Validation Agent (PoC Explainer)
└── Report Engine
       ├── JSON
       ├── Markdown
       ├── HTML
       └── screenshots/
```

### ⚙️ Integração com Ferramentas Externas na VPS
As ferramentas externas permanecem instaladas separadamente no sistema operacional / VPS. O CWE-Cover 2.0 verifica dinamicamente via `shutil.which` (`command -v ferramenta`) e utiliza a ferramenta disponível automaticamente:
- Se instalada (ex: `aquatone`, `subfinder`, `httpx`, `katana`, `nuclei`): Executa e agrega evidências.
- Se não disponível: Registra `Tool: NOT AVAILABLE (ignorando etapa visual externa)` e prossegue sem interromper a execução.

---

## 📦 Pacote Completo de Evidências (`.zip`)

Ao finalizar cada execução, o **CWE-Cover 2.0** cria automaticamente uma estrutura de pastas organizada e compacta todos os artefatos gerados em um arquivo `.zip` único:

```text
reports/
└── nome-do-alvo/
    └── timestamp-da-execucao/
        ├── bugcrowd_triage.md
        ├── scan_agents.json
        ├── findings/
        │   ├── CWE-693/
        │   │   ├── evidence/
        │   │   │   └── raw_evidence.txt
        │   │   ├── screenshots/
        │   │   ├── poc/
        │   │   │   ├── reproduce.sh
        │   │   │   └── poc_details.txt
        │   │   └── finding.md
        │   └── CWE-200/
        │       ├── evidence/
        │       ├── screenshots/
        │       ├── poc/
        │       └── finding.md
        ├── screenshots/
        │   └── nome-do-alvo/
        ├── evidence/
        │   └── audited_urls.txt
        ├── logs/
        │   ├── execution.log
        │   └── tools_status.txt
        └── tools/
            └── aquatone/
```

### 🖥️ Saída Confirmada no Terminal
```text
[✓] Varredura finalizada
[✓] Relatório Markdown: /caminho/absoluto/reports/target/2026-08-30_16-00-00/bugcrowd_triage.md
[✓] Relatório dos agentes: /caminho/absoluto/reports/target/2026-08-30_16-00-00/scan_agents.json
[✓] Screenshots: /caminho/absoluto/reports/target/2026-08-30_16-00-00/screenshots/
[✓] Evidências: /caminho/absoluto/reports/target/2026-08-30_16-00-00/evidence/
[✓] POCs: /caminho/absoluto/reports/target/2026-08-30_16-00-00/findings/
[✓] Pacote completo criado

[✓] ZIP confirmado:
    /caminho/absoluto/reports/target/2026-08-30_16-00-00.zip
    Tamanho: 1.45 MB
```

---

## 🔍 Camada de Validação de Achados & PoC Explainer

O fluxo segue a esteira:  
**DETECÇÃO → ABRIR FINDING → COLETAR EVIDÊNCIA → VALIDAR A REGRA → GERAR POC/EVIDÊNCIA → AGENTES ANALISAM → CLASSIFICAR → RELATÓRIO FINAL**

Cada achado auditado inclui:
- **CWE & Classificação MITRE**
- **URL & Parâmetro Afetado**
- **Motivo da Detecção**
- **Evidência Observada**
- **PoC de Execução Segura (cURL / script de reprodução)**
- **Análise Técnica dos Agentes**
  - *O que foi comprovado empiricamente*
  - *O que NÃO foi comprovado (sem suposições ou exploração invasiva)*
  - *Avaliação de Falso Positivo e Contenção de Escopo*
- **Impacto Real & Guia de Remediação**

---

## ⚡ Exemplos de Execução (CLI)

```bash
# 1. Varredura completa com empacotamento automático de evidências
python cwe_discover.py -u https://alvo-autorizado.example --i-have-authorization

# 2. Varredura com contexto de plataforma Bug Bounty
python cwe_discover.py -u https://alvo-autorizado.example --i-have-authorization --platform bugcrowd

# 3. Varredura com arquivo de escopo JSON
python cwe_discover.py -u https://alvo-autorizado.example --i-have-authorization --scope-file examples/scope_example.json
```

---

## 🛡️ Licença & Autoria

Desenvolvido por **Carol Lamas** (CyberHuntLab).  
- **Website:** https://cyberhuntlab.com.br/  
- **Licença:** MIT License (https://opensource.org/licenses/MIT)
