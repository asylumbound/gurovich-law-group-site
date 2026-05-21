/**
 * Image Optimization Tracker
 * Documents all images, their alt text, and lazy loading status
 */

// Images that should NOT have lazy loading (above the fold / hero images)
const ABOVE_FOLD_IMAGES = [
  'her0_element_base.png',       // Homepage hero background
  'opacity_half_hero.png',       // Homepage hero overlay
  'justice-statue-replacement-2.png', // Homepage hero statue
  'her0_element_bottom_angles.png',   // Homepage hero divider
  'glg-logo-header-flat.png',   // Site header logo
  'logo-wht.png',               // Footer logo (visible on scroll but critical)
];

// All images with their optimized alt text
const IMAGE_ALT_TEXT_MAP = {
  // Hero
  'her0_element_base.png': 'Los Angeles skyline at sunset - Gurovich Law Group serves the greater LA area',
  'opacity_half_hero.png': '', // Decorative, aria-hidden
  'justice-statue-replacement-2.png': 'Lady Justice statue symbolizing fair legal representation',
  'her0_element_bottom_angles.png': '', // Decorative, aria-hidden
  
  // Header/Footer
  'glg-logo-header-flat.png': 'Gurovich Law Group Logo',
  'logo-wht.png': 'Gurovich Law Group - Return to Homepage',
  'payment-icons.webp': 'We accept American Express, MasterCard, Visa, Discover, and Cash',
  
  // Page Heroes
  'about-firm-hero-bg.png': 'Gurovich Law Group office building in Sherman Oaks California',
  'aboutus-courtroom.png': 'Attorney presenting case in courtroom before judge',
  'areas-served-hero-bg.jpg': 'Stanley Mosk Courthouse in downtown Los Angeles',
  'team-hero-bg.jpg': 'Gurovich Law Group attorneys in professional setting',
  'reviews-hero-bg.jpg': 'Satisfied client shaking hands with attorney after successful case resolution',
  'contact-hero-bg.jpg': 'Modern law office interior with professional meeting space',
  'practice-areas-hero-bg.png': 'Scales of justice representing comprehensive legal practice areas',
  'blog-hero-bg.png': 'Legal research and case law books in law library',
  
  // Practice Area Icons
  'personal-injury-LOGO.png': 'Personal injury law practice area icon',
  'criminal-defense.png': 'Criminal defense law practice area icon',
  'civillitigation.png': 'Civil litigation practice area icon',
  'tenants-rights.png': 'Tenant rights law practice area icon',
  
  // Blog Images
  'blog-hidden-penalties.png': 'Traffic ticket with hidden financial penalties and court fees illustration',
  'blog-insurance-adjusters.png': 'Insurance adjuster reviewing claim documents at desk',
  'blog-accused-crime.png': 'Person consulting with criminal defense attorney about charges',
  'blog-car-accident.png': 'Vehicle collision scene on Los Angeles highway',
  'blog-10-things-accident.png': 'Checklist of steps to take after a car accident',
  'blog-what-is-personal-injury.png': 'Person receiving medical treatment after personal injury',
  'blog-car-accident-steps.jpg': 'First responders at car accident scene documenting evidence',
  'blog-claim-mistakes.jpg': 'Insurance claim form with common mistakes highlighted',
  'blog-slip-fall-premises.jpg': 'Wet floor warning sign in commercial property',
  'blog-pain-suffering.webp': 'Person experiencing pain and emotional distress after injury',
  'blog-statute-limitations.webp': 'Calendar showing legal filing deadline for personal injury claim',
  'blog-workplace-injury.jpg': 'Worker receiving medical attention for on-the-job injury',
  'blog-distracted-driving.jpg': 'Driver using phone while behind the wheel causing accident risk',
  'blog-uber-lyft.jpg': 'Rideshare vehicle involved in traffic accident in Los Angeles',
  'blog-product-liability.webp': 'Defective consumer product with warning label and recall notice',
};

console.log('Image optimization plan created');
console.log(`Total images: ${Object.keys(IMAGE_ALT_TEXT_MAP).length}`);
console.log(`Above-fold (no lazy): ${ABOVE_FOLD_IMAGES.length}`);
console.log(`Lazy-loadable: ${Object.keys(IMAGE_ALT_TEXT_MAP).length - ABOVE_FOLD_IMAGES.length}`);
