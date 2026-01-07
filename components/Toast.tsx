import { useEffect } from "react";

type Props = {
  message: string | null;
  onClose: () => void;
};

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => onClose(), 2400);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-center text-xs font-semibold text-white shadow-lg">
      {message}
    </div>
  );
}
