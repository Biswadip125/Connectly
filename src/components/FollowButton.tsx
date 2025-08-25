"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

type FollowButtonProps = {
  userId: string;
};
const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      const res = await toggleFollow(userId);
    } catch (error) {
      toast.error("Error in Following");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
      className="cursor-pointer w-20"
    >
      {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
    </Button>
  );
};

export default FollowButton;
