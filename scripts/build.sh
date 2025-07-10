#!/usr/bin/env bash
set -euo pipefail

# build.sh [dev|prod]
# Runs Expo prebuild and loads the env from eas.json
# Then either installs the dev client locally or triggers an EAS build

usage() {
  echo "Usage: $0 {dev|prod}" >&2
  exit 1
}

if [ $# -ne 1 ]; then
  usage
fi

case "$1" in
  dev)
    EAS_BUILD_PROFILE=development npx expo prebuild
    EAS_BUILD_PROFILE=development npx expo run:android
    ;;
  prod)
    EAS_BUILD_PROFILE=production npx expo prebuild
    EAS_BUILD_PROFILE=production eas build --platform android --profile production
    ;;
  *)
    usage
    ;;
esac
