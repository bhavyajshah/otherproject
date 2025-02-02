"use client";
//Global
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
//Components
import { Icons } from "../Icons/Icons";
//Hooks
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import {
  ABOUT_ROUTE,
  DELIVERY_ROUTE,
  PAYMENT_ROUTE,
  POLITIC_ROUTE,
  SHOP_ADDRESS,
  SHOP_EMAIL,
  SHOP_INSTAGRAM,
  SHOP_NAME,
  SHOP_PHONE,
  SHOP_ROUTE,
  SHOP_TELEGRAM,
  SHOP_WHATSAPP,
  PROVIDER_SITE,
  SHOP_SECOND_PHONE,
} from "@/utils/Consts";
//Images
import logo from "../../public/assets/other/logo.png";
//Styles
import "./Footer.scss";

import { usePathname } from "next/navigation";

//Cookies
import { getCookie } from "cookies-next";
  
export function Footer() {
  const translate = useTranslate();

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pathname = usePathname();

  // Footer'ın gösterilmeyeceği sayfalar
  const hideFooterRoutes = ["/contacts"];

  const [language, setLanguage] = useState("");

  useEffect(() => {
    const selectedLanguage = getCookie("selectedLanguage") || "";
    setLanguage(selectedLanguage);
  }, [translate, language]);

  return (
    <footer>
      <div className="container mx-auto mb-[47px] px-[15px] lg:px-[30px]">
        {/* <nav className="hidden md:flex justify-between items-center mb-[32px]">
          <Link href={SHOP_ROUTE}>
            <Image width={100} height={50} src={logo} alt="logo" />
          </Link>

          <div className="footer-links">
            <Link href={ABOUT_ROUTE}>{translate.headerAbout}</Link>

            <Link href={DELIVERY_ROUTE}>{translate.headerDelivery}</Link>

            <Link href={PAYMENT_ROUTE}>{translate.footerPayment}</Link>

            <Link href={POLITIC_ROUTE}>{translate.footerPolitics}</Link>

            <Link target="_blank" href={PROVIDER_SITE+"?lang="+language}>
              {translate.footerProviders}
            </Link>
          </div>
        </nav> */}
        {!hideFooterRoutes.includes(pathname) && (
        <nav className="grid grid-cols-2 md:flex w-full justify-between">
          <div className="flex flex-col md:hidden justify-between md:items-center gap-[18px] md:gap-0">
            <Link href={SHOP_ROUTE}>
              <Image width={100} height={50} src={logo} alt="logo" />
            </Link>
            <div className="flex flex-col gap-[16px] md:gap-[57px]">
              <Link href={ABOUT_ROUTE}>{translate.headerAbout}</Link>

              <Link href={DELIVERY_ROUTE}>{translate.headerDelivery}</Link>

              <Link href={PAYMENT_ROUTE}>{translate.footerPayment}</Link>

              <Link target="_blank" href={PROVIDER_SITE}>
                {translate.footerProviders}
              </Link>
            </div>
          </div>
          <div className="w-full flex flex-col-reverse md:flex-row md:justify-between items-center gap-[10px] md:gap-[32px]">
            <div className="w-full flex flex-col-reverse md:flex-col gap-[12px] md:gap-[32px]">
              <p className="family_bold footer_shop_address">{SHOP_ADDRESS}</p>
              <div className="flex flex-col sm:flex-row lg:hidden sm:items-center gap-[13px]">
                <p className="font-bold">{translate.footerWriteUs}:</p>

                <div className="flex gap-[10px]">
                  <Link href={SHOP_TELEGRAM}>
                    <Icons id="telegram" />
                  </Link>

                  <Link href={SHOP_WHATSAPP}>
                    <Icons id="whatsapp" />
                  </Link>

                  <Link href={SHOP_INSTAGRAM}>
                    <Icons id="instagram" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col justify-between gap-[15px]">
              <div className="flex flex-col">
                <Link className="text-[14px]" href={`tel:${SHOP_PHONE}`}>
                  {SHOP_PHONE}
                </Link>
                <Link className="text-[14px]" href={`tel:${SHOP_SECOND_PHONE}`}>
                  {SHOP_SECOND_PHONE}
                </Link>
              </div>

              <div className="flex flex-col">
                <Link
                  className="family_bold text-[10px] text-black"
                  href={`mailto:${SHOP_EMAIL}`}
                >
                  {SHOP_EMAIL}
                </Link>

                {/* <p className="hidden md:block text-[10px]">
                  {translate.footerTextUnderEmail}
                </p> */}
              </div>
            </div>

            <nav className="w-full hidden lg:flex items-center justify-end gap-[13px]">
              <span className="family_bold">{translate.footerWriteUs}:</span>

              <Link href={SHOP_TELEGRAM}>
                <Icons id="telegram" />
              </Link>

              <Link href={SHOP_WHATSAPP}>
                <Icons id="whatsapp" />
              </Link>

              <Link href={SHOP_INSTAGRAM}>
                <Icons id="instagram" />
              </Link>
            </nav>
          </div>
        </nav>
  )}
      </div>

      <div className="w-full container mx-auto flex justify-between items-center mb-4 px-[28px] sm:px-0">
        <span className="text-[10px]">{translate.footerUsing}</span>

        <Link href={POLITIC_ROUTE}>{translate.footerPolitics}</Link>
        
        <span className="hidden sm:block">{`© ${SHOP_NAME}`}</span>

  
      </div>

      {showScrollButton && (
        <button
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </footer>
  );
}
