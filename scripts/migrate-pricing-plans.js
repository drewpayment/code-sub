#!/usr/bin/env node

/**
 * Migration script to add existing pricing plans to PocketBase
 * Run with: node scripts/migrate-pricing-plans.js
 */
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';

dotenv.config();

const pb = new PocketBase('https://pocketbase.hoytlabs.cloud');

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
    console.log('🚀 Starting pricing plans feature update...');
    
    // Authenticate as admin
    console.log('🔐 Authenticating as admin...');
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Admin authentication successful');

    // Get all existing plans
    console.log('📋 Fetching existing plans...');
    const existingPlans = await pb.collection('plans').getFullList();
    console.log(`📊 Found ${existingPlans.totalItems || existingPlans.length} existing plans`);

    // Update existing plans with features
    console.log('📝 Updating existing plans with features...');
    let updatedCount = 0;
    
    for (const planTemplate of pricingPlans) {
      // Find existing plan by name
      const existingPlan = existingPlans.find(plan => plan.name === planTemplate.name);
      
      if (existingPlan) {
        try {
          console.log(`🔄 Updating plan: ${planTemplate.name} (ID: ${existingPlan.id})`);
          
          // Update the plan with features and any other missing fields
          const updateData = {
            features: planTemplate.features,
            description: planTemplate.description, // Update description too
            // Only update price if it's not already set
            ...(existingPlan.price === 0 && { price: planTemplate.price }),
            // Only update billing_period if it's not already set
            ...(!existingPlan.billing_period && { billing_period: planTemplate.billing_period }),
            // Ensure is_active is set
            is_active: planTemplate.is_active
          };
          
          await pb.collection('plans').update(existingPlan.id, updateData);
          console.log(`✅ Updated plan: ${planTemplate.name} with features`);
          updatedCount++;
        } catch (error) {
          console.error(`❌ Failed to update plan: ${planTemplate.name}`, error);
        }
      } else {
        console.log(`⚠️ Plan not found in database: ${planTemplate.name}`);
        console.log('📋 Available plans in database:');
        existingPlans.forEach(plan => console.log(`   - ${plan.name}`));
      }
    }

    if (updatedCount > 0) {
      console.log('🎉 Feature update completed successfully!');
      console.log(`📊 Updated ${updatedCount} plans with features`);
    } else {
      console.log('⚠️ No plans were updated. Check plan names match exactly.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main(); 