import { Suspense } from "react";
import UserChatClient from "./UserChatClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat…</div>}>
      <UserChatClient />
    </Suspense>
  );
}
