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
import Onboarding from "./pages/Onboarding";
import OnboardingSuccess from "./pages/OnboardingSuccess";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/blog"} component={Blog} />
        <Route path={"/blog/:slug"} component={BlogPost} />
        <Route path={"/about"} component={AboutUs} />
        <Route path={"/reviews"} component={Reviews} />
        <Route path={"/practice-areas"} component={PracticeAreas} />
        <Route path={"/practice-areas/:area"} component={PracticeAreaDetail} />
        <Route path={"/practice-areas/:area/:subpage"} component={PracticeAreaSubPage} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/team"} component={OurTeam} />
        <Route path={"/privacy"} component={PrivacyPolicy} />
        <Route path={"/terms"} component={TermsOfService} />
        <Route path={"/disclaimer"} component={Disclaimer} />
        <Route path={"/onboarding"} component={Onboarding} />
        <Route path={"/onboarding/success"} component={OnboardingSuccess} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
