#!/usr/bin/env node
/**
 * Firestore Backup Script
 * 
 * This script exports all Firestore collections to JSON files for backup.
 * Run regularly via cron job or manually before major changes.
 * 
 * Usage:
 *   node scripts/backup-firestore.mjs
 * 
 * Prerequisites:
 *   1. Install gcloud CLI: https://cloud.google.com/sdk/docs/install
 *   2. Authenticate: gcloud auth application-default login
 *   3. Set project: gcloud config set project scriptorium-bible-app
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Collections to backup
const COLLECTIONS = [
  'journals',
  'prayers', 
  'readingProgress',
  'sermons',
  'pulseAssessments',
  'userSettings',
  'groups',
  'discussions',
  'comments'
]

// Initialize Firebase Admin
// Option 1: Using service account (recommended for production)
// Download from Firebase Console > Project Settings > Service Accounts
// const serviceAccount = require('./serviceAccountKey.json')
// initializeApp({ credential: cert(serviceAccount) })

// Option 2: Using default credentials (for local development with gcloud auth)
initializeApp({
  projectId: 'scriptorium-bible-app'
})

const db = getFirestore()

async function backupCollection(collectionName) {
  console.log(`  Backing up ${collectionName}...`)
  
  const snapshot = await db.collection(collectionName).get()
  const docs = []
  
  snapshot.forEach(doc => {
    docs.push({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamps to ISO strings
      _exportedAt: new Date().toISOString()
    })
  })
  
  console.log(`    Found ${docs.length} documents`)
  return docs
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = join(__dirname, '..', 'backups', timestamp)
  
  // Create backup directory
  if (!existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true })
  }
  
  console.log(`\n🔄 Starting Firestore backup...`)
  console.log(`📁 Backup directory: ${backupDir}\n`)
  
  const backup = {
    timestamp: new Date().toISOString(),
    projectId: 'scriptorium-bible-app',
    collections: {}
  }
  
  for (const collection of COLLECTIONS) {
    try {
      const docs = await backupCollection(collection)
      backup.collections[collection] = docs
      
      // Also save individual collection file
      writeFileSync(
        join(backupDir, `${collection}.json`),
        JSON.stringify(docs, null, 2)
      )
    } catch (error) {
      console.error(`  ❌ Error backing up ${collection}:`, error.message)
      backup.collections[collection] = { error: error.message }
    }
  }
  
  // Save complete backup
  writeFileSync(
    join(backupDir, 'full-backup.json'),
    JSON.stringify(backup, null, 2)
  )
  
  // Save backup manifest
  const manifest = {
    timestamp: backup.timestamp,
    collections: Object.keys(backup.collections).map(name => ({
      name,
      count: Array.isArray(backup.collections[name]) 
        ? backup.collections[name].length 
        : 0
    }))
  }
  writeFileSync(
    join(backupDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )
  
  console.log(`\n✅ Backup complete!`)
  console.log(`📄 Files saved to: ${backupDir}`)
  
  // Summary
  console.log(`\n📊 Summary:`)
  manifest.collections.forEach(c => {
    console.log(`   ${c.name}: ${c.count} documents`)
  })
}

// Alternative: Use Firebase's built-in export (recommended for large datasets)
async function exportToGCS() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  RECOMMENDED: Use Firebase's Native Export for Large Datasets  ║
╚════════════════════════════════════════════════════════════════╝

For production backups, use gcloud CLI:

1. Create a Cloud Storage bucket:
   gsutil mb gs://scriptorium-bible-app-backups

2. Export Firestore to GCS:
   gcloud firestore export gs://scriptorium-bible-app-backups/$(date +%Y-%m-%d)

3. Schedule daily backups with Cloud Scheduler:
   gcloud scheduler jobs create http firestore-backup \\
     --schedule="0 2 * * *" \\
     --uri="https://firestore.googleapis.com/v1/projects/scriptorium-bible-app/databases/(default):exportDocuments" \\
     --http-method=POST \\
     --oauth-service-account-email=YOUR_SERVICE_ACCOUNT \\
     --message-body='{"outputUriPrefix":"gs://scriptorium-bible-app-backups"}'

Benefits of native export:
- Handles large datasets efficiently
- Supports point-in-time recovery
- Easy to restore with 'gcloud firestore import'
`)
}

// Run the backup
console.log('═'.repeat(60))
console.log('  Scriptorium Bible App - Firestore Backup')
console.log('═'.repeat(60))

const args = process.argv.slice(2)

if (args.includes('--help')) {
  console.log(`
Usage: node scripts/backup-firestore.mjs [options]

Options:
  --local     Run local JSON backup (default)
  --gcs-info  Show Google Cloud Storage export instructions
  --help      Show this help message
`)
} else if (args.includes('--gcs-info')) {
  exportToGCS()
} else {
  runBackup().catch(error => {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  })
}
