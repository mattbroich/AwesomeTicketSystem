"use client";

import { signOut } from './api/auth/actions';
import { LogOut } from 'lucide-react';

const Logout = () => {

  const handleSignout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  }
  return (
    <span
      className="cursor-pointer"
      onClick={() => {
        handleSignout();
      }}
    >
      <LogOut></LogOut>
    </span>
  );
};

export default Logout;