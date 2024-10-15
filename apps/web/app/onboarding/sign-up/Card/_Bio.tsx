import { Card, Input } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';

interface Errors {
  name: string;
  bio: string;
}

interface BioProps {
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  errors: Errors;
  loading?: boolean;
}

export default function Bio({ bio, setBio, errors, loading }: BioProps) {
  return (
    <Card.Primary className="justify-start gap-4" title="Profile">
      <div>
        <Input.Label value="Short bio" />
        <Card.Primary
          background="bg-transparent"
          className="border border-white border-opacity-30 border-dashed mt-2"
        >
          <Input.TextArea
            placeholder="Short bio. Tell a bit about yourself."
            className="h-[240px]"
            id="onboarding-bio-input"
            defaultValue={bio ? bio : ''}
            disabled={loading}
            maxLength={160}
            error={errors.bio}
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              if (Utils.isValidContent(target.value)) {
                const cleanedBio = Utils.cleanText(target.value);
                setBio(cleanedBio);
              } else {
                setBio('');
              }
            }}
          />
        </Card.Primary>
      </div>
    </Card.Primary>
  );
}
