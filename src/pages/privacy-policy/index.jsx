import React from "react";
import { DropdownIcon } from "../../utills/imgConstants";
import { BreadCrumb } from "primereact/breadcrumb";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const items = [
    {
      label: (
        <Link className="breadcrumb-link" to="/delivery-request">
          Home
        </Link>
      ),
    },
    {
      label: <Link className="breadcrumb-link">Privacy Policy</Link>,
    },
  ];

  const personalInfo = [
    "When You access or use any of the services on the Company website or myTVS mobile app, We collect sign-up and account information such as Your name, phone number, physical address and e-mail ID.",
    "When You use Our location-enabled services i.e., myTVS Life360, We collect information about Your actual location and about things near Your device, such as Wi-Fi access points, cell towers and Bluetooth-enabled devices, through GPS and other sensor data from Your device (“Location Data”).",
    "When You sign-up for Our services and use the myTVS app, We may collect Sensitive Personal Data or Information (as defined in Section 3 of the Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules, 2011) such as Your password for security purposes and You authorize Us to do so by agreeing to this Privacy Policy.",
    "When You register for an event, webinar or contest, We Collect Your contact information, such as Your full name, email, phone and location. When You register through a registration form on Our Website, We may collect information such as IP address and location.",
    "When You request customer support, We collect Your name, device information or any other Personal Information You may provide Us in the course of such interaction.",
    "When You submit certain information to Our services, such as filling out a survey about Your user experience or feedback, We collect Personal Information You have provided as part of it.",
    "When You enter information in the landing pages of this website which is used by marketing teams, We collect Your contact information, such as Your full name, email, phone and location.",
    "When You apply for an employment opportunity with Us through Our online recruitment system, We collect Your contact information, such as name, email address, mailing address, phone number; any other information You volunteer, including during any interview or Your interactions with Us and contained in the resume that You submit to Us.",
    "We collect supply chain management data, including Personal Information of individual contractors, agents and of account managers, resellers and staff of third-party suppliers who provide services to Us.",
    "We may collect Personal Information about You that Our Affiliates share with Us",
  ];
  const personalInfoNotShared = [
    "When You are a visitor of this website, We collect Your device and Your usage of our website or emails (such as Internet Protocol (IP) addresses or other identifiers as described in the section “Cookie Policy”.",
    "When You use and interact with Our services, We collect Your device type, and the operating system version and Your usage of Our services through log files and other technologies, some of which may qualify as Personal Information.",
    "We may collect Your Personal Information (a) from third party sources that share such information with Us, such as providers of lists of potential service users without breach of any confidentiality clause; or (b) that is available on public platforms.",
    "When You subscribe to Our services, We collect transaction confirmation and completion details from Our banking and credit card partners.",
    "When You use certain services on the myTVS mobile app, We collect insurance policy details that insurers may share with Us.",
    "We may also collect or receive Your Personal Information from other sources such as Our business or channel partners through whom You create or access Your account.",
    "When You authorize Us to connect with a third-party service, We will access and store Your Personal Information that the third-party service makes available to Us, which may include Your email address, location or profile information.",
  ];

  const purposePersonalInfo = [
    "Enable Your access to and use of Our services and process the transaction and to fulfil booking requests with service centers.",
    "Enable Us to offer features like nearest service centers, vehicle location to provide emergency breakdown assistance and vehicle tracking information for Dongle fitted vehicles.",
    "Respond to User’s requests for service brochures, to customize and improve communication content, or for marketing or brand promotion.",
    "For analysis and development activities (including data analytics, surveys and/or profiling) to improve Our services and facilities in order to enhance Your relationship with Us or for Your benefit, or to improve any of our Service(s) for Your benefit. It may also be used to provide User with helpful offers and information on myTVS products and services.",
    "Provide support in relation to Your use of Our Services (for example, mailing information in response to Your request for a service request or to follow up on a query or complaint).",
    "To organize events or for other marketing/ promotional activities and ensure that any event, webinar or contest You register for is conducted in a secure and effective manner.",
    "Investigate and prevent fraudulent transactions, unauthorized access to this website and/or myTVS app, and other illegal activities;",
    "Evaluate You for any position that You have applied for or that We may consider You at the time that You submitted Your resume or on a later date.",
    "Perform Our obligations or receive products/services in accordance with any contract that We may have with You or Your organization;",
    "Manage Our relationship with You or Your organization;",
  ];

  const sharingInfo = [
    "Our Affiliates, companies that We will acquire in the future when they are made Our Affiliates, and third-party service providers so that they may offer You Our services, support in connection with Our services and/or to send information or updates on the services.",
    "Credit reference agencies to prevent fraudulent purchases.",
    "Our third-party service providers that host and maintain this website, Our applications, backup, storage, payment processing, analytics and other services. These third-party service providers may have access to or use Your Personal Information for the purpose of providing these services to Us.",
    "Third-party providers who assist Us in marketing and promotions.",
    "Third party organisers or sponsors that assist Us with the organisation of events,webinars, contests.",
    "External recruiters and organizations like those that do employee background checks on Our behalf and on behalf of Our group entities.",
    "Third parties whose products We use in maintaining a record of and evaluating You for the position applied.",
    "Third parties involved in a corporate transaction., If Company becomes involved in a merger, acquisition, or any form of sale of some or all its assets, then, in accordance with applicable laws, Company will use reasonable efforts to notify You of any transfer of Personal Information to an unaffiliated third party.",
    "Law enforcement authorities, government authorities, courts, dispute resolution bodies, regulators, auditors, and any party appointed or requested by applicable regulators to carry out investigations or audits of Our activities.",
    "Professional advisors who advise and assist Us in enforcing Our contracts and policies, handling Our claims, effective management of Our company and in relation to any disputes We may become involved in.",
  ];

  const rights = [
    "You can request Us for access and correction of Your Personal Information.",
    "You can request Us to delete Your Personal Information and We will take all reasonable steps to delete it unless We need to keep it for legal or statutory reasons as mentioned above.",
    "If We have collected and used Your Sensitive Personal Data or Information SPDI with Your consent, then You can withdraw Your consent at any time. Withdrawing Your consent will not affect the lawfulness of any Our use of Your Personal Information prior to Your withdrawal, nor will it affect use of Your Personal Information conducted in reliance on lawful grounds other than consent.",
    "You have the right to opt-out of marketing communications We send You at any time by contacting Us.",
    "If You seek to exercise Your rights under this clause, please contact Us at the details provided in clause 10. We will verify any requests before acting on the request and respond to all requests We receive from individuals wishing to exercise their data protection rights within a reasonable timeframe in accordance with applicable laws.",
  ];

  const cookiesPolicy = [
    "Essential Cookies: We set essential cookies that enable core functionality such as security, network management, and accessibility. You may not opt-out of thesecookies. However, You may disable these by changing Your browser or device settings, but this may affect how the website or myTVS app functions.",
    "Analytics, Customisation and Advertising Cookies: We also set cookies to collect information that is used either in aggregate form to help Us understand how Our website or myTVS app are being used or how effective marketing campaigns are, to help customise the website or myTVS app for You or to make advertising messages more relevant to You. We set these cookies to help Us improve Our website and myTVS app by collecting and reporting information on how You use it. The cookies collect information in a way that does not directly identify anyone. The list of cookies and opt-out mechanism will, as required by applicable law, be displayed when You visit Our website.",
  ];
  return (
    <>
      <div className="agreement-header">
        <div>
          <BreadCrumb
            className="policy-breadcrumb"
            model={items}
            separatorIcon={
              <img
                className="img-fluid"
                src={DropdownIcon}
                alt="Separator Icon"
              />
            }
          />
        </div>
        <div className="agreement-title">Privacy Policy</div>
      </div>

      <div className="policy-page-body">
        <div className="privacy-policy-main-content">
          <div className="agreement-title">Privacy Policy</div>

          <div className="term-content">
            This Privacy Policy (“Privacy Policy”) describes how Ki Mobility
            Solutions Private Limited (“the Company” or “We” or Us”) collects,
            uses, discloses and protects Personal Information of individuals
            that the Company collects in connection with the Company’s services,
            this website or myTVS mobile app.
          </div>
          <div className="privacy-policy-title">
            I. Introduction and scope :
          </div>
          <div className="term-content">
            Any person logging on to or using this website or myTVS mobile app
            ("User or You") is deemed to have read the terms and conditions
            mentioned herein and agreed to the collection and processing of
            their Personal Information as described herein. If You do not agree
            to the collection and processing of Your Personal Information, You
            are free to not provide the Personal Information sought by Us for
            collection and processing, in which case We shall have the option
            not to provide the services for which the said Personal Information
            was sought.
          </div>
          <div className="privacy-policy-title">
            II. Personal Information Collected by Us
          </div>
          <div className="term-content mb">What is Personal Information?</div>
          <div className="term-content">
            “Personal Information” means any information relating to a natural
            person which, either directly or indirectly, in combination with
            other information, is capable of identifying such person, which can
            include the following :
          </div>
          <div>
            <ul className="terms-list">
              <li className="term-content terms-list">
                Information about the individual’s personal identity inter alia
                as name, age, sex, etc.
              </li>
              <li className="term-content terms-list">
                His/her contact details such as address, postal code, telephone
                or mobile number and facsimile;
              </li>
              <li className="term-content terms-list">
                User ID information such as username, email address and other
                security-related information used by an individual in relation
                to access and use this website or myTVS mobile app and its
                content, user id of social networks, etc.
              </li>
            </ul>
          </div>
          <div className="term-content mb">
            Personal Information directly provided by the User :
          </div>
          <div>
            <ul className="terms-list">
              {personalInfo?.map((info, i) => (
                <li key={i} className="term-content terms-list">
                  {info}
                </li>
              ))}
            </ul>
          </div>
          <div className="term-content mb">
            Personal Information not provided directly by You:
          </div>
          <div>
            <ul className="terms-list">
              {personalInfoNotShared?.map((info, i) => (
                <li key={i} className="term-content terms-list">
                  {info}
                </li>
              ))}
            </ul>
          </div>
          <div className="privacy-policy-title">
            III. Purposes for Which Personal Information will be Collected and
            Used
          </div>
          <div className="term-content mb">
            We collect and use Your Personal Information to:
          </div>
          <div>
            <ul className="terms-list">
              {purposePersonalInfo?.map((info) => (
                <li className="term-content terms-list">{info}</li>
              ))}
            </ul>
          </div>
          <div className="privacy-policy-title">
            IV. Sharing of Personal Information
          </div>
          <div className="term-content mb">
            Like many businesses, Company uses a range of service providers to
            help us maximize the quality and efficiency of our services and our
            business operations. This means that individuals and organizations
            outside of Company, such as mail houses, will sometimes have access
            to Personal Information held by Company and may use it on behalf of
            Company. We require our service providers to adhere to strict data
            protection requirements.
          </div>
          <div className="term-content mb">
            We may share Your Personal Information with:
          </div>
          <div>
            <ul className="terms-list">
              {sharingInfo?.map((info) => (
                <li className="term-content terms-list">{info}</li>
              ))}
            </ul>
          </div>
          <div className="privacy-policy-title">
            V. Retention of Personal Information
          </div>
          <div className="term-content">
            We retain the Personal Information collected for as long as it is
            necessary to fulfill the purposes for which it is collected, or for
            as long as we are required to retain them in accordance with
            applicable law or regulation. In the absence of a need to retain
            Personal Information, We will either delete it or aggregate it, or,
            if this is not possible then We will securely store Your Personal
            Information and isolate it from any further use until deletion is
            possible.
          </div>
          <div className="privacy-policy-title">
            VI. Security of Information
          </div>
          <div className="term-content">
            We use We use appropriate and reasonable security measures to
            protect the Personal Information that We collect and Process. Such
            measures include SSL encryption; the industry standard security
            measures for transactions made over the internet. Further, data is
            secured in a secure data center environment and We use sophisticated
            detection and intrusion technologies to ensure that there are no
            network security breaches.
          </div>
          <div className="privacy-policy-title">VII. Your Rights</div>

          <div className="term-content mb">
            You are entitled to the following rights:
          </div>
          <div>
            <ul className="terms-list">
              {rights?.map((info) => (
                <li className="term-content terms-list">{info}</li>
              ))}
            </ul>
          </div>
          <div className="privacy-policy-title">VIII. Cookie Policy</div>
          <div className="term-content mb">
            New technologies are emerging on the Internet that help us deliver
            customized visitor experiences. We may use cookies and other
            tracking devices on this website & myTVS mobile apps. Using cookies
            on our sites provides benefits to You, such as allowing you to
            maintain account login information or contact information on forms
            between visits, or locating a nearby service center. The use of
            cookies also allows to measure site activity to provide a better
            user experience. Cookies and other tracking devices may be used to
            tell us the time and length of visit, the pages You look at on our
            site, the site You visited just before coming to ours, and the name
            of your internet service provider.
          </div>
          <div className="term-content mb">
            We may collect Personal Information automatically from You through
            cookies or similar technology. We primary deploy two types of
            cookies:
          </div>
          <div>
            <ul className="terms-list">
              {cookiesPolicy?.map((info) => (
                <li className="term-content terms-list">{info}</li>
              ))}
            </ul>
          </div>
          <div className="privacy-policy-title">
            IX. Geographic Scope of Site
          </div>
          <div className="term-content">
            Company controls and operates this web site from India. Unless
            otherwise specified on or by this web site, this web site is
            intended to promote only those services that are provided by myTVS
            in India and its territories, and myTVS makes no representation that
            materials in this web site or the products described thereby are
            appropriate or available for use in other locations. The Company
            stores data in India primarily but may transfer Your Personal
            Information outside India in compliance with applicable laws in
            India. All visitors to this web site are responsible for compliance
            with all Indian laws applicable to them with respect to the content
            and operation of this website or myTVS mobile app.
          </div>
          <div className="privacy-policy-title">
            X. Contacting Our Grievance Officer
          </div>
          <div className="term-content mb">
            If Company becomes aware of any ongoing concerns or problems
            concerning privacy practices, we will take these issues seriously
            and work to address these concerns. If You have any further queries
            relating to our Privacy Policy, or You have a problem or complaint,
            please e-mail Our Grievance Officer in the following manner:
          </div>

          <div className="term-content mb">
            Kind Attention:{" "}
            <span className="grievence-officer">
              Mr. Jim Marvyn (Grievance Officer)
            </span>
          </div>
          <div className="term-content">
            E-mail ID:{" "}
            <a href="mailto:customer.help@mytvs.in" className="helpmail">
              customer.help@mytvs.in
            </a>
          </div>
          <div className="privacy-policy-title">
            XI. Background Location Tracking Disclosure
          </div>
          <div className="term-content mb">What We Do</div>
          <div className="term-content">
            Our application uses background location services to provide you
            with real-time updates on your vehicle's location, even when the app
            is not actively in use or closed. This enables you to track your
            vehicle's transit and ensures accurate location information.
          </div>
          <div className="term-content mb">Why We Need This</div>
          <div className="term-content  mb">
            Continuous Vehicle Tracking: Background location tracking allows us
            to provide you with up-to-date information about your vehicle's
            location, ensuring you stay connected even when not actively using
            the app.
          </div>
          <div className="term-content mb">Your Privacy Matters</div>
          <div className="term-content">
            <ul className="terms-list">
              <li className="term-content terms-list">
                Control Your Data: Your location data is used solely for
                tracking your vehicle's transit and is never shared with third
                parties for marketing or any other purposes.
              </li>
              <li className="term-content terms-list">
                Privacy Settings: You have full control over location services
                through your device's settings. You can turn off background
                location tracking at any time.
              </li>
            </ul>
          </div>
          <div className="term-content mb">Security Measures</div>
          <div className="term-content">
            Secure Handling: We handle your location data with the utmost care
            and employ robust security measures to protect it from unauthorized
            access.
          </div>

          <div className="privacy-policy-title">
            XII. How to Manage Background Location Services
          </div>
          <div className="term-content">
            To manage background location services for our app, please refer to
            your device's settings and explore the location permissions section.
          </div>
          <div className="privacy-policy-title">XIII. Future changes</div>
          <div className="term-content">
            These Privacy Policies may be reviewed and revised. Changes to the
            Privacy Policy will be made by posting an updated version of the
            policy on this website and/or myTVS mobile app, and You shall be
            notified only if there are material changes to this Privacy Policy.
            We request our visitors/members to consider the updated policy
            displayed on this web site and/or myTVS mobile app only.
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
