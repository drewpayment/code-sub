# Code-Sub Website Images

This directory contains all optimized images for the Code-Sub website, organized by section and purpose.

## Directory Structure

```
static/images/
├── hero/
│   ├── hero-main-1920x1080.webp     # Primary hero background
│   ├── hero-main-1024x600.webp      # Tablet version
│   └── hero-main-768x500.webp       # Mobile version
├── services/
│   ├── icons/
│   │   ├── web-development.svg
│   │   ├── ecommerce.svg
│   │   ├── maintenance.svg
│   │   └── seo-performance.svg
│   └── illustrations/
│       ├── web-dev-400x300.webp
│       ├── ecommerce-400x300.webp
│       ├── maintenance-400x300.webp
│       └── seo-400x300.webp
├── team/
│   ├── expert-team-300x300.webp
│   ├── results-driven-600x400.webp
│   └── partnership-600x400.webp
├── testimonials/
│   ├── sarah-johnson-80x80.webp
│   ├── mike-chen-80x80.webp
│   └── lisa-rodriguez-80x80.webp
├── clients/
│   ├── logo-placeholder-1-150x75.png
│   ├── logo-placeholder-2-150x75.png
│   └── logo-placeholder-3-150x75.png
├── faq/
│   ├── process-timeline-200x150.webp
│   ├── tech-stack-200x150.webp
│   └── support-illustration-200x150.webp
└── cta/
    └── contact-action-600x400.webp
```

## Image Optimization Requirements

### File Formats
- **WebP**: Primary format for photos and complex graphics
- **SVG**: Vector icons and simple graphics
- **PNG**: Logos with transparency
- **JPEG**: Fallback for photos (if WebP not supported)

### Compression Guidelines
- **Hero images**: < 200KB each
- **Service images**: < 100KB each
- **Icons**: < 10KB each
- **Total page weight**: < 2MB including all images

### Responsive Sizing
- **Hero**: 1920x1080 (desktop), 1024x600 (tablet), 768x500 (mobile)
- **Services**: 400x300 standard, responsive scaling
- **Team photos**: 300x300 square format
- **Testimonials**: 80x80 circular crop
- **Client logos**: 150x75 standard size

## Alt Text Library

See `alt-text.md` for complete SEO-optimized alt text for all images.

## Image Sources

All images sourced from:
- Unsplash (free, high-quality photography)
- Pexels (business-focused stock photos)
- Custom SVG icons (brand-specific)

## Implementation Notes

1. Use `loading="lazy"` for images below the fold
2. Implement responsive srcset for hero images
3. Provide fallback formats for older browsers
4. Test performance impact after implementation

## Last Updated
January 2025 - Initial content architecture phase 