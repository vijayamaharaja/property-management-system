/**
 * Format a date object or string to YYYY-MM-DD format for API requests
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return '';
    }
    
    // Format as YYYY-MM-DD
    return d.toISOString().split('T')[0];
  };
  
  /**
   * Format a date object or string to a human-readable format
   * @param {Date|string} date - Date to format
   * @param {string} format - Format type ('short', 'long', 'full')
   * @returns {string} Formatted date string
   */
  export const formatReadableDate = (date, format = 'short') => {
    if (!date) return '';
    
    const d = new Date(date);
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return '';
    }
    
    // Format options
    const options = {
      short: { month: 'short', day: 'numeric', year: 'numeric' }, // Jan 1, 2025
      long: { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }, // Mon, January 1, 2025
      full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } // Monday, January 1, 2025
    };
    
    return d.toLocaleDateString(undefined, options[format] || options.short);
  };
  
  /**
   * Calculate the number of nights between two dates
   * @param {Date|string} checkInDate - Check-in date
   * @param {Date|string} checkOutDate - Check-out date
   * @returns {number} Number of nights
   */
  export const calculateNights = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return 0;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    
    // Calculate difference in days
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((end - start) / oneDay));
    
    return diffDays;
  };
  
  /**
   * Check if a date is in the past
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if date is in the past
   */
  export const isPastDate = (date) => {
    if (!date) return false;
    
    const d = new Date(date);
    const today = new Date();
    
    // Set time to beginning of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    
    return d < today;
  };
  
  /**
   * Check if a date range overlaps with another date range
   * @param {Date|string} startA - Start date of first range
   * @param {Date|string} endA - End date of first range
   * @param {Date|string} startB - Start date of second range
   * @param {Date|string} endB - End date of second range
   * @returns {boolean} True if the ranges overlap
   */
  export const dateRangesOverlap = (startA, endA, startB, endB) => {
    if (!startA || !endA || !startB || !endB) return false;
    
    const a = { start: new Date(startA), end: new Date(endA) };
    const b = { start: new Date(startB), end: new Date(endB) };
    
    // Check if any date is invalid
    if (
      isNaN(a.start.getTime()) || 
      isNaN(a.end.getTime()) || 
      isNaN(b.start.getTime()) || 
      isNaN(b.end.getTime())
    ) {
      return false;
    }
    
    // Check overlap
    return (
      (a.start <= b.end && a.start >= b.start) || 
      (a.end <= b.end && a.end >= b.start) ||
      (b.start <= a.end && b.start >= a.start) ||
      (b.end <= a.end && b.end >= a.start)
    );
  };
  
  /**
   * Get a date that is X days in the future
   * @param {number} days - Number of days to add
   * @returns {Date} Future date
   */
  export const getFutureDate = (days = 1) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };