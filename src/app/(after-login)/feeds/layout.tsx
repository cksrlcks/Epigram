import { PropsWithChildren } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '피드 | 에피그램',
};

export default function Layout({ children }: PropsWithChildren) {
  return <>{children}</>;
}
