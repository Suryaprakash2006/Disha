import React from 'react';
import { Loader2, Inbox } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <Loader2 className="animate-spin mb-2" size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 card">
      <Inbox size={32} className="mb-3" />
      <p className="text-slate-600 font-medium">{title}</p>
      {subtitle && <p className="text-sm mt-1 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-red-500 card border-red-100">
      <p className="font-medium">{message}</p>
    </div>
  );
}
