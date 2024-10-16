import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUserStore } from '../stores/userStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state._id);

  useEffect(() => {
    if (user) {
      navigate({ to: '/feed' });
    }
  }, [user, navigate]);
};