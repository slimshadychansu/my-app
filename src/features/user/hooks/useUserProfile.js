import { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../../../store/atoms';
import { userApi } from '../api/userApi';

export function useUserProfile() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userApi.getProfile();
      const updatedUser = {
        ...user,
        ...response.data,
        isLoggedIn: true
      };
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || '프로필 조회에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, setUser]);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const response = await userApi.updateProfile(profileData);
      const updatedUser = {
        ...user,
        ...response.data
      };
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || '프로필 업데이트에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, setUser]);

  const updatePreferences = useCallback(async (preferences) => {
    setLoading(true);
    try {
      const response = await userApi.updatePreferences(preferences);
      const updatedUser = {
        ...user,
        preferences: response.data
      };
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || '취향 정보 업데이트에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, setUser]);

  return {
    user,
    fetchProfile,
    updateProfile,
    updatePreferences,
    loading,
    error
  };
}