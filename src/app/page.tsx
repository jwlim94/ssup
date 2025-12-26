/**
 * 메인 피드 페이지
 *
 * 현재: Phase 1 플레이스홀더
 * 추후: 위치 기반 포스트 목록 + 지도 뷰 토글
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">SSUP</h1>
      <p className="text-gray-600 text-center">
        Location-based anonymous posting service
      </p>
      <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-green-700 text-sm">✓ Phase 1 Setup Complete</p>
      </div>

      {/* Phase 1 체크리스트 */}
      <div className="mt-8 text-left text-sm text-gray-500">
        <p className="font-medium mb-2">Setup Checklist:</p>
        <ul className="space-y-1">
          <li>✓ Next.js 14 + TypeScript</li>
          <li>✓ Tailwind CSS</li>
          <li>✓ Supabase Client</li>
          <li>✓ React Leaflet</li>
          <li>✓ Project Structure</li>
        </ul>
      </div>
    </main>
  );
}
