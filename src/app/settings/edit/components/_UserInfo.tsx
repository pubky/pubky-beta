import { Input, Typography } from '@social/ui-shared';

interface Errors {
  name: string;
  bio: string;
}

interface UserInfoProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handler: string | undefined;
  errors: Errors;
  loading: boolean;
}

export default function UserInfo({ name, setName, handler, errors, loading }: UserInfoProps) {
  return (
    <>
      <Input.Cursor
        id="edit-profile-name-input"
        placeholder="Your Name"
        className="h-auto text-[40px] font-bold sm:text-[64px] placeholder:text-opacity-30"
        defaultValue={name}
        disabled={loading}
        maxLength={24}
        autoCorrect="off"
        error={errors.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
      />
      <Typography.H2 variant="light" className="-mt-4 text-opacity-50 break-words">
        {handler}
      </Typography.H2>
    </>
  );
}
