import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { intervalToDuration } from 'date-fns';
import { base as twBase, baseSepolia as twBaseSepolia } from 'thirdweb/chains';
import { base, baseSepolia } from 'viem/chains';

import { PlayerTraits, PlayerSpecialTrait, PlayerTrainingMode } from '@/types';

export const IS_PROD = import.meta.env.VITE_VERCEL_ENV === 'production';
export const IS_DEV = import.meta.env.VITE_VERCEL_ENV === 'development';

export const APP_THIRDWEB_CHAIN = IS_PROD ? twBase : twBaseSepolia;
export const APP_VIEM_CHAIN = IS_PROD ? base : baseSepolia;
export const isValidChain = (chainId?: number) =>
  chainId === APP_THIRDWEB_CHAIN.id;

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const TRAINING_MODE_MAP = {
  [PlayerTrainingMode.ATTACK]: {
    label: 'Attack',
    emoji: '🏀',
  },
  [PlayerTrainingMode.DEFENSE]: {
    label: 'Defense',
    emoji: '🛡️',
  },
  [PlayerTrainingMode.MEDITATION]: {
    label: 'Meditation',
    emoji: '🧘',
  },
  [PlayerTrainingMode.CARDIO]: {
    label: 'Cardio',
    emoji: '🏃',
  },
  [PlayerTrainingMode.STRENGTH]: {
    label: 'Strength',
    emoji: '💪',
  },
};
export const SPECIAL_TRAITS_IMPACT = {
  [PlayerSpecialTrait.SELFISH]: -1,
  [PlayerSpecialTrait.LONE_WOLF]: -1,
  [PlayerSpecialTrait.FRAGILE]: -1,
  [PlayerSpecialTrait.CRUMBLER]: -1,
  [PlayerSpecialTrait.HOTHEAD]: -1,
  [PlayerSpecialTrait.CRITIC]: 0,
  [PlayerSpecialTrait.CLUTCH_PLAYER]: 1,
  [PlayerSpecialTrait.ENERGIZER]: 1,
  [PlayerSpecialTrait.PLAYMAKER]: 1,
  [PlayerSpecialTrait.SHARPSHOOTER]: 1,
  [PlayerSpecialTrait.GLADIATOR]: 1,
};
export const SPECIAL_TRAITS_MAP = {
  [PlayerSpecialTrait.SELFISH]: 'Selfish',
  [PlayerSpecialTrait.LONE_WOLF]: 'Lone Wolf',
  [PlayerSpecialTrait.FRAGILE]: 'Fragile',
  [PlayerSpecialTrait.CRUMBLER]: 'Crumbler',
  [PlayerSpecialTrait.HOTHEAD]: 'Hot Head',
  [PlayerSpecialTrait.CRITIC]: 'Critic',
  [PlayerSpecialTrait.CLUTCH_PLAYER]: 'Clutch Player',
  [PlayerSpecialTrait.ENERGIZER]: 'Energizer',
  [PlayerSpecialTrait.PLAYMAKER]: 'Playmaker',
  [PlayerSpecialTrait.SHARPSHOOTER]: 'Sharpshooter',
  [PlayerSpecialTrait.GLADIATOR]: 'Gladiator',
};
export const TRAITS_MAP: Record<keyof PlayerTraits, string> = {
  shooting: 'Shooting',
  dribbling: 'Dribbling',
  passing: 'Passing',
  blocking: 'Blocking',
  stealing: 'Stealing',
  speed: 'Speed',
  strength: 'Strength',
  stamina: 'Stamina',
  injury: 'Injury',
  determination: 'Determination',
  reactionTime: 'Reaction Time',
  specialTraits: 'Special Traits',
};

export const formatIndexToPos = (i: number) => {
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

export const formatMood = (mood: number) => {
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
export const formatAggression = (aggression: number) => {
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

export const shortenAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

export const formatToDuration = (startDate: string, endDate?: string) => {
  if (!endDate) {
    return '';
  }

  const duration = intervalToDuration({
    start: new Date(startDate),
    end: new Date(endDate),
  });

  const parts = [];
  if (duration.days) parts.push(`${duration.days} d`);
  if (duration.hours)
    parts.push(`${duration.hours} ${duration.hours > 1 ? 'hrs' : 'hr'}`);
  if (duration.minutes) parts.push(`${duration.minutes} min`);
  if (duration.seconds) parts.push(`${duration.seconds} sec`);

  // If both days and hours are zero, show only minutes
  if (parts.length === 0 && duration.minutes === 0) {
    parts.push(`0m`);
  }

  return parts.join(' ');
};
