import api from './api';

const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

const updateUserProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

const changePassword = async (passwordData) => {
  const response = await api.put('/users/change-password', passwordData);
  return response.data;
};

const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await api.post('/users/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const userProfileService = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfileImage
};

export default userProfileService;