'use client';

import React, { ReactNode, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { usePathname } from 'next/navigation';

const AnimatedWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [springProps, api] = useSpring(() => ({
    opacity: 0,
    transform: 'scale(0.5)',
    config: { mass: 1, tension: 250, friction: 20 },
  }));

  // Запускаємо анімацію щоразу, коли компонент монтується або змінюється маршрут
  useEffect(() => {
    // api.start примусово скидає анімацію до початкового стану (from) і запускає її до кінцевого стану (to), гарантуючи, що ефект завжди спрацьовує
    api.start({
      from: { opacity: 0, transform: 'scale(0.5)' },
      to: { opacity: 1, transform: 'scale(1)' },
    });
  }, [api, pathname]);

  return (
    <animated.div style={springProps} className='flex items-center justify-end w-screen h-screen'>
      {children}
    </animated.div>
  );
};

export default AnimatedWrapper;
