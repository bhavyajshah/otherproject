//Utils
import * as locales from "@/utils/locales";

const getTranslate = (selectedLanguage: string) => {
  return locales[selectedLanguage.toLowerCase() as keyof typeof locales];
};

export default getTranslate;
