import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const SPECIAL_TRAITS_MAP = {
  Selfish: -1,
  'Lone Wolf': -1,
  Fragile: -1,
  Crumbler: -1,
  Hothead: -1,
  Critic: 0,
  'Clutch Player': 1,
  Energizer: 1,
  Playmaker: 1,
  Sharpshooter: 1,
  Gladiator: 1,
};
export const formatIndexToPos = (i) => {
  switch (i) {
    case 0:
      return 'Forward';
    case 1:
      return 'Left Defender';
    case 2:
      return 'Right Defender';
    default:
      return '';
  }
};

export const formatMood = (mood) => {
  let title;
  let description;

  if (mood >= 30 && mood <= 70) {
    title = 'Balance';
    description = 'A balanced style of play.';
  } else if (mood < 30) {
    title = 'Defense';
    description = 'A defensive style of play.';
  } else if (mood > 70) {
    title = 'Offense';
    description = 'An offensive style of play.';
  }

  return { title, description };
};
export const formatAggression = (aggression) => {
  let title;
  let description;

  if (aggression >= 30 && aggression <= 70) {
    title = 'Medium';
    description = 'Balanced approach.';
  } else if (aggression < 30) {
    title = 'Low';
    description = 'Minimum fouls, low risk of injuries.';
  } else if (aggression > 70) {
    title = 'High';
    description =
      'High risk of fouls and injuries, but strong pressure on the opponent.';
  }

  return { title, description };
};
