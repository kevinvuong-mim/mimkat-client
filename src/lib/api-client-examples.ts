/**
 * Example: How to use the API Client with Auto Token Refresh
 *
 * This file demonstrates various ways to make authenticated API calls
 * with automatic token refresh handling.
 */

import { apiClient } from "@/lib/api-client";

// ===== Example 1: Simple GET Request =====
async function getUserProfile() {
  try {
    const response = await apiClient.get("/auth/me");
    console.log("User profile:", response);
    return response;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    throw error;
  }
}

// ===== Example 2: POST Request with Data =====
async function createPost(title: string, content: string) {
  try {
    const response = await apiClient.post("/posts", {
      title,
      content,
    });
    console.log("Post created:", response);
    return response;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw error;
  }
}

// ===== Example 3: PUT Request (Full Update) =====
async function updateUser(
  userId: string,
  userData: { name: string; email: string }
) {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    console.log("User updated:", response);
    return response;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}

// ===== Example 4: PATCH Request (Partial Update) =====
async function updateUserAvatar(userId: string, avatarUrl: string) {
  try {
    const response = await apiClient.patch(`/users/${userId}`, {
      avatar: avatarUrl,
    });
    console.log("Avatar updated:", response);
    return response;
  } catch (error) {
    console.error("Failed to update avatar:", error);
    throw error;
  }
}

// ===== Example 5: DELETE Request =====
async function deletePost(postId: string) {
  try {
    const response = await apiClient.delete(`/posts/${postId}`);
    console.log("Post deleted:", response);
    return response;
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw error;
  }
}

// ===== Example 6: GET with Query Parameters =====
async function searchPosts(keyword: string, page: number = 1) {
  try {
    const queryParams = new URLSearchParams({
      keyword,
      page: page.toString(),
      limit: "10",
    });

    const response = await apiClient.get(`/posts?${queryParams}`);
    console.log("Search results:", response);
    return response;
  } catch (error) {
    console.error("Failed to search posts:", error);
    throw error;
  }
}

// ===== Example 7: Public Request (No Auth) =====
async function getPublicStats() {
  try {
    const response = await apiClient.publicGet("/public/stats");
    console.log("Public stats:", response);
    return response;
  } catch (error) {
    console.error("Failed to get public stats:", error);
    throw error;
  }
}

// ===== Example 8: Using in React Component =====
/*
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiClient.get<{ posts: Post[] }>('/posts');
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost(title: string, content: string) {
    try {
      const newPost = await apiClient.post<Post>('/posts', {
        title,
        content,
      });
      
      setPosts([newPost, ...posts]);
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  }

  async function handleDeletePost(postId: string) {
    try {
      await apiClient.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() => handleDeletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
*/

// ===== Example 9: Using with TypeScript Generics =====
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

async function getUserWithTypes(userId: string) {
  try {
    // Type-safe response
    const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);

    console.log("User data:", response.data);
    console.log("Success:", response.success);

    return response.data;
  } catch (error) {
    console.error("Failed to get user:", error);
    throw error;
  }
}

// ===== Example 10: Error Handling =====
async function robustApiCall() {
  try {
    const response = await apiClient.get("/protected-resource");
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Session expired") {
        // User will be redirected to login automatically
        console.log("Session expired, please login again");
      } else if (error.message.includes("Network")) {
        // Network error
        console.error("Network error, please check your connection");
      } else {
        // Other errors
        console.error("API Error:", error.message);
      }
    }
    throw error;
  }
}

// ===== Example 11: Multiple Parallel Requests =====
async function loadDashboardData() {
  try {
    // All requests will be made in parallel
    // If token expires during any request, it will be auto-refreshed
    // and all failed requests will be retried automatically
    const [user, posts, stats] = await Promise.all([
      apiClient.get("/auth/me"),
      apiClient.get("/posts"),
      apiClient.get("/stats"),
    ]);

    return { user, posts, stats };
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    throw error;
  }
}

// Export examples for use
export {
  getUserProfile,
  createPost,
  updateUser,
  updateUserAvatar,
  deletePost,
  searchPosts,
  getPublicStats,
  getUserWithTypes,
  robustApiCall,
  loadDashboardData,
};
