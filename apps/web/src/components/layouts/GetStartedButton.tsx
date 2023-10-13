'use client';

import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GetStartedButton() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const hidden = pathname === '/login';

  return (
    <Link
      href="/login"
      className={`border-foreground/10 bg-foreground/10 hover:bg-foreground/5 rounded-full border px-4 py-1 transition duration-300 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {t('common:get-started')}
    </Link>
  );
}
