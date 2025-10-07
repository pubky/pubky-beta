import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function InviteRedirectPage({ params }: PageProps) {
  const { code } = await params;

  const cleaned = (code || '').toUpperCase();
  const formatted = cleaned.includes('-') ? cleaned : cleaned.replace(/(.{4})(?=.)/g, '$1-');

  redirect(`/onboarding/sign-up?token=${encodeURIComponent(formatted)}`);
}
