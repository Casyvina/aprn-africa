import { sanityFetch } from "@/lib/sanity/fetch";
import { TRAINING_PROGRAMS_QUERY } from "@/lib/queries/training";
import type { TrainingProgramCard } from "@/lib/queries/training";
import CoursesPageClient from "@/components/dashboard/CoursesPageClient";

export const metadata = { title: "Training Catalogue | APRN" };

export default async function CoursesPage() {
  const courses = await sanityFetch<TrainingProgramCard[]>(TRAINING_PROGRAMS_QUERY, {}, ["training"]);
  return <CoursesPageClient courses={courses} />;
}
