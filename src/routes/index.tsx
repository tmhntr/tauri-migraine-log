import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import { ListFilter, File } from "lucide-react";
const Home = () => {
  const today = new Date();
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  );
  const lastLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 2,
    today.getDate(),
  );
  const monthlyCountQuery = useGetEpisodeCount(today, lastMonth);
  const previousMonthlyCountQuery = useGetEpisodeCount(
    lastMonth,
    lastLastMonth,
  );

  return (
    <main className="grid flex-1 auto-rows-max items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 grid-cols-3">
      <h2 className="text-4xl font-bold tracking-tight col-span-3">
        Welcome back Timothy!
      </h2>
      <Card
        className="col-span-3 sm:col-span-1 h-full"
        x-chunk="dashboard-05-chunk-0"
      >
        <CardHeader className="gap-2 pb-8">
          <CardTitle>Keep track of your migraine episodes</CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            Fill out a step by step form to quickly log your migraine episodes.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <a href="/create">
            <Button>Log an Episode</Button>
          </a>
        </CardFooter>
      </Card>
      <Card
        className="col-span-3 sm:col-span-1 h-full"
        x-chunk="dashboard-05-chunk-1"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Current status:</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">Coming soon 👀</div>
        </CardFooter>
      </Card>
      <Card
        className="col-span-3 sm:col-span-1 h-full"
        x-chunk="dashboard-05-chunk-2"
      >
        <CardHeader className="pb-2">
          <CardDescription>Water tracker</CardDescription>
        </CardHeader>
        <CardContent>Track your water intake</CardContent>
        <CardFooter>Coming soon 👀</CardFooter>
      </Card>
      <Tabs defaultValue="week" className="col-span-3">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-sm"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Fulfilled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div>
        <TabsContent value="week" className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
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
                    console.log(`prev ${prevCount}, cur ${currentCount}`);
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
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Average episode severity</CardTitle>
                <CardDescription>
                  Recent migraine episode severity.
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>Coming soon 👀</CardFooter>
            </Card>
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Water intake</CardTitle>
                <CardDescription>Recent average water intake</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>Coming soon 👀</CardFooter>
            </Card>
            <Card>
              <CardHeader className="px-7">
                <CardTitle>Triggers</CardTitle>
                <CardDescription>Recent migraine triggers.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                </ul>
              </CardContent>
              <CardFooter>Coming soon 👀</CardFooter>
            </Card>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            <Card className="col-span-3">
              <CardHeader className="px-7">
                <CardTitle>Weekly analytics</CardTitle>
                <CardDescription>
                  A graph of weekly episodes with air pressure, precip, and temp
                </CardDescription>
              </CardHeader>
              <CardContent>...</CardContent>
              <CardFooter>Coming soon 👀</CardFooter>
            </Card>
            <Card className="col-span-2">
              <CardHeader className="px-7">
                <CardTitle>Entries</CardTitle>
                <CardDescription>Recent migraine episodes.</CardDescription>
              </CardHeader>
              <CardContent>...</CardContent>
              <CardFooter>Coming soon 👀</CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

import { createFileRoute } from "@tanstack/react-router";
import { useGetEpisodeCount } from "@/hooks/queries";

export const Route = createFileRoute("/")({
  component: Home,
});
