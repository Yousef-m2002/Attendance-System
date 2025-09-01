
import SignInPage from '../../_components/Authentications/SignInPage'
import { Suspense } from "react";
export const dynamic = "force-dynamic"; // يمنع Static Generation

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInPage/>
    </Suspense>
  );
}
