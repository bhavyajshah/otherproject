import getTranslate from "@/utils/translate";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const language = cookies()?.get("selectedLanguage")?.value;
  const selectedLanguage = language ? language : "en";
  return {
    title: getTranslate(selectedLanguage).titleCart,
    description: getTranslate(selectedLanguage).descriptionCart,
  };
}

export default function BasketLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        {children}
      </>
  );
}