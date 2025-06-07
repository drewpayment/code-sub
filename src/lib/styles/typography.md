# Typography System - Marketing Homepage Design System

## Overview
This typography system is designed for a professional, approachable marketing homepage targeting small-to-medium businesses. It balances readability with visual hierarchy to support conversion-focused content.

## Font Stack
- **Primary Font**: Inter (Google Fonts)
- **Fallback**: System UI fonts for performance
- **Character**: Modern, clean, highly readable across all devices

## Typography Hierarchy

### Display Text (Hero Sections)
Use for main hero headlines and large promotional text.

```html
<!-- Hero Headline (72px) -->
<h1 class="text-display-2xl font-extrabold text-neutral-900">
  Professional Web Development for Growing Businesses
</h1>

<!-- Large Section Headlines (60px) -->
<h1 class="text-display-xl font-bold text-primary">
  Why Choose Our Services?
</h1>

<!-- Section Headlines (48px) -->
<h2 class="text-display-lg font-bold text-neutral-900">
  Our Development Process
</h2>
```

### Standard Headings
Use for content structure and information hierarchy.

```html
<!-- Page Titles (36px) -->
<h1 class="text-h1 font-bold text-neutral-900">About Our Company</h1>

<!-- Section Titles (30px) -->
<h2 class="text-h2 font-semibold text-neutral-900">Our Services</h2>

<!-- Subsection Titles (24px) -->
<h3 class="text-h3 font-semibold text-neutral-900">Essential Package</h3>

<!-- Card Titles (20px) -->
<h4 class="text-h4 font-medium text-neutral-900">Project Management</h4>

<!-- Small Headings (18px) -->
<h5 class="text-h5 font-medium text-neutral-700">Features Include</h5>

<!-- Micro Headings (16px) -->
<h6 class="text-h6 font-medium text-neutral-700">Technical Details</h6>
```

### Body Text
Use for main content, descriptions, and general text.

```html
<!-- Large Body Text - Hero descriptions, important content (18px) -->
<p class="text-body-lg text-neutral-600">
  We partner with small and medium businesses to create professional, 
  high-performing websites that drive growth and establish credibility.
</p>

<!-- Standard Body Text - General content (16px) -->
<p class="text-body text-neutral-600">
  Our team brings over 10 years of experience in web development, 
  specializing in modern frameworks and conversion optimization.
</p>

<!-- Small Body Text - Secondary info, fine print (14px) -->
<p class="text-body-sm text-neutral-500">
  All packages include SSL certificates, basic SEO setup, and 30 days of support.
</p>
```

### UI & Interactive Text
Use for buttons, captions, labels, and interface elements.

```html
<!-- Large Button Text (16px) -->
<button class="text-button-lg font-medium">Get Started Today</button>

<!-- Standard Button Text (14px) -->
<button class="text-button font-medium">Learn More</button>

<!-- Captions & Labels (12px) -->
<span class="text-caption text-neutral-500">* Starting at $2,500</span>

<!-- Overlines & Tags (12px, wide spacing) -->
<span class="text-overline font-medium text-accent uppercase">Popular</span>
```

## Font Weight Guidelines

### Weight Hierarchy
- **Black (900)**: Hero text, major impact statements
- **Extrabold (800)**: Large display headings
- **Bold (700)**: Standard headings (H1-H3), emphasis
- **Semibold (600)**: Subheadings (H4-H6), important text
- **Medium (500)**: UI elements, buttons, subtle emphasis
- **Normal (400)**: Body text, descriptions, general content
- **Light (300)**: Subtle text, secondary information

### Usage Examples
```html
<!-- Hero Impact -->
<h1 class="text-display-2xl font-black text-primary">
  Grow Your Business Online
</h1>

<!-- Section Headings -->
<h2 class="text-h2 font-bold text-neutral-900">Our Process</h2>

<!-- Subheadings -->
<h4 class="text-h4 font-semibold text-neutral-800">Discovery Phase</h4>

<!-- Buttons -->
<button class="text-button font-medium bg-primary text-white">
  Start Project
</button>

<!-- Body Text -->
<p class="text-body font-normal text-neutral-600">
  We begin every project with a thorough discovery process...
</p>
```

## Color Combinations

### High Contrast (Accessibility First)
```html
<!-- Primary Text on Light Background -->
<div class="bg-neutral-50">
  <h1 class="text-neutral-900">High Contrast Heading</h1>
  <p class="text-neutral-700">Readable body text</p>
</div>

<!-- White Text on Dark Background -->
<div class="bg-primary">
  <h2 class="text-white">White on Primary Blue</h2>
  <p class="text-primary-100">Light text for readability</p>
</div>
```

### Brand Color Integration
```html
<!-- Primary Brand Colors -->
<h2 class="text-primary font-bold">Professional Development</h2>

<!-- Accent Colors for Highlights -->
<span class="text-accent font-medium">✓ Included Feature</span>

<!-- Muted Text for Secondary Info -->
<p class="text-neutral-500 font-normal">Additional details...</p>
```

## Responsive Typography

### Mobile-First Approach
```html
<!-- Responsive Hero Text -->
<h1 class="text-h1 md:text-display-lg lg:text-display-xl font-extrabold">
  Scale with Screen Size
</h1>

<!-- Responsive Body Text -->
<p class="text-body-sm md:text-body lg:text-body-lg">
  Comfortable reading at any size
</p>
```

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
- **Minimum contrast ratio**: 4.5:1 for normal text
- **Large text contrast**: 3:1 for 18px+ or 14px+ bold
- **Line height**: Minimum 1.5x font size for body text
- **Character spacing**: Minimum 0.12x font size

### Recommended Practices
```html
<!-- Good: High contrast, readable sizes -->
<div class="bg-white">
  <h2 class="text-h2 font-bold text-neutral-900">Accessible Heading</h2>
  <p class="text-body leading-relaxed text-neutral-700">
    Body text with comfortable line height and contrast.
  </p>
</div>

<!-- Enhanced for accessibility -->
<button class="text-button-lg font-medium bg-primary text-white 
              hover:bg-primary-dark focus:ring-2 focus:ring-primary-300
              transition-colors duration-200">
  Accessible Button
</button>
```

## Component Examples

### Marketing Card
```html
<div class="bg-white rounded-xl shadow-medium p-6">
  <span class="text-overline font-medium text-accent uppercase">Popular</span>
  <h3 class="text-h3 font-bold text-neutral-900 mt-2">Enhanced Package</h3>
  <p class="text-body text-neutral-600 mt-3">
    Perfect for growing businesses that need advanced features and ongoing support.
  </p>
  <div class="text-display-lg font-extrabold text-primary mt-4">$4,500</div>
  <span class="text-caption text-neutral-500">Starting price</span>
</div>
```

### Call-to-Action Section
```html
<section class="bg-primary-50 py-16">
  <div class="text-center">
    <h2 class="text-display-lg font-bold text-neutral-900">
      Ready to Start Your Project?
    </h2>
    <p class="text-body-lg text-neutral-600 mt-4 max-w-2xl mx-auto">
      Join hundreds of satisfied clients who have transformed their online presence 
      with our professional web development services.
    </p>
    <button class="text-button-lg font-medium bg-primary text-white 
                   px-8 py-4 rounded-lg mt-8 hover:bg-primary-dark transition-colors">
      Get Your Free Consultation
    </button>
  </div>
</section>
```

---

## Quick Reference

### Size Scale
- **Display**: 72px, 60px, 48px (display-2xl, display-xl, display-lg)
- **Headings**: 36px, 30px, 24px, 20px, 18px, 16px (h1-h6)
- **Body**: 18px, 16px, 14px (body-lg, body, body-sm)
- **UI**: 16px, 14px, 12px (button-lg, button, caption)

### Weight Scale
- **900 Black**: Hero impact text
- **800 Extrabold**: Large display
- **700 Bold**: Main headings
- **600 Semibold**: Subheadings
- **500 Medium**: UI elements
- **400 Normal**: Body text 