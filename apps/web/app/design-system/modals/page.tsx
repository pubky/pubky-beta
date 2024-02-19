'use client';

import { Button, Modal } from '@social/ui-shared';

export default async function Index() {
  return (
    <div className="flex-1 w-full h-screen bg-black p-10">
      <div className={'pb-8'}>
        <Button.Create ModalComponent={Modal.CreatePost} />
      </div>
    </div>
  );
}
