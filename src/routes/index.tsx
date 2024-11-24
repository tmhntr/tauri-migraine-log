import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { WeatherWidget } from "@/components/WeatherWidget";
// import { useGeolocation } from "@/hooks/useGeolocation";

const Home = () => {
  const [today] = React.useState(new Date());
  // const { error: locationError } = useGeolocation();
  const user = useStore(store, (s) => s.user);

  // Calculate dates once using useMemo
  const [currentStart, currentEnd, previousStart, previousEnd] =
    React.useMemo(() => {
      const currentEnd = new Date();
      const currentStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate(),
      );
      const previousEnd = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate(),
      );
      const previousStart = new Date(
        today.getFullYear(),
        today.getMonth() - 2,
        today.getDate(),
      );
      return [currentStart, currentEnd, previousStart, previousEnd];
    }, [today]);

  const monthlyCountQuery = useGetEpisodeCount(currentStart, currentEnd);
  const previousMonthlyCountQuery = useGetEpisodeCount(
    previousStart,
    previousEnd,
  );

  return (
    <main className="grid flex-1 auto-rows-max items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 grid-cols-3">
      <h2 className="text-4xl font-bold tracking-tight col-span-3">
        Welcome back{user && " " + user.name}!
      </h2>

      <section className="col-span-3 sm:col-span-1">
        <Card className="h-full" x-chunk="dashboard-05-chunk-0">
          <CardHeader className="gap-2 pb-8">
            <CardTitle>Keep track of your migraine episodes</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              Fill out a step by step form to quickly log your migraine
              episodes.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <a href="/create">
              <Button>Log an Episode</Button>
            </a>
          </CardFooter>
        </Card>
      </section>

      <section className="col-span-3 sm:col-span-1">
        <ManagementStepLogger></ManagementStepLogger>
      </section>

      <section className="col-span-3">
        <PodcastPlayer />
      </section>

      <section className="col-span-3">
        <WeatherWidget />
      </section>

      <section className="col-span-3 sm:col-span-1">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Episodes this month</CardDescription>
            <CardTitle className="text-4xl">
              {monthlyCountQuery.data?.toString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {(() => {
                const prevCount = previousMonthlyCountQuery.data || 0;
                const currentCount = monthlyCountQuery.data || 0;
                const change = currentCount - prevCount;
                const percentChange =
                  prevCount !== 0
                    ? ((change / prevCount) * 100).toFixed(1)
                    : "N/A";
                const changeText =
                  change > 0
                    ? `+${change} (+${percentChange}%)`
                    : `${change} (${percentChange}%)`;
                return `${changeText} from last month`;
              })()}
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </section>

      <section className="col-span-3">
        <Link to="/settings">
          <Button>Settings</Button>
        </Link>
      </section>
    </main>
  );
};

import { createFileRoute, Link } from "@tanstack/react-router";
import { useGetEpisodeCount } from "@/hooks/queries";
import React from "react";
import PodcastPlayer from "@/components/PodcastPlayer";
import ManagementStepLogger from "@/components/ManagementStepLogger";
import { store } from "@/main";
import { useStore } from "@tanstack/react-store";

export const Route = createFileRoute("/")({
  component: Home,
});
