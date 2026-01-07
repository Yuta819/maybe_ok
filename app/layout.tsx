import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "たぶん大丈夫仕分け（クエスト搭載版）",
  description: "日常の不安を仕分けて、1分クエストで軽い達成を積むアプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
