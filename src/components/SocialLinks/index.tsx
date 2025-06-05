import { Icon } from '@social/ui-shared';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  colorIcon?: string;
  classNameIcon?: string;
}

export default function SocialLinks({ colorIcon = 'white', classNameIcon, ...rest }: SocialLinksProps) {
  const baseIconCSS = twMerge('cursor-pointer opacity-30 hover:opacity-100', classNameIcon);
  const baseCSS = 'h-6 justify-start items-start gap-6 inline-flex';
  return (
    <div className={twMerge(baseCSS, rest.className)}>
      <Link target="_blank" href="https://github.com/pubky" className={baseIconCSS}>
        <Icon.Github size="24" color={colorIcon} />
      </Link>
      <Link target="_blank" href="https://x.com/getpubky" className={baseIconCSS}>
        <Icon.Twitter size="24" color={colorIcon} />
      </Link>
      <Link target="_blank" href="https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg" className={baseIconCSS}>
        <Icon.Youtube width="24" height="24" color={colorIcon} />
      </Link>
      <Link target="_blank" href="https://medium.com/pubky" className={baseIconCSS}>
        <Icon.Medium size="24" color={colorIcon} />
      </Link>
    </div>
  );
}
