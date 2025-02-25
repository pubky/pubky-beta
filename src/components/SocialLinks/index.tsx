import { Icon } from '@social/ui-shared';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SocialLinks({ ...rest }: SocialLinksProps) {
  const baseCSS = 'h-6 justify-start items-start gap-6 inline-flex';
  return (
    <div className={twMerge(baseCSS, rest.className)}>
      <Link
        target="_blank"
        href="https://github.com/pubky"
        className="cursor-pointer opacity-30 hover:opacity-100"
      >
        <Icon.Github size="24" />
      </Link>
      <Link
        target="_blank"
        href="https://x.com/getpubky"
        className="cursor-pointer opacity-30 hover:opacity-100"
      >
        <Icon.Twitter size="24" />
      </Link>
      <Link
        target="_blank"
        href="https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg"
        className="cursor-pointer opacity-30 hover:opacity-100"
      >
        <Icon.Youtube width="24" height="24" />
      </Link>
      <Link
        target="_blank"
        href="https://medium.com/pubky"
        className="cursor-pointer opacity-30 hover:opacity-100"
      >
        <Icon.Medium size="24" />
      </Link>
    </div>
  );
}
