import { useRef } from 'react';
import { Image as ImageIcon, X as XIcon } from 'lucide-react';

import styles from './styles.module.scss';

interface ImageInputProps {
  imageFile: File | null;
  label: string;
  setImageFile: (file: File | null) => void;
}

export default function ImageInput({ imageFile, label, setImageFile }: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleRemove = () => {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={styles.imageInput}>
      <label className={styles.label}>{label}</label>
      <div
        className={`${styles.previewWrapper} ${imageFile ? styles.hasImage : styles.empty}`}
        onClick={() => !imageFile && inputRef.current?.click()}
      >
        {imageFile ? (
          <>
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className={styles.previewImage} />
            <button type="button" className={styles.removeBtn} onClick={handleRemove}>
              <XIcon size={18} />
            </button>
          </>
        ) : (
          <div className={styles.emptyState}>
            <ImageIcon size={32} />
            <span>Click to upload image</span>
          </div>
        )}
      </div>

      <input type="file" accept="image/*" ref={inputRef} className={styles.input} onChange={handleFileChange} />
    </div>
  );
}
