import React from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Car, PlaneTakeoff, PlusCircle, BarChart2, Bell, CalendarDays } from 'lucide-react';

import styles from './styles.module.scss';

const DUMMY_CAR_HIRES = [
  { id: 'ch-001', client: 'John Doe', date: '2025-08-15', status: 'Confirmed' },
  { id: 'ch-002', client: 'Alice Smith', date: '2025-08-19', status: 'Pending' },
];

const DUMMY_TOUR_PACKAGES = [
  { id: 'tp-001', client: 'Jane Doe', date: '2025-08-16', status: 'Confirmed' },
  { id: 'tp-002', client: 'Peter Jones', date: '2025-08-20', status: 'Confirmed' },
];

const DUMMY_AIRPORT_PICKUPS = [{ id: 'ap-001', client: 'Michael Scott', date: '2025-08-17', status: 'Confirmed' }];

// Dummy data for key metrics
const DUMMY_METRICS = [
  { id: 1, title: 'Total Bookings (This Month)', value: 45, icon: <BarChart2 /> },
  { id: 2, title: 'New Inquiries (Last 7 Days)', value: 12, icon: <Bell /> },
  { id: 3, title: 'Available Cars', value: 8, icon: <Car /> },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const renderBookingItems = (bookings: typeof DUMMY_CAR_HIRES) => {
    return bookings.length > 0 ? (
      bookings.map((booking) => (
        <div key={booking.id} className={styles.bookingItem}>
          <div className={styles.bookingInfo}>
            <p className={styles.bookingClient}>{booking.client}</p>
          </div>
          <p className={styles.bookingDate}>{booking.date}</p>
          <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>{booking.status}</span>
        </div>
      ))
    ) : (
      <p className={styles.noDataMessage}>No bookings found.</p>
    );
  };

  return (
    <div className={styles.homePage}>
      {/* Welcome Header */}
      <div className={styles.welcomeHeader}>
        <h1 className={styles.welcomeTitle}>Dashboard Overview</h1>
        <p className={styles.welcomeSubtitle}>Monitor your bookings, metrics, and quick actions</p>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Section 1: Upcoming Bookings */}
        <div className={`${styles.sectionCard} ${styles.bookingsSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Bookings</h2>
            <button className={styles.viewAllButton} onClick={() => console.log('Navigating to All Bookings page...')}>
              View All
            </button>
          </div>
          <div className={styles.bookingsGrid}>
            {/* Car Hire Bookings */}
            <div className={styles.bookingSubSection}>
              <h3 className={styles.bookingSubTitle}>
                <Car size={18} /> Car Hires
              </h3>
              <div className={styles.bookingsList}>{renderBookingItems(DUMMY_CAR_HIRES)}</div>
            </div>

            {/* Tour Package Bookings */}
            <div className={styles.bookingSubSection}>
              <h3 className={styles.bookingSubTitle}>
                <PlaneTakeoff size={18} /> Tour Packages
              </h3>
              <div className={styles.bookingsList}>{renderBookingItems(DUMMY_TOUR_PACKAGES)}</div>
            </div>

            {/* Airport Pickup Bookings */}
            <div className={styles.bookingSubSection}>
              <h3 className={styles.bookingSubTitle}>
                <CalendarDays size={18} /> Airport Pickups
              </h3>
              <div className={styles.bookingsList}>{renderBookingItems(DUMMY_AIRPORT_PICKUPS)}</div>
            </div>
          </div>
        </div>

        {/* Section 2: Key Metrics */}
        <div className={`${styles.sectionCard} ${styles.metricsSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Key Metrics</h2>
          </div>
          <div className={styles.metricsGrid}>
            {DUMMY_METRICS.map((metric) => (
              <div key={metric.id} className={styles.metricCard}>
                <div className={styles.metricIcon}>{metric.icon}</div>
                <p className={styles.metricTitle}>{metric.title}</p>
                <h3 className={styles.metricValue}>{metric.value}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Quick Actions */}
        <div className={`${styles.sectionCard} ${styles.actionsSection}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>
          <div className={styles.quickActionsGrid}>
            <div className={styles.actionCard} onClick={() => handleLinkClick('/cars/add')}>
              <PlusCircle size={24} />
              <p>Add New Car</p>
            </div>
            <div className={styles.actionCard} onClick={() => handleLinkClick('/destinations')}>
              <MapPin size={24} />
              <p>Manage Destinations</p>
            </div>
            <div className={styles.actionCard} onClick={() => handleLinkClick('/cars')}>
              <Car size={24} />
              <p>Manage Cars</p>
            </div>
            <div className={styles.actionCard} onClick={() => handleLinkClick('/tour-packages')}>
              <PlaneTakeoff size={24} />
              <p>Manage Packages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
