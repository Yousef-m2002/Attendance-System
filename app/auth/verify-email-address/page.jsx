import VerifyEmail from "../../_components/Authentications//Ass"
import { Suspense } from "react";
export const dynamic = "force-dynamic"; // يمنع Static Generation

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
       <VerifyEmail/>
    </Suspense>
  );
}
