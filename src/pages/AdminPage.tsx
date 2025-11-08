
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Admin from "./Admin";
import { AdminProvider } from "@/context/AdminContext";

const AdminPage: React.FC = () => {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (!isLoading && user && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAdmin ? (
    <AdminProvider>
      <Admin />
    </AdminProvider>
  ) : null;
};

export default AdminPage;
