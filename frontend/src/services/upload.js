import axiosInstance from './api';

export const uploadEvent = (formData) =>
  axiosInstance.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);

export const uploadSettings = (formData) =>
  axiosInstance.put('/settings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);