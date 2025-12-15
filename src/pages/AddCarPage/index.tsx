import React, { useState } from 'react';
import z from 'zod';

import styles from './styles.module.scss';
import ImageInput from '../../components/ui/ImageInput';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

import TextInput from '../../components/ui/TextInput';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import SelectInput from '../../components/ui/SelectInput';
import {
  DriveTypes,
  FuelTypes,
  TransmissionTypes,
  useCreateCarMutation,
  type DriveType,
  type FuelType,
  type TransmissionType,
} from '../../api/carsApi';
import { toLabel } from '../../lib/utils';
import Switch from '../../components/ui/Switch';
import MultipleImageInput from '../../components/ui/MultipleImageInput';

const carSchema = z.object({
  name: z.string(),
  description: z.string(),
  seats: z.string().transform((val) => parseInt(val, 10)),
  pricePerDayUsd: z.string().transform((val) => parseInt(val, 10)),
  pricePerDayUgx: z.string().transform((val) => parseInt(val, 10)),
});

type CreateCarFormInputs = z.infer<typeof carSchema>;

const AddCarPage: React.FC = () => {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<File | null>(null);
  const [selectedTransmissionType, setSelectedTransmissionType] = useState<TransmissionType | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(null);
  const [selectedDriveType, setSelectedDriveType] = useState<DriveType | null>(null);
  const [selfDriveAvailable, setSelfDriveAvailable] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCarFormInputs>({
    resolver: zodResolver(carSchema),
  });

  const createCarMutation = useCreateCarMutation();

  const onSubmit: SubmitHandler<CreateCarFormInputs> = (data) => {
    if (photo && selectedTransmissionType && selectedFuelType && selectedDriveType) {
      const toastId = toast.loading('Creating car...');

      createCarMutation.mutate(
        {
          name: data.name,
          description: data.description,
          seats: data.seats,
          pricePerDayUsd: data.pricePerDayUsd,
          pricePerDayUgx: data.pricePerDayUgx,
          drive: selectedDriveType,
          fuelType: selectedFuelType,
          transmissionType: selectedTransmissionType,
          selfDriveAvailable,
          photo,
          photos,
        },
        {
          onSuccess: (apiResponse) => {
            toast.update(toastId, {
              render: apiResponse.message || 'Car added successfully.',
              type: 'success',
              isLoading: false,
              autoClose: 3000,
            });
            reset();

            navigate('/cars');
          },
          onError: (errorMessage) => {
            toast.update(toastId, {
              render: errorMessage.message || 'An error occurred while creating the car.',
              type: 'error',
              isLoading: false,
              autoClose: 3000,
            });
          },
        },
      );
    } else {
      toast.error('Validation error, check input data and try again');
    }
  };

  return (
    <div className={styles.addCarPage}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Add New Car</h1>
          <p>Fill in the details below to add a new car to your fleet.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.addForm}>
          <TextInput label="Name" name="name" type="tel" control={control as any} errors={errors} autoComplete="name" />

          <TextArea label="Description" name="description" control={control as any} errors={errors} />

          <SelectInput
            label="Transmission type"
            value={selectedTransmissionType}
            onValueChange={(value) => setSelectedTransmissionType(value as any)}
            options={TransmissionTypes.map((type) => ({
              label: toLabel(type),
              value: type,
            }))}
          />

          <SelectInput
            label="Fuel type"
            value={selectedFuelType}
            onValueChange={(value) => setSelectedFuelType(value as any)}
            options={FuelTypes.map((type) => ({
              label: toLabel(type),
              value: type,
            }))}
          />

          <SelectInput
            label="Drive type"
            value={selectedDriveType}
            onValueChange={(value) => setSelectedDriveType(value as any)}
            options={DriveTypes.map((type) => ({
              label: toLabel(type),
              value: type,
            }))}
          />

          <TextInput label="Number of seats" name="seats" type="number" control={control as any} errors={errors} />
          <TextInput label="Price per day (USD)" name="pricePerDayUsd" type="number" control={control as any} errors={errors} />
          <TextInput label="Price per day (UGX)" name="pricePerDayUgx" type="number" control={control as any} errors={errors} />

          <Switch label="Self drive" checked={selfDriveAvailable} onCheckedChange={setSelfDriveAvailable} />

          <ImageInput label="Image" imageFile={photo} setImageFile={setPhoto} />

          <MultipleImageInput label="Photos" value={photos} onChange={setPhotos} />
          <Button isLoading={createCarMutation.isPending}>Add</Button>
        </form>
      </div>
    </div>
  );
};

export default AddCarPage;
