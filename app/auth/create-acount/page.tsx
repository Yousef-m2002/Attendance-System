import Createacount from '../../_components/Authentications/createacount'
import { Suspense } from "react";
export const dynamic = "force-dynamic"; // يمنع Static Generation

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Createacount/>
    </Suspense>
  );
}
