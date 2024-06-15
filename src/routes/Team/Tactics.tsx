import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { Button, Slider, Loader } from '@/components';
import { cn, formatMood, formatAggression } from '@/lib/utils';
// import { updateUser } from '@/lib/api';
import { useUser } from '@/lib/queryClient';
import { queryClient } from '../../lib/queryClient';

const schemes = [
  {
    label: '2-1',
    value: 0,
    description: 'Two players stay in defense, one attacker actively attacks.',
  },
  {
    label: '1-2',
    value: 1,
    description: 'One player stays in defense, two attackers actively attack.',
  },
  {
    label: '3-0',
    value: 2,
    description: 'Three players stay in defense, zero attackers.',
  },
  {
    label: '0-3',
    value: 3,
    description: 'Zero players stay in defense, three attackers.',
  },
];
export const Tactics = () => {
  return null;

  const {
    data: user,
    isFetching: isUserFetching,
    isFetchedAfterMount: isUserFetched,
  } = useUser();

  const [selectedScheme, setSelectedScheme] = useState(0);
  const [selectedMood, setSelectedMood] = useState(50);
  const [selectedAggression, setSelectedAggression] = useState(50);

  const scheme = schemes[selectedScheme];
  const mood = formatMood(selectedMood);
  const aggression = formatAggression(selectedAggression);

  const handleNewTactics = async (values) => {
    await updateUser({
      tactics: {
        ...user.team.tactics,
        ...values,
      },
    });
    await queryClient.invalidateQueries(['user']);
  };

  useEffect(() => {
    if (user) {
      const {
        team: {
          tactics: { scheme, mood, aggressiveness },
        },
      } = user;

      setSelectedScheme(scheme);
      setSelectedMood(mood);
      setSelectedAggression(aggressiveness);
    }
  }, [user]);

  if (!user || (isUserFetching && !isUserFetched)) {
    return <Loader />;
  }

  return (
    <motion.div>
      <h2 className="text-2xl mb-2">Tactics</h2>

      <div className="mb-8">
        <h3 className="text-xl text-slate-600 mb-1">Scheme</h3>

        <div className="flex items-center mb-2">
          {schemes.map((scheme) => {
            const { label, value } = scheme;
            return (
              <div key={value} className="mr-2 last:mr-0">
                <Button
                  className={cn(
                    'bg-white  text-black hover:text-white',
                    selectedScheme === value && 'bg-blue-600 text-white'
                  )}
                  onClick={() => {
                    setSelectedScheme(value);
                    handleNewTactics({ scheme: value });
                  }}
                >
                  {label}
                </Button>
              </div>
            );
          })}
        </div>

        {scheme && (
          <div>
            <h3 className="text-lg text-slate-600">Description</h3>
            <p>{scheme.description}</p>
          </div>
        )}
      </div>

      <div className="flex gap-x-16">
        <div>
          <h3 className="text-xl text-slate-600 mb-1">Game mood</h3>

          <Slider
            defaultValue={[selectedMood]}
            max={100}
            step={1}
            value={[selectedMood]}
            onValueChange={(values) => setSelectedMood(values[0])}
            onValueCommit={(values) => handleNewTactics({ mood: values[0] })}
          />

          <div>
            <h3 className="text-lg text-slate-600">{mood.title}</h3>
            <p className="h-20">{mood.description}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl text-slate-600 mb-1">Aggressiveness</h3>

          <Slider
            defaultValue={[selectedAggression]}
            max={100}
            step={1}
            value={[selectedAggression]}
            onValueChange={(values) => setSelectedAggression(values[0])}
            onValueCommit={(values) =>
              handleNewTactics({ aggressiveness: values[0] })
            }
          />

          <div>
            <h3 className="text-lg text-slate-600">{aggression.title}</h3>
            <p>{aggression.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
