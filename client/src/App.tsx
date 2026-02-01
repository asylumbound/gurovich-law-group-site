import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ContactModalProvider } from "./contexts/ContactModalContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/Layout";
import CookieConsent from "./components/CookieConsent";
import AccessibilityWidget from "./components/AccessibilityWidget";
import { Loader2 } from "lucide-react";

// Static imports for public-facing pages (SEO important, fast initial load)
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AboutUs from "./pages/AboutUs";
import Reviews from "./pages/Reviews";
import PracticeAreas from "./pages/PracticeAreas";
import PracticeAreaDetail from "./pages/PracticeAreaDetail";
import PracticeAreaSubPage from "./pages/PracticeAreaSubPage";
import Contact from "./pages/Contact";
import OurTeam from "./pages/OurTeam";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Disclaimer from "./pages/Disclaimer";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import AreasServed from "./pages/AreasServed";
import CityLandingPage from "./pages/CityLandingPage";

// Lazy imports for heavy admin/internal pages (auth required, loaded on demand)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
// QUARANTINED: Terminal causing production build issues
// const Terminal = lazy(() => import("./pages/Terminal"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
// QUARANTINED: ComponentShowcase imports AIChatBox which uses Streamdown/mermaid
// const ComponentShowcase = lazy(() => import("./pages/ComponentShowcase"));

// Loading fallback component for lazy-loaded routes
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Wrapper component for lazy-loaded routes
function LazyRoute({ component: Component }: { component: React.LazyExoticComponent<React.ComponentType<any>> }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* QUARANTINED: Terminal route disabled for production debugging */}
      {/* <Route path="/terminal">
        <Suspense fallback={<PageLoader />}>
          <Terminal />
        </Suspense>
      </Route> */}
      
      {/* QUARANTINED: Component Showcase disabled - imports mermaid via AIChatBox */}
      {/* <Route path="/components">
        <Suspense fallback={<PageLoader />}>
          <ComponentShowcase />
        </Suspense>
      </Route> */}
      
      {/* All other routes use the standard Layout */}
      <Route>
        <Layout>
          <Switch>
            {/* Public pages - static imports for SEO */}
            <Route path="/" component={Home} />
            <Route path="/blog" component={Blog} />
            <Route path="/blog/:slug" component={BlogPost} />
            <Route path="/about" component={AboutUs} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/practice-areas" component={PracticeAreas} />
            <Route path="/practice-areas/:area" component={PracticeAreaDetail} />
            <Route path="/practice-areas/:area/:subpage" component={PracticeAreaSubPage} />
            <Route path="/contact" component={Contact} />
            <Route path="/team" component={OurTeam} />
            <Route path="/areas-served" component={AreasServed} />
            <Route path="/areas-served/:city" component={CityLandingPage} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsOfService} />
            <Route path="/disclaimer" component={Disclaimer} />
            <Route path="/onboarding/success" component={OnboardingSuccess} />
            <Route path="/404" component={NotFound} />
            
            {/* Admin/Internal pages - LAZY LOADED */}
            <Route path="/onboarding">
              <Suspense fallback={<PageLoader />}>
                <Onboarding />
              </Suspense>
            </Route>
            <Route path="/admin">
              <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
              </Suspense>
            </Route>
            
            {/* Final fallback route */}
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <LanguageProvider>
          <ContactModalProvider>
            <TooltipProvider>
              {/* Skip to Main Content Link - WCAG 2.4.1 Bypass Blocks */}
              <a 
                href="#main-content" 
                className="skip-to-main"
                onClick={(e) => {
                  e.preventDefault();
                  const main = document.getElementById('main-content');
                  if (main) {
                    main.focus();
                    main.scrollIntoView();
                  }
                }}
              >
                Skip to main content
              </a>
              
              <Toaster />
              <Router />
              <CookieConsent />
              <AccessibilityWidget />
            </TooltipProvider>
          </ContactModalProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
