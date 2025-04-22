"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    const provider = params.get("provider");
    if (code && provider) {
      // Send code and provider to your authenticate action
      const formData = new FormData();
      formData.append("oauthProvider", provider);
      formData.append("oauthCode", code);

      fetch("/api/auth/oauth", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            router.push("/dashboard");
          } else {
            // handle error, e.g. show a message or redirect
            router.push("/auth?error=oauth");
          }
        });
    }
  }, [params, router]);

  return <div>Signing you in...</div>;
}
