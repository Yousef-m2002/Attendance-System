
import NewPassword from '../_components/Authentications/NewPassword'
import { Suspense } from "react";
export const dynamic = "force-dynamic"; // يمنع Static Generation

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <NewPassword/>
    </Suspense>
  );
}
