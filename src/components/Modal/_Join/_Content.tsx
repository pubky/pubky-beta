'use client';

import { Button, Card, Icon, Typography } from '@social/ui-shared';
import Link from 'next/link';

interface ContentJoinProps {
  closeJoin: any;
}

export default function ContentJoin({ closeJoin }: ContentJoinProps) {
  return (
    <>
      <Typography.Body className="text-opacity-80 my-4" variant="medium-light">
        Enjoying Pubky? Creating an account is easy as one, two, three.
      </Typography.Body>
      <div className="flex flex-col sm:flex-row gap-6">
        <Card.Primary title="New here?" text="Join by scanning a QR with Bitkit, or by creating a new pubky.">
          <div className="flex justify-center items-center my-10">
            <Icon.UserPlus size="128" />
          </div>
          <Link href="/onboarding/sign-in">
            <Button.Large id="backup-recovery-phrase-btn" onClick={closeJoin} icon={<Icon.UserPlus size="16" />}>
              Join Pubky
            </Button.Large>
          </Link>
        </Card.Primary>
        <Card.Primary title="Sign in" text="Already have an account? Sign in to interact with Pubky.">
          <div className="flex justify-center items-center my-10">
            <Icon.Key size="128" />
          </div>
          <Link href="/sign-in">
            <Button.Large id="backup-recovery-file-btn" onClick={closeJoin} icon={<Icon.Key size="16" />}>
              Sign in
            </Button.Large>
          </Link>
        </Card.Primary>
      </div>
    </>
  );
}
