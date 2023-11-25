

const extractRoleFromToken = (token) => {
    try {
      // Split the token into header, payload, and signature
      const [encodedHeader, encodedPayload] = token.split('.');
  
      // Decode the payload (Base64 decoding)
      const decodedPayload = atob(encodedPayload);
  
      // Parse the JSON payload to get the token claims
      const claims = JSON.parse(decodedPayload);
  
      // Extract the role from the claims
      const role = claims.role || 'user'; // Default to 'user' if 'role' is not present
  
      return role;
    } catch (error) {
      console.error('Error decoding and extracting role from JWT:', error);
      return 'user'; // Default to 'user' in case of an error
    }
  };
module.exports = extractRoleFromToken;