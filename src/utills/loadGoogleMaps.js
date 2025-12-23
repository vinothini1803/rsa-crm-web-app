export function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    // Check if Google Maps API is already loaded
    if (
      typeof window.google === "object" &&
      typeof window.google.maps === "object"
    ) {
      resolve(window.google);
      return;
    }

    // Check if script tag for Google Maps API already exists in DOM
    // Check both head and body for existing scripts
    const existingScript =
      document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') ||
      document.querySelector('script[src*="maps.googleapis.com"]');
    
    if (existingScript) {
      // Script is already being loaded, wait for it to complete
      const checkInterval = setInterval(() => {
        if (
          typeof window.google === "object" &&
          typeof window.google.maps === "object"
        ) {
          clearInterval(checkInterval);
          resolve(window.google);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (
          typeof window.google === "object" &&
          typeof window.google.maps === "object"
        ) {
          resolve(window.google);
        } else {
          reject(new Error("Google Maps API failed to load"));
        }
      }, 10000);

      return;
    }

    // No existing script, create a new one
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve(window.google);
    script.onerror = (err) => reject(err);

    document.head.appendChild(script);
  });
}
