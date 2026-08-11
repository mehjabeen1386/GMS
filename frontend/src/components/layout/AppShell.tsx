// // Purpose: Conditional App Shell to render Sidebar/Navbar only on internal pages
// // Path: frontend/src/components/layout/AppShell.tsx

// 'use client';

// import React, { useState } from 'react';
// import { usePathname } from 'next/navigation';
// import Sidebar from '@/components/layout/Sidebar';
// import Navbar from '@/components/layout/Navbar';

// export default function AppShell({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   // Pages that should NOT show the sidebar/navbar (Landing, Login, Register)
//   const isPublicPage = 
//     pathname === '/' || 
//     pathname.startsWith('/login') || 
//     pathname.startsWith('/register');

//   if (isPublicPage) {
//     return <>{children}</>;
//   }

//   // Internal pages get the clean Sidebar + Navbar layout frame exactly once
//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       <Sidebar 
//         isMobileOpen={isMobileOpen} 
//         onMobileClose={() => setIsMobileOpen(false)} 
//       />
//       <div className="flex flex-1 flex-col min-w-0">
//         <Navbar onMobileMenuToggle={() => setIsMobileOpen(true)} />
//         <main className="flex-1 overflow-y-auto bg-muted/10 p-4 sm:p-6 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }