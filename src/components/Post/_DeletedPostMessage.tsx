import { Typography } from '@social/ui-shared';

interface DeletedPostMessageProps {
  className?: string;
}

export default function DeletedPostMessage({ className }: DeletedPostMessageProps) {
  return (
    <div className={`px-6 py-2 bg-white bg-opacity-10 rounded-lg ${className}`}>
      <Typography.Body variant="small" className="text-opacity-50">
        This post has been deleted by its author.
      </Typography.Body>
    </div>
  );
}
