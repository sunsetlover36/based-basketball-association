import { ChangeEvent, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActiveAccount } from 'thirdweb/react';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

import { useDialog } from '@/store';
import { Modal, Button, Input, Loader } from '@/components';
import { DialogName } from '@/store/ui/types';
import { cn } from '@/lib/utils';
import { editTeamLogo } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

export const editLogoSchema = z.object({
  teamLogo: z
    .instanceof(FileList)
    .nullable()
    .refine(
      (files) => files !== null && files.length === 1,
      'Team logo is required'
    )
    .refine(
      (files) => files !== null && files[0]?.type.startsWith('image/'),
      'Must be an image file'
    )
    .refine((files) => files !== null && files[0]?.size <= 5 * 1024 * 1024, {
      message: 'Team logo must be less than 5MB',
    }),
});

export const EditLogoDialog = () => {
  const account = useActiveAccount();
  const { isOpen, toggle } = useDialog(DialogName.EDIT_LOGO_DIALOG);

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<z.infer<typeof editLogoSchema>>({
    resolver: zodResolver(editLogoSchema),
    defaultValues: {
      teamLogo: null,
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const teamLogo = watch('teamLogo');

  const onSubmit: SubmitHandler<z.infer<typeof editLogoSchema>> = async (
    data
  ) => {
    try {
      setIsLoading(true);

      await editTeamLogo({
        teamLogo: data.teamLogo![0],
      });
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['team', account?.address],
      });
      toggle(false);

      setTimeout(() => {
        reset({ teamLogo: null });
        setPreview(null);
        toast.success('Team logo updated successfully', {
          id: 'edit-team-logo',
          icon: '🎉',
        });
      }, 100);
    } catch {
      toast.error('Something went wrong', {
        id: 'edit-team-logo',
        icon: '🚨',
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('teamLogo', e.target.files as FileList);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Modal
      showModal={isOpen}
      close={() => {
        toggle(false);
      }}
      title="Edit Team Logo"
      fixedButton
      buttons={
        <Button
          className="ml-4"
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          Edit
        </Button>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(isLoading && 'hidden')}
      >
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
      </form>
      {isLoading && (
        <div className="flex items-center justify-center mt-4">
          <Loader size={69} />
        </div>
      )}
    </Modal>
  );
};
