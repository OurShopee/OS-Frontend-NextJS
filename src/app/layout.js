import "@/styles/globals.scss";
import ReduxProvider from "@/store/Provider";
import BootstrapClient from "../components/BootstrapClient";
import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";

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
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap"
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
          <div className="bg-white md:mx-auto">
            <Header />
            <div className="container mainbody">{children}</div>
            <BootstrapClient />
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
