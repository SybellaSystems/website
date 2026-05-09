// pages/privacy-policy.tsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      {/* Full-width container */}
      <div className="w-full space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1C3C8C] mb-2">
            Privacy Policy of Sybella Systems
          </h1>
          {/* <p className="text-sm text-gray-500">
            Effective Date: ,,,,,,,,,,,,,,,,,,
          </p> */}
        </div>

        <section className="space-y-8 max-w-[90%] mx-auto">
          <p>
            At Sybella Systems ("we," "us," or "our"), we are dedicated to
            ensuring your privacy. This Privacy Policy explains our policies on
            the collection, use, and disclosure of your information when you use
            our services. By using or accessing our services, you accept the
            terms of this Privacy Policy.
          </p>

          {/* Principles */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Our Principles
            </h2>
            <p>
              We promise to handle your personal data responsibly and according
              to applicable laws. Our principles are:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Transparency of data practices.</li>
              <li>Minimization of data to what is necessary.</li>
              <li>Care for your rights regarding your personal data.</li>
              <li>Security for protection of your data.</li>
            </ul>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Information We Collect
            </h2>

            <h3 className="font-semibold mt-2">
              Information You Provide Directly to Us
            </h3>
            <p>
              When you register, fill in forms, or contact us, you might provide
              us with personal information, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Name</li>
              <li>E-mail address</li>
              <li>Phone number</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information</li>
            </ul>

            <h3 className="font-semibold mt-2">
              Information Automatically Collected
            </h3>
            <p>
              When you access our services, we gather automatically some device
              and usage patterns information, including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages on our website visited</li>
              <li>Date and time of access</li>
              <li>Time spent on pages</li>
            </ul>

            <h3 className="font-semibold mt-2">Data from Third Parties</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Social networking websites when you connect your account.</li>
              <li>Marketing partners to enhance our services.</li>
              <li>
                Service providers who assist us in delivering our services.
              </li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To provide, continue, and upgrade our services.</li>
              <li>To process payments and manage your account.</li>
              <li>
                To get in touch with you, including sending updates and
                promotional materials.
              </li>
              <li>
                To gain knowledge about user behavior and preferences to enhance
                our services.
              </li>
              <li>To prevent fraud and ensure security.</li>
            </ul>
          </div>

          {/* When We Share Your Information */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              When We Share Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>To comply with the law and respond to legal requests.</li>
              <li>
                For the protection of the rights, property, or safety of Sybella
                Systems, our users, or others.
              </li>
              <li>In connection with a merger, asset sale, or acquisition.</li>
              <li>With your consent or at your request.</li>
            </ul>
          </div>

          {/* Service Providers */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Service Providers
            </h2>
            <p>
              We may appoint third-party organizations and individuals to
              provide our services ("Service Providers"). Service Providers may
              have access to your personal information to perform tasks on our
              behalf, but are not permitted to pass it on or use it otherwise.
            </p>
          </div>

          {/* Legal Compliance */}
          <div>
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Legal Compliance and Protection of Creative Commons and Others
            </h2>
            <p>
              We may share your information as needed when we are required by
              law or in response to valid requests from public authorities (for
              example, a court order or government agency). We also may share
              your information as we reasonably believe we have the right to do
              so to protect our rights and the rights of others, including to
              enforce our agreements and policies.
            </p>
          </div>

          {/* All remaining sections... */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Business Transfers
            </h2>
            <p>
              If we perform a merger, acquisition, or sale of assets, your
              personal information could be part of the business transaction. We
              will provide advance notice before your personal information is
              transferred and subject to a new privacy policy.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Affiliated Companies
            </h2>
            <p>
              We can share your information with our affiliate companies, and in
              that case, we will cause such affiliates to agree to this Privacy
              Policy. Affiliates include our parent entity, subsidiaries, joint
              venture entities, or other entities which we control or are under
              common control with us.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Consent
            </h2>
            <p>
              By using our services, you consent to the collection and use of
              your Personal Data as described in this Privacy Policy. You can
              withdraw your consent at any time with or without legal or
              contractual exceptions.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Aggregate/De-identified Information
            </h2>
            <p>
              We may use and disclose aggregate or de-identified information
              that could not reasonably be used to identify you for various
              purposes such as research, analysis, and marketing.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Legal Basis for Processing Personal Data (Rwanda)
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                To Fulfill Our Contractual Obligations to You: We process your
                personal information in order to comply with our contractual
                obligations with you.
              </li>
              <li>
                Legitimate Interests: We are able to process your information
                where it is our legitimate interest, provided our interests do
                not override your rights.
              </li>
              <li>
                Legal Requirement: We may process your data in order to fulfill
                the obligations required by law or in order to allow us to
                operate as a business.
              </li>
              <li>
                Consent: Where we rely on your consent, we will ask for your
                clear consent to process your data.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Online Analytics
            </h2>
            <p>
              We may employ the services of third-party service providers to
              monitor and analyze usage of our services. The providers may store
              information from your device, such as your IP address, browser
              type, and pages visited.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Your Choices and Data Subject Rights
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The right to access personal data.</li>
              <li>The right to request a correction of personal data.</li>
              <li>The right to request erasure of personal data.</li>
              <li>
                The right to object or restrict processing of personal data.
              </li>
              <li>The right to data portability.</li>
            </ul>
            <p>
              If you wish to exercise any of these rights, you can contact us at
              the following details.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              International Transfers
            </h2>
            <p>
              Your information may be shared to — and stored on — computers in
              countries other than your home country, where the laws of
              information protection might be less stringent. If you are outside
              Rwanda but would like to supply us with information, note that we
              transmit the information, including personal information, to
              Rwanda and process it there.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Security Measures
            </h2>
            <p>
              We are dedicated to protecting your personal information and
              implementing adequate technical and organizational measures to
              prevent unauthorized access, use, or disclosure. Nevertheless, no
              method of transmission over the Internet or method of electronic
              storage is 100% secure, and we cannot guarantee complete security.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Children
            </h2>
            <p>
              Our site is not targeted towards children who are under the age of
              13. We do not collect information from children under the age of
              13 on purpose. We will delete such information if we notice that
              we have collected personal information from a child.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Data Retention
            </h2>
            <p>
              We will keep your personal data no longer than necessary for the
              purposes set out in this Privacy Policy. We will retain and use
              your information for as long as necessary to achieve the purposes
              listed in this Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Third-Party Links and Services
            </h2>
            <p>
              Our website might be linking to third-party websites or services
              not owned or controlled by us. We have no control over the privacy
              practices of these third parties. We suggest that you review the
              privacy statements of any third-party websites that you choose to
              visit.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Changes to this Privacy Policy
            </h2>
            <p>
              We may modify our Privacy Policy at any time. We will give you
              notice of any changes by publishing the new Privacy Policy on this
              page. You should check this Privacy Policy regularly for any
              updates. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </p>

            <h2 className="text-2xl font-semibold text-[#1C3C8C] mb-2">
              Questions About this Privacy Policy
            </h2>
            <p>
              If you require any information regarding this Privacy Policy or
              our privacy policy, you can contact us at: …………………. We will be
              pleased to assist you and resolve any questions you have regarding
              your personal information and privacy.
            </p>
          </div>
        </section>


      </div>
    </div>
  );
};

export default PrivacyPolicy;
