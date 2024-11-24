/**
 * v0 by Vercel.
 * @see https://v0.dev/t/UHarD6QWOMa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface PodcastEpisode {
  title: string;
  author: string;
  imageUrl: string;
  audioUrl: string;
  description?: string;
  publishDate?: string;
}

interface AudioPlayerProps {
  episode: PodcastEpisode;
}

export default function AudioPlayer({ episode }: AudioPlayerProps) {
  return (
    <Card className="col-span-3 sm:col-span-1">
      <CardHeader>
        <CardTitle>Now playing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="rounded-md overflow-hidden">
            <img
              className="w-full h-32 object-cover"
              src={episode.imageUrl}
              alt={`${episode.title} cover`}
              width="128"
              height="128"
              style={{ aspectRatio: "128/128", objectFit: "cover" }}
            />
          </div>
          <div className="grid gap-1">
            <h1 className="text-lg font-semibold">{episode.title}</h1>
            <h2 className="text-sm text-gray-500 dark:text-gray-400">
              {episode.author}
            </h2>
            {episode.publishDate && (
              <p className="text-sm text-muted-foreground">
                {new Date(episode.publishDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {episode.description && (
          <p className="text-sm text-muted-foreground">
            {episode.description.replace(/<[^>]*>/g, "")}
          </p>
        )}

        <div>
          <audio
            data-testid="audio-player"
            className="w-full"
            src={episode.audioUrl}
            controls
          />
        </div>
      </CardContent>
    </Card>
  );
}
