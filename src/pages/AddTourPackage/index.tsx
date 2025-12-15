import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import z from 'zod';
import { Plus, X } from 'lucide-react';

import styles from './styles.module.scss';
import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import TextArea from '../../components/ui/TextArea';
import ImageInput from '../../components/ui/ImageInput';
import MultipleImageInput from '../../components/ui/MultipleImageInput';
import { useCreateTourPackageMutation, type TourPackageItineraryItem } from '../../api/tourPackagesApi';

const tourPackageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  pricePerPersonUgx: z.string().transform((val) => parseFloat(val)),
  pricePerPersonUsd: z.string().transform((val) => parseFloat(val)),
});

type CreateTourPackageFormInputs = z.infer<typeof tourPackageSchema>;

const AddTourPackagePage: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTourPackageFormInputs>({
    resolver: zodResolver(tourPackageSchema),
    defaultValues: {
      name: '',
      description: '',
      pricePerPersonUgx: '0',
      pricePerPersonUsd: '0',
    },
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [itinerary, setItinerary] = useState<TourPackageItineraryItem[]>([
    { name: '', description: '' },
  ]);

  const createTourPackageMutation = useCreateTourPackageMutation();

  const addItineraryItem = () => {
    setItinerary([...itinerary, { name: '', description: '' }]);
  };

  const removeItineraryItem = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const updateItineraryItem = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setItinerary(updated);
  };

  const onSubmit: SubmitHandler<CreateTourPackageFormInputs> = (data) => {
    if (!photo) {
      toast.error('Please upload a primary photo');
      return;
    }

    // Filter out empty itinerary items
    const validItinerary = itinerary.filter((item) => item.name.trim() && item.description.trim());

    if (validItinerary.length === 0) {
      toast.error('Please add at least one itinerary item');
      return;
    }

    const toastId = toast.loading('Creating tour package...');

    createTourPackageMutation.mutate(
      {
        name: data.name,
        description: data.description,
        pricePerPersonUgx: data.pricePerPersonUgx,
        pricePerPersonUsd: data.pricePerPersonUsd,
        photo,
        photos,
        itinerary: validItinerary,
      },
      {
        onSuccess: (apiResponse) => {
          toast.update(toastId, {
            render: apiResponse.message || 'Tour package added successfully.',
            type: 'success',
            isLoading: false,
            autoClose: 3000,
          });
          reset();
          setPhoto(null);
          setPhotos([]);
          setItinerary([{ name: '', description: '' }]);
          navigate('/tour-packages');
        },
        onError: (error: any) => {
          toast.update(toastId, {
            render: error?.message || 'An error occurred while creating the tour package.',
            type: 'error',
            isLoading: false,
            autoClose: 3000,
          });
        },
      },
    );
  };

  return (
    <div className={styles.addTourPackagePage}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Add New Tour Package</h1>
          <p>Fill in the details below to add a new tour package to your offerings.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.addForm}>
          <TextInput label="Name" name="name" type="text" control={control as any} errors={errors} autoComplete="name" />

          <TextArea label="Description" name="description" control={control as any} errors={errors} />

          <TextInput
            label="Price per person (USD)"
            name="pricePerPersonUsd"
            type="number"
            control={control as any}
            errors={errors}
          />

          <TextInput
            label="Price per person (UGX)"
            name="pricePerPersonUgx"
            type="number"
            control={control as any}
            errors={errors}
          />

          <ImageInput label="Primary Photo" imageFile={photo} setImageFile={setPhoto} />

          <MultipleImageInput label="Additional Photos" value={photos} onChange={setPhotos} />

          <div className={styles.itinerarySection}>
            <div className={styles.itineraryHeader}>
              <label className={styles.itineraryLabel}>Itinerary</label>
              <button type="button" onClick={addItineraryItem} className={styles.addItineraryButton}>
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {itinerary.map((item, index) => (
              <div key={index} className={styles.itineraryItem}>
                <div className={styles.itineraryItemHeader}>
                  <span className={styles.itineraryItemNumber}>Day {index + 1}</span>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItineraryItem(index)}
                      className={styles.removeItineraryButton}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Item name (e.g., Day 1: Arrival)"
                  value={item.name}
                  onChange={(e) => updateItineraryItem(index, 'name', e.target.value)}
                  className={styles.itineraryInput}
                />
                <textarea
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                  className={styles.itineraryTextarea}
                  rows={3}
                />
              </div>
            ))}
          </div>

          <Button isLoading={createTourPackageMutation.isPending} disabled={createTourPackageMutation.isPending}>
            Add Package
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddTourPackagePage;
