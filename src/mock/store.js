import React from "react";
import { seed } from "./data.js";

const StoreContext = React.createContext(null);

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function computeDerived(state) {
  const quotesByRequest = new Map();
  for (const q of state.quotations) {
    const arr = quotesByRequest.get(q.request_id) ?? [];
    arr.push(q);
    quotesByRequest.set(q.request_id, arr);
  }

  const jobsByRequest = new Map();
  for (const j of state.jobs) {
    const arr = jobsByRequest.get(j.request_id) ?? [];
    arr.push(j);
    jobsByRequest.set(j.request_id, arr);
  }

  const conversationByJob = new Map();
  for (const c of state.conversations) conversationByJob.set(c.job_id, c);

  return { quotesByRequest, jobsByRequest, conversationByJob };
}

export function StoreProvider({ children }) {
  const [state, setState] = React.useState(() => ({
    ...clone(seed),
    ui: {
      theme: "light",
      role: "customer",
      actorUserId: "u_c_1"
    }
  }));

  const derived = React.useMemo(() => computeDerived(state), [state]);

  const api = React.useMemo(() => {
    const getUser = (id) => state.users.find((u) => u.id === id) ?? null;
    const getProviderProfile = (providerProfileId) =>
      state.provider_profiles.find((p) => p.id === providerProfileId) ?? null;
    const getCategory = (id) => state.categories.find((c) => c.id === id) ?? null;

    const setTheme = (theme) =>
      setState((s) => ({ ...s, ui: { ...s.ui, theme } }));

    const setActor = ({ role, actorUserId }) =>
      setState((s) => ({ ...s, ui: { ...s.ui, role, actorUserId } }));

    const markAllNotificationsRead = (userId) =>
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => (n.user_id === userId ? { ...n, read: true } : n))
      }));

    const notify = (s, { userId, type, text }) => ({
      ...s,
      notifications: [
        {
          id: `n_${Math.floor(Math.random() * 900000 + 100000)}`,
          user_id: userId,
          type,
          text,
          created_at: new Date().toISOString(),
          read: false
        },
        ...s.notifications
      ]
    });

    // Customer: create request (two-step wizard in UI).
    const createRequest = (payload) =>
      setState((s) => {
        const actor = s.users.find((u) => u.id === s.ui.actorUserId);
        if (!actor || actor.role !== "customer") return s;

        const id = `r_${Math.floor(Math.random() * 900000 + 100000)}`;
        const req = {
          id,
          customer_id: actor.id,
          category_id: payload.category_id,
          title: payload.title,
          description: payload.description,
          location_text: payload.location_text,
          lat: payload.lat ?? null,
          lng: payload.lng ?? null,
          area_size: payload.area_size ?? null,
          preferred_date: payload.timing_flexibility === "specific_date" ? payload.preferred_date ?? null : null,
          timing_flexibility: payload.timing_flexibility ?? "flexible",
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const media = (payload.media_urls ?? [])
          .filter(Boolean)
          .slice(0, 5)
          .map((url) => ({
            id: `rm_${Math.floor(Math.random() * 900000 + 100000)}`,
            request_id: id,
            file_url: url,
            file_type: "image/jpeg",
            uploaded_at: new Date().toISOString()
          }));

        // Notify matching providers (rule-based, MVP).
        let out = { ...s, requests: [req, ...s.requests], request_media: [...media, ...s.request_media] };
        const city = req.location_text.split(" - ")[0];
        const eligibleProviders = s.provider_profiles.filter((p) => {
          const user = s.users.find((u) => u.id === p.user_id);
          if (!user || user.status !== "active") return false;
          if (p.verification_status !== "approved") return false;
          if (!p.categories.includes(req.category_id)) return false;
          if (!p.coverage_areas.some((a) => a === city)) return false;
          return true;
        });
        for (const p of eligibleProviders) {
          out = notify(out, {
            userId: p.user_id,
            type: "request",
            text: `طلب جديد متاح: ${req.title} في ${city}`
          });
        }
        return out;
      });

    // Provider: submit quotation with constraints and eligibility.
    const submitQuotation = ({ requestId, quoted_price, estimated_duration, message }) =>
      setState((s) => {
        const actor = s.users.find((u) => u.id === s.ui.actorUserId);
        if (!actor || actor.role !== "provider") return s;
        if (actor.status !== "active") return s;

        const providerProfile = s.provider_profiles.find((p) => p.user_id === actor.id);
        if (!providerProfile) return s;
        if (providerProfile.verification_status !== "approved") return s;

        const request = s.requests.find((r) => r.id === requestId);
        if (!request || request.status !== "open") return s;

        const city = request.location_text.split(" - ")[0];
        const eligible =
          providerProfile.categories.includes(request.category_id) &&
          providerProfile.coverage_areas.includes(city);
        if (!eligible) return s;

        const existsActive = s.quotations.some(
          (q) => q.request_id === requestId && q.provider_id === providerProfile.id && q.status === "submitted"
        );
        if (existsActive) return s;

        const q = {
          id: `q_${Math.floor(Math.random() * 900000 + 100000)}`,
          request_id: requestId,
          provider_id: providerProfile.id,
          quoted_price: Number(quoted_price),
          estimated_duration,
          message: message ?? null,
          status: "submitted",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        let out = { ...s, quotations: [q, ...s.quotations] };
        out = notify(out, {
          userId: request.customer_id,
          type: "quote",
          text: `وصلك عرض سعر جديد من ${providerProfile.business_name}`
        });
        return out;
      });

    // Business rule: selecting quotation creates job, updates request + quote statuses.
    const selectQuotation = ({ requestId, quotationId }) =>
      setState((s) => {
        const q = s.quotations.find((x) => x.id === quotationId);
        if (!q) return s;

        const request = s.requests.find((r) => r.id === requestId);
        if (!request) return s;
        if (request.status !== "open") return s;

        const updatedQuotations = s.quotations.map((qq) => {
          if (qq.request_id !== requestId) return qq;
          if (qq.id === quotationId) return { ...qq, status: "selected" };
          return { ...qq, status: qq.status === "submitted" ? "rejected" : qq.status };
        });

        const updatedRequests = s.requests.map((r) =>
          r.id === requestId ? { ...r, status: "in_progress", updated_at: new Date().toISOString() } : r
        );

        const jobId = `j_${Math.floor(Math.random() * 900000 + 100000)}`;
        const convId = `c_${Math.floor(Math.random() * 900000 + 100000)}`;
        const newJob = {
          id: jobId,
          request_id: requestId,
          quotation_id: quotationId,
          customer_id: request.customer_id,
          provider_id: q.provider_id,
          status: "active",
          scheduled_date: request.preferred_date,
          provider_completed_at: null,
          customer_confirmed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const newConversation = {
          id: convId,
          job_id: jobId,
          customer_id: request.customer_id,
          provider_id: q.provider_id,
          created_at: new Date().toISOString()
        };

        let out = {
          ...s,
          quotations: updatedQuotations,
          requests: updatedRequests,
          jobs: [...s.jobs, newJob],
          conversations: [...s.conversations, newConversation]
        };
        out = notify(out, {
          userId: getProviderProfile(q.provider_id)?.user_id ?? "",
          type: "selected",
          text: `تهانينا! تم اختيار عرضك لطلب: ${request.title}`
        });
        out = notify(out, {
          userId: request.customer_id,
          type: "job",
          text: `تم إنشاء مشروع لطلب: ${request.title}`
        });
        return out;
      });

    const providerMarkCompleted = ({ jobId }) =>
      setState((s) => ({
        ...s,
        jobs: s.jobs.map((j) =>
          j.id === jobId
            ? { ...j, status: "completed", provider_completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }
            : j
        )
      }));

    const customerConfirmCompleted = ({ jobId }) =>
      setState((s) => ({
        ...s,
        jobs: s.jobs.map((j) =>
          j.id === jobId
            ? { ...j, customer_confirmed_at: new Date().toISOString(), updated_at: new Date().toISOString() }
            : j
        )
      }));

    const submitRating = ({ jobId, score, comment }) =>
      setState((s) => {
        const job = s.jobs.find((j) => j.id === jobId);
        if (!job?.customer_confirmed_at) return s;

        const exists = s.ratings.some((r) => r.job_id === jobId);
        if (exists) return s;

        const rating = {
          id: `ra_${Math.floor(Math.random() * 900000 + 100000)}`,
          job_id: jobId,
          customer_id: job.customer_id,
          provider_id: job.provider_id,
          score,
          comment,
          created_at: new Date().toISOString()
        };
        return { ...s, ratings: [...s.ratings, rating] };
      });

    const sendMessage = ({ conversationId, senderId, text, attachmentUrl }) =>
      setState((s) => ({
        ...s,
        messages: [
          ...s.messages,
          {
            id: `m_${Math.floor(Math.random() * 900000 + 100000)}`,
            conversation_id: conversationId,
            sender_id: senderId,
            message_text: text,
            attachment_url: attachmentUrl ?? null,
            created_at: new Date().toISOString()
          }
        ]
      }));

    const adminApproveProvider = ({ providerProfileId }) =>
      setState((s) => ({
        ...s,
        provider_profiles: s.provider_profiles.map((p) =>
          p.id === providerProfileId ? { ...p, verification_status: "approved" } : p
        )
      }));

    const adminRejectProvider = ({ providerProfileId }) =>
      setState((s) => ({
        ...s,
        provider_profiles: s.provider_profiles.map((p) =>
          p.id === providerProfileId ? { ...p, verification_status: "rejected" } : p
        )
      }));

    return {
      state,
      derived,
      getUser,
      getProviderProfile,
      getCategory,
      setTheme,
      setActor,
      markAllNotificationsRead,
      createRequest,
      submitQuotation,
      selectQuotation,
      providerMarkCompleted,
      customerConfirmCompleted,
      submitRating,
      sendMessage,
      adminApproveProvider,
      adminRejectProvider
    };
  }, [state, derived]);

  React.useEffect(() => {
    document.body.dataset.theme = state.ui.theme;
  }, [state.ui.theme]);

  // Keep this file as pure .js (no JSX) for Vite build import analysis.
  return React.createElement(StoreContext.Provider, { value: api }, children);
}

export function useStore() {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

