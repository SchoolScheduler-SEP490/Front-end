"use client";
const HeaderSection = dynamic(() => import("./_components/section_header"));
const JoinCommunitySection = dynamic(
  () => import("./_components/section_join")
);
import dynamic from "next/dynamic";
export default function Home() {
  return (
    <div className="w-screen">

      <div className="mb-24">
        <HeaderSection />
      </div>

      <div className="mb-16">
        <JoinCommunitySection />
      </div>
    </div>
  );
}
