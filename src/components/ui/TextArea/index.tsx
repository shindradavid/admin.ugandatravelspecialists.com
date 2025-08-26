import React from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form'; // Import specific types for better typing
import styles from './styles.module.scss'; // Import component-specific styles

// Define a generic type for form data for better reusability
interface FormValues extends Record<string, any> {}

interface TextAreaProps {
  label: string;
  name: string;
  control: Control<FormValues>; // Use Control<FormValues> for generic compatibility
  errors: FieldErrors<FormValues>; // Use FieldErrors<FormValues> for generic compatibility
  type?: 'text' | 'email' | 'url' | 'tel' | 'search'; // Specify common text-like types
  placeholder?: string;
  autoComplete?: string;
  className?: string; // Allow optional className for external styling if needed
}

const TextArea: React.FC<TextAreaProps> = ({ label, name, control, errors, placeholder, autoComplete, className }) => {
  return (
    <div className={`${styles.formGroup} ${className || ''}`}>
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            id={name}
            rows={6}
            placeholder={placeholder}
            // Apply inputError class if there's an error for this field
            className={errors[name] ? styles.inputError : ''}
            autoComplete={autoComplete}
            aria-invalid={errors[name] ? 'true' : 'false'} // ARIA attribute for accessibility
          />
        )}
      />
      {/* Display the error message specific to this input field */}
      {errors[name] && (
        <p role="alert" className={styles.inputErrorMessage}>
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default TextArea;
