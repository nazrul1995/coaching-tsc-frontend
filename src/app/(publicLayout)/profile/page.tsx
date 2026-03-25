'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user, isLoggedIn } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0b1326]">
        <p className="text-xl">Please login to view your profile.</p>
      </div>
    );
  }

  const handleUpdate = () => {
    alert('Profile updated (dummy)');
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white/5 p-8 rounded-3xl shadow-lg border border-white/10">
        <h1 className="text-3xl font-bold mb-8 text-[#adc6ff]">Your Profile</h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || 'Profile Picture'}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-[#adc6ff]/20 flex items-center justify-center text-2xl text-[#adc6ff] rounded-full">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 flex flex-col gap-4">
            <p>
              <span className="text-white/70">Name: </span>
              <span className="text-white font-medium">{user?.name}</span>
            </p>
            <p>
              <span className="text-white/70">Email: </span>
              <span className="text-white font-medium">{user?.email}</span>
            </p>
            <p>
              <span className="text-white/70">Role: </span>
              <span className="text-[#6ffbbe] font-medium capitalize">{user?.role}</span>
            </p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="flex flex-col gap-4 mb-6">
          <label className="text-white/70 text-sm">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#adc6ff]"
            placeholder="Your Name"
          />

          <label className="text-white/70 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#adc6ff]"
            placeholder="Your Email"
          />

          <label className="text-white/70 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#adc6ff]"
            placeholder="New Password"
          />
        </div>

        <Button
          className="bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] font-bold text-lg px-10 py-4 rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105"
          onClick={handleUpdate}
        >
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;