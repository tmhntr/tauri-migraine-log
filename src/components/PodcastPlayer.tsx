import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AudioPlayer from "./AudioPlayer";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react"; // Make sure to install lucide-react

interface PodcastEpisode {
  title: string;
  author: string;
  imageUrl: string;
  audioUrl: string;
  description?: string;
  publishDate?: string;
}

async function fetchPodcastFeed() {
  const response = await fetch("https://feeds.captivate.fm/migraine-talks/");
  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");

  const items = xml.querySelectorAll("item");
  return Array.from(items).map((item) => ({
    title: item.querySelector("title")?.textContent || "",
    author: "Migraine Canada",
    imageUrl:
      xml.querySelector("image url")?.textContent ||
      "https://artwork.captivate.fm/e3bf6840-821c-489b-844e-2a6b98c2385b/kO_lpgIgXH9UYVIMUD_np1Qi.jpg",
    audioUrl: item.querySelector("enclosure")?.getAttribute("url") || "",
    description: item.querySelector("description")?.textContent || "",
    publishDate: item.querySelector("pubDate")?.textContent || "",
  }));
}

function EpisodeList({
  episodes,
  onEpisodeSelect,
}: {
  episodes: PodcastEpisode[];
  onEpisodeSelect: (episode: PodcastEpisode) => void;
}) {
  return (
    <Card className="col-span-3 sm:col-span-1 h-full">
      <CardContent className="p-4 h-full">
        <h2 className="text-2xl font-bold mb-4">Available Episodes</h2>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {episodes.map((episode, _) => (
            <div
              key={episode.audioUrl}
              className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors border-b last:border-b-0"
              onClick={() => onEpisodeSelect(episode)}
            >
              <img
                src={episode.imageUrl}
                alt={episode.title}
                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-medium truncate">{episode.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {episode.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PodcastPlayer() {
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(
    null,
  );
  const [showList, setShowList] = useState(true);

  const {
    data: episodes,
    isLoading,
    isError,
  } = useQuery<PodcastEpisode[]>({
    queryKey: ["podcast-feed"],
    queryFn: fetchPodcastFeed,
  });

  if (isLoading) {
    return (
      <Card className="col-span-3 sm:col-span-1 h-full">
        <CardContent className="flex items-center justify-center h-full">
          Loading podcast...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="col-span-3 sm:col-span-1 h-full">
        <CardContent className="flex items-center justify-center h-full">
          Error loading podcast
        </CardContent>
      </Card>
    );
  }

  if (!episodes || episodes.length === 0) {
    return (
      <Card className="col-span-3 sm:col-span-1 h-full">
        <CardContent className="flex items-center justify-center h-full">
          No episodes found
        </CardContent>
      </Card>
    );
  }

  const handleEpisodeSelect = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
    setShowList(false);
  };

  return (
    <div className="h-[600px]">
      {showList ? (
        <EpisodeList
          episodes={episodes}
          onEpisodeSelect={handleEpisodeSelect}
        />
      ) : (
        <div className="h-full">
          <Button
            variant="ghost"
            onClick={() => setShowList(true)}
            className="flex items-center gap-2 mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Episodes
          </Button>
          <AudioPlayer episode={selectedEpisode || episodes[0]} />
        </div>
      )}
    </div>
  );
}
