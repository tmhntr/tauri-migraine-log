import { render, screen } from "@testing-library/react";
import AudioPlayer, { PodcastEpisode } from "./AudioPlayer";
import "@testing-library/jest-dom";
import { expect, test } from "vitest";

test("renders AudioPlayer component", () => {
  const episode: PodcastEpisode = {
    title: "Test Episode",
    audioUrl: "https://example.com/test.mp3",
    author: "Test Author",
    imageUrl: "https://example.com/test.jpg",
  };
  render(<AudioPlayer episode={episode} />);
});

test("renders audio element with correct src", () => {
  const episode: PodcastEpisode = {
    title: "Test Episode",
    audioUrl: "https://example.com/test.mp3",
    author: "Test Author",
    imageUrl: "https://example.com/test.jpg",
  };
  render(<AudioPlayer episode={episode} />);
  const audioElement = screen.getByTestId("audio-player");
  expect(audioElement).toHaveAttribute("src", episode.audioUrl);
});

test("displays the correct title and author", () => {
  const episode: PodcastEpisode = {
    title: "Test Episode",
    audioUrl: "https://example.com/test.mp3",
    author: "Test Author",
    imageUrl: "https://example.com/test.jpg",
  };
  render(<AudioPlayer episode={episode} />);
  expect(screen.getByText(episode.title)).toBeInTheDocument();
  expect(screen.getByText(episode.author)).toBeInTheDocument();
});

test("renders image with correct src", () => {
  const episode: PodcastEpisode = {
    title: "Test Episode",
    audioUrl: "https://example.com/test.mp3",
    author: "Test Author",
    imageUrl: "https://example.com/test.jpg",
  };
  render(<AudioPlayer episode={episode} />);
  const imageElement = screen.getByAltText(episode.title + " cover");
  expect(imageElement).toHaveAttribute("src", episode.imageUrl);
});
