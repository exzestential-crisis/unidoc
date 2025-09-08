// components/DoctorSections.tsx
import React from "react";
import { Doctor, DoctorCard, DoctorRowCard } from "@/types/doctor";
import { DoctorRowCard as DoctorRowCardComponent } from "@/components/ui";
import HorizontalShowcase from "@/components/ui/HorizontalShowcase";
import {
  HorizontalShowcaseSkeleton,
  TopDoctorsSkeletons,
} from "@/components/skeletons/DoctorSkeletons";

interface DoctorSectionProps {
  title: string;
  doctors: DoctorCard[];
  loading: boolean;
  showSeeMore?: boolean;
  onSeeMore?: () => void;
}

interface TopDoctorsSectionProps {
  topDoctors: DoctorRowCard[];
  loading: boolean;
}

export const DoctorsNearYouSection: React.FC<DoctorSectionProps> = ({
  title,
  doctors,
  loading,
}) => (
  <div className="flex-col mt-6">
    <h3 className="text-xl font-semibold text-[#525858] mb-4">{title}</h3>
    {loading ? (
      <HorizontalShowcaseSkeleton />
    ) : doctors.length > 0 ? (
      <HorizontalShowcase items={doctors} />
    ) : null}
  </div>
);

export const TopDoctorsSection: React.FC<TopDoctorsSectionProps> = ({
  topDoctors,
  loading,
}) => (
  <>
    <div className="flex justify-between mt-6">
      <h3 className="text-xl font-semibold text-[#525858] my-4">Top Doctors</h3>
      <button className="text-neutral-500 cursor-pointer">See more</button>
    </div>

    {loading ? (
      <TopDoctorsSkeletons />
    ) : topDoctors.length > 0 ? (
      topDoctors.map((doctor, idx) => (
        <div key={doctor.id + idx} className="mb-4">
          <DoctorRowCardComponent {...doctor} />
        </div>
      ))
    ) : (
      <div className="text-center py-8 text-gray-500">No top doctors found</div>
    )}
  </>
);

export const AvailableTodaySection: React.FC<DoctorSectionProps> = ({
  title,
  doctors,
  loading,
}) => (
  <div className="flex-col mt-6">
    <div className="flex justify-between mb-4">
      <h3 className="text-xl font-semibold text-[#525858]">{title}</h3>
      <button className="text-neutral-500 cursor-pointer">See more</button>
    </div>
    {loading ? (
      <HorizontalShowcaseSkeleton />
    ) : doctors.length > 0 ? (
      <HorizontalShowcase items={doctors} />
    ) : (
      <div className="text-center py-8 text-gray-500">
        No doctors available today
      </div>
    )}
  </div>
);
