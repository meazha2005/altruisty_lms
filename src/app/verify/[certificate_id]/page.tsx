import { redirect } from 'next/navigation';

export default async function VerifyShortRedirect({
  params,
}: {
  params: Promise<{ certificate_id: string }>;
}) {
  const { certificate_id } = await params;
  redirect(`/verify-certificate/${encodeURIComponent(certificate_id)}`);
}
