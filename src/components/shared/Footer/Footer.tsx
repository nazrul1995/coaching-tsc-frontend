import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#0b1326] text-white border-t border-white/10">
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#adc6ff] to-transparent opacity-40" />

      <div className="max-w-[1440px] mx-auto px-8 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="space-y-5">
          <h2 className="text-3xl font-black tracking-tight text-[#adc6ff]">
            Lens
          </h2>
          <p className="text-white/70 leading-relaxed text-sm">
            A modern learning platform designed to help students succeed with 
            expert teachers, live classes, and structured exam preparation.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 pt-2">
            <a className="p-2 rounded-full bg-white/10 hover:bg-[#adc6ff]/20 transition">
              <Facebook size={18} />
            </a>
            <a className="p-2 rounded-full bg-white/10 hover:bg-[#adc6ff]/20 transition">
              <Twitter size={18} />
            </a>
            <a className="p-2 rounded-full bg-white/10 hover:bg-[#adc6ff]/20 transition">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-5">Quick Links</h3>
          <ul className="space-y-3 text-white/70 text-sm">
            <li><Link href="#courses" className="hover:text-white">Courses</Link></li>
            <li><Link href="#teachers" className="hover:text-white">Teachers</Link></li>
            <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="#community" className="hover:text-white">Community</Link></li>
          </ul>
        </div>

        {/* Courses */}
        <div>
          <h3 className="font-bold text-lg mb-5">Courses</h3>
          <ul className="space-y-3 text-white/70 text-sm">
            <li>Class 6–8 Foundation</li>
            <li>SSC Preparation</li>
            <li>HSC Science</li>
            <li>Admission Coaching</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-5">Contact</h3>
          <ul className="space-y-4 text-white/70 text-sm">
            <li className="flex items-center gap-3">
              <Mail size={16} />
              support@lens.edu
            </li>
            <li>Chattogram, Bangladesh</li>
            <li>+880 1234-567890</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Lens. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;