"use client";
//Global
import { useEffect } from "react";
//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
// import { useLanguage } from "./useLanguage";
//Cookies
import { getCookie, setCookie } from "cookies-next";

import { useParams } from "next/navigation";
//Utils
import * as locales from "@/utils/locales";

import { useLocale } from "next-intl";

const useTranslate = () => {
  const locale = useLocale();
  return locales[locale as keyof typeof locales];
};

export { useTranslate };
