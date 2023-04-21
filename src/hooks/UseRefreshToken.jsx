import { useEffect } from 'react';
import { useToken } from './MemoryJwtToken';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export function useRefreshToken() {
  const { token, setToken } = useToken();

  useEffect(() => {
    if (!token) {
      const refreshToken = getCookie('refreshToken');
      if (refreshToken) {
        const formData = new FormData();
        formData.append("refreshToken", refreshToken);
        const options = {
          method: "POST",
          body: formData,
        };
        fetch('http://localhost:8080/RefreshToken', options)
          .then((response) => {
            // Log the raw response text
            return response.text().then(text => {
              return JSON.parse(text);
            });
          })
          .then((data) => {
            if (data.token) {
              setToken(data.token);
            }
          })
          .catch((error) => {
            console.error('Error refreshing token:', error);
          });
      }
    }
  }, [token, setToken]);
}
