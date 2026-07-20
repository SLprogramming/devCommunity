export function extractHashtags(text: string): string[] {
  if (!text) return [];

  // Match # followed by valid tag chars (word chars, hyphen, dot),
  // ensuring it starts with an alphanumeric/underscore char and doesn't end with a trailing dot
  const matches = text.match(/#[a-zA-Z0-9_][a-zA-Z0-9_\-\.]*[a-zA-Z0-9_\-]/g);
  if (!matches) return [];

  const cleanedTags = matches.map((tag) =>
    tag.substring(1).toLowerCase().trim(),
  );

  // Return unique tags only
  return Array.from(new Set(cleanedTags));
}

export function getReadingTime(content: string): string {
  if (!content) return "1 min read";

  // Strip HTML tags if content contains HTML
  const cleanContent = content.replace(/<[^>]*>/g, "");

  // Count words by splitting spaces
  const wordCount = cleanContent.trim().split(/\s+/).length;

  // Calculate minutes (200 words/min average)
  const minutes = Math.ceil(wordCount / 200);

  return `${minutes} min read`;
}
