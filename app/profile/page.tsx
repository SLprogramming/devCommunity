import React from "react";
import {
  Home,
  Terminal,
  Compass,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  Eye,
  Flame,
  Code,
} from "lucide-react";

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
  ];

  const trendingTags = [
    "nextjs",
    "typescript",
    "tailwindcss",
    "ai",
    "rust",
    "bun",
  ];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 font-sans antialiased selection:bg-cyan-500/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0d0e12]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            dev<span className="text-cyan-400">.</span>hub
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search articles, tags, authors..."
              className="w-64 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
            />
          </div>
          <button className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/10 active:scale-95">
            Write Post
          </button>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
            alt="Profile"
            className="h-9 w-9 rounded-xl border border-slate-700 ring-2 ring-transparent hover:ring-cyan-500/50 transition-all cursor-pointer"
          />
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
        {/* Left Sidebar Navigation */}
        <aside className="hidden md:flex flex-col gap-2">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/50 text-cyan-400 font-medium border border-cyan-500/20 shadow-sm shadow-cyan-500/5"
          >
            <Home className="h-5 w-5" /> Home
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 transition-all group"
          >
            <Compass className="h-5 w-5 group-hover:text-indigo-400" /> Explore
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 transition-all group"
          >
            <Bookmark className="h-5 w-5 group-hover:text-emerald-400" />{" "}
            Bookmarks
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 transition-all group"
          >
            <Code className="h-5 w-5 group-hover:text-amber-400" /> Hackathons
          </a>

          <hr className="border-slate-800/60 my-4" />

          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              My Custom Tags
            </span>
            <div className="flex flex-col gap-1 mt-3">
              <span className="text-sm text-slate-400 hover:text-slate-200 cursor-pointer py-1.5">
                #react
              </span>
              <span className="text-sm text-slate-400 hover:text-slate-200 cursor-pointer py-1.5">
                #nextjs
              </span>
              <span className="text-sm text-slate-400 hover:text-slate-200 cursor-pointer py-1.5">
                #tailwindcss
              </span>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="md:col-span-2 flex flex-col gap-6">
          {/* Feed Filter Tabs */}
          <div className="flex gap-4 border-b border-slate-800/80 pb-2">
            <button className="text-sm font-semibold text-slate-200 border-b-2 border-cyan-500 pb-2 px-1">
              Relevant
            </button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-300 pb-2 px-1">
              Latest
            </button>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-300 pb-2 px-1">
              Top
            </button>
          </div>

          {/* Posts List */}
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[#13151a] border border-slate-800/60 rounded-2xl p-6 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-black/20 group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="h-8 w-8 rounded-lg object-cover border border-slate-800"
                />
                <div>
                  <h4 className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
                    {post.author}
                  </h4>
                  <p className="text-xs text-slate-500">Posted today</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400/90 transition-colors mb-3 leading-snug">
                {post.title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono bg-slate-900/80 text-slate-400 px-2.5 py-1 rounded-md border border-slate-850 hover:border-slate-700 hover:text-slate-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-slate-400 text-sm border-t border-slate-800/40 pt-4">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors group/btn">
                    <ThumbsUp className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors group/btn">
                    <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    <span>{post.comments}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </main>

        {/* Right Sidebar Panel */}
        <aside className="hidden lg:flex flex-col gap-6">
          {/* Trending Panel */}
          <div className="bg-[#13151a] border border-slate-800/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-4 w-4 text-orange-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Trending Tags
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-gradient-to-br from-slate-900 to-slate-950 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Active Discussions */}
          <div className="bg-[#13151a] border border-slate-800/60 rounded-2xl p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Active Discussions
            </h3>
            <div className="flex flex-col gap-4">
              <div className="group cursor-pointer">
                <h4 className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  Is Next.js Server Actions ready for absolute enterprise scale?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  42 comments • Active 10m ago
                </p>
              </div>
              <div className="group cursor-pointer">
                <h4 className="text-sm font-medium text-slate-300 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  What is your favorite CSS structure approach in 2026?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  105 comments • Active 1h ago
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
