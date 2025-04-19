import { LoaderCircle } from 'lucide-react';

export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderCircle
        className="animate-[spin_0.5s_linear_infinite]"
        size={size}
      />
    </div>
  );
}
