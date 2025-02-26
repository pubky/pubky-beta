import { Icon, Tooltip } from '@social/ui-shared';

interface CheckedPostProps {
  cached: string;
}

export default function CheckedPost({ cached }: CheckedPostProps) {
  return (
    <Tooltip.Main className="cursor-default min-w-[250px] translate-y-[0px] p-4">
      <div className="flex items-start gap-2 mb-1">
        <Icon.Check size="16" color="#00BA7C" opacity={1} className="mt-0.5" />
        <div>
          <p className="leading-tight text-neutral-50">Saved in Homeserver</p>
          <p className="text-xs text-neutral-400">Available in your storage</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Icon.Check
          size="16"
          color={cached === 'nexus' || cached === undefined ? '#00BA7C' : '#A3A3A3'}
          opacity={cached === 'nexus' || cached === undefined ? 1 : 0.5}
          className="mt-0.5"
        />
        <div>
          <p className="leading-tight text-neutral-50">
            {cached === 'nexus' || cached === undefined ? 'Indexed in Nexus' : 'Indexing in Nexus'}
          </p>
          <p className="text-xs text-neutral-400">Available for searches</p>
        </div>
      </div>
    </Tooltip.Main>
  );
}
