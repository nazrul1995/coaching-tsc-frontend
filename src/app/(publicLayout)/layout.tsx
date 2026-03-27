import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Header/Nabvar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar/>
      {children}
      <Footer />
    </div>
  );
}