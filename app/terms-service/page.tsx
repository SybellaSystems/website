// pages/terms-of-service.tsx
import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6">
      <div className=" mx-auto py-12 px-6">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-4 text-[#1C3C8C]">
          Terms of Service of Sybella Systems
        </h1>
        {/* <p className="text-center text-sm text-[#6B7280] mb-10">
          Effective Date: (Insert Date)
        </p> */}

        {/* Sections */}
        <section className="space-y-8">
          {/* 1. Interpretation */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Interpretation
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
              Definitions
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>Services:</strong> The software solutions, applications,
                and platforms provided by Sybella Systems designed to empower
                African communities, facilitate education, enhance business
                operations, and promote meaningful employment opportunities.
              </li>
              <li>
                <strong>User:</strong> Any individual or entity that accesses,
                registers, or uses our Services, including but not limited to
                customers, partners, and visitors.
              </li>
              <li>
                <strong>Content:</strong> All information, text, graphics,
                images, audio, video, and other materials that are posted,
                uploaded, or transmitted through our Services, whether by Users
                or by us.
              </li>
            </ul>
          </div>

          {/* 3. Acknowledgment */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Acknowledgment
            </h2>
            <p>
              By using our Services, you acknowledge that you have read,
              understood, and agree to be bound by these Terms. You represent
              and warrant that you are of legal age to enter into these Terms or
              that you have obtained the consent of a parent or guardian.
            </p>
          </div>

          {/* 4. User Accounts */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              User Accounts
            </h2>
            <p>
              To access certain features of our Services, you may be required to
              create a user account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Provide accurate, current, and complete information during the
                registration process.
              </li>
              <li>Maintain the security of your password and account.</li>
              <li>
                Notify us immediately of any unauthorized use of your account or
                any other breach of security.
              </li>
              <li>
                Be responsible for all activities that occur under your account.
              </li>
            </ul>
          </div>

          {/* 5. Content */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Content
            </h2>
            <p>
              You are solely responsible for any Content you post or transmit
              through our Services. You retain ownership of all rights to your
              Content, subject to the rights granted to us in these Terms. By
              posting Content, you grant us a worldwide, non-exclusive,
              royalty-free, sublicenseable, and transferable license to use,
              reproduce, modify, publish, and distribute such Content.
            </p>
          </div>

          {/* 6. Our Right to Post Content */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Our Right to Post Content
            </h2>
            <p>
              We reserve the right to post, modify, or remove Content from our
              Services at our discretion. This includes the right to use your
              Content to improve our Services, develop new features, and conduct
              research. We may also analyze usage patterns and trends to enhance
              user experience.
            </p>
          </div>

          {/* 7. Content Restrictions */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Content Restrictions
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                Illegal, harmful, threatening, abusive, harassing, defamatory,
                obscene, or otherwise objectionable content.
              </li>
              <li>
                Infringing upon the intellectual property rights of others.
              </li>
              <li>Containing viruses, malware, or any other harmful code.</li>
              <li>Misleading or deceptive content.</li>
            </ul>
          </div>

          {/* 8. Content Backups */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Content Backups
            </h2>
            <p>
              While we strive to maintain backups of all Content, we are not
              responsible for any loss or deletion of your Content. It is your
              responsibility to maintain your own backups. We recommend that you
              regularly back up your Content and data.
            </p>
          </div>

          {/* 9. Copyright Policy */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Copyright Policy
            </h2>
            <p>
              We respect the intellectual property rights of others. If you
              believe that your work has been copied in a way that constitutes
              copyright infringement, please contact us with the necessary
              details, including your contact information, a description of the
              work, and a description of where the alleged infringement is
              located.
            </p>
          </div>

          {/* 10. Intellectual Property Infringement */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Intellectual Property Infringement
            </h2>
            <p>
              You may not use our Services to infringe upon the intellectual
              property rights of others. We take allegations of infringement
              seriously and will investigate such claims. We reserve the right
              to remove Content that infringes on the rights of others and may
              terminate the accounts of repeat infringers.
            </p>
          </div>

          {/* 11. Your Feedback to Us */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Your Feedback to Us
            </h2>
            <p>
              We welcome your feedback, suggestions, and ideas regarding our
              Services. By submitting feedback, you grant us a perpetual,
              irrevocable, and royalty-free license to use your feedback for any
              purpose, including improvements to our Services. We appreciate
              your input and may use it in future updates.
            </p>
          </div>

          {/* 12. Links to Other Websites */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Links to Other Websites
            </h2>
            <p>
              Our Services may contain links to third-party websites or services
              that are not owned or controlled by us. We are not responsible for
              the content, privacy policies, or practices of these websites. We
              encourage you to read the terms of service and privacy policies of
              any third-party websites you visit.
            </p>
          </div>

          {/* 13. Termination */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend your access to our
              Services at any time, for any reason, without prior notice. Upon
              termination, your right to use our Services will immediately
              cease. We may also take legal action if necessary to enforce these
              Terms.
            </p>
          </div>

          {/* 14. Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages arising from your use of our Services. This includes, but
              is not limited to, loss of profits, data, or goodwill.
            </p>
          </div>

          {/* 15. "AS IS" and "AS AVAILABLE" Disclaimer */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              "AS IS" and "AS AVAILABLE" Disclaimer
            </h2>
            <p>
              Our Services are provided on an "AS IS" and "AS AVAILABLE" basis.
              We make no representations or warranties of any kind regarding the
              operation of our Services, the accuracy of the information
              provided, or the availability of any specific features. Your use
              of our Services is at your own risk.
            </p>
          </div>

          {/* 16. Governing Law of Rwanda */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Governing Law of Rwanda
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the Republic of Rwanda, without regard to its conflict
              of law principles. Any legal action or proceeding arising out of
              or relating to these Terms shall be brought exclusively in the
              courts located in Rwanda.
            </p>
          </div>

          {/* 17. Dispute Resolution */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Dispute Resolution
            </h2>
            <p>
              Any disputes arising out of or relating to these Terms shall be
              resolved through binding arbitration in accordance with the rules
              of the Rwanda Arbitration Centre. The arbitration shall take place
              in Kigali, Rwanda, and the proceedings shall be conducted in
              English.
            </p>
          </div>

          {/* 18. Severability and Waiver */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Severability and Waiver
            </h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions shall remain in full effect. Our failure to
              enforce any right or provision of these Terms shall not be deemed
              a waiver of such right or provision.
            </p>
          </div>

          {/* 19. Changes to Terms */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Changes to These Terms of Service
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Any
              changes will be effective immediately upon posting on our website.
              Your continued use of our Services after changes constitutes
              acceptance of the new Terms. We encourage you to review these
              Terms periodically for any updates.
            </p>
          </div>

          {/* 20. Contact Us */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Contact Us
            </h2>
            <p>
              If you have any questions or concerns about these Terms, please
              contact us at{" "}
              <span className="text-[#28A745] font-semibold">
                (Insert Contact Information)
              </span>
              . We value your feedback and are here to assist you with any
              inquiries you may have.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
