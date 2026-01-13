import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface DecodedToken {
  exp: number;
  iat: number;
  id: string;
  role: string;
}

const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  const timeUntilExpiry = decoded.exp - currentTime;
  
  return timeUntilExpiry < 120;
};

export const useTokenRefresh = () => {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshAccessToken = async (): Promise<boolean> => {
    const refToken = localStorage.getItem("refreshToken");
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({refreshToken: refToken})
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.accessToken) {
        localStorage.setItem('adminToken', data.accessToken);
        cookieStore.set('adminToken', data.accessToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      localStorage.removeItem('adminToken');
      router.push('/signin');
      return false;
    }
  };

  const checkAndRefreshToken = async () => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      router.push('/signin');
      return;
    }

    if (isTokenExpiringSoon(token)) {
      await refreshAccessToken();
    }
  };

  useEffect(() => {
    checkAndRefreshToken();

    intervalRef.current = setInterval(() => {
      checkAndRefreshToken();
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { refreshAccessToken, checkAndRefreshToken };
};