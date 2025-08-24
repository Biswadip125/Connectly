"use client";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";

const CreatePost = () => {
  const { user } = useUser();
  const [postContent, setPostContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!postContent.trim() && !imageUrl) return;
    setIsPosting(true);
    try {
      const result = await createPost(postContent, imageUrl);
      if (result.success) {
        //reset the form
        setPostContent("");
        setImageUrl("");
        setShowImageUpload(false);
        toast.success("Post created Successfully");
      }
    } catch (error) {
      console.log("Failed to create a post:", error);
      toast.error("Failed to create a post");
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <Card className="mb-6 ">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4 w-full">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind "
              className="min-h-[100px] resize-none w-full p-0 border-0 focus-visible:ring-0 text-base bg-transparent focus-visible:outline-none shadow-none dark:bg-transparent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={isPosting}
            />
          </div>
          {/*Todo: HANDLE IMAGE UPLOADS */}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!postContent.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
