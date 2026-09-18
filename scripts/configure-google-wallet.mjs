#!/usr/bin/env node
// Read credentials from a local file and pass them to Wrangler through stdin.
// Never place key contents in command arguments, logs or repository files.
import { readFile } from 'node:fs/promises'
import { createPrivateKey, sign } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const keyFile = args.find(arg => !arg.startsWith('--') && args[args.indexOf(arg) - 1] !== '--issuer')
const issuer = args[args.indexOf('--issuer') + 1]
const configure = args.includes('--configure')
if (!keyFile || !args.includes('--issuer') || !/^\d+$/.test(issuer)) {
  console.error('Usage: node scripts/configure-google-wallet.mjs /path/service-account.json --issuer ISSUER_ID [--configure]')
  process.exit(1)
}

async function checkCredentials(credentials) {
  const now = Math.floor(Date.now() / 1000)
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url')
  const payload = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/wallet_object.issuer',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  })}`
  const assertion = `${payload}.${sign('RSA-SHA256', Buffer.from(payload), createPrivateKey(credentials.private_key)).toString('base64url')}`
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    signal: AbortSignal.timeout(15000),
  })
  const token = await tokenResponse.json()
  if (!tokenResponse.ok || !token.access_token) throw Error(`Google authentication failed (${tokenResponse.status}).`)
  const response = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1/eventticketclass?issuerId=${issuer}&maxResults=1`, {
    headers: { Authorization: `Bearer ${token.access_token}` }, signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw Error(`Wallet issuer access failed (${response.status}). Check API activation and issuer permissions.`)
}

function wrangler(command, input) {
  const result = spawnSync('./node_modules/.bin/wrangler', command, {
    input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 120000,
  })
  if (result.status !== 0) throw Error(`Wrangler ${command.slice(0, 3).join(' ')} failed. Check Wrangler sign-in and project access.`)
}

try {
  const credentials = JSON.parse(await readFile(keyFile, 'utf8'))
  if (credentials.type !== 'service_account' || !credentials.client_email?.endsWith('.iam.gserviceaccount.com') ||
    !credentials.private_key?.includes('BEGIN PRIVATE KEY')) throw Error('A Google service-account JSON file is required.')
  await checkCredentials(credentials)
  console.log('Google authentication and access to the specified Wallet issuer verified.')
  if (configure) {
    const secrets = JSON.stringify({
      GOOGLE_WALLET_ENABLED: 'false', GOOGLE_WALLET_ISSUER_ID: issuer,
      GOOGLE_WALLET_CLIENT_EMAIL: credentials.client_email, GOOGLE_WALLET_PRIVATE_KEY: credentials.private_key,
    })
    wrangler(['deploy', '--config', 'wrangler.wallet.toml'])
    wrangler(['secret', 'bulk', '--config', 'wrangler.wallet.toml'], secrets)
    wrangler(['pages', 'secret', 'bulk', '--project-name', 'next-theater'], secrets)
    console.log('Wallet credentials configured on Pages and the retry worker. Wallet remains disabled pending publishing access and the Android acceptance test. Redeploy Pages after configuration.')
  } else console.log('Check only: no Cloudflare configuration changed. Add --configure to install the existing credentials.')
} catch (error) {
  // Do not dump provider responses or credential objects.
  console.error(error instanceof SyntaxError ? 'The credential file is not valid JSON.' : error.message)
  process.exitCode = 1
}
