# Configurando o Upload Automático para o Google Drive

O `cwe-discover` pode enviar cada relatório gerado (Markdown, HTML, CSV)
direto para uma pasta específica no Google Drive — útil pra manter os
achados de cada cliente/alvo isolados em pastas separadas.

Método recomendado: **Service Account** (conta de robô do Google Cloud,
sem login interativo — ideal pra automação/cron). Existe também suporte a
OAuth de usuário (`--gdrive-auth-mode oauth`), que abre o navegador na
primeira execução.

## Passo 1 — Criar o projeto e ativar a API

1. Acesse https://console.cloud.google.com
2. Crie um projeto (ou use um existente)
3. Vá em **APIs e Serviços → Biblioteca** e ative a **Google Drive API**

## Passo 2 — Criar a Service Account

1. **APIs e Serviços → Credenciais → Criar Credenciais → Conta de Serviço**
2. Dê um nome, ex: `cwe-discover-bot`
3. Conclua sem atribuir papéis de projeto (não são necessários — o
   acesso é dado diretamente na pasta do Drive, não no projeto)

## Passo 3 — Gerar a chave JSON

1. Abra a Service Account criada → aba **Chaves**
2. **Adicionar Chave → Criar nova chave → JSON**
3. Renomeie o arquivo baixado para `credentials.json`
4. **Nunca versione esse arquivo no Git** — adicione ao `.gitignore`:
   ```
   echo "credentials.json" >> .gitignore
   echo "gdrive_token.json" >> .gitignore
   ```

## Passo 4 — Compartilhar a pasta do Drive com a Service Account

A Service Account tem um e-mail próprio, no formato:
```
nome@projeto.iam.gserviceaccount.com
```
(visível na tela da conta de serviço que você criou).

Abra a pasta de destino no Google Drive → **Compartilhar** → adicione esse
e-mail com permissão de **Editor**.

## Passo 5 — Pegar o ID da pasta

Com a pasta aberta no navegador, o ID é o trecho final da URL:
```
https://drive.google.com/drive/folders/SEU_ID_AQUI
```

## Passo 6 — Instalar dependências e rodar

```bash
pip install -r requirements-gdrive.txt

python cwe_discover.py \
  -u https://alvo-autorizado.com \
  --i-have-authorization \
  --format markdown \
  -o cwe_report.md \
  --gdrive-folder-id SEU_ID_AQUI \
  --gdrive-credentials credentials.json
```

### Alternativa: autenticação OAuth (conta pessoal em vez de service account)

```bash
python cwe_discover.py \
  -u https://alvo-autorizado.com \
  --i-have-authorization \
  -o cwe_report.md \
  --gdrive-folder-id SEU_ID_AQUI \
  --gdrive-credentials oauth_client_secret.json \
  --gdrive-auth-mode oauth
```
Na primeira execução abre o navegador pra login; depois reusa o token
salvo em `gdrive_token.json`.

## Parâmetros

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `--gdrive-folder-id` | Sim (ativa o upload) | ID da pasta de destino no Drive |
| `--gdrive-credentials` | Não (default `credentials.json`) | Caminho do JSON de credenciais |
| `--gdrive-auth-mode` | Não (default `service_account`) | `service_account` ou `oauth` |

## Isolamento por cliente/alvo

Crie uma pasta por cliente no Drive, compartilhe cada uma com a mesma
Service Account, e passe o `--gdrive-folder-id` correspondente em cada
execução. A ferramenta valida, antes do upload, que o ID informado é
realmente uma pasta acessível com permissão de editor — se a checagem
falhar, o upload é abortado (nunca envia pra pasta errada nem falha em
silêncio).

> ⚠️ Nunca compartilhe a pasta de um cliente com a Service Account de
> outro projeto/ambiente — mantenha uma pasta isolada por alvo pra evitar
> vazamento cruzado de relatórios.

Se o upload falhar (pasta errada, sem permissão, rede fora), o script
avisa no terminal mas **não** apaga nem impede a geração do relatório
local — o relatório já está salvo antes de o upload ser tentado.
