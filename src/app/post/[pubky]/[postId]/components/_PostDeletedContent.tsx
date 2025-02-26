import Link from 'next/link';
import { Typography } from '@social/ui-shared';

// Component for Deleted Content
export function DeletedContent() {
  return (
    <div className="ml-4 px-6 py-2 bg-white bg-opacity-10 rounded-lg">
      <Typography.Body variant="small" className="text-opacity-50 text-center">
        This post has been deleted by its author.
        <Link href="/home" className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer">
          Go home
        </Link>
      </Typography.Body>
    </div>
  );
}
