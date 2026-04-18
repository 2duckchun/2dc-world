import Script from "next/script"
import { THEME_STORAGE_KEY } from "./constants"

const themeScript = `(function(){
  const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(storageKey);
  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
})();`

export function ThemeScript() {
  return (
    <Script id="theme-script" strategy="beforeInteractive">
      {themeScript}
    </Script>
  )
}
