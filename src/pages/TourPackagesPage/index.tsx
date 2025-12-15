import { useNavigate } from 'react-router';
import React, { useState, useMemo } from 'react';
import { Package, Search } from 'lucide-react';

import styles from './styles.module.scss';
import { useTourPackages } from '../../api/tourPackagesApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const TourPackagesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: tourPackages, isLoading } = useTourPackages();

  const filteredPackages = useMemo(() => {
    if (!searchQuery) {
      return tourPackages;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return tourPackages.filter((pkg) => pkg.name.toLowerCase().includes(lowerCaseQuery));
  }, [searchQuery, tourPackages]);

  const handleAddPackageClick = () => {
    navigate('/tour-packages/add');
  };

  if (isLoading) {
    return (
      <div className={styles.tourPackagesPage}>
        <LoadingSpinner text="Loading tour packages..." fullScreen />
      </div>
    );
  }

  return (
    <div className={styles.tourPackagesPage}>
      {/* Control Bar: Search and Call to Action */}
      <div className={styles.controlBar}>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <button onClick={handleAddPackageClick} className={styles.ctaButton}>
          <Package size={18} />
          Add New Package
        </button>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length > 0 ? (
        <div className={styles.packagesGrid}>
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className={styles.packageCard}>
              <div className={styles.cardImage} style={{ backgroundImage: `url(${pkg.primaryPhotoUrl})` }}></div>
              <div className={styles.cardOverlay}>
                <h3 className={styles.packageName}>{pkg.name}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title={searchQuery ? `No packages found for "${searchQuery}"` : 'No tour packages yet'}
          description={
            searchQuery
              ? 'Try adjusting your search terms or clear the search to see all packages.'
              : 'Get started by creating your first tour package to offer to travelers.'
          }
          action={
            !searchQuery
              ? {
                  label: 'Add New Package',
                  onClick: handleAddPackageClick,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default TourPackagesPage;
