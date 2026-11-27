#!/bin/sh
set -eu

CDPATH='' cd -- "$(dirname -- "$0")"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    printf '%s\n' 'Node.js and npm are required. Install them, then rerun this script.' >&2
    exit 1
fi

npm ci --include=dev

printf '\n%s\n' 'Dependencies installed. Run these commands from the project directory.' \
    '  npm run dev    Start the development server at http://localhost:5173' \
    '  npm run build  Create a production build in dist/'
