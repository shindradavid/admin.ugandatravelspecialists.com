import React, { useState, useMemo } from 'react';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router';
import { useDestinations } from '../../api/destinationsApi';

const DestinationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const { data: destinations } = useDestinations();

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

  return (
    <div className={styles.destinationsPage}>
      {/* Control Bar: Search and Call to Action */}
      <div className={styles.controlBar}>
        <div className={styles.searchBarContainer}>
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button onClick={handleAddDestinationClick} className={styles.ctaButton}>
          Add New Destination
        </button>
      </div>

      {/* Destinations Grid */}
      <div className={styles.destinationsGrid}>
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((destination) => (
            <div key={destination.id} className={styles.destinationCard}>
              <div className={styles.cardImage} style={{ backgroundImage: `url(${destination.photoUrl})` }}></div>
              <div className={styles.cardOverlay}>
                <h3 className={styles.destinationName}>{destination.name}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No destinations found for "{searchQuery}".</p>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage;
