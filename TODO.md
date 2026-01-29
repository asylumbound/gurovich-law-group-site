# Gurovich Law Group Website - Pending Tasks

## Cookies Notification Popup
- [ ] Create `CookieConsent.tsx` component with popup/banner at bottom of page
- [ ] Add "Accept All", "Reject All", and "Customize" buttons
- [ ] Store user preference in localStorage to prevent showing again
- [ ] Include link to Privacy Policy page
- [ ] Style to match site design (dark theme with primary accent)
- [ ] Add smooth slide-up animation on first visit
- [ ] Integrate component into App.tsx (show on all pages)

## Privacy Policy Page (`/privacy`)
- [ ] Create `PrivacyPolicy.tsx` page component
- [ ] Add route in App.tsx for `/privacy`
- [ ] Include sections:
  - [ ] Information We Collect
  - [ ] How We Use Your Information
  - [ ] Information Sharing and Disclosure
  - [ ] Cookies and Tracking Technologies
  - [ ] Data Security
  - [ ] Your Rights and Choices
  - [ ] Children's Privacy
  - [ ] Changes to This Policy
  - [ ] Contact Information
- [ ] Add last updated date
- [ ] Style with proper headings and readable typography

## Terms of Service Page (`/terms`)
- [ ] Create `TermsOfService.tsx` page component
- [ ] Add route in App.tsx for `/terms`
- [ ] Include sections:
  - [ ] Acceptance of Terms
  - [ ] Use of Website
  - [ ] Intellectual Property
  - [ ] User Conduct
  - [ ] Disclaimer of Warranties
  - [ ] Limitation of Liability
  - [ ] Indemnification
  - [ ] Governing Law
  - [ ] Changes to Terms
  - [ ] Contact Information
- [ ] Add last updated date
- [ ] Style consistent with Privacy Policy page

## Disclaimer Page (`/disclaimer`)
- [ ] Create `Disclaimer.tsx` page component
- [ ] Add route in App.tsx for `/disclaimer`
- [ ] Include sections:
  - [ ] Legal Disclaimer
  - [ ] No Attorney-Client Relationship
  - [ ] Results Not Guaranteed
  - [ ] Accuracy of Information
  - [ ] External Links
  - [ ] Professional Advice
  - [ ] Jurisdiction
- [ ] Add last updated date
- [ ] Style consistent with other legal pages

## Notes
- All legal pages should have consistent styling with proper navigation back to home
- Consider adding a sidebar or breadcrumb navigation for legal pages
- Ensure footer links correctly point to these pages (already configured)
