import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useLenis } from "./hooks/useLenis";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { PromoBar } from "./components/marketing/PromoBar";
import { MaintenanceScreen, SiteExperience } from "./components/marketing/SiteExperience";
import { Home } from "./pages/Home";
import { Checkout } from "./pages/Checkout";
import { Admin } from "./pages/Admin";
import { NotFound } from "./pages/NotFound";

function App() {
  useLenis();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/forge");

  if (isAdmin) {
    return (
      <>
        <Toaster position="bottom-center" />
        <Routes>
          <Route path="/forge" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <PromoBar />
      <ScrollProgress />
      <Navbar />
      <CartDrawer />
      <SiteExperience />
      <MaintenanceScreen />
      <Toaster position="bottom-center" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commande" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
