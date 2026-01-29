import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Terminal from "@/pages/Terminal";

/**
 * TerminalApp - Standalone wrapper for the Terminal page
 * 
 * This is the entry point for the Terminal subdomain (terminal.gurovich.law).
 * It provides all necessary providers but excludes the main site's Layout,
 * navigation, and other marketing-site components.
 * 
 * The Terminal includes its own header with navigation back to the main site.
 */
function TerminalApp() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Terminal />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default TerminalApp;
