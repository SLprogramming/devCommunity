"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  FileText,
  User as UserIcon,
  Hash,
  ArrowRight,
  Loader2,
  SearchX,
} from "lucide-react";
import { quickSearchAction, type QuickSearchResult } from "@/feature/search/actions";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCount } from "@/utils/helper";

export default function SearchBar({
  enableDropdown = true,
  autoFocus = false,
  initialQuery = "",
}: {
  enableDropdown?: boolean;
  autoFocus?: boolean;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<QuickSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  const debouncedQuery = useDebounce(query, 300);
  const hasMinLength = debouncedQuery.trim().length >= 2;

  // Global "/" shortcut to focus the input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch quick results
  useEffect(() => {
    if (!enableDropdown || !hasMinLength) {
      setResults(null);
      setIsSearching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearching(true);

    quickSearchAction(debouncedQuery)
      .then((res) => {
        // Ignore stale responses
        if (requestId !== requestIdRef.current) return;
        setResults(res);
        setHighlightedIndex(-1);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsSearching(false);
      });
  }, [debouncedQuery, hasMinLength, enableDropdown]);

  // Flat navigation order: posts -> users -> tags
  const flatResults = results
    ? [
        ...results.posts.map((p) => `/post/${p.id}`),
        ...results.users.map((u) => `/profile/${u.id}`),
        ...results.tags.map((t) => `/tag/${t.name}`),
      ]
    : [];

  const totalResults = flatResults.length;

  const closeAndNavigate = useCallback(
    (href?: string) => {
      setIsOpen(false);
      inputRef.current?.blur();
      if (href) {
        setQuery("");
        router.push(href);
      }
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !totalResults) {
      if (e.key === "Escape") setIsOpen(false);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < totalResults - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          closeAndNavigate(flatResults[highlightedIndex]);
        } else {
          closeAndNavigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    closeAndNavigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const showDropdown =
    enableDropdown && isOpen && hasMinLength && (isSearching || !!results);
  const hasNoResults = results && !isSearching && totalResults === 0;

  let flatIndexCounter = -1;

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {isSearching && showDropdown ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        <input
          ref={inputRef}
          type="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (enableDropdown) setIsOpen(true);
          }}
          onFocus={() => enableDropdown && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search posts, tags, or creators..."
          className="w-full pl-9 pr-12 h-9 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all rounded-md border outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {/* Quick Results Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover/95 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden max-h-[70vh] overflow-y-auto">
          {hasNoResults ? (
            <div className="flex flex-col items-center justify-center gap-1.5 py-8 px-4 text-center">
              <SearchX className="w-5 h-5 text-muted-foreground/50" />
              <p className="text-xs font-medium text-foreground">
                No results found
              </p>
              <p className="text-[11px] text-muted-foreground">
                Try different keywords for posts, people, or tags.
              </p>
            </div>
          ) : (
            <>
              <Section title="Posts" icon={FileText}>
                {results?.posts.map((post) => {
                  flatIndexCounter += 1;
                  const idx = flatIndexCounter;
                  return (
                    <Link
                      key={post.id}
                      href={`/post/${post.id}`}
                      onClick={() => closeAndNavigate()}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
                        highlightedIndex === idx ? "bg-accent" : ""
                      }`}
                    >
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-foreground line-clamp-1 min-w-0 flex-1">
                        {post.caption || post.content || "Untitled Post"}
                      </span>
                    </Link>
                  );
                })}
              </Section>

              <Section title="People" icon={UserIcon}>
                {results?.users.map((user) => {
                  flatIndexCounter += 1;
                  const idx = flatIndexCounter;
                  return (
                    <Link
                      key={user.id}
                      href={`/profile/${user.id}`}
                      onClick={() => closeAndNavigate()}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
                        highlightedIndex === idx ? "bg-accent" : ""
                      }`}
                    >
                      <Image
                        src={
                          user.image ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                        }
                        alt={user.name || "User"}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <span className="text-xs text-foreground truncate min-w-0 flex-1">
                        {user.name || "Anonymous"}
                      </span>
                      {user.profile?.jobTitle && (
                        <span className="text-[10px] text-muted-foreground truncate hidden sm:inline">
                          {user.profile.jobTitle}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </Section>

              <Section title="Tags" icon={Hash}>
                {results?.tags.map((tag) => {
                  flatIndexCounter += 1;
                  const idx = flatIndexCounter;
                  return (
                    <Link
                      key={tag.id}
                      href={`/tag/${tag.name}`}
                      onClick={() => closeAndNavigate()}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
                        highlightedIndex === idx ? "bg-accent" : ""
                      }`}
                    >
                      <Hash className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs text-foreground truncate min-w-0 flex-1 font-mono">
                        {tag.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatCount(tag._count.posts)}{" "}
                        {tag._count.posts === 1 ? "post" : "posts"}
                      </span>
                    </Link>
                  );
                })}
              </Section>

              {/* View all footer */}
              <button
                onClick={() =>
                  closeAndNavigate(
                    `/search?q=${encodeURIComponent(query.trim())}`,
                  )
                }
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary hover:bg-accent/60 border-t border-border transition-colors"
              >
                View all results
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  // Hide section entirely if it has no children rendered
  const childArray = Children.toArray(children);
  if (childArray.length === 0) return null;

  return (
    <div className="py-1.5">
      <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        <Icon className="w-3 h-3" />
        {title}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
