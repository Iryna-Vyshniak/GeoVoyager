import AnimatedSpace from '@/components/animated-space';
import Stars from '@/scenes/stars';
import MainContainer from '@/components/main-container';

export default function Home() {
  return (
    <main className='relative grid place-items-center items-center justify-items-center w-full h-full remove-scrollbar overflow-hidden'>
      <div className='fixed inset-0 -z-10 w-screen h-screen pointer-events-auto'>
        <AnimatedSpace>
          <Stars />
        </AnimatedSpace>
      </div>
      <MainContainer />
    </main>
  );
}
