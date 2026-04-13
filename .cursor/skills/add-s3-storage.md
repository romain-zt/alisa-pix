# Skill: Add S3 Storage

Step-by-step guide to set up S3-compatible object storage for Payload media.

## Steps

### 1. Add MinIO to Docker Compose

```yaml
# docker-compose.yml
services:
  minio:
    image: minio/minio:latest
    ports:
      - '9000:9000'
      - '9001:9001'
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

  # Optional: auto-create bucket on startup
  minio-init:
    image: minio/mc:latest
    depends_on:
      - minio
    entrypoint: >
      /bin/sh -c "
      sleep 3 &&
      mc alias set local http://minio:9000 minioadmin minioadmin &&
      mc mb local/rfe-media --ignore-existing &&
      mc anonymous set download local/rfe-media
      "

volumes:
  minio_data:
```

### 2. Install the Payload S3 adapter

```bash
pnpm add @payloadcms/storage-s3
```

### 3. Configure in payload.config.ts

```typescript
import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  // ...
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
        region: process.env.S3_REGION || 'us-east-1',
        forcePathStyle: true, // Required for MinIO
      },
    }),
  ],
})
```

### 4. Set environment variables

```env
# .env.local (local dev with MinIO)
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=rfe-media
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_REGION=us-east-1
```

### 5. Configure Next.js for remote images

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/rfe-media/**',
      },
      // Production:
      // { protocol: 'https', hostname: 'cdn.rohmfeiferentertainment.com' },
    ],
  },
}
```

### 6. Verify

- [ ] `docker compose up -d` starts MinIO
- [ ] MinIO console accessible at `http://localhost:9001`
- [ ] Bucket `rfe-media` exists
- [ ] Upload a test image via Payload admin
- [ ] Image is stored in MinIO (check console)
- [ ] Image loads in the frontend via the S3 URL
- [ ] `pnpm build` passes

### 7. Production considerations

- Replace MinIO env vars with real S3/R2 credentials
- Add a CDN in front of S3 for public assets
- Set appropriate CORS on the S3 bucket
- Update `remotePatterns` in next.config for the production domain
- Consider `generateFileURL` in the storage config for CDN URLs
