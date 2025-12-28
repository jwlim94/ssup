import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl || typeof imageUrl !== "string") {
      return Response.json({ error: "Invalid imageUrl" }, { status: 400 });
    }

    // URL에서 파일 경로 추출
    const path = imageUrl.split("/post-images/")[1];
    if (!path) {
      return Response.json({ error: "Invalid image path" }, { status: 400 });
    }

    // Admin Client로 삭제 (RLS 우회)
    const adminClient = createAdminClient();
    const { error } = await adminClient.storage
      .from("post-images")
      .remove([path]);

    if (error) {
      console.error("Cleanup image error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to cleanup" }, { status: 500 });
  }
}
