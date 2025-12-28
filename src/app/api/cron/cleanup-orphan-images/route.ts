import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminClient = createAdminClient();
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    let deletedCount = 0;

    // 1. Storage에서 모든 사용자 폴더 목록 가져오기
    const { data: userFolders, error: listError } = await adminClient.storage
      .from("post-images")
      .list("", { limit: 1000 });

    if (listError) {
      console.error("Failed to list storage folders:", listError);
      return Response.json({ error: listError.message }, { status: 500 });
    }

    // 2. DB에서 사용 중인 image_url 목록 가져오기
    const { data: posts } = await adminClient
      .from("posts")
      .select("image_url")
      .not("image_url", "is", null);

    const usedUrls = new Set(posts?.map((p) => p.image_url) || []);

    // 3. 각 사용자 폴더 내 파일 확인
    for (const folder of userFolders || []) {
      if (!folder.name) continue;

      const { data: files } = await adminClient.storage
        .from("post-images")
        .list(folder.name, { limit: 1000 });

      for (const file of files || []) {
        if (!file.name) continue;

        const filePath = `${folder.name}/${file.name}`;

        // Public URL 생성
        const {
          data: { publicUrl },
        } = adminClient.storage.from("post-images").getPublicUrl(filePath);

        // 사용 중인 이미지인지 확인
        if (usedUrls.has(publicUrl)) {
          continue; // 사용 중이면 스킵
        }

        // 파일명에서 타임스탬프 추출 (형식: userId/timestamp.ext)
        const timestamp = parseInt(file.name.split(".")[0] || "0");

        // 1시간 이상 된 고아 이미지만 삭제
        if (timestamp && timestamp < oneHourAgo) {
          const { error: deleteError } = await adminClient.storage
            .from("post-images")
            .remove([filePath]);

          if (!deleteError) {
            deletedCount++;
            console.log(`Deleted orphan image: ${filePath}`);
          }
        }
      }
    }

    return Response.json({
      success: true,
      deleted: deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return Response.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
