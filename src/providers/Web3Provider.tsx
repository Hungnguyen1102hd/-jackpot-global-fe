'use client';

import dynamic from 'next/dynamic';

export const Web3Provider = dynamic(
    () => import('./Web3ProviderClient'),
    { ssr: false }
);
