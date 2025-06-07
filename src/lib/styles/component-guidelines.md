# Component Design Guidelines - Marketing Homepage Design System

## Overview
These guidelines ensure consistent, accessible, and maintainable UI components across the marketing homepage. All components should leverage our established color palette and typography hierarchy while following modern web standards.

## Core Principles

### 1. **Accessibility First**
- All components must meet WCAG 2.1 AA standards
- Proper focus management and keyboard navigation
- Semantic HTML structure
- Appropriate ARIA attributes

### 2. **Mobile-First Responsive**
- Design for mobile screens first
- Scale gracefully to larger screens
- Touch-friendly interaction areas (44px minimum)

### 3. **Consistent Token Usage**
- Use established color tokens (primary, accent, neutral, etc.)
- Follow typography hierarchy (display, heading, body text)
- Consistent spacing and sizing patterns

### 4. **Performance Optimized**
- Minimal DOM complexity
- Efficient CSS using Tailwind utilities
- Optimized for fast rendering

---

## Component Categories

### Buttons & Interactive Elements

#### Primary Button
**Usage**: Main call-to-action, conversion-focused actions
```html
<button class="inline-flex items-center justify-center 
               px-6 py-3 rounded-lg
               bg-primary hover:bg-primary-dark 
               text-white text-button-lg font-medium
               transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2
               disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed">
  Get Started Today
</button>
```

#### Secondary Button
**Usage**: Secondary actions, less prominent CTAs
```html
<button class="inline-flex items-center justify-center 
               px-6 py-3 rounded-lg
               bg-accent hover:bg-accent-dark 
               text-white text-button font-medium
               transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2">
  Learn More
</button>
```

#### Outline Button
**Usage**: Tertiary actions, alternative options
```html
<button class="inline-flex items-center justify-center 
               px-6 py-3 rounded-lg
               border-2 border-primary text-primary
               hover:bg-primary hover:text-white
               text-button font-medium
               transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2">
  Contact Us
</button>
```

#### Button Sizes
```html
<!-- Large Button (Hero sections) -->
<button class="px-8 py-4 text-button-lg">Large Button</button>

<!-- Standard Button -->
<button class="px-6 py-3 text-button">Standard Button</button>

<!-- Small Button -->
<button class="px-4 py-2 text-caption">Small Button</button>
```

### Cards & Content Containers

#### Service Card
**Usage**: Service offerings, pricing packages
```html
<div class="bg-white rounded-xl shadow-medium border border-neutral-200 
            p-6 hover:shadow-strong transition-shadow duration-300
            group cursor-pointer">
  <!-- Header -->
  <div class="flex items-center justify-between mb-4">
    <span class="text-overline font-medium text-accent uppercase tracking-widest">
      Popular
    </span>
    <div class="text-success">
      <svg class="w-5 h-5" fill="currentColor"><!-- Check icon --></svg>
    </div>
  </div>
  
  <!-- Title -->
  <h3 class="text-h3 font-bold text-neutral-900 mb-2 
             group-hover:text-primary transition-colors">
    Enhanced Package
  </h3>
  
  <!-- Description -->
  <p class="text-body text-neutral-600 mb-4 leading-relaxed">
    Perfect for growing businesses that need advanced features and ongoing support.
  </p>
  
  <!-- Price -->
  <div class="flex items-baseline mb-4">
    <span class="text-display-lg font-extrabold text-primary">$4,500</span>
    <span class="text-caption text-neutral-500 ml-2">starting price</span>
  </div>
  
  <!-- Features List -->
  <ul class="space-y-2 mb-6">
    <li class="flex items-center text-body-sm text-neutral-700">
      <span class="text-success mr-2">✓</span>
      Custom design & development
    </li>
    <li class="flex items-center text-body-sm text-neutral-700">
      <span class="text-success mr-2">✓</span>
      Content management system
    </li>
  </ul>
  
  <!-- CTA -->
  <button class="w-full bg-primary hover:bg-primary-dark text-white 
                 py-3 rounded-lg text-button font-medium
                 transition-colors duration-200">
    Choose Plan
  </button>
</div>
```

#### Testimonial Card
**Usage**: Client testimonials, social proof
```html
<div class="bg-neutral-50 rounded-xl p-6 border-l-4 border-accent">
  <!-- Quote -->
  <blockquote class="text-body-lg text-neutral-700 mb-4 italic leading-loose">
    "Working with this team transformed our online presence. 
    Professional, responsive, and delivered exactly what we needed."
  </blockquote>
  
  <!-- Attribution -->
  <div class="flex items-center">
    <img class="w-12 h-12 rounded-full object-cover mr-4" 
         src="/images/client-avatar.jpg" 
         alt="Client photo">
    <div>
      <div class="text-h6 font-semibold text-neutral-900">Sarah Johnson</div>
      <div class="text-caption text-neutral-500">CEO, Growth Dynamics</div>
    </div>
  </div>
</div>
```

### Navigation Components

#### Header Navigation
**Usage**: Main site navigation
```html
<nav class="bg-white shadow-soft border-b border-neutral-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <span class="text-h4 font-bold text-primary">YourBrand</span>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-8">
        <a href="#services" 
           class="text-body font-medium text-neutral-700 hover:text-primary
                  border-b-2 border-transparent hover:border-primary
                  pb-1 transition-all duration-200">
          Services
        </a>
        <a href="#about" 
           class="text-body font-medium text-neutral-700 hover:text-primary
                  border-b-2 border-transparent hover:border-primary
                  pb-1 transition-all duration-200">
          About
        </a>
        <a href="#pricing" 
           class="text-body font-medium text-neutral-700 hover:text-primary
                  border-b-2 border-transparent hover:border-primary
                  pb-1 transition-all duration-200">
          Pricing
        </a>
      </div>
      
      <!-- CTA Button -->
      <div class="hidden md:flex">
        <button class="bg-primary hover:bg-primary-dark text-white
                       px-6 py-2 rounded-lg text-button font-medium
                       transition-colors duration-200">
          Get Started
        </button>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button class="p-2 rounded-md text-neutral-700 hover:text-primary
                       hover:bg-neutral-100 transition-colors duration-200">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Form Components

#### Input Field
**Usage**: Contact forms, signup forms
```html
<div class="space-y-2">
  <label for="email" class="block text-h6 font-medium text-neutral-900">
    Email Address
  </label>
  <input type="email" id="email" name="email"
         class="w-full px-4 py-3 rounded-lg border border-neutral-300
                text-body text-neutral-900 placeholder-neutral-400
                focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary
                disabled:bg-neutral-100 disabled:text-neutral-500
                transition-colors duration-200"
         placeholder="Enter your email address">
  <p class="text-caption text-neutral-500">
    We'll never share your email with anyone else.
  </p>
</div>
```

#### Select Dropdown
**Usage**: Service selection, preferences
```html
<div class="space-y-2">
  <label for="service" class="block text-h6 font-medium text-neutral-900">
    Service Interest
  </label>
  <select id="service" name="service"
          class="w-full px-4 py-3 rounded-lg border border-neutral-300
                 text-body text-neutral-900
                 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary
                 transition-colors duration-200">
    <option value="">Select a service</option>
    <option value="essential">Essential Package</option>
    <option value="enhanced">Enhanced Package</option>
    <option value="premium">Premium Package</option>
  </select>
</div>
```

### Layout Components

#### Section Container
**Usage**: Main content sections
```html
<section class="py-16 lg:py-24 bg-neutral-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Section Header -->
    <div class="text-center mb-12">
      <span class="text-overline font-medium text-accent uppercase tracking-widest">
        Our Services
      </span>
      <h2 class="text-display-lg font-bold text-neutral-900 mt-2 mb-4">
        Professional Web Development
      </h2>
      <p class="text-body-lg text-neutral-600 max-w-2xl mx-auto leading-loose">
        We create custom websites that help your business grow and establish 
        a professional online presence.
      </p>
    </div>
    
    <!-- Section Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Content goes here -->
    </div>
  </div>
</section>
```

### Status & Feedback Components

#### Alert/Notification
**Usage**: Form feedback, important messages
```html
<!-- Success Alert -->
<div class="bg-success-50 border border-success-200 rounded-lg p-4">
  <div class="flex items-center">
    <div class="text-success mr-3">
      <svg class="w-5 h-5" fill="currentColor"><!-- Success icon --></svg>
    </div>
    <div>
      <h4 class="text-h6 font-semibold text-success-800">Success!</h4>
      <p class="text-body-sm text-success-700 mt-1">
        Your message has been sent successfully.
      </p>
    </div>
  </div>
</div>

<!-- Error Alert -->
<div class="bg-error-50 border border-error-200 rounded-lg p-4">
  <div class="flex items-center">
    <div class="text-error mr-3">
      <svg class="w-5 h-5" fill="currentColor"><!-- Error icon --></svg>
    </div>
    <div>
      <h4 class="text-h6 font-semibold text-error-800">Error</h4>
      <p class="text-body-sm text-error-700 mt-1">
        Please check your information and try again.
      </p>
    </div>
  </div>
</div>
```

#### Loading States
**Usage**: Form submissions, content loading
```html
<button class="inline-flex items-center justify-center 
               px-6 py-3 rounded-lg
               bg-primary text-white text-button font-medium
               disabled:opacity-50 disabled:cursor-not-allowed"
        disabled>
  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" 
       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  Processing...
</button>
```

---

## Component States

### Interactive States
All interactive components should implement these states:

#### Default State
- Base styling as defined above
- Clearly indicates interactive nature

#### Hover State
- Subtle color transition
- Shadow enhancement for cards
- Use `transition-all duration-200` for smooth animations

#### Focus State
- Visible focus ring using `focus:ring-2 focus:ring-primary-300`
- High contrast for accessibility
- Never remove focus indicators

#### Active State
- Pressed/clicked appearance
- Slightly darker colors
- Immediate visual feedback

#### Disabled State
- Reduced opacity (50-60%)
- Cursor change to `not-allowed`
- Muted colors from neutral palette

### Example State Implementation
```html
<button class="bg-primary hover:bg-primary-dark active:bg-primary-800
               text-white px-6 py-3 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2
               disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed
               transition-all duration-200">
  Interactive Button
</button>
```

---

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Escape key should close modals/dropdowns

### Screen Readers
- Semantic HTML structure
- Appropriate ARIA labels and roles
- Alternative text for images
- Form labels associated with inputs

### Color Contrast
- Text: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- UI elements: Minimum 3:1 contrast ratio

### Touch Targets
- Minimum 44px touch target size
- Adequate spacing between interactive elements
- Consider thumb-friendly placement on mobile

---

## Documentation Standards

### Component Documentation Template
```markdown
## ComponentName

**Purpose**: Brief description of component usage
**Accessibility**: WCAG compliance level
**Dependencies**: Required props/tokens

### Usage
[Code example]

### Props/Variants
- size: 'small' | 'medium' | 'large'
- variant: 'primary' | 'secondary' | 'outline'
- disabled: boolean

### States
- Default, Hover, Focus, Active, Disabled

### Accessibility Notes
- Specific a11y considerations
- Required ARIA attributes
```

### Code Comments
```html
<!-- Component: Primary CTA Button -->
<!-- States: default, hover, focus, active, disabled -->
<!-- Accessibility: WCAG 2.1 AA compliant -->
<button class="...">
  Button Text
</button>
```

---

## Performance Guidelines

### CSS Optimization
- Use Tailwind utilities for consistency
- Minimize custom CSS
- Leverage CSS Grid and Flexbox
- Optimize for critical rendering path

### Component Reusability
- Create modular, composable components
- Use consistent naming conventions
- Document component variants
- Implement proper prop interfaces

### Loading Performance
- Lazy load non-critical components
- Optimize images with proper sizing
- Use progressive enhancement
- Consider skeleton loading states

---

## Quality Checklist

Before implementing any component, ensure:

✅ **Design Consistency**
- [ ] Uses established color tokens
- [ ] Follows typography hierarchy
- [ ] Consistent spacing and sizing
- [ ] Matches design system patterns

✅ **Accessibility**
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Proper color contrast

✅ **Performance**
- [ ] Minimal DOM complexity
- [ ] Efficient CSS usage
- [ ] Fast rendering
- [ ] Mobile optimized

✅ **Code Quality**
- [ ] Clean, readable code
- [ ] Proper documentation
- [ ] Consistent naming
- [ ] Reusable and modular
``` 