"use client";
import { useState } from "react";
import { ContactFormData } from "../types";
import { useI18n } from "../contexts/I18nContext";

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    company: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error">("idle");

  // Handle input change
  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  // Contact form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop submission
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        console.log("Form Data Submitted:", formData);
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to send contact form");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "", company: "", phone: "" });
    } catch (error) {
      setSubmitStatus("error");
      console.error("Contact form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Subscribe to newsletter
  const handleSubscribe = async () => {
    if (!formData.email.trim()) {
      setErrors({ email: "Email is required to subscribe" });
      return;
    }

    setSubscribeStatus("idle");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      setSubscribeStatus("success");
    } catch (error) {
      setSubscribeStatus("error");
      console.error("Newsletter subscribe failed:", error);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-blue dark:text-dark-text mb-4 text-center">
            {t("contact.title")}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-dark-text-secondary mb-6 sm:mb-8 text-center">
            {t("contact.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder={t("contact.placeholder.name")}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                />
                {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
              </div>

              <div className="flex flex-col">
                <input
                  type="email"
                  placeholder={t("contact.placeholder.email")}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
                />
                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <input
                type="text"
                placeholder={t("contact.placeholder.company")}
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
              />
              <input
                type="tel"
                placeholder={t("contact.placeholder.phone")}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
              />
            </div>

            <div className="flex flex-col">
              <textarea
                rows={6}
                placeholder={t("contact.placeholder.message")}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-dark-surface dark:text-dark-text"
              />
              {errors.message && <span className="text-red-500 text-sm mt-1">{errors.message}</span>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? t("contact.sending") : t("contact.sendMessage")}
              </button>

              <button
                type="button"
                onClick={handleSubscribe}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-dark-blue text-dark-blue dark:text-dark-text dark:border-dark-text font-semibold rounded-lg hover:bg-dark-blue hover:text-white dark:hover:bg-dark-text dark:hover:text-dark-bg transition-colors"
              >
                {subscribeStatus === "success"
                  ? "Subscribed!"
                  : subscribeStatus === "error"
                  ? "Try Again"
                  : t("contact.subscribe")}
              </button>
            </div>
          </form>

          {submitStatus === "success" && (
            <p className="mt-4 text-green-600 font-medium text-center">Message sent successfully!</p>
          )}
          {submitStatus === "error" && (
            <p className="mt-4 text-red-600 font-medium text-center">Failed to send message. Please try again.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
