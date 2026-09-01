#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gdrive_integration • Upload de relatórios do cwe-discover para o Google Drive
Autor: Carol Lamas (CyberHuntLab)

Módulo isolado e opcional: só é importado se o usuário passar
--gdrive-folder-id no CLI. Dependências (google-api-python-client,
google-auth) não são obrigatórias pro resto da ferramenta funcionar.

Modo de autenticação: Service Account (recomendado para automação/CI,
sem interação humana). Suporte a OAuth de usuário fica como extensão
opcional (ver `_build_service_oauth`) pra quem preferir autenticar
com a própria conta Google em vez de uma service account.
"""

import os
import mimetypes
from typing import Optional

try:
    from google.oauth2 import service_account
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    from googleapiclient.errors import HttpError
    _GDRIVE_LIBS_OK = True
except ImportError:
    _GDRIVE_LIBS_OK = False

SCOPES = ["https://www.googleapis.com/auth/drive.file"]
FOLDER_MIME = "application/vnd.google-apps.folder"


class GDriveError(Exception):
    """Erro específico da integração com o Google Drive."""
    pass


def _require_libs():
    if not _GDRIVE_LIBS_OK:
        raise GDriveError(
            "Dependências do Google Drive ausentes. Instale com:\n"
            "  pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib"
        )


def _build_service_account(credentials_path: str):
    """Autentica via Service Account (JSON de credenciais). Recomendado
    para uso automatizado/CLI/CI, sem prompt interativo."""
    if not os.path.isfile(credentials_path):
        raise GDriveError(f"Arquivo de credenciais não encontrado: {credentials_path}")
    creds = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )
    return build("drive", "v3", credentials=creds, cache_discovery=False)


def _build_service_oauth(credentials_path: str, token_path: str = "gdrive_token.json"):
    """Autentica via OAuth de usuário (fluxo interativo no navegador na
    primeira execução, depois reusa o token salvo). Útil se o usuário
    preferir usar a própria conta Google em vez de uma service account."""
    creds = None
    if os.path.isfile(token_path):
        from google.oauth2.credentials import Credentials
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.isfile(credentials_path):
                raise GDriveError(f"Arquivo de client secret OAuth não encontrado: {credentials_path}")
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, "w", encoding="utf-8") as f:
            f.write(creds.to_json())

    return build("drive", "v3", credentials=creds, cache_discovery=False)


def get_drive_service(credentials_path: str, auth_mode: str = "service_account"):
    """Ponto único de autenticação. auth_mode: 'service_account' (default) ou 'oauth'."""
    _require_libs()
    if auth_mode == "oauth":
        return _build_service_oauth(credentials_path)
    return _build_service_account(credentials_path)


def verify_folder(service, folder_id: str) -> dict:
    """
    Confirma que o folder_id existe, é de fato uma pasta e está
    acessível com a credencial atual — evita que um upload vá parar
    num destino errado (ex: ID de arquivo, pasta de outro
    cliente/alvo, ou pasta sem permissão de escrita).
    """
    try:
        meta = service.files().get(
            fileId=folder_id,
            fields="id, name, mimeType, capabilities(canAddChildren)"
        ).execute()
    except HttpError as exc:
        raise GDriveError(
            f"Não foi possível acessar a pasta '{folder_id}': {exc}. "
            "Verifique o ID e se a credencial tem acesso (compartilhe a pasta "
            "com o e-mail da service account, ou reautentique via OAuth)."
        ) from exc

    if meta.get("mimeType") != FOLDER_MIME:
        raise GDriveError(f"O ID '{folder_id}' não corresponde a uma pasta do Drive.")

    if meta.get("capabilities", {}).get("canAddChildren") is False:
        raise GDriveError(
            f"Sem permissão de editor na pasta '{meta.get('name')}' ({folder_id}) — "
            "upload bloqueado para evitar falha silenciosa."
        )

    return meta


def upload_report(
    file_path: str,
    folder_id: str,
    credentials_path: str,
    auth_mode: str = "service_account",
    verbose: bool = False,
) -> Optional[str]:
    """
    Faz upload de um único relatório (md/html/csv/json) para a pasta
    isolada do alvo/cliente no Drive. Cada chamada valida a pasta de
    destino antes de subir o arquivo, então não há risco de um
    relatório de um alvo cair na pasta de outro por engano de config.

    Retorna o ID do arquivo criado no Drive, ou None em caso de falha
    não-fatal (loga o erro mas não derruba o restante do script).
    """
    _require_libs()

    if not os.path.isfile(file_path):
        raise GDriveError(f"Arquivo de relatório não encontrado: {file_path}")

    service = get_drive_service(credentials_path, auth_mode=auth_mode)
    folder_meta = verify_folder(service, folder_id)

    mime_type, _ = mimetypes.guess_type(file_path)
    mime_type = mime_type or "application/octet-stream"

    file_metadata = {
        "name": os.path.basename(file_path),
        "parents": [folder_id],
    }
    media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)

    try:
        uploaded = service.files().create(
            body=file_metadata,
            media_body=media,
            fields="id, webViewLink"
        ).execute()
    except HttpError as exc:
        raise GDriveError(f"Falha no upload para a pasta '{folder_meta.get('name')}': {exc}") from exc

    if verbose:
        print(f"[✓] Enviado para Drive » pasta: {folder_meta.get('name')} "
              f"| link: {uploaded.get('webViewLink')}")

    return uploaded.get("id")
