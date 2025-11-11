import "@/styles/globals.scss";
import ReduxProvider from "@/store/Provider";
import BootstrapClient from "../components/BootstrapClient";
import Footer from "@/components/Common/Footer";
import { ScrollTop } from "@/hooks";
import DynamicHeader from "@/components/Common/DynamicHeader";
import RTLDirection from "@/components/Common/RTLDirection";
import "react-intl-tel-input/dist/main.css";
import Script from "next/script";

export const metadata = {
  title: "OurShopee - Online Shopping",
  description:
    "Shop the best deals on electronics, fashion, beauty, and more at OurShopee.",
  keywords: "online shopping, best deals, OurShopee",
  image: "https://yourcdn.com/assets/og-home-image.webp",
  url: "https://www.ourshopee.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/56b1d105d2fa63f97d89d9626b476ec8?family=Bobby+Jones+Soft+Regular"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bayon&family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anta:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReduxProvider>
          <RTLDirection />
          <ScrollTop>
            <DynamicHeader />
            <div className="overflow-x-hidden">
              <div className="bg-white md:mx-auto relative">
                <div className="container mainbody">{children}</div>
                <BootstrapClient />
                <Footer />
              </div>
            </div>
          </ScrollTop>
        </ReduxProvider>
        <Script id="tamara-config" strategy="afterInteractive">
          {`
            window.tamaraWidgetConfig = {
              lang: "en",
              country: "AE",
              publicKey: "${process.env.NEXT_PUBLIC_TAMARA_PUBLIC_KEY}"
            };
          `}
        </Script>

        {/* 2) Tamara widget script */}
        <Script
          src="https://cdn-sandbox.tamara.co/widget-v2/tamara-widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
