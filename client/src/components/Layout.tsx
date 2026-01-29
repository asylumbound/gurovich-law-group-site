import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main 
        id="main-content" 
        className="flex-grow" 
        role="main"
        tabIndex={-1}
        aria-label="Main content"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
