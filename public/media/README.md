# Drop your demo video here

Put the Claude Code demo video in this folder as **`demo.mp4`**:

    public/media/demo.mp4

Then it will be served at  https://ntu-library.openskillshub.org/media/demo.mp4
and embedded on the home page ("See it in action").

Tips:
- Keep it under ~25 MB (Cloudflare per-file asset limit). A 60–90s 720p H.264
  screen recording is usually 5–15 MB. Compress with e.g.:
    ffmpeg -i input.mov -vcodec libx264 -crf 26 -preset slow -movflags +faststart -an public/media/demo.mp4
- .mp4 (H.264) plays everywhere. .webm also works.
