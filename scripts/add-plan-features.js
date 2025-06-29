#!/usr/bin/env node

/**
 * Script to add features to existing pricing plans
 */

import PocketBase from 'pocketbase';
import { config } from 'dotenv';

// Load environment variables
config();

const pb = new PocketBase('https://pocketbase.hoytlabs.cloud');

const planFeatures = {
  'Essential Care': {
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
  'Professional Care': {
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
  'Premium Care': {
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
  }
};

async function main() {
  try {
    console.log('🚀 Adding features to existing plans...');
    
    // Authenticate as admin using environment variables
    const adminEmail = process.env.PB_EMAIL;
    const adminPassword = process.env.PB_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      throw new Error('PB_EMAIL and PB_PASSWORD are required');
    }
    
    console.log('🔐 Authenticating as admin...');
    await pb.admins.authWithPassword(adminEmail, adminPassword);
    console.log('✅ Admin authentication successful');

    // Get all existing plans
    console.log('📋 Fetching existing plans...');
    const plans = await pb.collection('plans').getFullList();
    console.log(`Found ${plans.length} existing plans`);

    // Update each plan with features
    for (const plan of plans) {
      const features = planFeatures[plan.name];
      if (features) {
        console.log(`📝 Adding features to plan: ${plan.name}`);
        await pb.collection('plans').update(plan.id, { features });
        console.log(`✅ Updated plan: ${plan.name}`);
      } else {
        console.log(`⚠️ No features defined for plan: ${plan.name}`);
      }
    }

    console.log('🎉 Feature update completed successfully!');
    
  } catch (error) {
    console.error('❌ Feature update failed:', error);
    process.exit(1);
  }
}

main(); 