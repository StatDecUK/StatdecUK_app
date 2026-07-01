Now build all the frontend files in parallel:
Action: file_editor create /app/frontend/src/lib/legalDatabase.js --file-text "// UK Statutory Declaration legal database — 19 declaration types
// Migrated from the original Generator v9 HTML
export const declarationTypes = [
  {
    group: \"Core 10 Common Types\",
    items: [
      { id: \"1\", label: \"Type 1: Declaration of Solvency\" },
      { id: \"2\", label: \"Type 2: Landlord and Tenant Act 1954\" },
      { id: \"3\", label: \"Type 3: Change of Name\" },
      { id: \"4\", label: \"Type 4: Lost or Missing Documents\" },
      { id: \"5\", label: \"Type 5: Single Status / Freedom to Marry\" },
      { id: \"6\", label: \"Type 6: Identity or Marital Status\" },
      { id: \"7\", label: \"Type 7: Adverse Possession (Squatter's Rights)\" },
      { id: \"8\", label: \"Type 8: Right of Way Property Access\" },
      { id: \"9\", label: \"Type 9: Financial Affidavits and Support\" },
      { id: \"10\", label: \"Type 10: Confirmation of Cohabitation or Dependency\" },
    ],
  },
  {
    group: \"Additional Regulatory & Custom Types\",
    items: [
      { id: \"11\", label: \"Type 11: Tenancy Deposit Scheme (TDS) Claim\" },
      { id: \"12\", label: \"Type 12: Gifted Deposit / Source of Funds\" },
      { id: \"13\", label: \"Type 13: Transfer at Undervalue / Insolvency Protection\" },
      { id: \"14\", label: \"Type 14: Small Estates Probate Asset Release\" },
      { id: \"15\", label: \"Type 15: Gender Recognition Certificate (GRC)\" },
      { id: \"16\", label: \"Type 16: Patent / Intellectual Property Originality\" },
      { id: \"17\", label: \"Type 17: Import, Export, and Customs Declaration\" },
      { id: \"18\", label: \"Type 18: Professional Admission & Fitness to Practise\" },
    ],
  },
  {
    group: \"HMCTS Court Form Wording\",
    items: [
      { id: \"19\", label: \"Court Form: Traffic Enforcement Centre (PE2/PE3 Bundle)\" },
    ],
  },
];

export const legalDatabase = {
  \"1\": {
    apostille: \"International Apostille Required: No (Submitted to UK Companies House).\",
    exhibits: { A: \"A true statement of the company's assets and liabilities as of this date, produced in the prescribed Form LIQ02.\" },
    wording: \"I am a Director of [Company Name Ltd], Company Number [Insert Number]. I have made a full inquiry into the affairs of this company, and having done so, I have formed the opinion that this company will be able to pay its debts in full, together with interest at the official rate, within a period of 12 months from the commencement of the winding up. I append a true statement of the company's assets and liabilities as of this date, produced in the prescribed Form LIQ02, which is now produced and shown to me marked Exhibit 'A'.\",
  },
  \"2\": {
    apostille: \"International Apostille Required: No (Domestic commercial lease operations).\",
    exhibits: {
      A: \"A true copy of the formal Warning Notice served upon the Declarant by the Landlord.\",
      B: \"A true copy of the proposed structural lease agreement for the commercial premises.\",
    },
    wording: \"The Landlord, [Landlord Name], intends to grant me a tenancy of premises at [Property Address] for a term commencing on [Date]. I propose to enter into an agreement with the Landlord that the provisions of sections 24 to 28 of the Landlord and Tenant Act 1954 shall be excluded in relation to this tenancy. I confirm that the Landlord served on me a formal Warning Notice before I became contractually bound to enter into the tenancy. A copy of the formal Warning Notice is now produced and shown to me marked Exhibit 'A', and a copy of the proposed structural lease agreement is now produced and shown to me marked Exhibit 'B'.\",
  },
  \"3\": {
    apostille: \"International Apostille Required: Only if updating foreign registries / dual citizenship passports.\",
    exhibits: { A: \"A certified copy of the Declarant's existing official photographic identification records.\" },
    wording: \"For and on behalf of myself, I absolutely renounce and abandon the use of my former name [Old Full Name] and assume the new name [New Full Name]. I declare that I will at all times hereafter in all records, deeds, and dealings use and sign the name [New Full Name] exclusively. I expressly authorise all persons at all times to designate and address me by such assumed name, as supported by a copy of my existing official photographic identification now produced and shown to me marked Exhibit 'A'.\",
  },
  \"4\": {
    apostille: \"International Apostille Required: No (Submitted to domestic UK financial institutions).\",
    exhibits: {
      A: \"True copies of historical institutional correspondence proving ownership of the lost asset.\",
      B: \"True copies of the historical account statement records proving ownership of the lost asset.\",
    },
    wording: \"I am the legal owner of [Name of Document, e.g., Share Certificate No. 123 for X PLC]. The said document has been lost, mislaid, or accidentally destroyed, and to the best of my knowledge and belief, it is not in the possession of any other person. I have made exhaustive searches for the document but have been unable to locate it. In support of my ownership, copies of relevant institutional correspondence are now produced and shown to me marked Exhibit 'A', and copies of my historical account statement records are now produced and shown to me marked Exhibit 'B'.\",
  },
  \"5\": {
    apostille: \"International Apostille Required: Yes (Always, as it is strictly used by foreign embassies/authorities abroad).\",
    exhibits: { A: \"A certified copy of the Declarant's official Decree Absolute or relevant Death Certificate.\" },
    wording: \"I am a British Citizen holding Passport Number [Insert Number] and am currently residing at this address. I am legally free to enter into a marriage contract with [Fiancé's Full Name] under the laws of the United Kingdom, and there is no legal impediment to our union. I was previously married but that marriage was legally dissolved, a certified copy of my Decree Absolute is now produced and shown to me marked Exhibit 'A'.\",
  },
  \"6\": {
    apostille: \"International Apostille Required: Only if required by foreign authorities or universities.\",
    exhibits: {
      A: \"A certified copy of the Declarant's official Birth Certificate or Marriage Certificate.\",
      B: \"A certified copy of the conflicting educational record or qualification certificate.\",
    },
    wording: \"I am the same person named as [Name A] on my Birth Certificate and [Name B] on my Educational Diploma. I confirm that both names refer to one and the same person, namely myself, and I append a certified copy of my birth certificate marked Exhibit 'A' and a certified copy of my conflicting educational record marked Exhibit 'B'.\",
  },
  \"7\": {
    apostille: \"International Apostille Required: No (Submitted strictly to HM Land Registry).\",
    exhibits: {
      A: \"A copy of the Ordnance Survey Map highlighting the claimed parcel of land in red.\",
      B: \"Contemporary color photographs documenting the physical, established boundaries of the claimed land.\",
    },
    wording: \"Since [Year], I have been in undisputed, continuous, and exclusive open possession of the plot of land occupied without the consent, licence, or interruption of any third party. I have enclosed the land with fencing, maintained it, and used it exclusively for [e.g., parking] without paying rent to anyone. In support of this application, an Ordnance Survey Map highlighting the claimed land in red is now produced and shown to me marked Exhibit 'A', and contemporary color photographs documenting the physical, established boundaries are now produced and shown to me marked Exhibit 'B'.\",
  },
  \"8\": {
    apostille: \"International Apostille Required: No (Submitted strictly to HM Land Registry / UK Courts).\",
    exhibits: { A: \"An official property boundary map explicitly highlighting the access route utilized.\" },
    wording: \"I have resided at my property since [Year] and have continuously used the access path leading over [Neighbouring Property Land] to gain entry to my property by vehicle and on foot. This access has been exercised openly, continuously, without force, without secrecy, and without permission for a period exceeding 20 years. I append an official property boundary map explicitly highlighting the access route utilized, which is now produced and shown to me marked Exhibit 'A'.\",
  },
  \"9\": {
    apostille: \"International Apostille Required: Yes, occasionally (Depending on foreign immigration body criteria).\",
    exhibits: {
      A: \"True copies of the Declarant's recent financial bank statements.\",
      B: \"A copy of the Declarant's current, fully executed employment contract.\",
      C: \"True copies of the Declarant's recent P60 tax summaries confirming earnings.\",
    },
    wording: \"I make this declaration to support the visa application of [Applicant Name], who is my [Relationship]. I declare that I have sufficient funds and resources to provide full financial support and accommodation for the applicant during their stay in the UK. In proof of my financial status, copies of my recent bank statements are now produced and shown to me marked Exhibit 'A', a copy of my current employment contract is marked Exhibit 'B', and copies of my recent P60 tax summaries are marked Exhibit 'C'.\",
  },
  \"10\": {
    apostille: \"International Apostille Required: No (Submitted to UK probate firms or pension funds).\",
    exhibits: {
      A: \"True copies of joint utility bills establishing shared address history.\",
      B: \"A true copy of our joint tenancy agreement for the shared residential home.\",
      C: \"Certified copies of our joint bank records spanning the cohabitation period.\",
    },
    wording: \"I am the surviving partner of the deceased, [Deceased Name], who passed away on [Date]. We lived together continuously as life partners in a common household at my address from [Start Date] until their death, and I was financially dependent on them. In proof of our joint residence and shared financial life, copies of our joint utility bills are now produced and shown to me marked Exhibit 'A', a copy of our joint tenancy agreement is marked Exhibit 'B', and copies of our joint bank records are marked Exhibit 'C'.\",
  },
  \"11\": {
    apostille: \"International Apostille Required: No (Submitted to UK Tenancy Deposit Protection Schemes).\",
    exhibits: {
      A: \"True copies of formal rental arrears logs and financial ledger balance maps.\",
      B: \"A true copy of the formal independent check-out inventory report.\",
      C: \"True copies of recorded delivery postal tracking receipts sent to the tenant.\",
    },
    wording: \"I am the Landlord of the property at [Address], let under an Assured Shorthold Tenancy to [Tenant Name] which expired on [Date]. The tenant vacated the property owing funds and remains entirely uncontactable despite my reasonable attempts to establish communication. I make this declaration to claim the deposit from the TDS repository; I append my formal rent arrears logs marked Exhibit 'A', a copy of the check-out inventory report marked Exhibit 'B', and copies of my recorded postal tracking receipts marked Exhibit 'C'.\",
  },
  \"12\": {
    apostille: \"International Apostille Required: No (Submitted to UK mortgage lenders and conveyancing solicitors).\",
    exhibits: { A: \"A certified bank statement proving the legitimate origin and bulk source of the gift.\" },
    wording: \"I am making a financial gift of [£Amount] to my [Relationship], [Name], to assist with the purchase of [Property Address], and I hold no future equity or right of residency in the property. I confirm that this payment is an unconditional, non-repayable gift. In compliance with anti-money laundering regulations, my certified bank statement proving the legitimate origin and bulk source of these funds is now produced and shown to me marked Exhibit 'A'.\",
  },
  \"13\": {
    apostille: \"International Apostille Required: No (Used by domestic mortgage lenders or insolvency pools).\",
    exhibits: {
      A: \"A true copy of the independent professional property valuation report.\",
      B: \"An up-to-date bankruptcy search certificate confirming the transferor's financial solvency.\",
    },
    wording: \"I am transferring the property at [Address] to [Recipient Name] for the sum of [£Amount], which is below the open market value, and this is not being executed to defraud creditors. I declare that my total remaining assets exceed my total liabilities, and I am fully solvent at the date of this transfer. In support of this statement, an independent property valuation report is now produced and shown to me marked Exhibit 'A', and an up-to-date bankruptcy search certificate is now produced and shown to me marked Exhibit 'B'.\",
  },
  \"14\": {
    apostille: \"International Apostille Required: No (Submitted to domestic UK financial asset holders).\",
    exhibits: { A: \"An official copy of the Death Certificate issued by the Registrar of Births, Deaths and Marriages.\" },
    wording: \"I am the legal next of kin of the late [Deceased Name], who died intestate on [Date]. The total value of the deceased's estate does not exceed small estate limits, no formal Grant of Representation is being sought, and I request the release of closing bank funds. I append an official copy of the Death Certificate issued by the Registrar, which is now produced and shown to me marked Exhibit 'A'.\",
  },
  \"15\": {
    apostille: \"International Apostille Required: No (Submitted to the UK Gender Recognition Panel).\",
    exhibits: {
      A: \"Official diagnostic medical reports issued by an authorized gender dysphoria specialist.\",
      B: \"Extensive documentary evidence proving the Declarant has lived in their acquired gender for a minimum of two years.\",
    },
    wording: \"I am applying for a Gender Recognition Certificate under the Gender Recognition Act 2004. I formally declare that I have lived in my acquired gender as a [Male/Female] since [Date] and intend to continue doing so until death. In support of my application, my official medical diagnostic reports are now produced and shown to me marked Exhibit 'A', and extensive documentary evidence proving I have lived in my acquired gender for a minimum of two years is marked Exhibit 'B'.\",
  },
  \"16\": {
    apostille: \"International Apostille Required: Only if filing internationally via WIPO framework channels.\",
    exhibits: {
      A: \"Technical blueprints and functional engineering drawings proving independent creation.\",
      B: \"A true copy of the draft design manifest and proprietary research logs.\",
    },
    wording: \"I am the sole inventor and author of the design/technology titled [Title] submitted under UK IPO Application Number [Number]. I declare that this work is entirely original to me and does not infringe upon any pre-existing proprietary rights. The technical blueprints and functional engineering drawings proving independent creation are now produced and shown to me marked Exhibit 'A', and a copy of the draft design manifest is marked Exhibit 'B'.\",
  },
  \"17\": {
    apostille: \"International Apostille Required: Yes, frequently (Depending strictly on target country maritime customs laws).\",
    exhibits: {
      A: \"The official commercial shipping invoice detailing cargo transaction values.\",
      B: \"True copies of the structural bills of lading verifying the transit itinerary.\",
      C: \"Itemised packaging lists validating the complete physical contents of the shipment.\",
    },
    wording: \"I am the shipping agent for [Company Name] regarding consignment reference [Number]. I solemnly declare that the goods contained in the shipment match the customs manifesto descriptions, originate wholly from [Country], and have a true commercial value of [Amount]. The official commercial shipping invoice is now produced and shown to me marked Exhibit 'A', copies of the bills of lading are marked Exhibit 'B', and the itemised packaging lists validating this shipment are marked Exhibit 'C'.\",
  },
  \"18\": {
    apostille: \"International Apostille Required: Only if registering with a foreign professional medical/legal board.\",
    exhibits: { A: \"An official up-to-date criminal record check certificate issued via the DBS or ACRO framework.\" },
    wording: \"I am applying for admission to the professional register of the [Regulatory Body] and confirm that I have no criminal background or pending disciplinary investigations. I confirm that all representations made within my application pack are entirely true and honest. My official criminal record check certificate, consisting of an up-to-date Disclosure and Barring Service (DBS) or ACRO report, is now produced and shown to me marked Exhibit 'A'.\",
  },
  \"19\": {
    apostille: \"International Apostille Required: No (Strictly handled by the UK Traffic Enforcement Centre).\",
    isCourtForm: true,
    exhibits: {
      A: \"A copy of the signed tenancy agreement or completion statement for the new property.\",
      B: \"My updated DVLA V5C Vehicle Registration Logbook showing the official address change date.\",
      C: \"A copy of my Royal Mail redirection confirmation order spanning the transition period.\",
      D: \"Contemporary utility bills confirming the exact dates of residence transition.\",
    },
    wording: \"My reasons for filing outside the given time limits are as follows: I did not receive the initial statutory notifications or penalty charge notices because I changed residential addresses. I only became aware of the matter when enforcement action was initiated. In strict verification of my out-of-time status and historical address change, I attach key evidence. This documentary proof consists of my official tenancy agreement for my new property marked Exhibit 'A', my updated DVLA V5C Vehicle Registration Logbook marked Exhibit 'B', a copy of my Royal Mail redirection confirmation order marked Exhibit 'C', and contemporary utility bills covering the transition period marked Exhibit 'D'.\",
  },
};

export function getTypeLabel(id) {
  for (const g of declarationTypes) {
    const found = g.items.find((i) => i.id === id);
    if (found) return found.label;
  }
  return `Type ${id}`;
}

export function buildDeclarationText({ name, address, occupation, body, templateId }) {
  const safeName = name || \"[NAME]\";
  const safeAddress = address || \"[ADDRESS]\";
  const safeOcc = occupation || \"[OCCUPATION]\";
  if (templateId === \"19\") {
    return `IN THE COUNTY COURT AT THE TRAFFIC ENFORCEMENT CENTRE (TEC)
APPLICATION TO FILE A STATUTORY DECLARATION OUT OF TIME (FORM PE2 / PE3)

Declarant Applicant: ${safeName}
Residential Address: ${safeAddress}
Employment Reference: ${safeOcc}

REASONS FOR FILING OUT OF TIME STATUTORY PARAGRAPHS:
${body}

WARNING: Filing a false declaration knowingly and wilfully is a criminal offence under Section 5 of the Perjury Act 1911.

Declared and Signed by the applicant: ........................................... Dated: ............................

Before me,
Signature of Solicitor / Authorized Court Officer: ............................................................
Name of Witnessing Professional: ................................................................`;
  }
  return `STATUTORY DECLARATION
(Under the Statutory Declarations Act 1835)

I, ${safeName}, of ${safeAddress}, occupying the position of ${safeOcc}, do solemnly and sincerely declare as follows:

${body}

AND I make this solemn declaration conscientiously believing the same to be true and by virtue of the provisions of the Statutory Declarations Act 1835.

Declared at: ........................................................................
This ............. day of .................................... 20...

Signature of Declarant: ............................................................

Before me,
Signature of Solicitor / Commissioner for Oaths: ............................................................
Name of Solicitor (Printed): ................................................................
Name of Firm / Court Seal: ..................................................................`;
}

export function buildExhibitText({ letter, name, pages, description }) {
  const safeName = (name || \"[NAME]\").toUpperCase();
  const safePages = pages || 1;
  return `EXHIBIT \"${letter}\"


This is the Exhibit marked \"${letter}\" referred to in the Statutory Declaration of
${safeName}.

The attached documentation is a multi-page file securely compiled and consisting of exactly ${safePages} page(s) in total.

Description of Exhibit Contents:
${description}


Declared before me this ............. day of .................................... 20...


At Office Address: ...................................................................................
                   ...................................................................................



.......................................................................................
Signature of Authorised Solicitor / Commissioner for Oaths`;
}
"
Observation: Create successful: /app/frontend/src/lib/legalDatabase.js
