"use client";

const LandingSection = dynamic(() => import("./_components/section_heading"));
const StaffSection = dynamic(() => import("./_components/section_staff"));
const BlogsSection = dynamic(() => import("./_components/section_blogs"));
const FeedbackSection = dynamic(() => import("./_components/section_feedback"));
const JoinCommunitySection = dynamic(() => import("./_components/section_join"));
import dynamic from "next/dynamic";

export default function Home() {
  return (
    <div className="w-screen">
      <div className="mb-24">
        <LandingSection />
      </div>

      <div className="mb-16">
        <StaffSection />
      </div>
      
      <div className="mb-16">
        <BlogsSection />
      </div>

      <div className="mb-16">
        <FeedbackSection />
      </div>

      <div className="mb-16">
        <JoinCommunitySection />
      </div>
    </div>
  );
}
