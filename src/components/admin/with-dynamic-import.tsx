'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Higher Order Component to wrap admin pages with dynamic import
// This prevents Firebase initialization during static export
export function withDynamicImport<P extends object>(Component: ComponentType<P>) {
  // Create a dynamic component with SSR disabled
  const DynamicComponent = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  });

  // Return the dynamic component
  return function WithDynamicImport(props: P) {
    return <DynamicComponent {...props} />;
  };
}