// A YouTube video embedded through youtube-nocookie.com, with a plain link as a fallback for a
// video that has been removed or no longer allows embedding.
export function VideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="video-embed">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
