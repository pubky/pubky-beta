'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentLink from '../Modal/_Link/_Content';
import { Links } from '@/types/Post';

interface LinkProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setLinks: any;
  links: Links[];
  title?: string;
  className?: string;
}

export default function Link({ show, setShow, links, setLinks, title, className }: LinkProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Add Profile Link'} className={className}>
      <ContentLink setShowModalLink={setShow} links={links} setLinks={setLinks} />
    </BottomSheet.Root>
  );
}
