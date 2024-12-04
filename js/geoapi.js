async function fetchGeoData() {
    try {
      const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching GeoJS data:", error);
      return null;
    }
  }

  
  async function displayGeoData() {
    const data = await fetchGeoData();
    if (data) {
      document.getElementById("geo-country").textContent = `Country: ${data.country}`;
      document.getElementById("geo-region").textContent = `Region: ${data.region}`;
      document.getElementById("geo-city").textContent = `City: ${data.city}`;
      document.getElementById("geo-timezone").textContent = `Timezone: ${data.timezone}`;
    } else {
      document.getElementById("geo-info").textContent = "Unable to fetch location data.";
    }
  }
  
  // Call the function to display the data
  displayGeoData();
  