import React, { useState, useMemo } from 'react';
import { MapPin, Search } from 'lucide-react';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router';
import { useDestinations } from '../../api/destinationsApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const DestinationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const { data: destinations, isLoading } = useDestinations();

  const filteredDestinations = useMemo(() => {
    if (!searchQuery) {
      return destinations;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    return destinations.filter((destination) => destination.name.toLowerCase().includes(lowerCaseQuery));
  }, [searchQuery, destinations]);

  const handleAddDestinationClick = () => {
    navigate('/destinations/add');
  };

  if (isLoading) {
    return (
      <div className={styles.destinationsPage}>
        <LoadingSpinner text="Loading destinations..." fullScreen />
      </div>
    );
  }

  return (
    <div className={styles.destinationsPage}>
      {/* Control Bar: Search and Call to Action */}
      <div className={styles.controlBar}>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <button onClick={handleAddDestinationClick} className={styles.ctaButton}>
          <MapPin size={18} />
          Add New Destination
        </button>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <div className={styles.destinationsGrid}>
          {filteredDestinations.map((destination) => (
            <div key={destination.id} className={styles.destinationCard}>
              <div className={styles.cardImage} style={{ backgroundImage: `url(${destination.primaryPhotoUrl})` }}></div>
              <div className={styles.cardOverlay}>
                <h3 className={styles.destinationName}>{destination.name}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapPin}
          title={searchQuery ? `No destinations found for "${searchQuery}"` : 'No destinations yet'}
          description={
            searchQuery
              ? 'Try adjusting your search terms or clear the search to see all destinations.'
              : 'Get started by adding your first destination to showcase to travelers.'
          }
          action={
            !searchQuery
              ? {
                  label: 'Add New Destination',
                  onClick: handleAddDestinationClick,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default DestinationsPage;
