'use client';

import React, { ReactNode, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

import { usePlaceModalController } from '@/shared/hooks/usePlaceModalController';

const Modal = ({ children }: { children: ReactNode }) => {
  const { isOpenModal, open, setIsOpenModal } = usePlaceModalController();

  useEffect(() => {
    open();
    return () => {
      setIsOpenModal(false);
    };
  }, []);

  const modalSpring = useSpring({
    opacity: isOpenModal ? 1 : 0,
    scale: isOpenModal ? 1 : 0,
    config: { mass: 1, tension: 250, friction: 20 },
  });

  return (
    <>
      {isOpenModal && (
        <animated.section
          style={modalSpring}
          className='relative inset-0 overflow-hidden w-screen h-screen remove-scrollbar'
        >
          {children}
        </animated.section>
      )}
    </>
  );
};

export default Modal;
