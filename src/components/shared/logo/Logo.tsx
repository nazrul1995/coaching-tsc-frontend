'use client'
import React from 'react';
import Link from 'next/link';

const Logo = () => {
    return (
        <>
          {/* Logo */}
        <Link href="/" className="text-3xl font-black tracking-tighter text-[#adc6ff] font-headline">
          Lens
        </Link>
        </>
    );
};

export default Logo;