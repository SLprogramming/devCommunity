import { getSession } from "@/lib/get-session";
import { getNotificationSnapshot } from "@/feature/notification/queries";

// Sets the maximum execution time limit to 60 seconds (useful for long-polling/streaming on platforms like Vercel)
export const maxDuration = 60;

// Instantiates a single encoder instance to reuse for converting strings to raw UTF-8 bytes
const encoder = new TextEncoder();

/**
 * Formats data into the Server-Sent Events (SSE) format and returns it as Uint8Array bytes.
 * Output string layout:
 *   event: notifications
 *   data: {"unreadCount": 3, ...}
 *   \n\n (Double newline tells SSE client the message is finished)
 */
function event(data: unknown) {
  return encoder.encode(
    `event: notifications\ndata: ${JSON.stringify(data)}\n\n`,
  );
}

export async function GET(request: Request) {
  // 1. Authenticate the user requesting the connection
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  // 2. Initialize a web-standard ReadableStream for long-lived real-time streaming
  const stream = new ReadableStream({
    async start(controller) {
      let previous = ""; // Remembers previous state to avoid pushing identical duplicate data
      let closed = false; // Tracks if the connection has been terminated

      // Safely closes the stream controller once, preventing errors if called multiple times
      const close = () => {
        if (closed) return;
        closed = true;
        controller.close();
      };

      // Automatically clean up and close the stream if the browser aborts/disconnects
      request.signal.addEventListener("abort", close, { once: true });

      try {
        // Poll database every 5 seconds for up to 55 seconds (leaving 5s buffer before maxDuration timeout)
        for (let elapsed = 0; elapsed < 55_000 && !closed; elapsed += 5_000) {
          const snapshot = await getNotificationSnapshot(userId);
          if (closed) break;

          // Convert current snapshot to string to easily check if anything changed
          const signature = JSON.stringify(snapshot);

          if (signature !== previous) {
            // Data changed: Send the new notifications payload
            controller.enqueue(event(snapshot));
            previous = signature;
          } else {
            // Data unchanged: Send an SSE comment line (`: text`) to keep the TCP connection alive
            controller.enqueue(encoder.encode(": keep-alive\n\n"));
          }

          // Pause execution for 5 seconds before the next check
          await new Promise((resolve) => setTimeout(resolve, 5_000));
        }
      } catch (error) {
        if (!closed) console.error("Notification stream failed:", error);
      } finally {
        // Ensure stream is properly closed when the loop finishes or throws an error
        close();
      }
    },
    cancel() {
      // Called if the consumer cancels the stream reader on the receiving side
    },
  });

  // 3. Return stream response configured with headers required for SSE protocol
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream", // Tells browser to treat this as SSE
      "Cache-Control": "no-cache, no-transform", // Prevents response caching
      Connection: "keep-alive", // Keeps persistent connection open
      "X-Accel-Buffering": "no", // Disables proxy buffering (e.g., NGINX) for immediate delivery
    },
  });
}
