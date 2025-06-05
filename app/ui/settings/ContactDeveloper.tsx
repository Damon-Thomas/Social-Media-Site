"use client";
import { useState } from "react";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ContactDeveloper() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  function validate() {
    const newErrors: typeof errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Please enter your name (at least 2 characters).";
    }
    if (!form.email.trim() || !validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = "Please enter a message (at least 10 characters).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setErrors({});
      } else if (
        res.status === 400 ||
        res.status === 429 ||
        res.status === 500
      ) {
        const data = await res.json();
        // Prefer errors object, but fall back to error string for 429/500
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.error) {
          setErrors({ message: data.error });
        } else {
          setErrors({});
        }
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      className="w-full flex flex-col mt-8"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="text-2xl font-bold mb-1">Contact the Developer</h2>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex flex-col">
          <label htmlFor="contact-name" className="mb-1 text-sm font-medium">
            Name
          </label>
          <input
            id="contact-name"
            className="p-2 rounded border border-zinc-600 bg-transparent text-[var(--dmono)] focus:border-[var(--primary)] transition"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <div className="h-4">
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <label htmlFor="contact-email" className="mb-1 text-sm font-medium">
            Email
          </label>
          <input
            id="contact-email"
            className="p-2 rounded border border-zinc-600 bg-transparent text-[var(--dmono)] focus:border-[var(--primary)] transition"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <div className="h-4">
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="contact-message" className="mb-1 text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          className="p-2 rounded border border-zinc-600 bg-transparent text-[var(--dmono)] focus:border-[var(--primary)] transition min-h-[100px]"
          placeholder="Your Message"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          rows={5}
          required
        />
        <div className="h-6">
          {errors.message &&
            !errors.name &&
            !errors.email &&
            errors.message !== "Too many requests. Please try again later." &&
            errors.message !== "Failed to send email." && (
              <p className="text-red-400 text-xs mt-1">{errors.message}</p>
            )}
        </div>
      </div>
      {/* General error (rate limit, server, etc) */}
      {errors.message &&
        !errors.name &&
        !errors.email &&
        (errors.message === "Too many requests. Please try again later." ||
          errors.message === "Failed to send email.") && (
          <p className="text-red-400 text-xs mb-2">{errors.message}</p>
        )}
      <div className="flex items-center gap-4">
        <button
          className="bg-[var(--primary)] text-[var(--aBlack)] font-bold py-2 px-6 rounded transition"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send"}
        </button>
        {status === "sent" && (
          <span className="text-green-400 text-sm">
            Message sent! Thank you.
          </span>
        )}
        {status === "error" && (
          <span className="text-red-400 text-sm">
            Something went wrong. Please try again.
          </span>
        )}
      </div>
    </form>
  );
}
