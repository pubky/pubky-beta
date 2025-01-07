'use client';

import { createContext, useContext, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import ModalJoin from './_Modal';
import BottomSheetJoin from './_BottomSheet';

interface ContextType {
  openJoin: () => void;
}

const JoinContext = createContext<ContextType>({
  openJoin: () => {},
});

export function JoinProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const openJoin = () => {
    setIsJoinOpen(true);
  };

  return (
    <JoinContext.Provider value={{ openJoin }}>
      {children}
      {isMobile ? (
        <BottomSheetJoin show={isJoinOpen} setShow={setIsJoinOpen} />
      ) : (
        <ModalJoin isJoinOpen={isJoinOpen} setIsJoinOpen={setIsJoinOpen} />
      )}
    </JoinContext.Provider>
  );
}

export function useJoin() {
  return useContext(JoinContext);
}
