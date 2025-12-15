import React from 'react';
import styles from './styles.module.scss';

interface EmptyStateProps {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className={styles.emptyState}>
      {Icon && (
        <div className={styles.iconContainer}>
          <Icon size={64} className={styles.icon} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <button onClick={action.onClick} className={styles.actionButton}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

