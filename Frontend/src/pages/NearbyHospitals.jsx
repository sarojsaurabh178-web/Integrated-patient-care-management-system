import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Search,
  PhoneCall,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Activity,
  Layers,
  Info,
  CheckCircle2,
  XCircle,
  LocateFixed,
  Ambulance,
  HeartPulse,
  Filter
} from 'lucide-react';
import hospitalService from '../services/hospitalService';

// Custom Map Marker Icons using Leaflet divIcon (crisp SVG, themeable, zero broken image assets)
const createUserMarkerIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="user-marker-pulse"></div>
      <div class="user-marker-core">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="12" r="8"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const createHospitalMarkerIcon = (hospital, isSelected = false) => {
  const isCareHub = hospital.id.includes('CAREHUB') || hospital.category?.includes('CareHub');
  const isEmergency = hospital.emergency_24x7;
  
  let bgClass = 'hosp-marker-clinic';
  if (isCareHub) bgClass = 'hosp-marker-carehub';
  else if (isEmergency) bgClass = 'hosp-marker-emergency';

  const selectedClass = isSelected ? 'hosp-marker-selected' : '';

  return L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div class="hosp-marker-pin ${bgClass} ${selectedClass}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M2 12h20"/>
        </svg>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -42]
  });
};

const RADIUS_OPTIONS = [2, 5, 10, 20, 50];

const NearbyHospitals = ({ setActiveTab }) => {
  // State management
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);
  const [facilityFilter, setFacilityFilter] = useState('ALL'); // ALL, 24X7, ICU, CAREHUB

  // Geolocation State
  const [userCoords, setUserCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState('IDLE'); // IDLE, REQUESTING, GRANTED, DENIED, UNAVAILABLE
  const [locationMessage, setLocationMessage] = useState('');
  const [resolvedLocationName, setResolvedLocationName] = useState('New Delhi (Central Region)');

  // Emergency Hotlines State
  const [emergencyHotlines, setEmergencyHotlines] = useState([
    { name: 'National Ambulance', number: '108', type: 'Ambulance' },
    { name: 'CareHub Emergency', number: '1066', type: 'Trauma ICU' },
    { name: 'Health Helpline', number: '1075', type: 'Medical Desk' },
    { name: 'Police / Emergency', number: '112', type: 'Unified Emergency' }
  ]);

  // Leaflet Map References
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default initial view: New Delhi Medical Hub
      const initialLat = 28.6289;
      const initialLon = 77.2065;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // OpenStreetMap high-contrast medical tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | MediTrack CareHub'
      }).addTo(map);

      // Layer groups for markers
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Invalidate size on initial layout
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch Hospitals from Backend
  const fetchHospitals = useCallback(async (coords = null, customRadius = null, customQuery = null) => {
    setLoading(true);
    setError(null);

    const latToUse = coords ? coords.lat : (userCoords ? userCoords.lat : 28.6289);
    const lonToUse = coords ? coords.lon : (userCoords ? userCoords.lon : 77.2065);
    const radToUse = customRadius !== null ? customRadius : radiusKm;
    const queryToUse = customQuery !== null ? customQuery : searchQuery;

    try {
      const response = await hospitalService.getNearbyHospitals({
        lat: latToUse,
        lon: lonToUse,
        radiusKm: radToUse,
        query: queryToUse
      });

      if (response && response.status === 'success') {
        const results = response.hospitals || [];
        setHospitals(results);
        if (response.center?.location_name) {
          setResolvedLocationName(response.center.location_name);
        }
        
        // Auto select first hospital if available
        if (results.length > 0 && !selectedHospital) {
          setSelectedHospital(results[0]);
        }
      } else {
        setHospitals([]);
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err);
      setError('Unable to fetch nearby healthcare facilities. Please verify your connection or try a different search.');
    } finally {
      setLoading(false);
    }
  }, [userCoords, radiusKm, searchQuery, selectedHospital]);

  // Initial Fetch on load
  useEffect(() => {
    fetchHospitals();
    
    // Also load verified emergency hotlines
    hospitalService.getEmergencyHotlines()
      .then(res => {
        if (res?.emergency_services) {
          setEmergencyHotlines(res.emergency_services);
        }
      })
      .catch(() => {
        // Fallback hotlines already defined
      });
  }, []);

  // Render & Update Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Render User Marker if available
    if (userCoords) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userMarker = L.marker([userCoords.lat, userCoords.lon], {
        icon: createUserMarkerIcon(),
        title: 'Your Detected Location'
      });

      userMarker.bindPopup(`
        <div class="map-popup-card">
          <div class="map-popup-header">
            <span class="user-popup-badge">📍 Your Location</span>
          </div>
          <p class="map-popup-desc">Searching within <strong>${radiusKm} km</strong> radius</p>
        </div>
      `);

      userMarker.addTo(markersLayerRef.current);
      userMarkerRef.current = userMarker;
    }

    // 2. Filter hospitals based on facility filter
    const filteredHospitals = hospitals.filter(hosp => {
      if (facilityFilter === '24X7') return hosp.emergency_24x7;
      if (facilityFilter === 'ICU') return hosp.bed_availability?.is_verified && hosp.bed_availability?.icu_beds?.available > 0;
      if (facilityFilter === 'CAREHUB') return hosp.id.includes('CAREHUB') || hosp.category?.includes('CareHub');
      return true;
    });

    // 3. Render Hospital Markers
    const bounds = L.latLngBounds([]);
    if (userCoords) {
      bounds.extend([userCoords.lat, userCoords.lon]);
    }

    filteredHospitals.forEach(hosp => {
      const isSelected = selectedHospital?.id === hosp.id;
      const marker = L.marker([hosp.lat, hosp.lon], {
        icon: createHospitalMarkerIcon(hosp, isSelected),
        title: hosp.name
      });

      // Bed availability summary snippet for popup
      const bedSnippet = hosp.bed_availability?.is_verified
        ? `<div class="popup-bed-stat verified">
             <span class="dot green"></span>
             <strong>${hosp.bed_availability.available_beds}</strong> Beds Available 
             (${hosp.bed_availability.icu_beds?.available || 0} ICU)
           </div>`
        : `<div class="popup-bed-stat unverified">
             <span class="dot gray"></span> Availability information not provided
           </div>`;

      const popupContent = `
        <div class="map-popup-card">
          <div class="map-popup-header">
            <h4 class="popup-title">${hosp.name}</h4>
            <span class="popup-distance">${hosp.distance_km} km away</span>
          </div>
          <p class="popup-address">${hosp.address}</p>
          ${bedSnippet}
          <div class="popup-actions">
            <a href="${hosp.directions_url}" target="_blank" rel="noopener noreferrer" class="popup-btn-nav">
              Get Directions
            </a>
            ${hosp.phone ? `<a href="tel:${hosp.phone.replace(/[^0-9+]/g, '')}" class="popup-btn-call">Call</a>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedHospital(hosp);
      });

      marker.addTo(markersLayerRef.current);
      bounds.extend([hosp.lat, hosp.lon]);
    });

    // Fit map bounds to view all markers
    if (bounds.isValid() && filteredHospitals.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [hospitals, userCoords, selectedHospital, facilityFilter, radiusKm]);

  // Request Current Geolocation
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('UNAVAILABLE');
      setLocationMessage('Geolocation is not supported by your browser. Please search manually by city or PIN code.');
      return;
    }

    setLocationStatus('REQUESTING');
    setLocationMessage('Requesting GPS location permission...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setUserCoords(coords);
        setLocationStatus('GRANTED');
        setLocationMessage(`GPS coordinates acquired (${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)})`);
        
        // Fetch hospitals around current coordinates
        fetchHospitals(coords, radiusKm, searchQuery);

        // Center map to current position
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.lat, coords.lon], 13);
        }
      },
      (geoError) => {
        console.warn('Geolocation permission error:', geoError);
        let errorMsg = 'Location permission was denied. You can search manually by City, Locality, or PIN Code.';
        if (geoError.code === 2) {
          errorMsg = 'GPS location unavailable. Please enter your location manually.';
        } else if (geoError.code === 3) {
          errorMsg = 'Location request timed out. Please enter your location manually.';
        }
        setLocationStatus('DENIED');
        setLocationMessage(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Handle Manual Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHospitals(userCoords, radiusKm, searchQuery);
  };

  // Handle Radius Change
  const handleRadiusSelect = (radius) => {
    setRadiusKm(radius);
    fetchHospitals(userCoords, radius, searchQuery);
  };

  // Focus on specific hospital on map
  const handleFocusHospitalOnMap = (hospital) => {
    setSelectedHospital(hospital);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([hospital.lat, hospital.lon], 15, {
        animate: true,
        duration: 1
      });
      // Scroll up to map on mobile
      if (window.innerWidth < 992 && mapContainerRef.current) {
        mapContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Recenter on User
  const handleRecenterOnUser = () => {
    if (userCoords && mapInstanceRef.current) {
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lon], 14, {
        animate: true
      });
    } else {
      handleDetectCurrentLocation();
    }
  };

  // Filtered hospital list
  const displayedHospitals = hospitals.filter(hosp => {
    if (facilityFilter === '24X7') return hosp.emergency_24x7;
    if (facilityFilter === 'ICU') return hosp.bed_availability?.is_verified && hosp.bed_availability?.icu_beds?.available > 0;
    if (facilityFilter === 'CAREHUB') return hosp.id.includes('CAREHUB') || hosp.category?.includes('CareHub');
    return true;
  });

  return (
    <div className="nearby-hospitals-page">
      {/* 1. Header Section */}
      <div className="page-header-card">
        <div className="header-meta">
          <div className="header-badge">
            <Activity size={15} className="pulse-icon" />
            <span>Healthcare Services &amp; Emergency Locator</span>
          </div>
          <h1 className="page-title">Nearby Hospitals &amp; Emergency Locator</h1>
          <p className="page-subtitle">
            Find certified hospitals, trauma centers, and clinics near your current location with real-time navigation and verified bed telemetry.
          </p>
        </div>

        {/* Emergency Hotlines Dial Bar */}
        <div className="emergency-hotlines-strip">
          <div className="hotline-title">
            <Ambulance size={18} className="text-danger" />
            <span>24/7 Emergency Dial:</span>
          </div>
          <div className="hotlines-pills">
            {emergencyHotlines.map((hotline, idx) => (
              <a 
                key={idx} 
                href={`tel:${hotline.number}`} 
                className="hotline-pill"
                title={`Call ${hotline.name} (${hotline.number})`}
              >
                <PhoneCall size={13} />
                <span className="hl-name">{hotline.name}:</span>
                <span className="hl-num">{hotline.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Geolocation & Location Search Controls Bar */}
      <div className="locator-controls-card">
        <div className="controls-row">
          {/* Geolocation Button */}
          <div className="geolocate-action-block">
            <button
              type="button"
              id="btn-detect-location"
              className={`btn-detect-location ${locationStatus === 'REQUESTING' ? 'loading' : ''}`}
              onClick={handleDetectCurrentLocation}
              disabled={locationStatus === 'REQUESTING'}
            >
              {locationStatus === 'REQUESTING' ? (
                <>
                  <RefreshCw size={18} className="spin-animation" />
                  <span>Locating Device...</span>
                </>
              ) : (
                <>
                  <LocateFixed size={18} />
                  <span>Find Hospitals Near Me</span>
                </>
              )}
            </button>
            <div className="privacy-disclosure-note">
              <ShieldCheck size={14} className="privacy-icon" />
              <span>Location access is optional and only used to calculate accurate distances. Your coordinates are never stored.</span>
            </div>
          </div>

          {/* Manual Location Search Input */}
          <form className="manual-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                id="hospital-location-search"
                className="form-control hospital-search-input"
                placeholder="Search by City (e.g. Delhi, Mumbai), Locality, PIN code, or Hospital name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    fetchHospitals(userCoords, radiusKm, '');
                  }}
                  title="Clear Search"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-search-submit">
              Search
            </button>
          </form>
        </div>

        {/* Radius Selector & Facility Filters */}
        <div className="filters-and-radius-row">
          {/* Radius Selector */}
          <div className="radius-selector-group">
            <span className="filter-label">Search Radius:</span>
            <div className="radius-pills">
              {RADIUS_OPTIONS.map((rad) => (
                <button
                  key={rad}
                  type="button"
                  className={`radius-pill ${radiusKm === rad ? 'active' : ''}`}
                  onClick={() => handleRadiusSelect(rad)}
                >
                  {rad} km
                </button>
              ))}
            </div>
          </div>

          {/* Quick Facility Filter Chips */}
          <div className="facility-filter-group">
            <span className="filter-label">Facility Filter:</span>
            <div className="facility-chips">
              <button
                type="button"
                className={`filter-chip ${facilityFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setFacilityFilter('ALL')}
              >
                All Facilities ({hospitals.length})
              </button>
              <button
                type="button"
                className={`filter-chip ${facilityFilter === '24X7' ? 'active' : ''}`}
                onClick={() => setFacilityFilter('24X7')}
              >
                🚨 24/7 Emergency
              </button>
              <button
                type="button"
                className={`filter-chip ${facilityFilter === 'ICU' ? 'active' : ''}`}
                onClick={() => setFacilityFilter('ICU')}
              >
                🛏️ ICU Available
              </button>
              <button
                type="button"
                className={`filter-chip ${facilityFilter === 'CAREHUB' ? 'active' : ''}`}
                onClick={() => setFacilityFilter('CAREHUB')}
              >
                ⭐ CareHub Network
              </button>
            </div>
          </div>
        </div>

        {/* Geolocation Status Feedback Banner */}
        {locationMessage && (
          <div className={`location-status-banner ${locationStatus.toLowerCase()}`}>
            {locationStatus === 'GRANTED' && <CheckCircle2 size={16} className="text-success" />}
            {locationStatus === 'DENIED' && <AlertTriangle size={16} className="text-warning" />}
            {locationStatus === 'UNAVAILABLE' && <AlertTriangle size={16} className="text-danger" />}
            {locationStatus === 'REQUESTING' && <RefreshCw size={16} className="spin-animation text-primary" />}
            <span>{locationMessage}</span>
          </div>
        )}
      </div>

      {/* 3. Main Split View: Interactive Map & Hospital Results Cards */}
      <div className="hospital-locator-content-grid">
        {/* Left Column: Interactive Map */}
        <div className="map-view-column">
          <div className="map-card-wrapper">
            <div className="map-card-header">
              <div className="map-header-info">
                <Layers size={18} className="text-primary" />
                <span className="map-header-title">Live Healthcare Facilities Map</span>
                <span className="map-current-zone">Near: {resolvedLocationName}</span>
              </div>
              <div className="map-header-actions">
                <button
                  type="button"
                  className="btn-map-control"
                  onClick={handleRecenterOnUser}
                  title="Recenter Map on Current Location"
                >
                  <LocateFixed size={15} />
                  <span>My Location</span>
                </button>
                <button
                  type="button"
                  className="btn-map-control"
                  onClick={() => fetchHospitals(userCoords, radiusKm, searchQuery)}
                  title="Refresh Nearby Facilities"
                >
                  <RefreshCw size={15} className={loading ? 'spin-animation' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Map Canvas */}
            <div 
              id="nearby-hospital-map" 
              ref={mapContainerRef} 
              className="interactive-map-container"
              tabIndex="0"
              aria-label="Interactive map showing nearby hospitals"
            />

            {/* Map Legend */}
            <div className="map-legend-footer">
              <span className="legend-label">Map Legend:</span>
              <div className="legend-items">
                <span className="legend-item">
                  <span className="legend-dot user-dot"></span> Current Location
                </span>
                <span className="legend-item">
                  <span className="legend-dot carehub-dot"></span> CareHub Network (Verified Beds)
                </span>
                <span className="legend-item">
                  <span className="legend-dot emergency-dot"></span> 24/7 Emergency Center
                </span>
                <span className="legend-item">
                  <span className="legend-dot clinic-dot"></span> External Hospital / Clinic
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hospital Results Cards */}
        <div className="results-list-column">
          <div className="results-summary-bar">
            <div className="summary-left">
              <span className="results-count">
                <strong>{displayedHospitals.length}</strong> facilities found
              </span>
              <span className="results-radius">within {radiusKm} km radius</span>
            </div>
            <div className="summary-right">
              <span className="sort-indicator">Sorted by nearest distance</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="hospitals-loading-container">
              <RefreshCw size={36} className="spin-animation text-primary" />
              <p>Scanning nearby healthcare facilities and verified telemetry...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="hospitals-error-state">
              <AlertTriangle size={32} className="text-warning" />
              <h4>Unable to Load Facilities</h4>
              <p>{error}</p>
              <button 
                type="button" 
                className="btn-retry-fetch"
                onClick={() => fetchHospitals(userCoords, radiusKm, searchQuery)}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty Results State */}
          {!loading && !error && displayedHospitals.length === 0 && (
            <div className="hospitals-empty-state">
              <div className="empty-icon-box">
                <MapPin size={36} />
              </div>
              <h4>No Hospitals Found in this Radius</h4>
              <p>
                We couldn't find healthcare centers within <strong>{radiusKm} km</strong> of {resolvedLocationName}.
              </p>
              <div className="empty-state-actions">
                <button
                  type="button"
                  className="btn-expand-radius"
                  onClick={() => handleRadiusSelect(50)}
                >
                  Expand Radius to 50 km
                </button>
                <button
                  type="button"
                  className="btn-reset-search"
                  onClick={() => {
                    setSearchQuery('');
                    setFacilityFilter('ALL');
                    fetchHospitals(null, 20, '');
                  }}
                >
                  Reset Search
                </button>
              </div>
            </div>
          )}

          {/* Hospital Cards List */}
          {!loading && !error && displayedHospitals.length > 0 && (
            <div className="hospitals-cards-stack">
              {displayedHospitals.map((hospital) => {
                const isCareHub = hospital.id.includes('CAREHUB') || hospital.category?.includes('CareHub');
                const isSelected = selectedHospital?.id === hospital.id;
                const hasBedData = hospital.bed_availability?.is_verified;

                return (
                  <div 
                    key={hospital.id} 
                    className={`hospital-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleFocusHospitalOnMap(hospital)}
                  >
                    {/* Card Top: Badges & Distance */}
                    <div className="hospital-card-top">
                      <div className="hospital-badges">
                        {isCareHub && (
                          <span className="badge-carehub-network">
                            <Activity size={12} /> CareHub Verified
                          </span>
                        )}
                        <span className={`badge-hospital-type ${hospital.category?.toLowerCase().includes('gov') ? 'gov' : 'pvt'}`}>
                          {hospital.type}
                        </span>
                        {hospital.emergency_24x7 && (
                          <span className="badge-emergency-24x7">
                            🚨 24/7 Emergency
                          </span>
                        )}
                      </div>
                      <div className="hospital-distance-pill">
                        <Navigation size={13} className="text-primary" />
                        <span><strong>{hospital.distance_km} km</strong> away</span>
                      </div>
                    </div>

                    {/* Card Body: Info & Image */}
                    <div className="hospital-card-body">
                      <div className="hospital-media-box">
                        <img 
                          src={hospital.image || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=300&q=80'} 
                          alt={hospital.name}
                          className="hospital-thumbnail"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </div>

                      <div className="hospital-info-details">
                        <h3 className="hospital-name">{hospital.name}</h3>
                        <p className="hospital-address">
                          <MapPin size={14} className="address-icon" />
                          <span>{hospital.address}</span>
                        </p>

                        {/* Opening Hours */}
                        {hospital.opening_hours && (
                          <p className="hospital-hours">
                            <Clock size={13} className="clock-icon" />
                            <span>{hospital.opening_hours}</span>
                          </p>
                        )}

                        {/* Specializations / Services Tags */}
                        {hospital.services && hospital.services.length > 0 && (
                          <div className="hospital-services-tags">
                            {hospital.services.slice(0, 4).map((srv, sIdx) => (
                              <span key={sIdx} className="service-tag">{srv}</span>
                            ))}
                            {hospital.services.length > 4 && (
                              <span className="service-tag more">+{hospital.services.length - 4} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bed Availability Section */}
                    <div className="hospital-bed-section">
                      {hasBedData ? (
                        <div className="verified-beds-block">
                          <div className="beds-header">
                            <div className="beds-header-left">
                              <HeartPulse size={15} className="text-success" />
                              <span className="beds-status-title">Live Bed Telemetry</span>
                              <span className="verified-pill">Verified Network</span>
                            </div>
                            <span className="beds-last-updated">
                              Source: {hospital.bed_availability.source} ({hospital.bed_availability.last_updated})
                            </span>
                          </div>
                          
                          <div className="beds-metrics-grid">
                            <div className="bed-metric-card total">
                              <span className="metric-val">{hospital.bed_availability.total_beds}</span>
                              <span className="metric-lbl">Total Beds</span>
                            </div>
                            <div className="bed-metric-card occupied">
                              <span className="metric-val">{hospital.bed_availability.occupied_beds}</span>
                              <span className="metric-lbl">Occupied</span>
                            </div>
                            <div className="bed-metric-card available">
                              <span className="metric-val available-glow">{hospital.bed_availability.available_beds}</span>
                              <span className="metric-lbl">Available Beds</span>
                            </div>
                            <div className="bed-metric-card icu">
                              <span className="metric-val icu-glow">{hospital.bed_availability.icu_beds?.available || 0}</span>
                              <span className="metric-lbl">ICU Beds</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="unverified-beds-block">
                          <Info size={15} className="info-icon" />
                          <div className="unverified-text">
                            <strong>Availability information not provided</strong>
                            <p>External facility bed telemetry is not linked to the CareHub verified network.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Actions: Directions, Call, View on Map */}
                    <div className="hospital-card-actions">
                      <a
                        href={hospital.directions_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-action-directions"
                        onClick={(e) => e.stopPropagation()}
                        title="Open GPS Navigation in Google Maps"
                      >
                        <Navigation size={15} />
                        <span>Get Directions</span>
                        <ExternalLink size={13} className="ext-icon" />
                      </a>

                      <button
                        type="button"
                        className="btn-action-mapview"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFocusHospitalOnMap(hospital);
                        }}
                        title="Locate and zoom on Map"
                      >
                        <MapPin size={15} />
                        <span>View on Map</span>
                      </button>

                      {hospital.phone ? (
                        <a
                          href={`tel:${hospital.phone.replace(/[^0-9+]/g, '')}`}
                          className="btn-action-call"
                          onClick={(e) => e.stopPropagation()}
                          title={`Call ${hospital.name} at ${hospital.phone}`}
                        >
                          <PhoneCall size={15} />
                          <span>Call: {hospital.phone}</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="btn-action-call disabled"
                          disabled
                          title="Phone number unverified"
                        >
                          <PhoneCall size={15} />
                          <span>Phone unverified</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyHospitals;
