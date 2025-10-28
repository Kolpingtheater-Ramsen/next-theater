# Wallet Pass Setup Guide

This guide explains how to configure Apple Wallet and Google Wallet passes for the ticket system.

## Overview

The system supports generating digital wallet passes for both iOS (Apple Wallet) and Android (Google Wallet). Users can add their tickets directly to their phone's wallet app for easy access.

## Apple Wallet Setup

### Prerequisites

1. **Apple Developer Account** - You need an active Apple Developer account ($99/year)
2. **Pass Type ID** - Create a Pass Type ID in your Apple Developer account
3. **Certificates** - Generate required certificates

### Step-by-Step Setup

#### 1. Create Pass Type ID

1. Go to [Apple Developer Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list/passTypeId)
2. Click the "+" button to create a new Pass Type ID
3. Enter a description (e.g., "Winterstück Event Tickets")
4. Enter an identifier (e.g., `pass.de.kolping-jugend.event-tickets`)
5. Click "Continue" and then "Register"

#### 2. Generate Certificate

1. In the Pass Type ID list, click on your newly created Pass Type ID
2. Click "Create Certificate"
3. Follow the instructions to create a Certificate Signing Request (CSR):
   - Open "Keychain Access" on your Mac
   - Go to Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority
   - Enter your email and name
   - Select "Saved to disk"
   - Save the CSR file
4. Upload the CSR file
5. Download the generated certificate (`.cer` file)
6. Double-click to install it in Keychain Access

#### 3. Export Certificates

1. Open Keychain Access
2. Find your Pass Type ID certificate
3. Right-click and select "Export"
4. Save as `.p12` file with a password
5. Convert to PEM format using OpenSSL:

```bash
# Extract certificate
openssl pkcs12 -in cert.p12 -clcerts -nokeys -out signerCert.pem

# Extract private key
openssl pkcs12 -in cert.p12 -nocerts -out signerKey.pem
```

#### 4. Download WWDR Certificate

1. Download the Apple Worldwide Developer Relations certificate from:
   https://www.apple.com/certificateauthority/
2. Download the "Worldwide Developer Relations - G4" certificate
3. Convert to PEM:

```bash
openssl x509 -inform DER -in AppleWWDRCAG4.cer -out wwdr.pem
```

#### 5. Create Directory Structure

Create the following directory structure in your project:

```
/workspace/certificates/
  └── apple-wallet/
      ├── signerCert.pem
      ├── signerKey.pem
      ├── wwdr.pem
      └── pass-model/
          ├── pass.json
          ├── icon.png
          ├── icon@2x.png
          ├── logo.png
          ├── logo@2x.png
          └── (optional: background.png, thumbnail.png)
```

#### 6. Create pass.json Template

Create `/certificates/apple-wallet/pass-model/pass.json`:

```json
{
  "formatVersion": 1,
  "passTypeIdentifier": "pass.de.kolping-jugend.event-tickets",
  "teamIdentifier": "YOUR_TEAM_ID",
  "organizationName": "Kolping Jugend Ramsen",
  "description": "Winterstück 2025 Event Ticket",
  "backgroundColor": "rgb(255, 106, 0)",
  "foregroundColor": "rgb(255, 255, 255)",
  "labelColor": "rgb(255, 255, 255)"
}
```

Replace `YOUR_TEAM_ID` with your Apple Developer Team ID (found in your Apple Developer account).

#### 7. Add Images

Add the following images to `/certificates/apple-wallet/pass-model/`:

- `icon.png` - 29x29 pixels
- `icon@2x.png` - 58x58 pixels  
- `icon@3x.png` - 87x87 pixels (optional)
- `logo.png` - 160x50 pixels
- `logo@2x.png` - 320x100 pixels
- `logo@3x.png` - 480x150 pixels (optional)

## Google Wallet Setup

### Prerequisites

1. **Google Cloud Project** - Free to create
2. **Google Wallet API** - Enable in your project
3. **Service Account** - Create credentials

### Step-by-Step Setup

#### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

#### 2. Enable Google Wallet API

1. In your Google Cloud Project, go to "APIs & Services" > "Library"
2. Search for "Google Wallet API"
3. Click "Enable"

#### 3. Create Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter a name (e.g., "wallet-pass-generator")
4. Click "Create and Continue"
5. Grant the role "Service Account Token Creator"
6. Click "Done"

#### 4. Generate Service Account Key

1. Click on the newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Click "Create"
6. Save the downloaded JSON file securely

#### 5. Get Issuer ID

1. Go to [Google Pay & Wallet Console](https://pay.google.com/business/console/)
2. Sign in with the same Google account
3. Navigate to "Google Wallet API"
4. Note your Issuer ID (format: `3388000000XXXXXXXX`)

#### 6. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Google Wallet Configuration
GOOGLE_WALLET_ISSUER_ID=3388000000XXXXXXXX
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=wallet-pass-generator@your-project.iam.gserviceaccount.com
GOOGLE_WALLET_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

To get the private key from your JSON file:
1. Open the downloaded service account JSON file
2. Copy the value of the `private_key` field (including the quotes)
3. Paste it as the value for `GOOGLE_WALLET_SERVICE_ACCOUNT_KEY`

## Environment Variables Summary

### Required for Apple Wallet
- File-based certificates in `/certificates/apple-wallet/`

### Required for Google Wallet
```env
GOOGLE_WALLET_ISSUER_ID=your_issuer_id
GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_WALLET_SERVICE_ACCOUNT_KEY="your_private_key"
```

### Optional
```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Testing

### Test Apple Wallet

1. Build and run your application
2. Create a test booking
3. On the ticket page, click "Zu Apple Wallet hinzufügen"
4. The `.pkpass` file should download
5. Open the file on an iOS device or Mac with Wallet
6. The pass should appear in Apple Wallet

### Test Google Wallet

1. Build and run your application
2. Create a test booking
3. On an Android device, click "Zu Google Wallet hinzufügen"
4. You should be redirected to Google Wallet
5. Click "Save" to add the pass to your wallet

## Troubleshooting

### Apple Wallet Issues

**Error: "Certificate not found"**
- Ensure certificates are in the correct location: `/workspace/certificates/apple-wallet/`
- Verify PEM format is correct
- Check file permissions

**Error: "Pass validation failed"**
- Verify `pass.json` is valid JSON
- Check that all required images exist
- Ensure Team ID is correct

**Pass doesn't download**
- Check that the API route is accessible
- Verify certificate configuration
- Check browser console for errors

### Google Wallet Issues

**Error: "Google Wallet not configured"**
- Ensure environment variables are set correctly
- Verify service account key is valid JSON
- Check that private key includes newlines (`\n`)

**Error: "Invalid JWT"**
- Verify service account email is correct
- Check that private key matches the service account
- Ensure issuer ID is correct

**Pass doesn't save**
- Check Google Wallet API is enabled
- Verify issuer ID is correct
- Ensure service account has proper permissions

## Security Notes

1. **Never commit certificates or private keys to version control**
2. Add `/certificates/` to your `.gitignore`
3. Store sensitive credentials in environment variables
4. Use different credentials for development and production
5. Rotate keys regularly
6. Limit service account permissions to minimum required

## Support

For additional help:
- Apple Wallet: https://developer.apple.com/wallet/
- Google Wallet: https://developers.google.com/wallet
