import { useDialog } from '@/store';
import { Modal } from '@/components';

export const TraitsDialog = () => {
  const { isOpen, toggle } = useDialog('traitsDialog');

  return isOpen ? (
    <Modal
      showModal={isOpen}
      setShowModal={toggle}
      title="Traits"
      className="sm:max-w-[90%] 2xl:max-w-[50%]"
    >
      <h2 class="text-xl font-bold mb-4 text-blue-600">
        Core Physical and Technical Attributes:
      </h2>
      <ul class="list-disc pl-5 mb-4">
        <li>
          <strong>Shooting Accuracy</strong> - ability to accurately shoot the
          ball into the basket.
        </li>
        <li>
          <strong>Shooting Speed</strong> - The time it takes for the player to
          make a shot.
        </li>
        <li>
          <strong>Dribbling Skill</strong> - ability to control the ball and
          maneuver around opponents.
        </li>
        <li>
          <strong>Three-Point Shooting</strong> - ability to accurately shoot
          from beyond the three-point line.
        </li>
        <li>
          <strong>Blocking Skill</strong> - ability to block opponents' shots.
        </li>
        <li>
          <strong>Stealing Skill</strong> - ability to steal the ball from
          opponents.
        </li>
        <li>
          <strong>One-on-One Play</strong> - ability to beat or defend against a
          single opponent.
        </li>
        <li>
          <strong>Strength</strong> - physical strength, important for battles
          under the basket.
        </li>
        <li>
          <strong>Speed</strong> - quickness and agility on the court.
        </li>
        <li>
          <strong>Jumping Ability</strong> - vertical leap.
        </li>
        <li>
          <strong>Passing Accuracy</strong> - ability to accurately pass the
          ball.
        </li>
        <li>
          <strong>Reaction Time</strong> - speed in reacting to opponents'
          actions.
        </li>
        <li>
          <strong>Rebounding Skill</strong> - ability to grab rebounds after
          missed shots.
        </li>
        <li>
          <strong>Stamina</strong> - ability to maintain a high level of energy
          throughout the game.
        </li>
        <li>
          <strong>Injury</strong> - health status, can be either "Not Injured"
          or "Injured for X days".
        </li>
      </ul>

      <h2 class="text-xl font-bold mb-4 text-blue-600">Mental Attributes:</h2>
      <ul class="list-disc pl-5 mb-4">
        <li>
          <strong>Determination</strong> - ability to stay focused and pursue
          goals despite obstacles. Increases with each game and practice.
        </li>
      </ul>

      <h2 class="text-xl font-bold mb-4 text-blue-600">Special Traits:</h2>

      <h3 class="text-lg font-semibold mb-2 text-green-600">
        Positive Traits:
      </h3>
      <ul class="list-disc pl-5 mb-4">
        <li>
          <strong>Clutch Player</strong> - Excels in the final minutes of the
          game when it’s crucial to win.
        </li>
        <li>
          <strong>Playmaker</strong> - Knows how to create winning situations
          and has excellent dribbling skills.
        </li>
        <li>
          <strong>Energizer</strong> - After a successful shot, has a chance to
          boost teammates' attributes.
        </li>
        <li>
          <strong>Sharpshooter</strong> - High likelihood of making three-point
          shots.
        </li>
        <li>
          <strong>Gladiator</strong> - Can steal the ball with 100% certainty,
          even against better opponents.
        </li>
      </ul>

      <h3 class="text-lg font-semibold mb-2 text-gray-600">Neutral Traits:</h3>
      <ul class="list-disc pl-5 mb-4">
        <li>
          <strong>Critic</strong> - Can either boost or lower teammates'
          attributes during the game.
        </li>
      </ul>

      <h3 class="text-lg font-semibold mb-2 text-red-600">Negative Traits:</h3>
      <ul class="list-disc pl-5 mb-4">
        <li>
          <strong>Crumbler</strong> - More likely to crack under pressure,
          significantly reducing performance during the game.
        </li>
        <li>
          <strong>Fragile</strong> - Higher chance of getting injured.
        </li>
        <li>
          <strong>Hothead</strong> - Plays very aggressively, which can lead to
          frequent fouls.
        </li>
        <li>
          <strong>Lone Wolf</strong> - Plays for themselves and does not pass
          the ball to teammates.
        </li>
        <li>
          <strong>Turtle</strong> - Has slow reactions and is easily
          outmaneuvered by opponents.
        </li>
      </ul>
    </Modal>
  ) : null;
};
