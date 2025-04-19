'use client';

import { useEffect, useState } from 'react';
import { Mars, Venus } from 'lucide-react';
import { Button } from '@/components/ui/button';

enum Gender {
  Male = 'male',
  Female = 'female',
}

export default function GenderQuestion() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('gender')) {
      setShow(true);
    }
  }, []);

  const handleSelect = (gender: Gender) => {
    localStorage.setItem('gender', gender);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity">
      <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-[#1a1a1a] border border-white/10 shadow-2xl text-white animate-fadeIn">
        <h2 className="text-2xl font-bold tracking-wide">Select your gender</h2>

        <div className="flex gap-6">
          <GenderButton
            label="Male"
            icon={<Mars className="size-6 text-blue-400" />}
            onClick={() => handleSelect(Gender.Male)}
          />
          <GenderButton
            label="Female"
            icon={<Venus className="size-6 text-pink-400" />}
            onClick={() => handleSelect(Gender.Female)}
          />
        </div>
      </div>
    </div>
  );
}

type GenderButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

function GenderButton({ label, icon, onClick }: GenderButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex items-center gap-2 p-6 rounded-xl hover:text-textD border border-white/10 hover:bg-white/10 transition-all"
    >
      {icon}
      <span className="text-lg font-medium">{label}</span>
    </Button>
  );
}
