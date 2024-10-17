"use client";
const HeaderSection = dynamic(() => import("./_components/section_header"));
const JoinCommunitySection = dynamic(
  () => import("./_components/section_join")
);
const ContactSection = dynamic(() => import("./_components/section_contact"));
const MapSection = dynamic(() => import("./_components/section_map"));
const FAQSection = dynamic(() => import("./_components/section_faq"));
import dynamic from "next/dynamic";
export default function Home() {
  return (
    <div className="w-screen">
      <div className="mb-24">
        <HeaderSection />
      </div>

      <div className="mb-16">
        <ContactSection/>
      </div>

      <div className="mb-16">
        <MapSection/>
      </div>

      <div className="mb-16">
        <FAQSection/>
      </div>

      <div className="mb-16">
        <JoinCommunitySection />
      </div>
    </div>
  );
}
