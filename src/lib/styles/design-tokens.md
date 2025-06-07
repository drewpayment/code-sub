# Design Tokens - Marketing Homepage Design System

## Overview
This document serves as the complete reference for all design tokens implemented in our marketing homepage design system. All tokens are integrated into our Tailwind CSS configuration and ready for use across components.

## Token Categories

### Color Tokens

#### Primary Brand Colors
Our primary brand identity colors, representing trust and professionalism.

```css
/* Token Structure: primary-{weight} */
--color-primary-50:  #eff6ff    /* Very light backgrounds */
--color-primary-100: #dbeafe    /* Light backgrounds */
--color-primary-200: #bfdbfe    /* Subtle accents */
--color-primary-300: #93c5fd    /* Focus rings, lighter accents */
--color-primary-400: #60a5fa    /* Medium accents */
--color-primary-500: #3b82f6    /* Light variant, hover states */
--color-primary-600: #2563eb    /* DEFAULT - Main brand color */
--color-primary-700: #1d4ed8    /* Dark variant, pressed states */
--color-primary-800: #1e40af    /* Darker accents */
--color-primary-900: #1e3a8a    /* Very dark accents */
--color-primary-950: #172554    /* Deepest variant */
```

**Tailwind Usage:**
```html
<!-- Background colors -->
<div class="bg-primary">Main brand background</div>
<div class="bg-primary-50">Light background</div>
<div class="bg-primary-700">Dark background</div>

<!-- Text colors -->
<h1 class="text-primary">Brand colored heading</h1>
<p class="text-primary-600">Standard brand text</p>

<!-- Border colors -->
<div class="border border-primary-300">Subtle border</div>
```

#### Accent Colors
Secondary brand colors that add energy and approachability.

```css
/* Token Structure: accent-{weight} */
--color-accent-50:  #f0fdfa    /* Very light backgrounds */
--color-accent-100: #ccfbf1    /* Light backgrounds */
--color-accent-200: #99f6e4    /* Subtle highlights */
--color-accent-300: #5eead4    /* Light variant */
--color-accent-400: #2dd4bf    /* Medium accents */
--color-accent-500: #14b8a6    /* DEFAULT - Main accent color */
--color-accent-600: #0d9488    /* Standard variant */
--color-accent-700: #0f766e    /* Dark variant */
--color-accent-800: #115e59    /* Darker accents */
--color-accent-900: #134e4a    /* Very dark accents */
--color-accent-950: #042f2e    /* Deepest variant */
```

**Tailwind Usage:**
```html
<!-- Accent buttons -->
<button class="bg-accent hover:bg-accent-dark">Secondary Action</button>

<!-- Accent highlights -->
<span class="text-accent font-medium">✓ Feature included</span>

<!-- Accent borders for cards -->
<div class="border-l-4 border-accent">Highlighted content</div>
```

#### Neutral Colors
Comprehensive grayscale for content, backgrounds, and UI elements.

```css
/* Token Structure: neutral-{weight} */
--color-neutral-50:  #f9fafb    /* Page backgrounds */
--color-neutral-100: #f3f4f6    /* Card backgrounds */
--color-neutral-200: #e5e7eb    /* Borders, dividers */
--color-neutral-300: #d1d5db    /* Light borders */
--color-neutral-400: #9ca3af    /* Muted text, placeholders */
--color-neutral-500: #6b7280    /* Secondary text */
--color-neutral-600: #4b5563    /* Body text */
--color-neutral-700: #374151    /* Emphasized text */
--color-neutral-800: #1f2937    /* Strong text */
--color-neutral-900: #111827    /* Headings, primary text */
--color-neutral-950: #030712    /* Maximum contrast text */
```

**Tailwind Usage:**
```html
<!-- Backgrounds -->
<section class="bg-neutral-50">Light section background</section>
<div class="bg-neutral-100">Card background</div>

<!-- Text hierarchy -->
<h1 class="text-neutral-900">Primary heading</h1>
<p class="text-neutral-600">Body text</p>
<span class="text-neutral-400">Muted text</span>

<!-- Borders -->
<div class="border border-neutral-200">Standard border</div>
```

#### Feedback Colors
Status and action-oriented colors for user feedback.

```css
/* Success Tokens */
--color-success-50:  #ecfdf5
--color-success-500: #10b981    /* DEFAULT */
--color-success-700: #047857
--color-success-800: #065f46

/* Warning Tokens */
--color-warning-50:  #fffbeb
--color-warning-500: #f59e0b    /* DEFAULT */
--color-warning-700: #b45309
--color-warning-800: #92400e

/* Error Tokens */
--color-error-50:    #fef2f2
--color-error-500:   #ef4444    /* DEFAULT */
--color-error-700:   #b91c1c
--color-error-800:   #991b1b

/* Info Tokens */
--color-info-50:     #ecfeff
--color-info-500:    #06b6d4    /* DEFAULT */
--color-info-700:    #0e7490
--color-info-800:    #155e75
```

**Tailwind Usage:**
```html
<!-- Success states -->
<div class="bg-success-50 text-success-800">Success message</div>
<span class="text-success">✓ Completed</span>

<!-- Error states -->
<div class="bg-error-50 text-error-800">Error message</div>
<span class="text-error">⚠ Error</span>
```

### Typography Tokens

#### Font Family Tokens
```css
--font-display: Inter, system-ui, sans-serif  /* Large headings, hero text */
--font-body:    Inter, system-ui, sans-serif  /* Body text, general content */
--font-sans:    Inter, system-ui, sans-serif  /* Default sans-serif */
```

**Tailwind Usage:**
```html
<h1 class="font-display">Hero Heading</h1>
<p class="font-body">Body content</p>
<span class="font-sans">UI text</span>
```

#### Font Size Tokens

**Display Sizes (Hero Sections)**
```css
--text-display-2xl: 4.5rem    /* 72px - Hero headlines */
--text-display-xl:  3.75rem   /* 60px - Large headlines */
--text-display-lg:  3rem      /* 48px - Section headlines */
```

**Heading Sizes**
```css
--text-h1: 2.25rem   /* 36px */
--text-h2: 1.875rem  /* 30px */
--text-h3: 1.5rem    /* 24px */
--text-h4: 1.25rem   /* 20px */
--text-h5: 1.125rem  /* 18px */
--text-h6: 1rem      /* 16px */
```

**Body Text Sizes**
```css
--text-body-lg: 1.125rem  /* 18px - Large body text */
--text-body:    1rem      /* 16px - Standard body */
--text-body-sm: 0.875rem  /* 14px - Small body text */
```

**UI Text Sizes**
```css
--text-button-lg: 1rem      /* 16px - Large buttons */
--text-button:    0.875rem  /* 14px - Standard buttons */
--text-caption:   0.75rem   /* 12px - Captions, labels */
--text-overline:  0.75rem   /* 12px - Overlines, tags */
```

**Tailwind Usage:**
```html
<!-- Display text -->
<h1 class="text-display-2xl">Hero Headline</h1>
<h2 class="text-display-lg">Section Headline</h2>

<!-- Standard headings -->
<h1 class="text-h1">Page Title</h1>
<h2 class="text-h2">Section Title</h2>

<!-- Body text -->
<p class="text-body-lg">Large body text</p>
<p class="text-body">Standard body text</p>
<p class="text-body-sm">Small body text</p>

<!-- UI text -->
<button class="text-button-lg">Large Button</button>
<span class="text-caption">Caption text</span>
```

#### Font Weight Tokens
```css
--font-thin:       100
--font-extralight: 200
--font-light:      300
--font-normal:     400  /* Regular/normal text */
--font-medium:     500  /* Slightly emphasized text */
--font-semibold:   600  /* Subheadings, important text */
--font-bold:       700  /* Headings, strong emphasis */
--font-extrabold:  800  /* Large headings, hero text */
--font-black:      900  /* Display text, very strong emphasis */
```

**Tailwind Usage:**
```html
<h1 class="font-black">Maximum impact</h1>
<h2 class="font-bold">Standard heading</h2>
<h3 class="font-semibold">Subheading</h3>
<button class="font-medium">Button text</button>
<p class="font-normal">Body text</p>
```

### Spacing & Layout Tokens

#### Custom Spacing
```css
--spacing-18:  4.5rem   /* 72px - Custom spacing */
--spacing-88:  22rem    /* 352px - Large sections */
--spacing-128: 32rem    /* 512px - Maximum widths */
```

**Tailwind Usage:**
```html
<div class="p-18">Custom padding</div>
<div class="max-w-128">Large container</div>
<section class="py-88">Large section spacing</section>
```

#### Standard Tailwind Spacing
All standard Tailwind spacing tokens are available (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96).

### Shadow Tokens

#### Custom Shadow System
```css
--shadow-soft:   0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)
--shadow-medium: 0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)
--shadow-strong: 0 10px 50px -12px rgba(0, 0, 0, 0.25)
```

**Tailwind Usage:**
```html
<div class="shadow-soft">Subtle card shadow</div>
<div class="shadow-medium">Standard card shadow</div>
<div class="shadow-strong">Prominent card shadow</div>
```

### Animation Tokens

#### Custom Animations
```css
--animate-fade-in:      fadeIn 0.5s ease-in-out
--animate-slide-up:     slideUp 0.5s ease-out
--animate-bounce-gentle: bounceGentle 2s infinite
```

**Tailwind Usage:**
```html
<div class="animate-fade-in">Fading content</div>
<div class="animate-slide-up">Sliding content</div>
<div class="animate-bounce-gentle">Gentle bouncing</div>
```

---

## Token Naming Conventions

### Color Token Pattern
```
{category}-{weight}
```

**Examples:**
- `primary-600` - Main brand color
- `accent-500` - Main accent color  
- `neutral-900` - Primary text color
- `success-50` - Light success background

### Typography Token Pattern
```
text-{size}
font-{weight}
font-{family}
```

**Examples:**
- `text-h1` - Heading 1 size
- `text-body` - Standard body text
- `font-bold` - Bold weight
- `font-display` - Display font family

### Spacing Token Pattern
```
{property}-{size}
```

**Examples:**
- `p-6` - Padding size 6
- `m-4` - Margin size 4
- `space-y-8` - Vertical spacing between children

### Component Token Pattern
```
{element}-{variant}-{state}
```

**Examples:**
- `bg-primary` - Primary background
- `hover:bg-primary-dark` - Primary background on hover
- `focus:ring-primary-300` - Primary focus ring

---

## Token Usage Patterns

### Button Tokens
```html
<!-- Primary Button -->
<button class="bg-primary hover:bg-primary-dark text-white 
               px-6 py-3 rounded-lg text-button-lg font-medium
               transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-primary-300">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-accent hover:bg-accent-dark text-white 
               px-6 py-3 rounded-lg text-button font-medium
               transition-colors duration-200">
  Secondary Action
</button>
```

### Card Tokens
```html
<div class="bg-white rounded-xl shadow-medium border border-neutral-200 p-6
            hover:shadow-strong transition-shadow duration-300">
  <h3 class="text-h3 font-bold text-neutral-900">Card Title</h3>
  <p class="text-body text-neutral-600">Card description</p>
</div>
```

### Section Tokens
```html
<section class="py-16 lg:py-24 bg-neutral-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-display-lg font-bold text-neutral-900 text-center">
      Section Heading
    </h2>
    <p class="text-body-lg text-neutral-600 text-center mt-4">
      Section description
    </p>
  </div>
</section>
```

### Form Tokens
```html
<input class="w-full px-4 py-3 rounded-lg border border-neutral-300
              text-body text-neutral-900 placeholder-neutral-400
              focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary
              transition-colors duration-200">
```

---

## Token Documentation Standards

### Component Token Documentation
When documenting component usage, include:

```markdown
## ComponentName

**Tokens Used:**
- Colors: `primary-600`, `neutral-50`, `neutral-900`
- Typography: `text-h3`, `font-bold`, `text-body`
- Spacing: `p-6`, `mb-4`
- Shadows: `shadow-medium`
- Animations: `animate-fade-in`

**State Tokens:**
- Default: `bg-primary`, `text-white`
- Hover: `hover:bg-primary-dark`
- Focus: `focus:ring-primary-300`
- Disabled: `disabled:bg-neutral-300`
```

### Token Testing Checklist
Before using tokens in components:

✅ **Color Contrast**
- [ ] Text meets 4.5:1 contrast ratio
- [ ] Large text meets 3:1 contrast ratio
- [ ] UI elements meet 3:1 contrast ratio

✅ **Typography Hierarchy**
- [ ] Uses appropriate text size token
- [ ] Uses correct font weight token
- [ ] Maintains hierarchy consistency

✅ **Spacing Consistency**
- [ ] Uses standard spacing tokens
- [ ] Follows consistent patterns
- [ ] Responsive spacing implemented

✅ **State Management**
- [ ] All interactive states defined
- [ ] Proper transition tokens used
- [ ] Focus states accessible

---

## Integration with Design Tools

### Figma Integration
Our design tokens can be synced with Figma using tools like:
- Figma Tokens plugin
- Style Dictionary
- Design token exporters

### Developer Integration
All tokens are available in:
- Tailwind CSS utilities
- CSS custom properties
- JavaScript/TypeScript constants
- Storybook documentation

### Token Maintenance
- Tokens are centralized in `tailwind.config.js`
- Documentation automatically generated
- Version controlled with code
- Breaking changes require major version bump

---

## Quick Reference

### Most Common Tokens

**Colors:**
- `bg-primary` - Main brand background
- `text-neutral-900` - Primary text
- `text-neutral-600` - Body text
- `border-neutral-200` - Standard border

**Typography:**
- `text-display-2xl font-extrabold` - Hero headlines
- `text-h2 font-bold` - Section headings
- `text-body` - Standard body text
- `text-button-lg font-medium` - Button text

**Layout:**
- `p-6` - Standard padding
- `shadow-medium` - Card shadows
- `rounded-lg` - Standard border radius
- `transition-colors duration-200` - Standard transitions

**Interactive:**
- `hover:bg-primary-dark` - Button hover
- `focus:ring-2 focus:ring-primary-300` - Focus ring
- `disabled:opacity-50` - Disabled state 