import { Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { DropDown } from '@/components/DropDown';
import { TStatus } from '@/types';
import { usePubkyClientContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { BottomSheet } from '@/components';

interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  creatorPubky: string | null | undefined;
  status: TStatus | undefined;
}

export default function Status({ creatorPubky, status }: StatusProps) {
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile();

  const extractEmojiAndText = (status: string) => {
    const emojiRegex =
      /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})(\p{Emoji_Modifier})?/gu;
    const emojiMatch = status.match(emojiRegex);
    if (emojiMatch) {
      const emoji = emojiMatch[0];
      const text = status.replace(emoji, '').trim();
      return { emoji, text };
    }
    return { emoji: '', text: status };
  };

  const { emoji, text } = status
    ? extractEmojiAndText(status)
    : { emoji: '', text: '' };

  return (
    <>
      {!creatorPubky || creatorPubky === pubky ? (
        <div className="flex flex-col justify-center items-center">
          {status ? (
            <>
              {isMobile ? (
                <BottomSheet.Status status={status} />
              ) : (
                <DropDown.Status status={status} />
              )}
            </>
          ) : (
            <Typography.Body className="text-opacity-50" variant="small">
              Loading Status...
            </Typography.Body>
          )}
        </div>
      ) : (
        status &&
        status !== 'noStatus' && (
          <Typography.Body
            className="text-xl font-light font-InterTight leading-7 tracking-wide"
            variant="medium"
          >
            {emoji && (
              <>
                {emoji} {text}
              </>
            )}
            {!emoji && (
              <>
                {
                  Utils.statusHelper.emojis[
                    status as keyof typeof Utils.statusHelper.emojis
                  ]
                }{' '}
                {
                  Utils.statusHelper.labels[
                    status as keyof typeof Utils.statusHelper.labels
                  ]
                }
              </>
            )}
          </Typography.Body>
        )
      )}
    </>
  );
}
