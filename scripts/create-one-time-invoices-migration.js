#!/usr/bin/env node

/**
 * PocketBase Migration Script for One-Time Invoices Collection
 * This script creates the one_time_invoices collection in PocketBase
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'pb_migrations');
const MIGRATION_TIMESTAMP = Date.now();
const MIGRATION_FILENAME = `${MIGRATION_TIMESTAMP}_one_time_invoices_collection.js`;
const MIGRATION_PATH = join(MIGRATIONS_DIR, MIGRATION_FILENAME);

// Migration file content using proper PocketBase JavaScript migration syntax
const MIGRATION_CONTENT = `/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "name": "one_time_invoices",
    "type": "base",
    "listRule": "@request.auth.role = 'admin'",
    "viewRule": "@request.auth.role = 'admin'", 
    "createRule": "@request.auth.role = 'admin'",
    "updateRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      {
        "name": "customer_id",
        "type": "relation",
        "required": true,
        "options": {
          "collectionId": "pbc_3142635823", // users collection
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["email", "name"]
        }
      },
      {
        "name": "plan_id", 
        "type": "relation",
        "required": true,
        "options": {
          "collectionId": "pbc_plans", // plans collection
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": ["name"]
        }
      },
      {
        "name": "stripe_invoice_id",
        "type": "text",
        "required": true,
        "options": {
          "min": 1,
          "max": 255,
          "pattern": ""
        }
      },
      {
        "name": "status",
        "type": "select",
        "required": true,
        "options": {
          "maxSelect": 1,
          "values": ["draft", "open", "paid", "void", "uncollectible"]
        }
      },
      {
        "name": "amount",
        "type": "number",
        "required": true,
        "options": {
          "min": 0,
          "max": null
        }
      },
      {
        "name": "due_date",
        "type": "date",
        "required": false,
        "options": {}
      },
      {
        "name": "invoice_pdf",
        "type": "url",
        "required": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      }
    ],
    "indexes": [
      "CREATE INDEX idx_one_time_invoices_customer ON one_time_invoices (customer_id)",
      "CREATE UNIQUE INDEX idx_one_time_invoices_stripe_id ON one_time_invoices (stripe_invoice_id)"
    ]
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("one_time_invoices");
  return app.delete(collection);
});`;

function createMigration() {
  try {
    // Ensure migrations directory exists
    if (!existsSync(MIGRATIONS_DIR)) {
      mkdirSync(MIGRATIONS_DIR, { recursive: true });
      console.log(`✅ Created migrations directory: ${MIGRATIONS_DIR}`);
    }

    // Write migration file
    writeFileSync(MIGRATION_PATH, MIGRATION_CONTENT);
    console.log(`✅ Created migration file: ${MIGRATION_FILENAME}`);
    console.log(`📁 Location: ${MIGRATION_PATH}`);
    
    console.log('\n📋 Next steps:');
    console.log('1. Upload this migration file to your PocketBase instance');
    console.log('2. Run the migration in PocketBase Admin UI');
    console.log('3. Or apply it via PocketBase CLI if you have access');
    
    return true;
  } catch (error) {
    console.error('❌ Error creating migration:', error);
    return false;
  }
}

// Run the migration creation
console.log('🚀 Creating PocketBase migration for one_time_invoices collection...\n');

if (createMigration()) {
  console.log('\n✅ Migration file created successfully!');
  process.exit(0);
} else {
  console.log('\n❌ Failed to create migration file');
  process.exit(1);
} 