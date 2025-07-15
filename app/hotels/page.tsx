// ✅ app/hotels/page.tsx
import { Suspense } from "react";
import Hotelfirst from "./Hotelfirst";

export default function SearchResults() {
  return (
    <div className="mt-28">
      <Suspense fallback={<div>Loading...</div>}>
        <Hotelfirst />
      </Suspense>
    </div>
  );
}
