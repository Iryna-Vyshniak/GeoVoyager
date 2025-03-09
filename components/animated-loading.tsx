import React from 'react';

const AnimatedLoading = ({ progress }: { progress: number }) => {
  return (
    <div className='absolute inset-0 flex items-center justify-center bg-transparent z-[100]'>
      <div className='p-4 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4'>
        {/* Флоатінг-лейбл з динамічним позиціонуванням */}
        <div
          className='inline-block mb-2 py-0.5 px-1.5 bg-primary/10 border border-primary/50 text-xs font-medium text-primary rounded-lg dark:bg-primary/20 dark:border-primary/60 dark:text-primary'
          style={{ marginLeft: `calc(${progress}% - 20px)` }}
        >
          {progress}%
        </div>

        {/* Кастомний прогрес-бар */}
        <div
          className='flex w-64 h-2 bg-white/50 rounded-full overflow-hidden dark:bg-neutral-700'
          role='progressbar'
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className='flex flex-col justify-center rounded-full overflow-hidden bg-blue-800 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className='text-primary mt-2'>Loading Earth...</p>
      </div>
    </div>
  );
};

export default AnimatedLoading;
