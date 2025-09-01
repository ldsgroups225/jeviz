import { Hero } from "./hero";
import { MonorepoSection } from "./monorepo-section";
import { DatabaseSection } from "./database-section";
import { AuthSection } from "./auth-section";
import { PaymentsSection } from "./payments-section";

export function HomePage() {
  return (
    <>
      <Hero />
      <MonorepoSection />
      <DatabaseSection />
      <AuthSection />
      <PaymentsSection />
    </>
  );
}