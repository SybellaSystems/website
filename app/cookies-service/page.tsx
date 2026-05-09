// pages/cookie-policy.tsx
import React from "react";

const CookiePolicy = () => {
  
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      <div className="w-full space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1C3C8C] mb-2">
            Cookie Policy of Sybella Systems
          </h1>
      
        </div>

        {/* Main Content */}
        <section className="space-y-8 max-w-[90%] mx-auto">
          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Introduction
            </h2>
            <p>
              This Cookie Policy explains how Sybella Systems ("we," "us," or
              "our") uses cookies and other similar technologies when you visit
              our website and use our services. By visiting our website, you
              consent to the use of cookies as explained in this policy.
            </p>
          </div>

          {/* How We Use Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              How We Use Cookies
            </h2>
            <p>
              Cookies are small text files stored on your device when you access
              a website. We use cookies and other similar tracking technologies
              to make your browsing experience on our website even more
              enjoyable and to provide you with personalized content. Cookies
              help us:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Remember your preferences and settings.</li>
              <li>See how you use our website.</li>
              <li>
                Improve the performance, usability, and functionality of our
                services.
              </li>
              <li>Display targeted advertisements based on your interests.</li>
            </ul>
          </div>

          {/* Types of Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Types of Cookies We Use
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Essential Cookies:</strong> Necessary for core website
                functionality.
              </li>
              <li>
                <strong>Performance Cookies:</strong> Collect usage information
                to optimize the website.
              </li>
              <li>
                <strong>Functional Cookies:</strong> Remember your choices like
                username, language, or region.
              </li>
              <li>
                <strong>Targeting/Advertising Cookies:</strong> Deliver ads
                relevant to your interests.
              </li>
            </ul>
          </div>

          {/* Full List of Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Full List of Cookies
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Session Cookies:</strong> Temporary cookies erased when
                you close your browser.
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Saved on your device until
                they expire or are manually deleted.
              </li>
              <li>
                <strong>Third-Party Cookies:</strong> Set by external domains
                for advertising and analytics.
              </li>
            </ul>
          </div>

          {/* Consent */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Consent
            </h2>
            <p>
              The first time you visit our website, you will see a cookie banner
              which informs you about our use of cookies. By choosing{" "}
              <span className="text-[#28A745] font-semibold">“Accept”</span> or
              continuing to browse our website, you consent to our use of
              cookies in accordance with this policy. You can manage your cookie
              preferences at any time through your browser.
            </p>
          </div>

          {/* What Can You Do About Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              What Can You Do About Cookies
            </h2>
            <p>
              You have the right to control and manage cookies. Some of the
              choices you have are as follows:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Browser Settings:</strong> Most web browsers provide
                control over cookies through the browser settings. You can
                accept or reject cookies, delete cookies already present, or
                have the browser notify you when a cookie is being sent.
              </li>
              <li>
                <strong>Opt-Out:</strong> You can opt out of targeted
                advertising cookies by going to the websites of advertising
                networks and filling out their opt-out forms.
              </li>
              <li>
                <strong>Cookie Management Tools:</strong> Some browsers offer
                tools or browser extensions that allow you to manage cookies
                more effectively.
              </li>
            </ul>
            <p className="mt-2 text-gray-500">
              Note: Disabling cookies may limit functionality and affect your
              browsing experience.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              How to Contact Us
            </h2>
            <p>
              If you have any queries or would like more information about our
              Cookie Policy or how we utilize cookies, please contact us at{" "}
              <span className="text-[#28A745] font-semibold">
                (Insert Contact Information)
              </span>
              . We're here to assist and answer any questions you may have
              regarding your privacy and data usage.
            </p>
          </div>
        </section>


      </div>
    </div>
  );
};

export default CookiePolicy;
