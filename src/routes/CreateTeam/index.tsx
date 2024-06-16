import { type ChangeEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { Navigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

import { useUser } from '@/lib/queryClient';
import { Button, Input, Loader } from '@/components';
import { cn } from '@/lib/utils';
import { useReadContracts } from 'wagmi';
import { teamsContract } from '@/lib/contracts';
import { CreateTeamPhase } from '@/types';
import { useDialog, useStore } from '@/store';
import { DialogName } from '@/store/ui/types';

export const createTeamSchema = z.object({
  teamName: z.string().min(1, { message: 'Team name is required' }),
  teamLogo: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, 'Team logo is required')
    .refine(
      (files) => files[0]?.type.startsWith('image/'),
      'Must be an image file'
    ),
  playerFullName: z
    .string()
    .min(1, { message: 'Player full name is required' }),
  playerNumber: z.string(),
  playerNickname: z.string(),
  playerCountry: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((val) => val !== null, { message: 'Country is required' }),
});

const formatTeamsData = (
  data: Array<{ result: BigInt | number; status: string }>
) => {
  const [
    maxContestTeams,
    maxFcfsTeams,
    maxInviteTeams,
    currentPhase,
    contestTeamsCreated,
    fcfsTeamsCreated,
    inviteTeamsCreated,
  ] = data;

  return {
    maxContestTeams: Number(maxContestTeams.result),
    maxFcfsTeams: Number(maxFcfsTeams.result),
    maxInviteTeams: Number(maxInviteTeams.result),
    currentPhase: Number(currentPhase.result),
    contestTeamsCreated: Number(contestTeamsCreated.result),
    fcfsTeamsCreated: Number(fcfsTeamsCreated.result),
    inviteTeamsCreated: Number(inviteTeamsCreated.result),
  };
};
const formatPhase = (phase: CreateTeamPhase) => {
  switch (phase) {
    case CreateTeamPhase.FCFS:
      return 'FCFS';
    case CreateTeamPhase.INVITE:
      return 'Invite';
    case CreateTeamPhase.CONTEST:
      return 'Contest';
  }
};
const getPhaseDetails = (
  phase: CreateTeamPhase,
  data: ReturnType<typeof formatTeamsData>
) => {
  switch (phase) {
    case CreateTeamPhase.FCFS:
      return {
        createdTeams: data.fcfsTeamsCreated,
        maxTeams: data.maxFcfsTeams,
      };
    case CreateTeamPhase.INVITE:
      return {
        createdTeams: data.inviteTeamsCreated,
        maxTeams: data.maxInviteTeams,
      };
    case CreateTeamPhase.CONTEST:
      return {
        createdTeams: data.contestTeamsCreated,
        maxTeams: data.maxContestTeams,
      };
  }
};
export const CreateTeam = () => {
  const { data: user } = useUser();
  const { setTeamData } = useStore();
  const { toggle: toggleConfirmTeamDialog } = useDialog(
    DialogName.CONFIRM_TEAM_DIALOG
  );

  const { data: teamsData } = useReadContracts({
    contracts: [
      {
        ...teamsContract,
        functionName: 'MAX_CONTEST_TEAMS',
      },
      {
        ...teamsContract,
        functionName: 'MAX_FCFS_TEAMS',
      },
      {
        ...teamsContract,
        functionName: 'MAX_INVITE_TEAMS',
      },
      {
        ...teamsContract,
        functionName: 'currentPhase',
      },
      {
        ...teamsContract,
        functionName: 'contestTeamsCreated',
      },
      {
        ...teamsContract,
        functionName: 'fcfsTeamsCreated',
      },
      {
        ...teamsContract,
        functionName: 'inviteTeamsCreated',
      },
    ],
  });
  const formattedTeamsData = useMemo(
    () =>
      teamsData
        ? formatTeamsData(
            teamsData as Array<{ result: BigInt | number; status: string }>
          )
        : null,
    [teamsData]
  );

  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const countryOptions = countryList().getData();

  const formatOptionLabel = ({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={`https://flagcdn.com/w20/${value.toLowerCase()}.png`}
        alt={label}
        className="mr-2"
      />
      {label}
    </div>
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
  });
  const teamName = watch('teamName');
  const teamLogo = watch('teamLogo');

  const onSubmit: SubmitHandler<z.infer<typeof createTeamSchema>> = async (
    data
  ) => {
    try {
      setIsLoading(true);

      const teamData = {
        ...data,
        teamLogo: data.teamLogo[0], // Access the first file
        playerCountry: data.playerCountry!.value,
      };
      setTeamData(teamData);
      toggleConfirmTeamDialog(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('teamLogo', e.target.files as FileList);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (!user) {
    return null;
  }
  if (user.team) {
    return <Navigate to={`/${user.address}/team`} replace={true} />;
  }
  if (!formattedTeamsData) {
    return <Loader size={69} className="mx-auto" />;
  }

  const { createdTeams, maxTeams } = getPhaseDetails(
    formattedTeamsData.currentPhase,
    formattedTeamsData
  );
  const isPhaseComplete = createdTeams === maxTeams;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex justify-center flex-col items-center"
    >
      <div className="flex justify-center">
        <div
          className={cn(
            'flex items-start justify-center gap-x-8',
            !isPhaseComplete && 'mr-8 pr-8 border-r-4 border-blue-600 flex-col'
          )}
        >
          <div className={cn(!isPhaseComplete && 'mb-8')}>
            <p>Current phase</p>
            <p className="text-3xl text-blue-600">
              {formatPhase(formattedTeamsData?.currentPhase)}
            </p>
          </div>

          <div className="flex flex-col">
            <p>Teams created</p>
            <p className="text-3xl text-blue-600">
              {createdTeams}/{maxTeams}
            </p>
          </div>

          <div className={cn(!isPhaseComplete && 'mt-8')}>
            <p>Total Teams</p>
            <p className="text-3xl text-blue-600">3333</p>
          </div>
        </div>
        {!isPhaseComplete && (
          <div className="min-w-[350px]">
            <h2 className="text-center text-lg sm:text-xl md:text-2xl uppercase">
              {isLoading ? 'Creating Your Team...' : 'Create Your Team!'}
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={cn('mx-auto', isLoading && 'hidden')}
            >
              <div className={cn(step === 1 && 'hidden')}>
                <h3 className="text-lg text-center mb-2">Team Settings</h3>
                <Controller
                  name="teamLogo"
                  control={control}
                  render={() => (
                    <Input
                      id="teamLogo"
                      accept="image/*"
                      label="Team Logo"
                      type="file"
                      customProps={{
                        error: errors.teamLogo,
                        imgPreview: preview,
                        inputClassName: 'hidden',
                        uploadLabel: (
                          <div className="w-full border-2 rounded-lg border-blue-600 flex flex-col items-center justify-center py-2 hover:bg-blue-200">
                            <Upload color="#2563EB" />
                            {teamLogo ? 'Change' : 'Upload'}
                          </div>
                        ),
                      }}
                      onChange={(e) => {
                        handleLogoChange(e);
                      }}
                    />
                  )}
                />
                <Input
                  id="teamName"
                  label="Team Name"
                  customProps={{ error: errors.teamName }}
                  className="mt-2"
                  {...register('teamName')}
                />
              </div>

              <div className={cn(step === 0 && 'hidden')}>
                <h3 className="text-center text-lg mb-2">Your Unique Player</h3>
                <div className="flex justify-center border-2 border-blue-600 rounded-lg p-2">
                  <img
                    src="/unrevealed.gif"
                    className="w-[200px] h-[200px] object-cover rounded-lg"
                  />
                </div>
                <Input
                  id="playerFullName"
                  label="Full Name"
                  customProps={{ error: errors.playerFullName }}
                  className="mt-2"
                  {...register('playerFullName')}
                />
                <Input
                  id="playerNickname"
                  label="Nickname"
                  customProps={{ error: errors.playerNickname }}
                  className="mt-2"
                  {...register('playerNickname')}
                />
                <Input
                  id="playerNumber"
                  label="Favorite Number"
                  customProps={{
                    error: errors.playerNumber,
                    numOnly: true,
                    minNum: 1,
                    maxNum: 99,
                  }}
                  className="my-2"
                  {...register('playerNumber')}
                />
                <Controller
                  name="playerCountry"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label>Country</label>
                      <Select
                        {...field}
                        formatOptionLabel={formatOptionLabel}
                        options={countryOptions}
                        placeholder="Select a country"
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderWidth: 2,
                            borderRadius: 8,
                            borderColor: '#2563EB',
                            '&:hover': {
                              borderColor: '#2563EB',
                            },
                          }),
                        }}
                      />
                    </>
                  )}
                />
              </div>

              <div className="flex justify-center mt-4">
                {step === 1 && (
                  <Button
                    variant="muted"
                    className="mr-4"
                    onClick={(e) => {
                      e.preventDefault();
                      setStep(0);
                    }}
                  >
                    Back
                  </Button>
                )}
                <Button
                  disabled={!teamName || !teamLogo}
                  onClick={(e) => {
                    if (step === 1) {
                      handleSubmit(onSubmit);
                    } else {
                      e.preventDefault();
                      setStep(step + 1);
                    }
                  }}
                >
                  {step === 0 ? 'Next' : 'Create!'}
                </Button>
              </div>
            </form>
            {isLoading && (
              <div className="flex items-center justify-center mt-4">
                <Loader size={69} />
              </div>
            )}
          </div>
        )}
      </div>

      {isPhaseComplete && (
        <div className="mt-8 text-center border-2 border-blue-600 rounded-lg py-4 px-12">
          <p className="text-2xl text-blue-600">This phase is complete!</p>
          <p className="text-xl">
            Please wait for the announcement of the next phase!
          </p>
          <div className="flex items-center justify-center mt-2">
            <img
              src="/x.png"
              className="w-[29px] rounded-lg mr-4 cursor-pointer"
              onClick={() => window.open('https://x.com/BasedBBA', '_blank')}
            />
            <img
              src="/warpcast.png"
              className="w-[36px] cursor-pointer"
              onClick={() =>
                window.open('https://warpcast.com/basedbba', '_blank')
              }
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
