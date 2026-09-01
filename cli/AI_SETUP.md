# 🧠 Configuração de Inteligência Artificial • CWE-Cover 2.0
> **CyberHuntLab • Autor:** Carol Lamas ([cyberhuntlab.com.br](https://cyberhuntlab.com.br))  
> *Orquestração Multi-Agente CrewAI • Modelos Locais Ollama (Llama 3 / Mistral) • Pipeline Evidence-First*

---

## 🎯 Filosofia Evidence-First na Camada de IA

No **CWE-Cover 2.0**, a Inteligência Artificial opera sob uma regra inquebrável:

> 🛡️ **A IA NUNCA é a fonte primária de evidência.**  
> O motor do scanner (`cwe_discover.py` e pipeline `agents/`) realiza a coleta determinística e validação empírica. A IA (Ollama ou CrewAI) atua exclusivamente na sumarização, enriquecimento de narrativa técnica e formatação de rascunhos para submissão em programas de Bug Bounty.

### O que a IA está proibida de fazer:
- ❌ Inventar endpoints, URLs ou rotas não visitadas;
- ❌ Gerar falsas provas de conceito (PoCs) ou payloads fictícios;
- ❌ Alterar cabeçalhos observados ou forjar respostas HTTP;
- ❌ Promover hipóteses não comprovadas para vulnerabilidades confirmadas.

---

## 🦙 1. Inteligência Artificial Local com Ollama (Opcional & 100% Privado)

O suporte ao **Ollama** permite enriquecer relatórios localmente no seu computador ou servidor sem enviar dados para a nuvem.

### 1.1 Verificação do Serviço Ollama
Certifique-se de que o Ollama está em execução:
```bash
# Verificar se o serviço está ativo
curl -s http://localhost:11434/api/tags

# Listar modelos locais instalados
ollama list
```

### 1.2 Modelos Recomendados
```bash
# Baixar o modelo Llama 3 (Padrão)
ollama pull llama3

# Ou baixar o modelo Mistral
ollama pull mistral
```

### 1.3 Testar Geração via Endpoint Local
```bash
curl -s http://localhost:11434/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"model":"llama3","prompt":"Responda somente: OLLAMA_OK","stream":false}'
```

### 1.4 Utilizando a flag `--ai-narrative` no Scanner
```bash
python cwe_discover.py -u https://alvo-autorizado.example \
  --i-have-authorization \
  --ai-narrative \
  --format markdown \
  -o relatorio_com_ia.md
```

---

## 🤖 2. Orquestração Multi-Agente com CrewAI (Opcional)

O **CrewAI** pode ser utilizado para orquestrar agentes especializados que consom a saída estruturada do `cwe_discover.py`.

```
                    CWE-DISCOVER
                         │
                         ▼
                Evidências Objetivas
                         │
                         ▼
                 AGENT PIPELINE
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
       Validação                  False Positive
          │                             │
          └──────────────┬──────────────┘
                         ▼
                      Impact
                         │
                         ▼
                      Report
                         │
                         ▼
                    CrewAI
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Recon Analyst         Report Writer
```

### 2.1 Instalação das Dependências do CrewAI
```bash
pip install crewai crewai-tools langchain-google-genai pydantic
```

### 2.2 Configuração da Chave de API (Gemini)
Se for utilizar o provider Gemini no CrewAI, exporte a variável de ambiente:
```bash
export GEMINI_API_KEY="SUA_CHAVE_AQUI"
```

### 2.3 Executando o Pipeline Completo com Agentes
```bash
python cwe_discover.py \
  -u https://alvo-autorizado.example \
  --i-have-authorization \
  --platform hackerone \
  --scope-file examples/scope_example.json \
  --agents \
  --format json \
  -o scan.json
```

Arquivos produzidos:
- `scan.json`: Resultados determinísticos completos da varredura;
- `scan_agents.json`: Resultados auditados, classificados e validados pelos agentes (`Validation`, `FalsePositive`, `Impact`).
