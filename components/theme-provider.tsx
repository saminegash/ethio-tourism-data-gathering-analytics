"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={false}
      themes={["light", "dark", "system"]}
      storageKey="ethio-tourism-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
