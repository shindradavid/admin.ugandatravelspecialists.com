import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './styles.module.scss';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text, fullScreen = false }) => {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  const spinner = (
    <div className={`${styles.spinnerContainer} ${fullScreen ? styles.fullScreen : ''}`}>
      <Loader2 size={sizeMap[size]} className={styles.spinner} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );

  return spinner;
};

export default LoadingSpinner;

