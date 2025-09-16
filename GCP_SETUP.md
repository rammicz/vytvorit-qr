# Google Cloud Platform Setup

Tento dokument popisuje nastavení automatického nasazení do Google Cloud Platform.

## 1. Vytvoření Google Cloud projektu

1. Jděte na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvořte nový projekt nebo vyberte existující
3. Poznamenejte si **Project ID**

## 2. Povolení potřebných API

```bash
# Povolení Cloud Run API
gcloud services enable run.googleapis.com

# Povolení Container Registry API
gcloud services enable containerregistry.googleapis.com

# Povolení Cloud Build API
gcloud services enable cloudbuild.googleapis.com
```

## 3. Vytvoření Service Account

```bash
# Vytvoření service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions" \
    --description="Service account for GitHub Actions deployment"

# Přiřazení rolí
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

# Vytvoření klíče
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## 4. Nastavení GitHub Secrets

V GitHub repozitáři jděte na **Settings > Secrets and variables > Actions** a přidejte:

- `GCP_PROJECT_ID`: Váš Google Cloud Project ID
- `GCP_SA_KEY`: Obsah souboru `key.json` (celý JSON)

## 5. Nastavení custom domény

### 5.1 V Google Cloud Console

1. Jděte na **Cloud Run > vytvorit-qr > Manage Custom Domains**
2. Klikněte **Add Mapping**
3. Zadejte doménu: `qr.aox.cz`
4. Vyberte region: `europe-west1`
5. Klikněte **Continue**

### 5.2 DNS nastavení

V DNS záznamech vaší domény `aox.cz` přidejte:

```
Type: CNAME
Name: qr
Value: ghs.googlehosted.com
TTL: 300
```

## 6. Testování nasazení

Po nastavení všech kroků:

1. Pushněte změny do `main` větve
2. GitHub Actions automaticky nasadí aplikaci
3. Aplikace bude dostupná na `https://qr.aox.cz`

## 7. Monitoring a logy

- **Cloud Run**: https://console.cloud.google.com/run
- **Cloud Build**: https://console.cloud.google.com/cloud-build
- **GitHub Actions**: https://github.com/rammicz/vytvorit-qr/actions

## Náklady

Odhadované měsíční náklady pro malou aplikaci:
- **Cloud Run**: ~$5-10 (1 instance, 512MB RAM)
- **Container Registry**: ~$1-2 (storage)
- **Cloud Build**: ~$2-5 (build minutes)
- **Custom domain**: Zdarma

**Celkem: ~$8-17/měsíc**
