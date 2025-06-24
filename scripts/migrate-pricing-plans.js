#!/usr/bin/env node

/**
 * Migration script to add existing pricing plans to PocketBase
 * Run with: node scripts/migrate-pricing-plans.js
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

// Authenticate as admin
const ADMIN_EMAIL = process.env.PB_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.PB_PASSWORD || 'admin123456';

const pricingPlans = [
  {
    name: 'Essential Care',
    description: 'Reliable hosting and core maintenance for a secure online presence.',
    price: 49.00,
    billing_period: 'monthly',
    features: {
      hosting: true,
      ssl_management: true,
      security_updates: true,
      monthly_backups: true,
      tech_stack_updates: 'basic',
      support: 'email',
      content_updates: false,
      performance_monitoring: false,
      seo_checks: false,
      analytics_setup: false,
      emergency_response: false,
      phone_support: false
    },
    is_active: true,
    display_order: 1
  },
  {
    name: 'Professional Care',
    description: 'Proactive support and optimization for growing businesses.',
    price: 99.00,
    billing_period: 'monthly',
    features: {
      hosting: true,
      ssl_management: true,
      security_updates: true,
      monthly_backups: true,
      tech_stack_updates: 'basic',
      support: 'priority_email',
      content_updates: '2_hours_monthly',
      performance_monitoring: true,
      seo_checks: 'basic',
      analytics_setup: true,
      emergency_response: false,
      phone_support: false
    },
    is_active: true,
    display_order: 2
  },
  {
    name: 'Premium Care',
    description: 'Comprehensive support and strategic insights for established businesses.',
    price: 199.00,
    billing_period: 'monthly',
    features: {
      hosting: true,
      ssl_management: true,
      security_updates: true,
      monthly_backups: true,
      tech_stack_updates: 'basic',
      support: 'phone',
      content_updates: '4_hours_monthly',
      performance_monitoring: true,
      seo_checks: 'advanced',
      analytics_setup: true,
      emergency_response: '4_hour',
      phone_support: true,
      monthly_reports: true
    },
    is_active: true,
    display_order: 3
  }
];

async function main() {
  try {
    console.log('🚀 Starting pricing plans migration...');
    
    // Authenticate as admin
    console.log('🔐 Authenticating as admin...');
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Admin authentication successful');

    // Check if plans collection exists
    try {
      const existingPlans = await pb.collection('plans').getList(1, 1);
      console.log(`📋 Found ${existingPlans.totalItems} existing plans`);
      
      if (existingPlans.totalItems > 0) {
        console.log('⚠️ Plans already exist. Delete existing plans? (y/N)');
        const readline = await import('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        
        const answer = await new Promise((resolve) => {
          rl.question('', resolve);
        });
        rl.close();
        
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          console.log('🗑️ Deleting existing plans...');
          for (const plan of existingPlans.items) {
            await pb.collection('plans').delete(plan.id);
          }
          console.log('✅ Existing plans deleted');
        } else {
          console.log('🚫 Migration cancelled');
          return;
        }
      }
    } catch {
      console.log('📋 No existing plans found, proceeding with migration...');
    }

    // Create new plans
    console.log('📝 Creating pricing plans...');
    for (const plan of pricingPlans) {
      try {
        const createdPlan = await pb.collection('plans').create(plan);
        console.log(`✅ Created plan: ${plan.name} (ID: ${createdPlan.id})`);
      } catch (error) {
        console.error(`❌ Failed to create plan: ${plan.name}`, error);
      }
    }

    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Created ${pricingPlans.length} pricing plans`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main(); 