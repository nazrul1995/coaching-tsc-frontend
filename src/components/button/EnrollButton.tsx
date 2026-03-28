import React from 'react';
import { TCourse } from '@/types/course';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface EnrollButtonProps {
  course: TCourse;
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ course }) => {
  const {user } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const handleEnroll = () => {
    if (user) {
        alert(`Enrolling in course: ${course.title}`);
    }  else {
        router.push(`/login?callbackUrl=${path}`);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      className="bg-green-400 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded"
    >
      Enroll Now
    </button>
  );
};

export default EnrollButton;