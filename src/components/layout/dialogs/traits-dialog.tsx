import { useDialog } from '@/store';
import { Modal } from '@/components';
import { DialogName } from '@/store/ui/types';

export const TraitsDialog = () => {
  const { isOpen, toggle } = useDialog(DialogName.TRAITS_DIALOG);

  return (
    <Modal
      showModal={isOpen}
      close={() => {
        toggle(false);
      }}
      title="Traits"
      className="sm:max-w-[90%] 2xl:max-w-[50%]"
      fixedButton
    >
      <h2 className="text-xl font-bold mb-2 text-blue-600">
        Core Physical and Technical&nbsp;Attributes
      </h2>
      <ul className="list-disc pl-5 mb-4">
        <li>
          <strong>Shooting</strong> - shooting accuracy, shooting speed,
          three-point shooting.
        </li>
        <li>
          <strong>Dribbling</strong> - ability to&nbsp;control the ball and
          maneuver around opponents.
        </li>
        <li>
          <strong>Passing</strong> - ability to&nbsp;accurately pass the ball.
        </li>
        <li>
          <strong>Blocking</strong> - ability to&nbsp;block the ball.
        </li>
        <li>
          <strong>Stealing</strong> - ability to&nbsp;steal the ball.
        </li>
        <li>
          <strong>Strength</strong> - physical strength.
        </li>
        <li>
          <strong>Speed</strong> - quickness and agility on&nbsp;the court.
        </li>
        <li>
          <strong>Stamina</strong> - indicates the player&rsquo;s fatigue.
          If&nbsp;stamina drops to&nbsp;0, the player needs to&nbsp;rest before
          he can continue playing.
        </li>
        <li>
          <strong>Injury</strong> - health status, can be&nbsp;either &laquo;Not
          Injured&raquo; or&nbsp;&laquo;Injured for{' '}
          <span className="text-blue-600">X</span> days&raquo;.
        </li>
      </ul>

      <h2 className="text-xl font-bold mb-2 text-blue-600">
        Mental Attributes
      </h2>
      <ul className="list-disc pl-5 mb-4">
        <li>
          <strong>Determination</strong> - ability to&nbsp;stay focused and
          pursue goals despite obstacles. Increases with each game and practice.
        </li>
        <li>
          <strong>Reaction Time</strong> - speed in reacting
          to&nbsp;opponents&rsquo; actions.
        </li>
      </ul>

      <h2 className="text-xl font-bold mb-2 text-blue-600">Special Traits</h2>

      <h3 className="text-lg font-semibold mb-2 text-green-600">
        Positive Traits
      </h3>
      <ul className="list-disc pl-5 mb-4">
        <li>
          <strong>Clutch Player</strong> - excels in&nbsp;the final minutes
          of&nbsp;the game when it’s crucial to&nbsp;win.
        </li>
        <li>
          <strong>Playmaker</strong> - knows how to&nbsp;create winning
          situations and has excellent dribbling skills.
        </li>
        <li>
          <strong>Energizer</strong> - after a&nbsp;successful shot, has
          a&nbsp;chance to boost teammates&rsquo; attributes.
        </li>
        <li>
          <strong>Sharpshooter</strong> - high likelihood of&nbsp;making
          three-point shots.
        </li>
        <li>
          <strong>Gladiator</strong> - can steal the ball with 100% certainty,
          even against better opponents.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mb-2 text-gray-600">
        Neutral Traits
      </h3>
      <ul className="list-disc pl-5 mb-4">
        <li>
          <strong>Critic</strong> - can either boost or&nbsp;lower
          teammates&rsquo; attributes during the game.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mb-2 text-red-600">
        Negative Traits
      </h3>
      <ul className="list-disc pl-5 mb-4">
        <li>
          <strong>Crumbler</strong> - more likely to&nbsp;crack under pressure,
          significantly reducing performance during the game.
        </li>
        <li>
          <strong>Fragile</strong> - higher chance of&nbsp;getting injured.
        </li>
        <li>
          <strong>Hothead</strong> - plays very aggressively, which can lead
          to&nbsp;frequent fouls.
        </li>
        <li>
          <strong>Lone Wolf</strong> - plays for themselves and does not pass
          the ball to&nbsp;teammates.
        </li>
        <li>
          <strong>Turtle</strong> - has slow reactions and is&nbsp;easily
          outmaneuvered by&nbsp;opponents.
        </li>
      </ul>
    </Modal>
  );
};
