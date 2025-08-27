import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";

const NotificationSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);
  return (
    <div className="space-y-4">
      <Card className="dark:bg-transparent gap-0 ">
        <CardHeader className="border-b ">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Skeleton className="h-4 w-20" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-14rem)]">
            {skeletonItems.map((i) => (
              <div className="flex items-start gap-4 p-4 border-b" key={i}>
                <Skeleton className="w-10 h-10 rounded-full" />

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-4 h-4 " />
                    <Skeleton className="w-40 h-4 " />
                  </div>
                  <div className="pl-6 w-full space-y-2">
                    <Skeleton className="w-full h-20 "></Skeleton>
                    <Skeleton className="w-24 h-6 " />
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSkeleton;
