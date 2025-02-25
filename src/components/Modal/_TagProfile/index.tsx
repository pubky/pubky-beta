import { Modal } from '@social/ui-shared';
import { UserTags, UserView } from '@/types/User';
import ContentProfileTag from './_Content';

interface ProfileTagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  profileTags: UserTags[];
  handleAddProfileTag: (tag: string) => void;
  handleDeleteProfileTag: (tag: string) => void;
  pubkyUser?: string;
  user?: UserView | null;
}

export default function ProfileTag({
  showModal,
  setShowModal,
  profileTags,
  handleAddProfileTag,
  handleDeleteProfileTag,
  pubkyUser,
  user,
}: ProfileTagProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => {
        setShowModal(false);
      }}
      className="md:w-[792px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        id="close-btn"
        onClick={() => {
          setShowModal(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <Modal.Header title={`Tag ${user?.details?.name}`} />
        <Modal.Content className="w-full flex flex-row">
          <ContentProfileTag
            profileTags={profileTags}
            handleAddProfileTag={handleAddProfileTag}
            handleDeleteProfileTag={handleDeleteProfileTag}
            pubkyUser={pubkyUser}
            user={user}
          />
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
