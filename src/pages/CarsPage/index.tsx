import React, { useState, useMemo } from 'react';
import { Car, Search } from 'lucide-react';

import styles from './styles.module.scss';
import { useNavigate } from 'react-router';
import { useCars } from '../../api/carsApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const CarsPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const { data: cars, isLoading } = useCars();

  const filteredCars = useMemo(() => {
    if (!searchQuery) {
      return cars;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return cars.filter((car) => car.name.toLowerCase().includes(lowerCaseQuery));
  }, [searchQuery, cars]);

  const handleAddCarClick = () => {
    navigate('/cars/add');
  };

  if (isLoading) {
    return (
      <div className={styles.carsPage}>
        <LoadingSpinner text="Loading cars..." fullScreen />
      </div>
    );
  }

  return (
    <div className={styles.carsPage}>
      {/* Control Bar: Search and Call to Action */}
      <div className={styles.controlBar}>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <button onClick={handleAddCarClick} className={styles.ctaButton}>
          <Car size={18} />
          Add New Car
        </button>
      </div>

      {/* Cars Grid */}
      {filteredCars.length > 0 ? (
        <div className={styles.carsGrid}>
          {filteredCars.map((car) => (
            <div key={car.id} className={styles.carCard}>
              <div className={styles.cardImage} style={{ backgroundImage: `url(${car.primaryPhotoUrl})` }}></div>
              <div className={styles.cardOverlay}>
                <h3 className={styles.carName}>{car.name}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Car}
          title={searchQuery ? `No cars found for "${searchQuery}"` : 'No cars yet'}
          description={
            searchQuery
              ? 'Try adjusting your search terms or clear the search to see all cars.'
              : 'Get started by adding your first car to the fleet.'
          }
          action={
            !searchQuery
              ? {
                  label: 'Add New Car',
                  onClick: handleAddCarClick,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default CarsPage;
