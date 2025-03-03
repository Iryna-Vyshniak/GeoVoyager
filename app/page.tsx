import AnimatedSpace from '@/components/animated-space';
import MainContainer from '@/components/main-container';

export default function Home() {
  return (
    <div className='relative w-screen min-h-screen overflow-hidden'>
      <AnimatedSpace />
      <main className='w-screen h-screen remove-scrollbar'>
        <MainContainer />
      </main>
    </div>
  );
}
