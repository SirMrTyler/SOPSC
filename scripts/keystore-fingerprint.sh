#!/usr/bin/env bash
set -euo pipefail

# Print the SHA-1 fingerprint of the Android release keystore

CRED_FILE="Frontend/sopsc-mobile-app/credentials.json"
KEYSTORE_DIR="Frontend/sopsc-mobile-app"

if [ ! -f "$CRED_FILE" ]; then
  echo "Credentials file not found: $CRED_FILE" >&2
  exit 1
fi

KEYSTORE_PATH="$KEYSTORE_DIR/$(jq -r '.android.keystore.keystorePath' "$CRED_FILE")"
PASSWORD="$(jq -r '.android.keystore.keystorePassword' "$CRED_FILE")"

if [ ! -f "$KEYSTORE_PATH" ]; then
  echo "Keystore not found: $KEYSTORE_PATH" >&2
  exit 1
fi

keytool -list -v -keystore "$KEYSTORE_PATH" -storepass "$PASSWORD" 2>/dev/null | grep 'SHA1:'
