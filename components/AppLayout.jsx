import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import { FooterVisibilityProvider } from '@modules/providers/FooterVisibilityProvider';

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      <FooterVisibilityProvider>
        <main className="relative z-[1]">
          {children}
        </main>
        <Footer />
      </FooterVisibilityProvider>
    </>
  );
}
