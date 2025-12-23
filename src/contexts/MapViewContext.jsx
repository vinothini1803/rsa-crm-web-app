import React, { createContext, useContext, useState, useMemo, useRef, useCallback } from "react";

const MapViewContext = createContext(null);

export const useMapViewContext = () => {
  const context = useContext(MapViewContext);
  return context; // Will be null if used outside provider
};

export const MapViewProvider = ({ children }) => {
  const [statusCounts, setStatusCounts] = useState({
    // ASP status counts
    asp: {
      green: 0, // Available
      blue: 0, // On the Way
      red: 0, // Busy
      black: 0, // Offline
    },
    // Case status counts
    case: {
      green: 0, // Inprogress
      yellow: 0, // Case created
      red: 0, // Asp unassigned
    },
    // Technician status counts
    technician: {
      green: 0, // Available
      blue: 0, // Assigned
      red: 0, // Busy
      black: 0, // Offline
    },
  });
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);
  const [selectedFilterType, setSelectedFilterType] = useState(null); // 'asp', 'case', or 'technician'
  // Use ref instead of state for handler to avoid re-renders
  const handleStatusFilterClickRef = useRef(null);
  const [storedAspData, setStoredAspData] = useState([]);
  const [storedCaseData, setStoredCaseData] = useState([]);
  const [storedTechnicianData, setStoredTechnicianData] = useState([]);

  // Function to set the handler (updates ref, doesn't cause re-render)
  // Memoized with useCallback to ensure stable reference
  const setHandleStatusFilterClick = useCallback((handler) => {
    handleStatusFilterClickRef.current = handler;
  }, []);

  // Wrapper function that calls the current handler from ref
  // This allows us to call handleStatusFilterClick directly without re-renders
  // Memoized with useCallback to ensure stable reference
  const handleStatusFilterClick = useCallback((...args) => {
    if (handleStatusFilterClickRef.current) {
      return handleStatusFilterClickRef.current(...args);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      statusCounts,
      setStatusCounts,
      selectedStatusFilter,
      setSelectedStatusFilter,
      selectedFilterType,
      setSelectedFilterType,
      handleStatusFilterClick,
      setHandleStatusFilterClick,
      storedAspData,
      setStoredAspData,
      storedCaseData,
      setStoredCaseData,
      storedTechnicianData,
      setStoredTechnicianData,
    }),
    [
      statusCounts,
      selectedStatusFilter,
      selectedFilterType,
      storedAspData,
      storedCaseData,
      storedTechnicianData,
    ]
  );

  return (
    <MapViewContext.Provider value={value}>{children}</MapViewContext.Provider>
  );
};
