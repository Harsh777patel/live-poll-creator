import { Outfit , Ovo } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"] , weight: ["400" ,"500" ,"600" ,"700"]});
const ovo = Ovo({ subsets: ["latin"] , weight: ["400"] });

export const metadata = {
  title: "CloudStream",
  description: "A real-time Live Poll Creator Website that lets you host interactive sessions, gather instant responses, and manage polls seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} ${ovo.className} antialiased`}
      >
        
          <Navbar />
        
        <Toaster position="top-center" />
        {children}
        <div>
         <Footer />
        </div>
      </body>
    </html>
  );
}