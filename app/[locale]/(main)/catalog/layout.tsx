import getTranslate from "@/utils/translate";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const language = cookies()?.get("NEXT_LOCALE")?.value?.toLowerCase();
  const selectedLanguage = language ? language : "en";
  return {
    title: getTranslate(selectedLanguage).titleCatalog,
    description: getTranslate(selectedLanguage).descriptionCatalog,
  };
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        {children}
      </>
  );
}