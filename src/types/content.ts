import { z } from 'zod';

// Zod schemas for content validation

export const logoSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  alt: z.string().min(1, 'Alt text is required'),
});

export const navItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Href is required'),
});

export const actionButtonSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Href is required'),
});

export const headlineSchema = z.object({
  text: z.string().min(1, 'Headline text is required'),
});

export const subtextSchema = z.object({
  text: z.string().min(1, 'Subtext is required'),
});

export const heroMediaSchema = z.object({
  type: z.string().min(1, 'Media type is required'),
  url: z.string().url('Please enter a valid URL'),
});

export const ctaSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Href is required'),
});

export const introductionSchema = z.object({
  text: z.string().min(1, 'Introduction text is required'),
});

export const cardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const carouselItemSchema = z.object({
  image: z.string().url('Please enter a valid image URL'),
});

export const highlightSchema = z.object({
  text: z.string().min(1, 'Highlight text is required'),
});

export const linkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Href is required'),
});

export const socialIconSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Please enter a valid URL'),
});

export const contactInfoSchema = z.object({
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const copyrightSchema = z.object({
  text: z.string().min(1, 'Copyright text is required'),
});

// Main content schema
export const headerSchema = z.object({
  logo: z.array(logoSchema),
  navbar: z.array(navItemSchema),
  actionButton: z.array(actionButtonSchema),
});

export const bannerSchema = z.object({
  headline: z.array(headlineSchema),
  subtext: z.array(subtextSchema),
  heroMedia: z.array(heroMediaSchema),
  primaryCTA: z.array(ctaSchema),
  secondaryCTA: z.array(ctaSchema),
});

export const mainContentSchema = z.object({
  introduction: z.array(introductionSchema),
  cards: z.array(cardSchema),
  carousel: z.array(carouselItemSchema),
  highlights: z.array(highlightSchema),
});

export const footerSchema = z.object({
  links: z.array(linkSchema),
  socialIcons: z.array(socialIconSchema),
  contactInfo: z.array(contactInfoSchema),
  copyrights: z.array(copyrightSchema),
});

export const contentDataSchema = z.object({
  header: headerSchema,
  banner: bannerSchema,
  mainContent: mainContentSchema,
  footer: footerSchema,
});

export type ContentData = z.infer<typeof contentDataSchema>;
export type HeaderData = z.infer<typeof headerSchema>;
export type BannerData = z.infer<typeof bannerSchema>;
export type MainContentData = z.infer<typeof mainContentSchema>;
export type FooterData = z.infer<typeof footerSchema>;

// Default sample content
export const defaultContent: ContentData = {
  header: {
    logo: [
      { url: 'https://cdn.site.com/logo.png', alt: 'Company Logo' },
    ],
    navbar: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Pricing', href: '/pricing' },
    ],
    actionButton: [
      { label: 'Get Started', href: '/signup' },
    ],
  },
  banner: {
    headline: [
      { text: 'Build Faster With Our Website' },
    ],
    subtext: [
      { text: 'Everything you need to launch quickly' },
    ],
    heroMedia: [
      { type: 'image', url: 'https://cdn.site.com/hero.jpg' },
    ],
    primaryCTA: [
      { label: 'Start Free Trial', href: '/trial' },
    ],
    secondaryCTA: [
      { label: 'Contact Sales', href: '/contact' },
    ],
  },
  mainContent: {
    introduction: [
      { text: 'Our platform helps teams ship faster.' },
    ],
    cards: [
      { title: 'Speed', description: 'Fast development' },
      { title: 'Scalability', description: 'Grows with you' },
    ],
    carousel: [
      { image: 'https://cdn.site.com/slide1.jpg' },
      { image: 'https://cdn.site.com/slide2.jpg' },
    ],
    highlights: [
      { text: 'Trusted by 10k+ users' },
    ],
  },
  footer: {
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
    ],
    socialIcons: [
      { platform: 'twitter', url: 'https://twitter.com/company' },
      { platform: 'facebook', url: 'https://facebook.com/company' },
      { platform: 'linkedin', url: 'https://linkedin.com/company' },
    ],
    contactInfo: [
      { email: 'support@company.com', phone: '', address: '' },
    ],
    copyrights: [
      { text: '© 2026 Company Inc.' },
    ],
  },
};
