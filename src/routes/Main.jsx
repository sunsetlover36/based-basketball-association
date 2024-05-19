import { useNavigate } from 'react-router-dom';

import { useDialog } from '@/store';
import { Button } from '@/components';

export const Main = () => {
  const navigate = useNavigate();
  const { toggle: toggleTeamDialog } = useDialog('teamDialog');
  const { toggle: toggleTraitsDialog } = useDialog('traitsDialog');

  const paragraphClassName =
    'text-sm sm:text-base lg:text-lg 2xl:text-xl w-[90%] sm:w-[75%] lg:w-[60%] 2xl:w-[55%] mx-auto mt-2 !leading-5 2xl:!leading-7';

  return (
    <div>
      <div className="text-center uppercase">
        <video
          autoPlay
          loop
          muted
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          className="w-32 sm:w-40 md:w-48 2xl:w-auto mx-auto mb-2"
        >
          <source src="/player.mp4" type="video/mp4" />
        </video>
        <h1 className="px-8 leading-6 text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl text-blue-600">
          Based Basketball Association
        </h1>
        <p className={paragraphClassName}>
          Based Basketball Association is a basketball coach career simulator.
        </p>
        <p className={paragraphClassName}>
          Build your dream team, starting from your hood, to&nbsp;dominate the
          street courts and then take over the whole basketball world.
        </p>
        <p className={paragraphClassName}>
          Each player will receive <span className="text-blue-600">1</span>{' '}
          random pack out of&nbsp;
          <span className="text-blue-600">3333</span>, containing{' '}
          <span className="text-blue-600">3</span>&nbsp;basketball enthusiasts
          from your hood, whom you&rsquo;ll gather for the upcoming games.
        </p>
        <p className={paragraphClassName}>
          Lead your squad to&nbsp;the title of&nbsp;the best team in&nbsp;the
          world in&nbsp;the thrilling gameplay of&nbsp;Based Basketball.
        </p>
      </div>

      <div className="flex justify-center items-center mt-8">
        <Button onClick={() => navigate('/mint')}>Mint</Button>
      </div>
      <div className="flex justify-center items-center mt-4">
        <Button
          variant="ghost"
          onClick={() => window.open('/BBA_Based_Paper.pdf', '_blank')}
        >
          Based Paper
        </Button>
        <Button
          variant="ghost"
          onClick={() => toggleTraitsDialog(true)}
          className="mx-4"
        >
          Traits
        </Button>
        <Button variant="ghost" onClick={() => toggleTeamDialog(true)}>
          Team
        </Button>
      </div>
    </div>
  );
};