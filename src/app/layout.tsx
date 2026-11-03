import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

// DM Sans para texto, labels e botões; Bricolage Grotesque só nos títulos.
// O next/font hospeda os arquivos junto com o app (sem request ao Google em
// runtime) e expõe cada fonte como variável CSS, usada no @theme do globals.css.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: {
    default: "Bee Productive",
    template: "%s | Bee Productive",
  },
  description: "Um favo, um check. Tarefas feitas, colmeia feliz.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TRPCReactProvider>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
