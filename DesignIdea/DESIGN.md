---
name: Nomad's Dream
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#3f493f'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d30'
  primary: '#00652c'
  on-primary: '#ffffff'
  primary-container: '#15803d'
  on-primary-container: '#d3ffd5'
  inverse-primary: '#79db8d'
  secondary: '#ac3400'
  on-secondary: '#ffffff'
  secondary-container: '#fd6b36'
  on-secondary-container: '#5d1900'
  tertiary: '#57584f'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f7066'
  on-tertiary-container: '#f5f4e8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f8a7'
  primary-fixed-dim: '#79db8d'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005323'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#832600'
  tertiary-fixed: '#e4e3d7'
  tertiary-fixed-dim: '#c7c7bc'
  on-tertiary-fixed: '#1b1c15'
  on-tertiary-fixed-variant: '#46473f'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style

The design system is built on a philosophy of **Organic Warmth**. It moves away from the sterile, high-tech aesthetic common in AI applications, instead favoring a human-centric, "analog-inspired" digital experience. The target audience is the curious traveler—individuals seeking inspiration and a personal connection to their journey.

The visual style blends **Soft Minimalism** with **Tactile Depth**. It uses immersive photography as a window into destinations, framed by organic, soft-edged containers. The emotional response should be one of serenity and confidence, making the complex task of AI-driven travel planning feel like a conversation with a well-traveled friend in a sun-drenched library.

## Colors

The palette is rooted in earth tones to ground the digital experience in the physical world.

- **Primary (Sage Green):** Used for primary actions, success states, and key navigational highlights. It represents growth and the natural world.
- **Accent (Terracotta):** Reserved for high-energy interactions, "Book Now" buttons, and delightful discoveries. It provides a warm contrast to the sage.
- **Background (Sand/Cream):** Replaces harsh white to reduce eye strain and provide a parchment-like quality to the interface.
- **Text (Charcoal):** A soft slate-grey that ensures high legibility while maintaining a softer contrast than pure black.

## Typography

This design system utilizes a high-contrast typographic pairing to signal both authority and modernity.

**Playfair Display** is used for all editorial headings. Its high stroke contrast evokes the feel of premium travel magazines and literary journals. It should be used with slightly tighter letter-spacing in large formats.

**Outfit** serves as the functional workhorse. Its geometric but friendly construction ensures clarity in itineraries and data-dense travel details. Body text should maintain generous line heights (1.6) to support the "breezy" and open feel of the brand.

## Layout & Spacing

The layout follows a **Fluid Grid** model with an emphasis on "Negative Space as Luxury." 

- **Desktop:** A 12-column grid with a maximum content width of 1280px. Margins are expansive (64px) to allow the content to breathe.
- **Tablet:** 8-column grid with 32px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows an 8px base unit. Vertical rhythm should favor larger gaps (xl and lg) between major sections to prevent the AI's generated content from feeling overwhelming. Use "Safe Area" padding for full-bleed photography containers to ensure text remains legible over images.

## Elevation & Depth

Depth in this design system is achieved through **Soft Ambient Shadows** and **Tonal Layering**, avoiding harsh lines or industrial shadows.

1.  **Level 0 (Surface):** The Sand/Cream background (#FDFCF0).
2.  **Level 1 (Cards/Floating Elements):** White (#FFFFFF) surfaces with a very soft, diffused shadow (Blur: 20px, Y: 4px, Color: Charcoal at 5% opacity).
3.  **Level 2 (Interactive/Hover):** Increased shadow spread and a subtle lift.
4.  **Photography Depth:** Large images should have a subtle inner-glow or soft border radius to integrate them into the cream background.

Avoid using pure black shadows. Instead, tint shadows with a hint of the Charcoal (#334155) or Sage Green to keep the warmth consistent.

## Shapes

The shape language is **Organic and Curvilinear**. 

Strict rectangles are avoided. Instead, we use "Squircles" (superellipses) for primary containers and cards. For decorative elements, AI loading states, or image masks, "soft blobs" (asymmetric organic shapes) are encouraged to reinforce the human/nature theme. 

- **Primary Containers:** 1rem (16px) corner radius.
- **Buttons & Tags:** Full pill-shaped radius (3rem) to provide a soft touchpoint for interaction.

## Components

- **Buttons:** Primary buttons use Sage Green with white text and a pill-shape. Secondary buttons use a Sage Green outline. The "CTA" (Book/Confirm) uses the Terracotta accent.
- **Cards:** Cards should have a white background, Level 1 elevation, and 16px rounded corners. Padding within cards should be generous (24px - 32px).
- **Input Fields:** Use a subtle Charcoal outline (20% opacity) that shifts to Sage Green on focus. Backgrounds should be slightly darker than the page surface.
- **Chips/Tags:** Used for travel tags (e.g., "Eco-friendly," "Beachfront"). These should be small, pill-shaped, using low-opacity tints of the primary colors.
- **The "AI Guide" Bubble:** A distinctive, slightly asymmetrical organic shape that differentiates AI-generated suggestions from standard UI elements.
- **Itinerary Timeline:** A vertical line in Sage Green with soft, circular nodes, using Playfair Display for time headings.