// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   getContactMessages,
//   replyToContactMessage,
//   updateContactStatus,
//   deleteContactMessage,
// } from "../api/contactApi";
// import Loader from "../components/Loader";

// const statusStyles = {
//   new: "bg-amber-100 text-amber-700",
//   reviewed: "bg-sky-100 text-sky-700",
//   closed: "bg-emerald-100 text-emerald-700",
// };

// const formatDate = (value) =>
//   new Date(value).toLocaleString("en-IN", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });

// export default function AdminContactMessages() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [replyDrafts, setReplyDrafts] = useState({});
//   const [replyingId, setReplyingId] = useState("");
//   const [actionError, setActionError] = useState("");
//   const [actionMessage, setActionMessage] = useState("");
//   const [deletingId, setDeletingId] = useState("");

//   const fetchMessages = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const data = await getContactMessages();
//       setMessages(Array.isArray(data?.contactMessages) ? data.contactMessages : []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch contact messages.");
//       setMessages([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMessages();
//   }, [fetchMessages]);

//   const handleReplyDraftChange = useCallback((id, value) => {
//     setReplyDrafts((current) => ({
//       ...current,
//       [id]: value,
//     }));
//     if (actionError) setActionError("");
//     if (actionMessage) setActionMessage("");
//   }, [actionError, actionMessage]);

//   const handleStatusUpdate = async (id, status) => {
//     try {
//       setActionError("");
//       setActionMessage("");
//       const data = await updateContactStatus(id, status);
//       const updatedMessage = data?.contactMessage;

//       setMessages((current) =>
//         current.map((message) =>
//           message._id === id ? updatedMessage || message : message
//         )
//       );
//       setActionMessage(`Message marked as ${status}.`);
//     } catch (err) {
//       setActionError(err.response?.data?.message || "Failed to update status.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this message?")) return;

//     try {
//       setDeletingId(id);
//       setActionError("");
//       setActionMessage("");
//       await deleteContactMessage(id);
//       setMessages((current) => current.filter((m) => m._id !== id));
//       setActionMessage("Message deleted successfully.");
//     } catch (err) {
//       setActionError(err.response?.data?.message || "Failed to delete message.");
//     } finally {
//       setDeletingId("");
//     }
//   };

//   const handleReplySubmit = useCallback(
//     async (id) => {
//       const replyMessage = replyDrafts[id]?.trim();

//       if (!replyMessage) {
//         setActionError("Reply message cannot be empty.");
//         return;
//       }

//       try {
//         setReplyingId(id);
//         setActionError("");
//         setActionMessage("");

//         const data = await replyToContactMessage(id, { replyMessage });
//         const updatedMessage = data?.contactMessage;

//         setMessages((current) =>
//           current.map((message) =>
//             message._id === id ? updatedMessage || message : message
//           )
//         );
//         setReplyDrafts((current) => ({
//           ...current,
//           [id]: "",
//         }));
//         setActionMessage("Reply sent successfully.");
//       } catch (err) {
//         setActionError(err.response?.data?.message || "Failed to send reply.");
//       } finally {
//         setReplyingId("");
//       }
//     },
//     [replyDrafts]
//   );

//   const filteredMessages = useMemo(() => {
//     const query = searchTerm.trim().toLowerCase();
//     if (!query) return messages;

//     return messages.filter((message) => {
//       const haystack = [
//         message.name,
//         message.email,
//         message.phone,
//         message.subject,
//         message.message,
//         message.status,
//       ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//       return haystack.includes(query);
//     });
//   }, [messages, searchTerm]);

//   if (loading) return <Loader />;

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
//       <header className="flex flex-col justify-between gap-6 rounded-[34px] bg-luxe-charcoal px-8 py-10 text-white shadow-[0_24px_80px_rgba(28,28,28,0.16)] lg:flex-row lg:items-center">
//         <div>
//           <div className="flex items-center gap-3">
//             <span className="h-px w-8 bg-luxe-bronze-light" />
//             <p className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-luxe-bronze-light">
//               Management Suite
//             </p>
//           </div>
//           <h1 className="mt-4 font-serif text-5xl tracking-tight">Guest Messages</h1>
//           <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
//             Review and respond to guest inquiries from our global properties. Maintain the highest standard of boutique hospitality.
//           </p>
//         </div>
//         <div className="relative w-full lg:max-w-xs">
//           <input
//             type="text"
//             placeholder="Filter messages..."
//             value={searchTerm}
//             onChange={(event) => setSearchTerm(event.target.value)}
//             className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-6 text-sm text-white outline-none transition focus:border-luxe-bronze focus:bg-white/10 focus:ring-4 focus:ring-luxe-bronze/20"
//           />
//           <svg
//             className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>
//       </header>

//       {/* Action Feedback */}
//       {(error || actionError || actionMessage) && (
//         <div className="mt-8 space-y-3">
//           {(error || actionError) && (
//             <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
//               <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {error || actionError}
//             </div>
//           )}
//           {actionMessage && (
//             <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-600">
//               <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//               {actionMessage}
//             </div>
//           )}
//         </div>
//       )}

//       <div className="mt-8 space-y-6">
//         {filteredMessages.length > 0 ? (
//           filteredMessages.map((message) => (
//             <article
//               key={message._id}
//               className="group relative overflow-hidden rounded-[32px] border border-luxe-border bg-white transition-all hover:shadow-xl"
//             >
//               <div className="flex flex-col lg:flex-row">
//                 {/* Message Content */}
//                 <div className="flex-1 p-8">
//                   <div className="flex flex-wrap items-center gap-4">
//                     <span
//                       className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${
//                         statusStyles[message.status] || "bg-luxe-smoke text-luxe-charcoal"
//                       }`}
//                     >
//                       {message.status}
//                     </span>
//                     <span className="text-xs font-semibold uppercase tracking-widest text-luxe-muted">
//                       {formatDate(message.createdAt)}
//                     </span>
//                   </div>

//                   <h2 className="mt-6 font-serif text-3xl tracking-tight text-luxe-charcoal">
//                     {message.subject}
//                   </h2>
//                   <div className="mt-6 rounded-3xl border border-luxe-border bg-luxe-smoke/30 p-6">
//                     <p className="whitespace-pre-line text-base leading-relaxed text-luxe-charcoal/80">
//                       {message.message}
//                     </p>
//                   </div>

//                   {/* Reply Section */}
//                   <div className="mt-8 space-y-4">
//                     <div className="flex items-center justify-between">
//                       <p className="text-[0.65rem] font-bold uppercase tracking-widest text-luxe-muted">
//                         Draft Reply
//                       </p>
//                       <p className="text-[0.65rem] text-luxe-muted/60">
//                         Sending to: {message.email}
//                       </p>
//                     </div>
//                     <textarea
//                       rows={4}
//                       value={replyDrafts[message._id] || ""}
//                       onChange={(e) => handleReplyDraftChange(message._id, e.target.value)}
//                       placeholder="Compose your hospitality response..."
//                       className="w-full rounded-[24px] border border-luxe-border bg-white px-6 py-5 text-sm outline-none transition-all focus:border-luxe-bronze focus:ring-4 focus:ring-luxe-bronze/5"
//                     />
//                     <div className="flex justify-end">
//                       <button
//                         onClick={() => handleReplySubmit(message._id)}
//                         disabled={replyingId === message._id || !replyDrafts[message._id]}
//                         className="rounded-full bg-luxe-charcoal px-8 py-3.5 text-xs font-bold text-white transition-all hover:bg-luxe-bronze disabled:cursor-not-allowed disabled:opacity-50"
//                       >
//                         {replyingId === message._id ? "Sending..." : "Send Response"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Sidebar Info */}
//                 <div className="w-full border-t border-luxe-border bg-luxe-smoke/50 p-8 lg:w-80 lg:border-l lg:border-t-0">
//                   <div className="space-y-8">
//                     <div>
//                       <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-luxe-muted">
//                         Guest Information
//                       </p>
//                       <div className="mt-4">
//                         <p className="text-lg font-serif font-bold text-luxe-charcoal">{message.name}</p>
//                         <p className="mt-1 break-all text-xs text-luxe-muted">{message.email}</p>
//                         {message.phone && <p className="mt-1 text-xs text-luxe-muted">{message.phone}</p>}
//                       </div>
//                     </div>

//                     <div>
//                       <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-luxe-muted">
//                         Linked Profile
//                       </p>
//                       <div className="mt-4">
//                         {message.user ? (
//                           <div className="flex items-center gap-3">
//                             <div className="h-8 w-8 rounded-full bg-luxe-bronze/20 flex items-center justify-center text-luxe-bronze font-bold text-xs">
//                               {message.user.firstName?.[0]}{message.user.lastName?.[0]}
//                             </div>
//                             <div>
//                               <p className="text-sm font-bold">{message.user.firstName} {message.user.lastName}</p>
//                               <p className="text-[10px] text-luxe-muted uppercase tracking-tighter">Verified Guest</p>
//                             </div>
//                           </div>
//                         ) : (
//                           <p className="text-xs italic text-luxe-muted">Public Submission</p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="pt-4 border-t border-luxe-border/50">
//                       <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-luxe-muted">
//                         Message Actions
//                       </p>
//                       <div className="mt-4 grid grid-cols-1 gap-3">
//                         <select
//                           value={message.status}
//                           onChange={(e) => handleStatusUpdate(message._id, e.target.value)}
//                           className="w-full rounded-xl border border-luxe-border bg-white px-4 py-2.5 text-xs font-semibold outline-none transition hover:border-luxe-bronze"
//                         >
//                           <option value="new">Mark as New</option>
//                           <option value="reviewed">Mark Reviewed</option>
//                           <option value="closed">Close Message</option>
//                         </select>
//                         <button
//                           onClick={() => handleDelete(message._id)}
//                           disabled={deletingId === message._id}
//                           className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
//                         >
//                           <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                           {deletingId === message._id ? "Deleting..." : "Delete Entry"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* History Bar */}
//               {message.replies?.length > 0 && (
//                 <div className="border-t border-luxe-border bg-white p-6">
//                   <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-luxe-muted mb-4">
//                     Interaction History ({message.replies.length})
//                   </p>
//                   <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
//                     {message.replies.map((reply, i) => (
//                       <div key={i} className="min-w-[280px] rounded-2xl bg-luxe-smoke/40 p-4 border border-luxe-border/30">
//                         <div className="flex items-center justify-between">
//                           <p className="text-xs font-bold text-luxe-charcoal">{reply.repliedByName}</p>
//                           <p className="text-[10px] text-luxe-muted">{formatDate(reply.sentAt)}</p>
//                         </div>
//                         <p className="mt-2 text-xs leading-relaxed text-luxe-charcoal/70 italic line-clamp-2">
//                           &quot;{reply.message}&quot;
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </article>
//           ))
//         ) : (
//           <div className="rounded-[40px] border border-dashed border-luxe-border bg-white px-8 py-24 text-center">
//             <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-luxe-smoke text-luxe-muted">
//               <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//             </div>
//             <h3 className="mt-6 font-serif text-3xl text-luxe-charcoal">All caught up</h3>
//             <p className="mt-3 text-luxe-muted max-w-sm mx-auto">
//               No messages match your current filters. New submissions will appear here automatically.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getContactMessages,
  replyToContactMessage,
  updateContactStatus,
  deleteContactMessage,
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
  const [deletingId, setDeletingId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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
    setReplyDrafts((cur) => ({ ...cur, [id]: value }));
    if (actionError) setActionError("");
    if (actionMessage) setActionMessage("");
  }, [actionError, actionMessage]);

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionError("");
      setActionMessage("");
      const data = await updateContactStatus(id, status);
      const updated = data?.contactMessage;
      setMessages((cur) => cur.map((m) => (m._id === id ? updated || m : m)));
      setActionMessage(`Message marked as ${status}.`);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      setDeletingId(id);
      setActionError("");
      setActionMessage("");
      await deleteContactMessage(id);
      setMessages((cur) => cur.filter((m) => m._id !== id));
      setActionMessage("Message deleted successfully.");
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete message.");
    } finally {
      setDeletingId("");
    }
  };

  const handleReplySubmit = useCallback(async (id) => {
    const replyMessage = replyDrafts[id]?.trim();
    if (!replyMessage) { setActionError("Reply cannot be empty."); return; }
    try {
      setReplyingId(id);
      setActionError("");
      setActionMessage("");
      const data = await replyToContactMessage(id, { replyMessage });
      const updated = data?.contactMessage;
      setMessages((cur) => cur.map((m) => (m._id === id ? updated || m : m)));
      setReplyDrafts((cur) => ({ ...cur, [id]: "" }));
      setActionMessage("Reply sent successfully.");
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to send reply.");
    } finally {
      setReplyingId("");
    }
  }, [replyDrafts]);

  const filteredMessages = useMemo(() => {
    let filtered = messages;
    
    // Status Filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(m => m.status === filterStatus);
    }

    // Search Filter
    const query = searchTerm.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((m) =>
        [m.name, m.email, m.phone, m.subject, m.message, m.status]
          .filter(Boolean).join(" ").toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [messages, searchTerm, filterStatus]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Page Header */}
      <div className="border-b border-luxe-border bg-white px-6 pt-10 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.45em] text-luxe-bronze">Management Suite</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-serif text-4xl tracking-tight text-luxe-charcoal">Guest Messages</h1>
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-luxe-border bg-luxe-smoke/40 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
              />
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-luxe-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="mt-10 flex gap-8">
            {["all", "new", "reviewed", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`relative pb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-colors ${
                  filterStatus === status ? "text-luxe-bronze" : "text-luxe-muted hover:text-luxe-charcoal"
                }`}
              >
                {status}
                {filterStatus === status && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-luxe-bronze" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        {/* Feedback banners */}
        {(error || actionError || actionMessage) && (
          <div className="mb-8 space-y-3">
            {(error || actionError) && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error || actionError}
              </div>
            )}
            {actionMessage && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {actionMessage}
              </div>
            )}
          </div>
        )}

        {/* Message list */}
        {filteredMessages.length > 0 ? (
          <div className="space-y-5">
            {filteredMessages.map((message) => (
              <article key={message._id} className="rounded-[28px] border border-luxe-border bg-white shadow-[0_4px_24px_rgba(28,28,28,0.04)]">

                {/* Top row: meta + status + actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-luxe-border px-7 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[message.status] || "bg-luxe-smoke text-luxe-charcoal"}`}>
                      {message.status}
                    </span>
                    <span className="text-xs text-luxe-muted">{formatDate(message.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={message.status}
                      onChange={(e) => handleStatusUpdate(message._id, e.target.value)}
                      className="rounded-lg border border-luxe-border bg-luxe-smoke/40 px-3 py-1.5 text-xs font-semibold outline-none transition hover:border-luxe-bronze"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(message._id)}
                      disabled={deletingId === message._id}
                      className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deletingId === message._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="px-7 py-6">
                  {/* Sender */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="font-semibold text-luxe-charcoal">{message.name}</span>
                    <span className="text-luxe-muted">{message.email}</span>
                    {message.phone && <span className="text-luxe-muted">{message.phone}</span>}
                    {message.user && (
                      <span className="rounded-full bg-luxe-smoke px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-luxe-muted">
                        Verified Guest
                      </span>
                    )}
                  </div>

                  {/* Subject + message */}
                  <h2 className="mt-4 font-serif text-2xl tracking-tight text-luxe-charcoal">{message.subject}</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-luxe-charcoal/70">
                    {message.message}
                  </p>

                  {/* Reply box */}
                  <div className="mt-6 space-y-3">
                    <label className="text-[0.6rem] font-bold uppercase tracking-widest text-luxe-muted">
                      Reply to {message.email}
                    </label>
                    <textarea
                      rows={3}
                      value={replyDrafts[message._id] || ""}
                      onChange={(e) => handleReplyDraftChange(message._id, e.target.value)}
                      placeholder="Write your reply…"
                      className="w-full rounded-2xl border border-luxe-border bg-luxe-smoke/30 px-5 py-4 text-sm outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/5"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleReplySubmit(message._id)}
                        disabled={replyingId === message._id || !replyDrafts[message._id]}
                        className="rounded-full bg-luxe-charcoal px-7 py-2.5 text-xs font-bold text-white transition hover:bg-luxe-bronze disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {replyingId === message._id ? "Sending…" : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply history */}
                {message.replies?.length > 0 && (
                  <div className="border-t border-luxe-border px-7 py-5">
                    <p className="mb-4 text-[0.6rem] font-bold uppercase tracking-[0.35em] text-luxe-muted">
                      History ({message.replies.length})
                    </p>
                    <div className="space-y-3">
                      {message.replies.map((reply, i) => (
                        <div key={i} className="flex items-start justify-between rounded-xl bg-luxe-smoke/40 px-5 py-3.5">
                          <div>
                            <p className="text-xs font-semibold text-luxe-charcoal">{reply.repliedByName}</p>
                            <p className="mt-1 text-xs leading-relaxed text-luxe-charcoal/60 italic">"{reply.message}"</p>
                          </div>
                          <p className="ml-6 shrink-0 text-[10px] text-luxe-muted">{formatDate(reply.sentAt)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-luxe-border bg-white px-8 py-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-luxe-smoke text-luxe-muted">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="mt-5 font-serif text-2xl text-luxe-charcoal">All caught up</h3>
            <p className="mt-2 text-sm text-luxe-muted">No messages match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}