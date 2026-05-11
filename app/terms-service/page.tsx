// pages/terms-of-service.tsx
import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-center mb-4 text-[#1C3C8C]">
            Terms of Service of Sybella Systems
          </h1>
          <p className="text-center text-sm text-[#6B7280]">
            Effective Date: May 11, 2026 | Last Updated: May 11, 2026
          </p>
        </header>

        {/* Sections */}
        <section className="space-y-8 text-sm md:text-base leading-relaxed">
          {/* 1. Interpretation */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              1. Interpretation
            </h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of
              the services provided by Sybella Systems ("we," "us," or "our").
              By accessing or using our services, you agree to be bound by these
              Terms. If you do not agree, you must not use our services.
            </p>
          </div>

          {/* 2. Definitions */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              2. Definitions
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Services:</strong> Software solutions, cloud platforms,
                AI-powered tools, and digital applications provided by Sybella
                Systems.
              </li>
              <li>
                <strong>User:</strong> Any individual or entity that accesses,
                registers, or uses our Services.
              </li>
              <li>
                <strong>Content:</strong> All information, text, graphics, and
                code transmitted through our Services.
              </li>
              <li>
                <strong>Data:</strong> Personal or transactional information 
                processed through our systems, including AI-driven insights.
              </li>
            </ul>
          </div>

          {/* 3. Acknowledgment */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              3. Acknowledgment
            </h2>
            <p>
              By using our Services, you acknowledge that you have read and
              understand these Terms. You warrant that you are of legal age or
              have obtained parental/guardian consent.
            </p>
          </div>

          {/* 4. User Accounts */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              4. User Accounts
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide accurate and complete information.</li>
              <li>Maintain the security of your credentials.</li>
              <li>Notify us immediately of unauthorized access.</li>
              <li>Accept responsibility for all activities under your account.</li>
            </ul>
          </div>

          {/* 5. Content Ownership */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              5. Content
            </h2>
            <p>
              You retain ownership of your Content. You grant us a
              worldwide, royalty-free license to use and distribute such Content 
              solely to provide and improve our Services.
            </p>
          </div>

          {/* 6. AI & Emerging Technologies */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              6. AI & Emerging Technologies
            </h2>
            <p>
              Our Services include AI, blockchain, and cloud computing. You 
              consent to automated processing and analytics. We commit to 
              ethical AI practices and transparency in algorithmic decisions.
            </p>
          </div>

          {/* 7. Data Privacy & Security */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              7. Data Privacy & Security
            </h2>
            <p>
              We comply with GDPR and Rwanda Data Protection Laws. While we 
              employ high-level encryption, you are responsible for maintaining 
              the confidentiality of your login information.
            </p>
          </div>

          {/* 8. Content Restrictions */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              8. Content Restrictions
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4 text-red-700">
              <li>Illegal, harmful, or abusive content.</li>
              <li>Intellectual property infringement.</li>
              <li>Viruses, malware, or malicious code.</li>
              <li>Deceptive information or deepfakes intended to mislead.</li>
            </ul>
          </div>

          {/* 9. Backups & Reliability */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              9. Backups & Reliability
            </h2>
            <p>
              We use redundant systems but cannot guarantee zero data loss. 
              Users are encouraged to maintain independent backups of critical data.
            </p>
          </div>

          {/* 10. Intellectual Property */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              10. Intellectual Property
            </h2>
            <p>
              All proprietary technologies, including AI models and source code, 
              remain the property of Sybella Systems.
            </p>
          </div>

          {/* 11. Feedback */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              11. Feedback
            </h2>
            <p>
              Any feedback provided grants us a perpetual license to use that 
              input for innovation without further compensation to you.
            </p>
          </div>

          {/* 12. Third-Party Links */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              12. Third-Party Links
            </h2>
            <p>
              We are not responsible for the content or security of third-party 
              websites linked within our platform.
            </p>
          </div>

          {/* 13. Termination */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              13. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts for 
              violations of these Terms or system abuse.
            </p>
          </div>

          {/* 14. Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              14. Limitation of Liability
            </h2>
            <p>
              Sybella Systems is not liable for indirect, incidental, or 
              consequential damages arising from your use of the Services.
            </p>
          </div>

          {/* 15. Disclaimer */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              15. Disclaimer
            </h2>
            <p>
              Services are provided "AS IS." We make no warranties regarding 
              uninterrupted uptime or 100% accuracy of AI outputs.
            </p>
          </div>

          {/* 16. Governing Law */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              16. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the Republic of Rwanda.
            </p>
          </div>

          {/* 17. Dispute Resolution */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              17. Dispute Resolution
            </h2>
            <p>
              Disputes will be resolved through good-faith negotiation. If 
              unresolved, they shall be submitted to the competent courts in 
              Kigali, Rwanda.
            </p>
          </div>

          {/* 18. Changes to Terms */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              18. Changes to Terms
            </h2>
            <p>
              We may update these Terms to reflect evolving technology or 
              regulatory changes. Continued use of Services after updates 
              constitutes acceptance of new Terms.
            </p>
          </div>

          {/* 19. Contact */}
          <div className="pt-8 border-t border-gray-200 text-center">
            <h2 className="text-xl font-semibold text-[#1C3C8C] mb-2">
              Questions?
            </h2>
            <p>
              Contact us at: <strong>legal@sybellasystems.co.rw</strong>
            </p>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="mt-16 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Sybella Systems. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default TermsOfService;