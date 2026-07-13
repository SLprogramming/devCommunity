import React from "react";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";

export default function DevCommunityDashboard() {
  // Mock data for the feed
  const posts = [
    {
      id: 1,
      author: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      title:
        "Mastering Advanced TypeScript: Utility Types You Aren't Using Yet",
      tags: ["typescript", "webdev", "architecture"],
      likes: 142,
      comments: 28,
      readTime: "5 min read",
    },
    {
      id: 2,
      author: "Marcus Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      title: "Why We Migrated Our Production API from Express to Elysia & Bun",
      tags: ["bun", "backend", "performance"],
      likes: 98,
      comments: 14,
      readTime: "8 min read",
    },
    {
      id: 3,
      author: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      title:
        "React 19 Action Hooks: Cleaning Up Form State Management Permanently",
      tags: ["react", "frontend", "javascript"],
      likes: 215,
      comments: 42,
      readTime: "6 min read",
    },
    {
      id: 4,
      author: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      title: "How to Optimize PostgreSql Indexes for Multi-Million Row Layouts",
      tags: ["database", "postgres", "sql"],
      likes: 187,
      comments: 19,
      readTime: "12 min read",
    },
    {
      id: 5,
      author: "Elena Rostova",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
      title:
        "Clean Architecture in Next.js: Stop Bleeding Business Logic into Pages",
      tags: ["nextjs", "architecture", "software"],
      likes: 312,
      comments: 56,
      readTime: "10 min read",
    },
    {
      id: 6,
      author: "Liam O'Connor",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      title:
        "CSS Subgrid is Finally Here: Fixing Alignment Across Nested Grid Items",
      tags: ["css", "tailwindcss", "frontend"],
      likes: 84,
      comments: 7,
      readTime: "4 min read",
    },
    {
      id: 7,
      author: "Aisha Rahman",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
      title: "Building Micro-frontends with Vite Module Federation in 2026",
      tags: ["vite", "microfrontends", "scaling"],
      likes: 156,
      comments: 22,
      readTime: "9 min read",
    },
    {
      id: 8,
      author: "Carlos Mendez",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
      title:
        "Redis vs. Dragonfly: Choosing the Right High-Performance Memory Layer",
      tags: ["redis", "devops", "caching"],
      likes: 119,
      comments: 16,
      readTime: "7 min read",
    },
    {
      id: 9,
      author: "Jessica Taylor",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
      title:
        "Everything a Frontend Engineer Needs to Know About Web Cryptography APIs",
      tags: ["security", "javascript", "auth"],
      likes: 173,
      comments: 31,
      readTime: "8 min read",
    },
    {
      id: 10,
      author: "Vikram Malhotra",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
      title:
        "Deploying Lightweight LLMs on Edge Infrastructure Using WebAssembly",
      tags: ["wasm", "ai", "edge"],
      likes: 245,
      comments: 49,
      readTime: "11 min read",
    },
  ];

  return (
    <>
      {/* Main Container */}

      {/* Left Sidebar Navigation */}

      {/* Main Feed */}
      <main className="md:col-span-2 flex flex-col gap-6">
        {/* Feed Filter Tabs */}
        <div className="flex gap-4 border-b border-border pb-2">
          <button className="text-sm font-semibold text-foreground border-b-2 border-primary pb-2 px-1">
            Discover
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-2 px-1 transition-colors">
            Following
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-2 px-1 transition-colors">
            Latest
          </button>
        </div>

        {/* Posts List */}
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-card text-card-foreground border border-border rounded-2xl p-6 hover:border-muted-foreground/30 transition-all hover:shadow-xl hover:shadow-black/5 group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={post.avatar}
                alt={post.author}
                className="h-8 w-8 rounded-lg object-cover border border-border"
              />
              <div>
                <h4 className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors">
                  {post.author}
                </h4>
                <p className="text-xs text-muted-foreground">Posted today</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
              {post.title}
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-md border border-border hover:border-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-muted-foreground text-sm border-t border-border/50 pt-4">
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors group/btn">
                  <ThumbsUp className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors group/btn">
                  <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                  <span>{post.comments}</span>
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                <Eye className="h-3.5 w-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </main>
    </>
  );
}
