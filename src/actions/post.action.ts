"use server";
import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export const createPost = async (content: string, imageUrl: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return null;
    const post = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Failed to craete a post:", error);
    return { success: false, error: "Failed to create a post" };
  }
};

export const getPosts = async () => {
  try {
    const posts = prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error in getting posts: ", error);
    throw new Error("Failed to fetch posts");
  }
};

export const toggleLike = async (postId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    //check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      //unliike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      //like and create notification (if only liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId, //recipient (post author)
                  creatorId: userId, // person who liked
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath("/");
  } catch (error) {
    console.log("Error in Liking Post: ", error);
    return {
      success: false,
    };
  }
};

export const createComment = async (postId: string, content: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) return;
    if (!content.trim()) throw new Error("Content is required");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found ");

    //create comment and notification in a transaction
    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });

      //creat comment if commenting on someone else's post
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });
    revalidatePath("/");
    return { success: true, comment };
  } catch (error) {
    console.error("Failed to create a comment:", error);
    return { success: false, error: "Failed to create comment " };
  }
};

export const deletePost = async (postId: string) => {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found ");

    if (post.authorId !== userId)
      throw new Error("Unauthorized - no deleted permissions");

    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath("/"); //purge the cache
    return { success: true };
  } catch (error) {
    console.log("Failed to delete post: ", error);
    return { success: false, error: "Failed to delete post" };
  }
};
