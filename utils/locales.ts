export { default as ru } from "@/locales/ru.json";
export { default as en } from "@/locales/en.json";
export { default as tr } from "@/locales/tr.json";


// // We enumerate all dictionaries here for better linting and typescript support
// // We also get the default import for cleaner types
// const dictionaries = {
//   en: () => import("../locales/en.json").then((module) => module.default),
//   tr: () => import("../locales/tr.json").then((module) => module.default),
//   ru: () => import("../locales/ru.json").then((module) => module.default),
// };

// export const getDictionary = (locale: string) =>
//  dictionaries[locale]?.() ?? dictionaries.en();