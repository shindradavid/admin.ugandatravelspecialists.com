import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import z from 'zod';

import styles from './styles.module.scss';
import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import TextArea from '../../components/ui/TextArea';
import SelectInput from '../../components/ui/SelectInput';
import ImageInput from '../../components/ui/ImageInput';
import {
  DestinationTypes,
  Regions,
  useCreateDestinationMutation,
  type DestinationType,
  type Region,
} from '../../api/destinationsApi';
import { toLabel } from '../../lib/utils';

const destinationSchema = z.object({
  name: z.string(),
  description: z.string(),
  district: z.string(),
});

type CreateDestinationFormInputs = z.infer<typeof destinationSchema>;

const AddDestinationPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDestinationFormInputs>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      name: '',
      description: '',
      district: '',
    },
  });

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedDestinationType, setSelectedDestinationType] = useState<DestinationType | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);

  const createDestinationMutation = useCreateDestinationMutation();

  const onSubmit: SubmitHandler<CreateDestinationFormInputs> = (data) => {
    if (selectedRegion && selectedDestinationType && photo) {
      const toastId = toast.loading('Creating destination...');

      createDestinationMutation.mutate(
        {
          name: data.name,
          description: data.description,
          district: data.district,
          region: selectedRegion,
          type: selectedDestinationType,
          photo,
        },
        {
          onSuccess: (apiResponse) => {
            toast.update(toastId, {
              render: apiResponse.message || 'Destination added successfully.',
              type: 'success',
              isLoading: false,
              autoClose: 3000,
            });
            reset();
            navigate('/destinations');
          },
          onError: (errorMessage) => {
            toast.update(toastId, {
              render: errorMessage.message || 'An error occurred while creating the destination.',
              type: 'error',
              isLoading: false,
              autoClose: 3000,
            });
          },
        },
      );
    }
  };

  return (
    <div className={styles.addDestinationPage}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Add New Destination</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.addForm}>
          <TextInput label="Name" name="name" type="tel" control={control as any} errors={errors} autoComplete="name" />

          <TextArea label="Description" name="description" control={control as any} errors={errors} />

          <TextInput label="District" name="district" control={control as any} errors={errors} />

          <SelectInput
            label="Region"
            value={selectedRegion}
            onValueChange={(value) => setSelectedRegion(value as any)}
            options={Regions.map((region) => ({
              label: toLabel(region),
              value: region,
            }))}
          />

          <SelectInput
            label="Destination type"
            value={selectedDestinationType}
            onValueChange={(value) => setSelectedDestinationType(value as any)}
            options={DestinationTypes.map((type) => ({
              label: toLabel(type),
              value: type,
            }))}
          />

          <ImageInput label="Image" imageFile={photo} setImageFile={setPhoto} />

          <Button isLoading={createDestinationMutation.isPending} disabled={createDestinationMutation.isPending}>
            Add
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddDestinationPage;
