import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getContactMessages,
  replyToContactMessage,
} from "../api/contactApi";
import Loader from "../components/Loader";

const statusStyles = {
  new: "bg-amber-100 text-amber-700",
  reviewed: "bg-sky-100 text-sky-700",
  closed: "bg-emerald-100 text-emerald-700",
};

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingId, setReplyingId] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getContactMessages();
      setMessages(Array.isArray(data?.contactMessages) ? data.contactMessages : []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch contact messages.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleReplyDraftChange = useCallback((id, value) => {
    setReplyDrafts((current) => ({
      ...current,
      [id]: value,
    }));
    if (actionError) {
      setActionError("");
    }
    if (actionMessage) {
      setActionMessage("");
    }
  }, [actionError, actionMessage]);

  const handleReplySubmit = useCallback(
    async (id) => {
      const replyMessage = replyDrafts[id]?.trim();

      if (!replyMessage) {
        setActionError("Reply message cannot be empty.");
        return;
      }

      try {
        setReplyingId(id);
        setActionError("");
        setActionMessage("");

        const data = await replyToContactMessage(id, { replyMessage });
        const updatedMessage = data?.contactMessage;

        setMessages((current) =>
          current.map((message) =>
            message._id === id ? updatedMessage || message : message,
          ),
        );
        setReplyDrafts((current) => ({
          ...current,
          [id]: "",
        }));
        setActionMessage("Reply sent successfully.");
      } catch (err) {
        console.error(err);
        setActionError(
          err.response?.data?.message || "Failed to send reply."
        );
      } finally {
        setReplyingId("");
      }
    },
    [replyDrafts]
  );

  const filteredMessages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return messages;
    }

    return messages.filter((message) => {
      const haystack = [
        message.name,
        message.email,
        message.phone,
        message.subject,
        message.message,
        message.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [messages, searchTerm]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="flex flex-col justify-between gap-6 rounded-[34px] bg-luxe-charcoal px-6 py-8 text-white shadow-[0_18px_60px_rgba(28,28,28,0.14)] lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">
            Contact Inbox
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none">
            Guest Messages
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
            Review questions, reservation requests, and pre-arrival support
            messages submitted from the contact page.
          </p>
        </div>
        <div className="relative w-full lg:max-w-xs">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-luxe-bronze focus:bg-white/10 focus:ring-4 focus:ring-luxe-bronze/20"
          />
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </header>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {actionError ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {actionMessage ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {actionMessage}
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <article
              key={message._id}
              className="rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] ${
                        statusStyles[message.status] ||
                        "bg-luxe-smoke text-luxe-charcoal"
                      }`}
                    >
                      {message.status}
                    </span>
                    <span className="text-xs uppercase tracking-[0.24em] text-luxe-muted">
                      Received {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <h2 className="mt-4 font-serif text-3xl">{message.subject}</h2>
                  <p className="mt-2 text-sm leading-7 text-luxe-muted">
                    From {message.name} · {message.email}
                    {message.phone ? ` · ${message.phone}` : ""}
                  </p>
                </div>
                <div className="rounded-2xl bg-luxe-smoke px-4 py-3 text-sm font-semibold text-luxe-charcoal">
                  Message #{message._id.slice(-6)}
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]">
                <div className="rounded-[24px] border border-luxe-border bg-[#FCFCFA] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-luxe-muted">
                    Message
                  </p>
                  <p className="mt-4 whitespace-pre-line leading-8 text-luxe-charcoal">
                    {message.message}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] bg-luxe-smoke p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-luxe-muted">
                      Sender
                    </p>
                    <p className="mt-3 text-lg font-semibold">{message.name}</p>
                    <p className="mt-1 break-all text-sm text-luxe-muted">
                      {message.email}
                    </p>
                    <p className="mt-1 text-sm text-luxe-muted">
                      {message.phone || "Phone not provided"}
                    </p>
                  </div>

                  <div className="rounded-[24px] bg-luxe-smoke p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-luxe-muted">
                      Linked Account
                    </p>
                    <p className="mt-3 text-sm text-luxe-charcoal">
                      {message.user
                        ? `${message.user.firstName || ""} ${
                            message.user.lastName || ""
                          }`.trim() || message.user.email
                        : "Submitted without a linked guest account"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]">
                <div className="rounded-[24px] border border-luxe-border bg-white p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-luxe-muted">
                      Reply to Guest
                    </p>
                    <span className="text-xs text-luxe-muted">
                      Email will be sent to {message.email}
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={replyDrafts[message._id] || ""}
                    onChange={(event) =>
                      handleReplyDraftChange(message._id, event.target.value)
                    }
                    placeholder="Write your reply here..."
                    className="mt-4 w-full rounded-[24px] border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10"
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleReplySubmit(message._id)}
                      disabled={replyingId === message._id}
                      className="rounded-full bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-not-allowed disabled:bg-luxe-muted"
                    >
                      {replyingId === message._id ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>

                <div className="rounded-[24px] bg-luxe-smoke p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-luxe-muted">
                    Reply History
                  </p>
                  <div className="mt-4 space-y-4">
                    {message.replies?.length ? (
                      [...message.replies]
                        .sort(
                          (a, b) =>
                            new Date(b.sentAt).getTime() -
                            new Date(a.sentAt).getTime()
                        )
                        .map((reply, index) => (
                          <div
                            key={`${reply.sentAt}-${index}`}
                            className="rounded-[20px] border border-white/60 bg-white p-4"
                          >
                            <p className="text-sm font-semibold text-luxe-charcoal">
                              {reply.repliedByName}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-luxe-muted">
                              {formatDate(reply.sentAt)}
                            </p>
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-luxe-charcoal">
                              {reply.message}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-luxe-muted">
                        No replies sent yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[30px] border border-dashed border-luxe-border bg-white px-6 py-14 text-center">
            <h3 className="font-serif text-3xl">No contact messages found</h3>
            <p className="mt-3 text-luxe-muted">
              New contact form submissions will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
