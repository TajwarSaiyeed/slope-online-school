"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (!sessionId || !courseId) {
      router.push("/");
    }

    async function retriveData() {
      await axios.get(
        `/api/courses/${courseId}/checkout?sessionId=${sessionId}`
      );
      router.push(`/courses/${courseId}?success=true`);
    }

    retriveData();
  }, [courseId, router, sessionId]);

  return null;
};

export default SuccessPage;
