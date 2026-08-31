import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import { Loader } from '@/components/ui/Loader';

export const LogoutNotice: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <Loader size="md" text="Cerrando sesión de forma segura…" />
    </div>
  );
};
