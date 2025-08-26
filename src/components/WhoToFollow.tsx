import { getRandomUsers } from "@/actions/user.action";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";

const WhoToFollow = async () => {
  const randomUsers = await getRandomUsers();

  // if (randomUsers.length === 0) return null;
  const user = await currentUser();

  return (
    <Card className="dark:bg-transparent sticky top-20">
      <CardHeader>
        <CardTitle>Who To Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {randomUsers?.map((randomUser) => (
            <div
              key={randomUser.id}
              className="flex items-center gap-2 justify-between "
            >
              <div className="flex gap-1 items-center ">
                <Link href={`/profile/${randomUser?.username}`}>
                  <Avatar>
                    <AvatarImage src={randomUser?.image || "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  <Link
                    href={`/profile/${randomUser?.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {randomUser?.name}
                  </Link>
                  <p className="text-muted-foreground">
                    @{randomUser.username}
                  </p>
                  <p className="text-muted-foreground">
                    {randomUser._count.followers} followers
                  </p>
                </div>
              </div>
              <FollowButton userId={randomUser.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhoToFollow;
