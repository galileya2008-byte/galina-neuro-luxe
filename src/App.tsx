import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Admin from "./pages/Admin.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import NotFound from "./pages/NotFound.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import NewsPage from "./pages/NewsPage.tsx";
import GalleryPage from "./pages/GalleryPage.tsx";
import OfferPage from "./pages/OfferPage.tsx";
import PageTracker from "./hooks/usePageTracking.tsx";
import YandexMetrika from "./components/YandexMetrika.tsx";
import CookieConsent from "./components/CookieConsent.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

const queryClient = new QueryClient();

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={routerBasename || undefined}>
        <ScrollToTop />
        <PageTracker />
        <YandexMetrika />
        <CookieConsent />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/news/:slug" element={<NewsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
