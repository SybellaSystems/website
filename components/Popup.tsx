"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../contexts/I18nContext";
import { toast } from "sonner";

export default function SubscriptionPopup() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const hasClosed = sessionStorage.getItem("popupClosed");
    if (!hasClosed) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("popupClosed", "true");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Subscribing...");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      toast.success(t("popup.success") || "Thank you for subscribing!", { 
        id: toastId,
        description:  "Successfully subscribed to newsletter"
      });
      setShow(false);
      sessionStorage.setItem("popupClosed", "true");
      setEmail(""); // Clear the email field
    } catch (err: any) {
      console.error(err);
      toast.error(t("popup.error") || "Failed to subscribe", { 
        id: toastId,
        description: err.message || "Please try again later."
      });
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-[#07090d]/80 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-[#0b0f18]/90 rounded-2xl shadow-2xl p-6 w-80 text-center border border-white/10"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 bg-white/10 hover:bg-white/15 text-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-md border border-white/10"
              aria-label="Close"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-2 text-white">
              {t("popup.title")}
            </h2>
            <p className="text-gray-300 mb-4">
              {t("popup.subtitle")}
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder={t("popup.placeholder")}
  
                onChange={(e) => setEmail(e.target.value)}
                className="border border-white/10 bg-[#07090d]/70 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 w-full mb-3 outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 w-full hover:bg-blue-700"
              >
                {t("popup.button")}
              </button>
            </form>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
