# SSUP - 최종 구현 명세서 (v1.0 MVP)

> 위치 기반 익명 포스팅 서비스

---

## 1. 프로젝트 개요

### 1.1 서비스 설명

SSUP은 위치 기반 익명 포스팅 서비스입니다.
사용자는 자신의 위치 반경 5km 내의 포스트만 볼 수 있으며,
해당 범위 내에서만 포스트 작성, 댓글, 좋아요가 가능합니다.
포스트는 24시간 후 자동 만료됩니다.

### 1.2 핵심 가치

| 가치          | 설명                      |
| ------------- | ------------------------- |
| **위치 기반** | 5km 반경 내 콘텐츠만 표시 |
| **익명성**    | 닉네임 기반, 실명 불필요  |
| **휘발성**    | 24시간 후 포스트 만료     |
| **접근성**    | 로그인 없이 둘러보기 가능 |

### 1.3 타겟

- **지역**: 미국 (전세계 확장 가능)
- **플랫폼**: 모바일 웹 우선 (Mobile-first)
- **언어**: UI 영어 / 사용자 입력 다국어

---

## 2. 기술 스택

### 2.1 Frontend

| 기술          | 버전 | 용도                          |
| ------------- | ---- | ----------------------------- |
| Next.js       | 14+  | React 프레임워크 (App Router) |
| TypeScript    | 5+   | 타입 안정성                   |
| Tailwind CSS  | 3+   | 스타일링                      |
| React Leaflet | 4+   | 지도 컴포넌트                 |
| Leaflet       | 1.9+ | 지도 라이브러리               |

### 2.2 Backend & Database

| 기술              | 용도                         |
| ----------------- | ---------------------------- |
| Supabase          | BaaS (Backend as a Service)  |
| PostgreSQL        | 데이터베이스 (Supabase 제공) |
| PostGIS           | 위치 기반 쿼리               |
| Supabase Auth     | 인증 (이메일 + 비밀번호)     |
| Supabase Storage  | 이미지 저장 (5MB 제한)       |
| Supabase Realtime | 실시간 피드 업데이트         |

### 2.3 지도

| 기술          | 용도                       |
| ------------- | -------------------------- |
| Leaflet       | 지도 라이브러리 (무료)     |
| OpenStreetMap | 지도 타일                  |
| CartoDB Light | 스타일 타일 (무료, 미니멀) |

### 2.4 배포 & 인프라

| 기술               | 용도           |
| ------------------ | -------------- |
| Vercel             | 호스팅 & CI/CD |
| Vercel 기본 도메인 | 초기 도메인    |

---

## 3. 핵심 기능 정의

### 3.1 인증 & 사용자

| 기능            | 설명                       | 상세             |
| --------------- | -------------------------- | ---------------- |
| **둘러보기**    | 로그인 없이 포스트 조회    | 위치 허용 필요   |
| **회원가입**    | 이메일 + 비밀번호 + 닉네임 | 닉네임 중복 불가 |
| **로그인**      | 이메일 + 비밀번호          | -                |
| **로그아웃**    | 세션 종료                  | -                |
| **프로필 수정** | 닉네임, 아바타 변경        | 닉네임 중복 체크 |

### 3.2 포스트

| 기능            | 설명                  | 상세                     |
| --------------- | --------------------- | ------------------------ |
| **포스트 조회** | 5km 내 포스트 목록    | 최신순 정렬, 실시간 갱신 |
| **포스트 작성** | 텍스트 + 이미지(선택) | 280자, 이미지 1장(5MB)   |
| **포스트 삭제** | 본인 포스트만         | Soft delete              |
| **포스트 만료** | 24시간 후 자동 숨김   | expires_at 기준          |
| **포스트 수정** | 불가 (MVP)            | 확장성 고려              |

### 3.3 댓글

| 기능          | 설명               | 상세                |
| ------------- | ------------------ | ------------------- |
| **댓글 조회** | 포스트의 댓글 목록 | 시간순              |
| **댓글 작성** | 텍스트만           | 280자, 5km 내에서만 |
| **댓글 삭제** | 본인 댓글만        | Soft delete         |
| **멘션**      | @닉네임 태그       | 대댓글 대체         |
| **대댓글**    | 없음               | 멘션으로 대체       |

### 3.4 좋아요

| 기능          | 설명                 | 상세            |
| ------------- | -------------------- | --------------- |
| **좋아요**    | 포스트/댓글에 좋아요 | 토글 방식       |
| **좋아요 수** | 카운트 표시          | 실시간 업데이트 |

### 3.5 피드 & 지도

| 기능           | 설명                   | 상세               |
| -------------- | ---------------------- | ------------------ |
| **리스트 뷰**  | 기본 피드 (Default)    | 포스트 카드 목록   |
| **지도 뷰**    | 토글로 전환            | Lazy load, 핀 표시 |
| **내 위치**    | 현재 위치 표시         | 5km 바운더리 원    |
| **정렬 변경**  | 최신순/가까운순/인기순 | 드롭다운           |
| **새 글 알림** | "N개의 새 포스트"      | 버튼 클릭 시 갱신  |

### 3.6 위치

| 기능            | 설명                       | 상세                 |
| --------------- | -------------------------- | -------------------- |
| **위치 권한**   | 브라우저 Geolocation       | 필수                 |
| **반경**        | 5km 고정                   | 사용자 변경 불가     |
| **포스트 위치** | 작성 시점 고정             | 작성자 이동해도 유지 |
| **위치 갱신**   | 앱 사용 중 주기적 업데이트 | 피드 자동 갱신       |

### 3.7 MVP 제외 기능

| 기능        | 상태 | 비고             |
| ----------- | ---- | ---------------- |
| 소셜 로그인 | 제외 | v1.1 이후        |
| 북마크/저장 | 제외 | 확장성 고려      |
| 공유        | 제외 | 확장성 고려      |
| 신고/차단   | 제외 | v2.0 이후        |
| 다크모드    | 제외 | 라이트 모드 고정 |
| 푸시 알림   | 제외 | v1.1 이후        |

---

## 4. 데이터베이스 스키마

### 4.1 ERD 개요

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │────<│   posts     │────<│  comments   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   ▼                   │
       │            ┌─────────────┐            │
       └───────────>│   likes     │<───────────┘
                    └─────────────┘
```

### 4.2 테이블 상세

#### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(30) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_users_nickname ON users(nickname);
```

#### posts

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content VARCHAR(280) NOT NULL,
  image_url TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- 확장성: 나중에 추가 가능
  -- category VARCHAR(50),
  -- is_edited BOOLEAN DEFAULT FALSE,

  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- 인덱스
CREATE INDEX idx_posts_location ON posts USING GIST(location);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_expires_at ON posts(expires_at);
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

#### comments

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content VARCHAR(280) NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- 인덱스
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

#### likes

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 확장성: reaction_type VARCHAR(20) DEFAULT 'like',

  -- 하나의 대상에만 좋아요 가능
  CONSTRAINT like_target CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),

  -- 중복 좋아요 방지
  CONSTRAINT unique_post_like UNIQUE (user_id, post_id),
  CONSTRAINT unique_comment_like UNIQUE (user_id, comment_id)
);

-- 인덱스
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_comment_id ON likes(comment_id);
```

### 4.3 위치 기반 쿼리 함수

```sql
-- 반경 내 포스트 조회 함수
CREATE OR REPLACE FUNCTION get_nearby_posts(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 5000,
  sort_by TEXT DEFAULT 'recent'
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  nickname VARCHAR,
  avatar_url TEXT,
  content VARCHAR,
  image_url TEXT,
  distance_meters DOUBLE PRECISION,
  likes_count BIGINT,
  comments_count BIGINT,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    u.nickname,
    u.avatar_url,
    p.content,
    p.image_url,
    ST_Distance(
      p.location::geography,
      ST_MakePoint(user_lng, user_lat)::geography
    ) as distance_meters,
    (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as likes_count,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.deleted_at IS NULL) as comments_count,
    p.created_at,
    p.expires_at
  FROM posts p
  JOIN users u ON p.user_id = u.id
  WHERE
    p.deleted_at IS NULL
    AND p.expires_at > NOW()
    AND ST_DWithin(
      p.location::geography,
      ST_MakePoint(user_lng, user_lat)::geography,
      radius_meters
    )
  ORDER BY
    CASE
      WHEN sort_by = 'recent' THEN p.created_at
      ELSE NULL
    END DESC NULLS LAST,
    CASE
      WHEN sort_by = 'distance' THEN ST_Distance(
        p.location::geography,
        ST_MakePoint(user_lng, user_lat)::geography
      )
      ELSE NULL
    END ASC NULLS LAST,
    CASE
      WHEN sort_by = 'popular' THEN (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id)
      ELSE NULL
    END DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;
```

### 4.4 Row Level Security (RLS)

```sql
-- Posts RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능 (위치 필터는 앱에서)
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (deleted_at IS NULL AND expires_at > NOW());

-- 본인만 작성 가능
CREATE POLICY "Users can create their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 본인만 삭제 가능 (soft delete)
CREATE POLICY "Users can delete their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Comments, Likes도 유사하게 설정
```

---

## 5. 페이지 & 화면 구조

### 5.1 페이지 목록

```
/                     # 메인 피드 (리스트 뷰 기본)
├── ?view=map        # 지도 뷰 (쿼리 파라미터)
│
/post/[id]           # 포스트 상세 + 댓글
/post/new            # 포스트 작성 (로그인 필요)
│
/auth
├── /login           # 로그인
├── /signup          # 회원가입
│
/profile
├── /                # 내 프로필
├── /edit            # 프로필 수정
├── /posts           # 내가 쓴 포스트
```

### 5.2 화면 와이어프레임

#### 메인 피드 (리스트 뷰)

```
┌─────────────────────────────┐
│ 📍 Current Location    [🗺️] │  ← 지도 토글
├─────────────────────────────┤
│ [최신순 ▼]     🔄 3 new     │  ← 정렬 + 새글 알림
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 😀 nickname · 5m · 150m │ │  ← 아바타, 닉네임, 시간, 거리
│ │                         │ │
│ │ 포스트 내용이 여기에     │ │
│ │ 표시됩니다...            │ │
│ │                         │ │
│ │ [🖼️ 이미지]              │ │
│ │                         │ │
│ │ ❤️ 12    💬 5           │ │  ← 좋아요, 댓글 수
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 😀 nickname · 2h · 1km  │ │
│ │ ...                     │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│         [+ 글쓰기]          │  ← FAB 버튼
└─────────────────────────────┘
```

#### 지도 뷰

```
┌─────────────────────────────┐
│ 📍 Current Location    [📋] │  ← 리스트 토글
├─────────────────────────────┤
│                             │
│    📍  포스트1              │
│         ⭕ 나               │  ← 내 위치 + 5km 원
│    📍  포스트2              │
│  ┈┈┈┈┈┈┈┈┈┈┈┈┈             │
│        (5km)                │
│              📍 포스트3     │
│                             │
├─────────────────────────────┤
│ 🗺️ OpenStreetMap            │
├─────────────────────────────┤
│         [+ 글쓰기]          │
└─────────────────────────────┘
```

#### 포스트 상세

```
┌─────────────────────────────┐
│ ← Back                      │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ 😀 nickname · 5m · 150m │ │
│ │                         │ │
│ │ 포스트 전체 내용         │ │
│ │                         │ │
│ │ [🖼️ 이미지]              │ │
│ │                         │ │
│ │ ❤️ 12    💬 5           │ │
│ │ ⏱️ 23h left             │ │  ← 만료까지 남은 시간
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ Comments (5)                │
├─────────────────────────────┤
│ 😀 user1 · 3m               │
│ 댓글 내용...                │
│ ❤️ 3                        │
├─────────────────────────────┤
│ 😀 user2 · 10m              │
│ @user1 멘션 댓글...         │
│ ❤️ 1                        │
├─────────────────────────────┤
│ [댓글 입력...]        [전송] │
└─────────────────────────────┘
```

#### 포스트 작성

```
┌─────────────────────────────┐
│ ✕ Cancel           [Post]  │
├─────────────────────────────┤
│ 📍 Your current location    │
│    will be attached         │
├─────────────────────────────┤
│                             │
│ What's happening nearby?    │
│                             │
│ ____________________________│
│ |                          ||
│ |  텍스트 입력 영역         ||
│ |                          ||
│ |__________________________||
│                             │
│ 234/280                     │  ← 글자 수
├─────────────────────────────┤
│ [🖼️ Add Image]              │
│                             │
│ ┌─────────────────────────┐ │
│ │ [선택된 이미지 미리보기] │ │
│ │              [❌ 제거]  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 6. 프로젝트 구조

```
/ssup
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   ├── page.tsx             # 메인 피드
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── post/
│   │   │   ├── [id]/page.tsx    # 포스트 상세
│   │   │   └── new/page.tsx     # 포스트 작성
│   │   └── profile/
│   │       ├── page.tsx
│   │       ├── edit/page.tsx
│   │       └── posts/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # 기본 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── Container.tsx
│   │   ├── post/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── PostForm.tsx
│   │   │   └── PostDetail.tsx
│   │   ├── comment/
│   │   │   ├── CommentList.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   └── CommentForm.tsx
│   │   ├── map/
│   │   │   ├── MapView.tsx
│   │   │   ├── PostMarker.tsx
│   │   │   └── RadiusCircle.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── SignupForm.tsx
│   │
│   ├── hooks/
│   │   ├── useLocation.ts        # 위치 관리
│   │   ├── useAuth.ts            # 인증 상태
│   │   ├── usePosts.ts           # 포스트 CRUD
│   │   ├── useComments.ts        # 댓글 CRUD
│   │   └── useRealtime.ts        # 실시간 구독
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Supabase 클라이언트
│   │   │   ├── server.ts         # 서버 클라이언트
│   │   │   └── database.types.ts # 타입 정의
│   │   ├── utils/
│   │   │   ├── distance.ts       # 거리 계산
│   │   │   ├── time.ts           # 시간 포맷
│   │   │   └── validation.ts     # 입력 검증
│   │   └── constants.ts          # 상수 정의
│   │
│   ├── types/
│   │   ├── post.ts
│   │   ├── comment.ts
│   │   ├── user.ts
│   │   └── location.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── icons/
│   └── images/
│
├── supabase/
│   ├── migrations/               # DB 마이그레이션
│   └── seed.sql                  # 시드 데이터
│
├── .env.local                    # 환경변수 (로컬)
├── .env.example                  # 환경변수 예시
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 7. 환경 변수

```env
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Config
NEXT_PUBLIC_DEFAULT_RADIUS_METERS=5000
NEXT_PUBLIC_POST_EXPIRY_HOURS=24
NEXT_PUBLIC_MAX_POST_LENGTH=280
NEXT_PUBLIC_MAX_IMAGE_SIZE_MB=5
```

---

## 8. 구현 로드맵

### Phase 1: 프로젝트 셋업 (1-2일)

- [ ] Next.js 14 + TypeScript 초기화
- [ ] Tailwind CSS 설정
- [ ] Supabase 프로젝트 생성 & 연동
- [ ] 환경변수 설정
- [ ] 기본 폴더 구조 생성
- [ ] Vercel 배포 설정

### Phase 2: 데이터베이스 (1-2일)

- [ ] PostGIS 확장 활성화
- [ ] 테이블 생성 (users, posts, comments, likes)
- [ ] 인덱스 생성
- [ ] RLS 정책 설정
- [ ] 위치 기반 쿼리 함수 생성
- [ ] 타입 생성 (supabase gen types)

### Phase 3: 인증 (2-3일)

- [ ] Supabase Auth 설정
- [ ] 회원가입 페이지 & 로직
- [ ] 로그인 페이지 & 로직
- [ ] 로그아웃
- [ ] 인증 상태 관리 (Context/Hook)
- [ ] Protected Route 설정

### Phase 4: 위치 기능 (2-3일)

- [ ] Geolocation Hook 구현
- [ ] 위치 권한 요청 UI
- [ ] 위치 갱신 로직
- [ ] 거리 계산 유틸리티

### Phase 5: 포스트 기능 (3-4일)

- [ ] 피드 조회 (위치 기반)
- [ ] 포스트 카드 컴포넌트
- [ ] 포스트 작성 페이지
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 포스트 삭제
- [ ] 정렬 기능 (최신/거리/인기)
- [ ] 실시간 새 포스트 알림

### Phase 6: 댓글 & 좋아요 (2-3일)

- [ ] 포스트 상세 페이지
- [ ] 댓글 목록 조회
- [ ] 댓글 작성
- [ ] 댓글 삭제
- [ ] @멘션 기능
- [ ] 좋아요 토글
- [ ] 좋아요 수 표시

### Phase 7: 지도 기능 (2-3일)

- [ ] React Leaflet 설정
- [ ] 지도 뷰 컴포넌트
- [ ] 포스트 마커 표시
- [ ] 내 위치 & 반경 원 표시
- [ ] 마커 클릭 → 포스트 이동
- [ ] 리스트/지도 뷰 토글

### Phase 8: 프로필 (1-2일)

- [ ] 프로필 페이지
- [ ] 프로필 수정
- [ ] 아바타 업로드
- [ ] 내 포스트 목록

### Phase 9: 마무리 (2-3일)

- [ ] 에러 처리 & 로딩 상태
- [ ] 반응형 확인 (모바일 최적화)
- [ ] 성능 최적화
- [ ] 테스트
- [ ] 최종 배포

---

## 9. 예상 일정

| Phase            | 기간  | 누적     |
| ---------------- | ----- | -------- |
| 1. 프로젝트 셋업 | 1-2일 | 2일      |
| 2. 데이터베이스  | 1-2일 | 4일      |
| 3. 인증          | 2-3일 | 7일      |
| 4. 위치 기능     | 2-3일 | 10일     |
| 5. 포스트 기능   | 3-4일 | 14일     |
| 6. 댓글 & 좋아요 | 2-3일 | 17일     |
| 7. 지도 기능     | 2-3일 | 20일     |
| 8. 프로필        | 1-2일 | 22일     |
| 9. 마무리        | 2-3일 | **25일** |

**예상 총 기간: 3-4주**

---

## 10. 비용 예측

### Supabase

| 단계     | MAU      | 플랜 | 월 비용  |
| -------- | -------- | ---- | -------- |
| MVP/초기 | ~1,000   | Free | $0       |
| 성장기   | ~10,000  | Pro  | ~$25     |
| 확장기   | ~50,000  | Pro  | ~$35-45  |
| 대규모   | 100,000+ | Pro  | ~$50-100 |

### Vercel

- Hobby (무료): 개인 프로젝트용
- Pro ($20/월): 팀 협업 시

### 지도

- Leaflet + OpenStreetMap + CartoDB: **$0 (무료)**

---

## 11. 확장 고려 사항 (MVP 이후)

### v1.1

- 소셜 로그인 (Google, Apple)
- 푸시 알림
- 북마크/저장 기능

### v1.2

- 다크 모드
- 포스트 수정
- 이미지 여러 장

### v2.0

- DM (1:1 메시지)
- 신고/차단 기능
- 카테고리/태그

### v3.0

- 그룹 채팅방
- 반경 설정 (사용자 선택)
- Flutter 모바일 앱

---

## 12. 기술 선택 근거

### Supabase 선택 이유

1. **PostGIS 지원**: 위치 기반 쿼리에 최적화
2. **비용 효율**: 리소스 기반 과금 (Firebase 대비 저렴)
3. **실시간 기능**: Realtime 내장
4. **익명 인증**: Anonymous Auth 지원
5. **무료 티어**: MVP 개발에 충분

### Leaflet + OSM 선택 이유

1. **완전 무료**: 확장해도 비용 없음
2. **충분한 기능**: 마커, 바운더리 표시 가능
3. **가벼움**: 모바일 친화적
4. **CartoDB 스타일**: 무료로 예쁜 지도

### Next.js 14 선택 이유

1. **App Router**: 최신 React 패턴
2. **서버 컴포넌트**: 성능 최적화
3. **Vercel 최적화**: 배포 간편
4. **TypeScript**: 타입 안정성

---

## 부록: 주요 결정 사항 요약

| 카테고리        | 결정                    |
| --------------- | ----------------------- |
| 반경            | 5km 고정                |
| 포스트 유효기간 | 24시간                  |
| 포스트 글자 수  | 280자                   |
| 이미지          | 1장, 5MB 제한           |
| 포스트 수정     | 불가 (MVP)              |
| 대댓글          | 없음 (@멘션으로 대체)   |
| 인증            | 이메일 + 비밀번호       |
| 닉네임          | 직접 입력, 중복 불가    |
| 아바타          | 기본 제공 + 업로드 옵션 |
| 기본 뷰         | 리스트 (지도는 토글)    |
| 기본 정렬       | 최신순                  |
| 언어            | UI 영어, 입력 다국어    |
| 다크모드        | 없음 (라이트 고정)      |
| 알림            | 없음 (MVP)              |
