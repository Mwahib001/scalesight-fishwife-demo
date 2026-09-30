import { VariantPlanning } from "../../components/VariantPlanning";
export const metadata = {
  title: "SKU & Size Planning | ScaleSight × NATURANA",
};
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense fallback={<p>Loading the supplied capsule…</p>}>
      <VariantPlanning />
    </Suspense>
  );
}
