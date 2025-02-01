import getTranslate from "@/utils/translate";
import { cookies } from "next/headers";

export async function generateMetadata() {
  const language = cookies()?.get("selectedLanguage")?.value;
  const selectedLanguage = language ? language : "en";
  return {
    title: getTranslate(selectedLanguage).titlePayment,
    description: getTranslate(selectedLanguage).descriptionPayment,
  };
}

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        {children}
      </>
  );
}