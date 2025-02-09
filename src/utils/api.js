// Utility function for handling API calls using fetch

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle GET requests
export const get = async (endpoint, params = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw {
        status: response.status,
        message: errorDetails.message || 'An error occurred',
        details: errorDetails
      };
    }
    return await response.json(); // Parse the response to JSON
  } catch (error) {
    console.error('API GET request failed:', error);
    throw error;
  }
};

// Helper function to handle POST requests
export const post = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`, 
      },
      body: JSON.stringify(data), // Stringify the data to be sent
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw {
        status: response.status,
        message: errorDetails.message || 'An error occurred',
        details: errorDetails
      };
    }

    return await response.json(); // Parse the response to JSON
  } catch (error) {
    console.error('API POST request failed:', error);
    throw error;
  }
};

// Helper function to handle PUT requests
export const put = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`, 
      },
      body: JSON.stringify(data), // Stringify the data to be sent
    });

    if (!response.ok) {
      throw new Error('Failed to put');
    }

    return await response.json(); // Parse the response to JSON
  } catch (error) {
    console.error('API PUT request failed:', error);
    throw error;
  }
};

// Helper function to handle PATCH requests
export const patch = async (endpoint, data = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`, 
            },
            body: JSON.stringify(data), // Stringify the data to be sent
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw {
            status: response.status,
            message: errorDetails.message || 'An error occurred',
            details: errorDetails
          };
        }

        return await response.json(); // Parse the response to JSON
    } catch (error) {
        console.error('API PATCH request failed:', error);
        throw error;
    }
};

// Helper function to handle DELETE requests
export const del = async (endpoint, params = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete');
    }

    return await response.json(); // Parse the response to JSON
  } catch (error) {
    console.error('API DELETE request failed:', error);
    throw error;
  }
};
