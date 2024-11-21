import axios, { AxiosRequestConfig } from 'axios';
import instance, { BASE } from './api';
import { BaseError } from './commonTypes';
import { toast } from 'react-toastify';

interface AccessTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const refreshAccessToken = async (): Promise<AccessTokenResponse> => {
  const refreshToken = window.localStorage.getItem('JWTRefresh');

  try {
    const response = await axios.post(`${BASE}/auth/token/refresh`, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    const baseError = error as BaseError;
    const errorStatus = baseError?.response.status;
    const errorDetail = baseError?.response?.data?.detail;
    toast.error(
      `Refresh token request error
          ${errorStatus ? `Status: ${errorStatus};` : ''}
          ${errorDetail ? `Details: ${errorDetail}` : ''}`
    );
    return { accessToken: '', refreshToken: '' };
  }
};

export const logout = () => {
  window.localStorage.removeItem('JWT');
  window.localStorage.removeItem('JWTRefresh');
  document.location.href = '/login';
};

export const handle401 = async (
  originalRequest: { _retry: boolean } & AxiosRequestConfig
) => {
  if (originalRequest._retry) {
    toast.error('Got unauthorized error after token refresh, logging out...');
    logout();
    return Promise.reject();
  }
  originalRequest._retry = true;

  const { accessToken, refreshToken } = await refreshAccessToken();
  if (accessToken && refreshToken) {
    window.localStorage.setItem('JWT', `${accessToken}`);
    window.localStorage.setItem('JWTRefresh', `${refreshToken}`);

    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return instance(originalRequest);
  }
  logout();
  return Promise.reject();
};

export const handleDarkMode = (
  turnOnHandler: () => void,
  turnOffHandler: () => void
) => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    turnOnHandler();
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      if (event.matches) {
        turnOnHandler();
      } else {
        turnOffHandler();
      }
    });
};

export const prettifyDate = (epochDate: number) =>
  new Date(epochDate).toLocaleString([], {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const fakeDelay = (delayMs = 500) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayMs);
  });
};
