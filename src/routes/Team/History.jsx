import { format } from 'date-fns';

import { cn } from '@/lib/utils';

export const History = ({ className }) => {
  const matches = [
    {
      _id: '1',
      teamA: {
        name: 'Based',
        score: 23,
      },
      teamB: {
        name: 'Lohs City',
        score: 2,
      },
      startTimestamp: Date.now() - 30000,
    },
    {
      _id: '2',
      teamA: {
        name: 'Based',
        score: 15,
      },
      teamB: {
        name: 'Bears',
        score: 7,
      },
      startTimestamp: Date.now() - 3500000,
    },
    {
      _id: '3',
      teamA: {
        name: 'Based',
        score: 10,
      },
      teamB: {
        name: 'Super Based',
        score: 21,
      },
      startTimestamp: Date.now() - 9000000,
    },
  ];

  return (
    <div className={className}>
      <h3 className="text-2xl mb-2">Matches history</h3>
      <div>
        {matches.length > 0 ? (
          matches.map((match) => {
            const { _id, teamA, teamB, startTimestamp } = match;

            return (
              <div
                key={_id}
                className="border-2 border-blue-600 w-full flex items-center justify-between px-4 rounded-lg hover:bg-blue-200 cursor-pointer transition-all ease-in-out duration-300 mb-2 last:mb-0"
              >
                <div>
                  <span
                    className={cn(
                      teamA.score > teamB.score
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {teamA.name}
                  </span>{' '}
                  <span className="text-lg">
                    {teamA.score} : {teamB.score}
                  </span>{' '}
                  <span
                    className={cn(
                      teamB.score > teamA.score
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {teamB.name}
                  </span>
                </div>

                <p className="text-end">
                  {format(startTimestamp, 'dd MMM yyyy HH:mm')}
                </p>
              </div>
            );
          })
        ) : (
          <p>No matches were played.</p>
        )}
      </div>
    </div>
  );
};
