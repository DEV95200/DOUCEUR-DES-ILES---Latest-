import { Play } from "lucide-react";
import { useAdminStore } from "../../store/adminStore";
import { SectionHeading } from "../ui/SectionHeading";
import { WaveDivider } from "../ui/WaveDivider";

function extractYoutubeId(url: string) {
  const patterns = [
    /youtu\.be\/([\w-]{6,})/,
    /youtube\.com\/watch\?v=([\w-]{6,})/,
    /youtube\.com\/embed\/([\w-]{6,})/,
    /youtube\.com\/shorts\/([\w-]{6,})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
}

export function VideoSpotlight() {
  const video = useAdminStore((state) => state.video);
  if (!video.enabled) return null;
  const videoId = extractYoutubeId(video.youtubeUrl);

  return (
    <section id="video" className="relative overflow-hidden bg-kala-purple px-6 py-28 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow={video.eyebrow}
          title={video.title}
          tagline={video.description}
          align="left"
          light
        />
        <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-kala-ink shadow-2xl">
          {videoId ? (
            <iframe
              title={video.title}
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex aspect-video items-center justify-center text-center text-white/60">
              <div>
                <Play className="mx-auto mb-3" size={34} />
                URL YouTube invalide
              </div>
            </div>
          )}
        </div>
      </div>
      <WaveDivider color="#fbf3e4" />
    </section>
  );
}
