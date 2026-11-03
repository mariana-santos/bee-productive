import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "./logo";
import { NewTaskLink } from "./new-task-link";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-ink no-underline">
          <Logo />
        </Link>
        <Suspense fallback={null}>
          <NewTaskLink />
        </Suspense>
      </div>
    </header>
  );
}
