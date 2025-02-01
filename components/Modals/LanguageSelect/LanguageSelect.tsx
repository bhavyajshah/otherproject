"use client";
//Global
import React, { FC, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams  } from "next/navigation";
//Hooks
import { useTypedSelector } from "@/hooks/useReduxHooks";
import { useLanguage } from "@/hooks/useLanguage";
//Images
import rus from "@/public/rus.png";
import tur from "@/public/tur.png";
import eng from "@/public/eng.png";
//Components
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
//Cookies
import { getCookie, setCookie } from "cookies-next";
//Styles
import "./LanguageSelect.scss";
import { useLocale } from "next-intl";

const LanguageSelect: FC<{ color: string }> = ({ color }) => {
  const { refresh } = useRouter();
  // const { changeSelectedLanguage } = useLanguage();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const flags = ["RU", "TR", "EN"];
  const locale = useLocale();
  const onChangeLanguage = (language: string) => {
    // setCookie("selectedLanguage", language);
    language = language.toLowerCase(); 
    if(! pathname) return;

    const newPath = `/${language}${pathname.replace(/^\/[a-z]{2}/, '')}`;
    const searchParamsString = searchParams.toString();
    const fullPath = searchParamsString ? `${newPath}?${searchParamsString}` : newPath;
    router.push(fullPath);
    // refresh();
  };

  const returnImageByState = (language: string) => {
    language = language.toUpperCase();
    switch (language) {
      case "RU":
        return rus;
      case "TR":
        return tur;
      default:
        return eng;
    }
  };

  const renderAllFlags = () => (
    flags.map(flag => (
      <DropdownItem
        key={flag}
        startContent={
          <Image src={returnImageByState(flag)} alt={flag} width={24} />
        }
      >
        {flag}
      </DropdownItem>
    ))
  );

  // useEffect(() => {
  //   const language = getCookie("selectedLanguage");
  //   if (language) changeSelectedLanguage(language);
  // }, [changeSelectedLanguage]);

  return (
    <Dropdown classNames={{ content: "dropdown-content" }} isKeyboardDismissDisabled>
      <DropdownTrigger>
        <Button variant="light" style={{ padding: 0, color }}>
          <Image
            src={returnImageByState(locale)}
            alt={locale}
            width={24}
            height={18}
          />
          {locale.toUpperCase()}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        //@ts-ignore
        onSelectionChange={keys => onChangeLanguage(keys.anchorKey)}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[locale.toUpperCase()]}
        classNames={{ base: "dropdown-content" }}
      >
        {renderAllFlags()}
      </DropdownMenu>
    </Dropdown>
  );
};

export { LanguageSelect };
