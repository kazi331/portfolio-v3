'use client';

import Footer from '@/components/layout/Footer';
import ContactCTA from '@/components/sections/ContactCTA';
import ExperienceV2 from '@/components/sections/ExperienceV2';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import GithubPreview from '@/components/sections/GithubPreview';
import HeroV3 from '@/components/sections/HeroV3';
import RecentBlog from '@/components/sections/RecentBlog';
import Services from '@/components/sections/Services';
import Stats from '@/components/sections/Stats';
import TechStackV2 from '@/components/sections/TechStackV2';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence> */}


      <div className="bg-[#090909] text-primary-text min-h-screen relative font-sans antialiased selection:bg-accent/20 selection:text-primary-text">
        <main id="main-content">
          <HeroV3 />
          <Stats />
          <FeaturedProjects />
          <TechStackV2 />
          <ExperienceV2 />
          <Services />
          {/* <Testimonials /> */}
          <RecentBlog />
          <GithubPreview />
          <ContactCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
