"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { searchTagsAction, createOrGetTagAction } from "@/feature/profile/actions";

interface Tag {
  id: string;
  name: string;
}

export default function TechStackInput({
  selectedTags,
  onTagsChange,
}: {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [isAdding, startAddTransition] = useTransition();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    startSearchTransition(async () => {
      const res = await searchTagsAction(debouncedQuery);
      if (res.success && res.data) {
        const unselected = res.data.filter(
          (tag) => !selectedTags.some((selected) => selected.id === tag.id)
        );
        setSearchResults(unselected);
      }
    });
  }, [debouncedQuery, selectedTags]);

  const handleSelectTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setQuery("");
    setSearchResults([]);
  };

  const handleAddCustomTag = () => {
    if (!query.trim()) return;

    startAddTransition(async () => {
      const res = await createOrGetTagAction(query);
      if (res.success && res.data) {
        if (!selectedTags.some((t) => t.id === res.data.id)) {
          onTagsChange([...selectedTags, res.data]);
        }
        setQuery("");
        setSearchResults([]);
      }
    });
  };

  const handleRemoveTag = (id: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-muted-foreground">
          Tech Stack / Skills
        </label>
        <p className="text-xs text-muted-foreground">
          List frameworks, tools, or languages you work with.
        </p>
      </div>

      {/* Add Skill Field Wrapper */}
      <div className="relative max-w-md">
        
        {/* Autocomplete Dropdown - Positioned ABOVE Input */}
        {debouncedQuery.trim().length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto p-1">
            {isSearching ? (
              <div className="p-3 text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectTag(tag)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors flex items-center justify-between"
                >
                  <span>{tag.name}</span>
                  <Plus className="w-3 h-3 text-muted-foreground" />
                </button>
              ))
            ) : (
              <div className="p-2.5 text-xs text-muted-foreground">
                No matching tag found. Press <kbd className="bg-muted px-1 rounded">Enter</kbd> or click <kbd className="bg-muted px-1 rounded">+</kbd> to add "<strong>{query}</strong>".
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomTag();
              }
            }}
            placeholder="e.g., React, Next.js, Tailwind"
            className="flex-1 text-sm bg-muted/50 border border-border rounded-xl px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <button
            type="button"
            onClick={handleAddCustomTag}
            disabled={isAdding || !query.trim()}
            className="p-2 border border-border bg-secondary hover:bg-secondary/80 disabled:opacity-50 text-secondary-foreground rounded-xl transition-colors flex items-center justify-center aspect-square"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Selected Tech Badges */}
      <div className="flex flex-wrap gap-1.5 pt-2">
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="text-xs bg-muted text-foreground border border-border pl-3 pr-1.5 py-1 rounded-lg flex items-center gap-1"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="text-muted-foreground hover:text-destructive p-0.5 rounded transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}