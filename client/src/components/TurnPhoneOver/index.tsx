import React from 'react';

import turn_the_phone_over from '@/assets/turn_the_phone_over.gif';

export function TurnPhoneOver() {
  return (
    <div className="fixed left-[0] top-[0] z-[1000000] h-full w-full bg-black">
      <img
        className="absolute left-[0] top-[0] h-full w-full object-contain"
        src={turn_the_phone_over}
        alt="Поверните свой телефон"
      />
    </div>
  );
}
