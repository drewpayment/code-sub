#!/usr/bin/env node

/**
 * PocketBase Migration Setup Script
 * This script creates a proper PocketBase migration file for the contact_submissions collection
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'pb_migrations');
const MIGRATION_TIMESTAMP = Date.now();
const MIGRATION_FILENAME = `${MIGRATION_TIMESTAMP}_contact_submissions_collection.js`;
const MIGRATION_PATH = join(MIGRATIONS_DIR, MIGRATION_FILENAME);

// Migration file content using proper PocketBase JavaScript migration syntax
const MIGRATION_CONTENT = `/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "name": "contact_submissions",
    "type": "base",
    "fields": [
      {
        "name": "name",
        "type": "text",
        "required": true,
        "options": {
          "min": 1,
          "max": 100
        }
      },
      {
        "name": "email", 
        "type": "email",
        "required": true
      },
      {
        "name": "phone",
        "type": "text", 
        "required": true,
        "options": {
          "min": 1,
          "max": 20
        }
      },
      {
        "name": "description",
        "type": "text",
        "required": false,
        "options": {
          "max": 1000
        }
      },
      {
        "name": "source",
        "type": "text",
        "required": false,
        "options": {
          "max": 50
        }
      },
      {
        "name": "selected_plan", 
        "type": "text",
        "required": false,
        "options": {
          "max": 50
        }
      }
    ],
    "listRule": "@request.auth.id != ''",
    "viewRule": "@request.auth.id != ''", 
    "createRule": "",
    "updateRule": "@request.auth.id != ''",
    "deleteRule": "@request.auth.id != ''"
  });

  return app.save(collection);
}, (app) => {
  // Rollback - delete the collection
  const collection = app.findCollectionByNameOrId("contact_submissions");
  return app.delete(collection);
});`;

function createMigration() {
    try {
        // Ensure migrations directory exists
        if (!existsSync(MIGRATIONS_DIR)) {
            console.log('📁 Creating pb_migrations directory...');
            mkdirSync(MIGRATIONS_DIR, { recursive: true });
        }

        // Check if contact_submissions migration already exists
        const existingFiles = [];
        try {
            const files = readdirSync(MIGRATIONS_DIR);
            const contactSubmissionsMigrations = files.filter(file => 
                file.includes('contact_submissions') && file.endsWith('.js')
            );
            existingFiles.push(...contactSubmissionsMigrations);
        } catch {
            // Directory doesn't exist or is empty
        }

        if (existingFiles.length > 0) {
            console.log('ℹ️  Contact submissions migration already exists:');
            existingFiles.forEach(file => console.log(`   - ${file}`));
            console.log('\n🎯 Your contact form should already work if PocketBase is running.');
            console.log('💡 If you need to recreate it, delete the existing migration file(s) first.');
            return;
        }

        // Write the migration file
        console.log('📝 Creating contact_submissions migration file...');
        writeFileSync(MIGRATION_PATH, MIGRATION_CONTENT, 'utf8');

        console.log('✅ Migration file created successfully!');
        console.log(`📄 File: ${MIGRATION_FILENAME}`);
        console.log(`📍 Path: ${MIGRATION_PATH}`);
        
        console.log('\n🚀 Next steps:');
        console.log('1. Start/restart your PocketBase server');
        console.log('2. The migration will run automatically on server start');
        console.log('3. Your contact form will then work properly');
        
        console.log('\n💡 PocketBase commands:');
        console.log('   Start server: ./pocketbase serve');
        console.log('   Check migrations: ./pocketbase migrate');
        
        console.log('\n🔍 What this migration creates:');
        console.log('   - contact_submissions collection');
        console.log('   - Fields: name, email, phone, description, source, selected_plan');
        console.log('   - Permissions: Anyone can create, only authenticated users can list/view/update/delete');

    } catch (error) {
        console.error('❌ Error creating migration:', error.message);
        process.exit(1);
    }
}

// Run the setup
console.log('🛠️  PocketBase Migration Setup for Contact Submissions Collection');
console.log('=' .repeat(70));
createMigration(); 