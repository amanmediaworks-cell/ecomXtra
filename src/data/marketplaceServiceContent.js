const sharedServiceItems = [
  {
    title: 'Product listing management',
    description: 'Create and maintain product titles, descriptions, attributes, images, and catalogue information based on the platform’s current requirements.',
  },
  {
    title: 'Catalogue issue support',
    description: 'Review listing errors, suppressed or incomplete products, and catalogue mismatches, then coordinate the next steps through the available seller channels.',
  },
  {
    title: 'Seller claims and cases',
    description: 'Organize supporting information, raise eligible seller-support cases, and track replies and follow-up actions.',
  },
  {
    title: 'Returns and refund workflows',
    description: 'Help monitor return and refund requests, record their status, and surface cases that need the seller’s decision or platform support.',
  },
  {
    title: 'Account health monitoring',
    description: 'Review visible account notifications and operational indicators so the seller can prioritize issues and respond through the correct platform process.',
  },
  {
    title: 'Inventory and order coordination',
    description: 'Support agreed inventory and order checks, flag discrepancies, and coordinate routine operational follow-up with your team.',
  },
  {
    title: 'Performance reporting',
    description: 'Summarize agreed account activities, open issues, and performance signals to help your team decide what to address next.',
  },
  {
    title: 'Policy-aware account support',
    description: 'Keep operational work aligned with the platform’s current seller policies. Final approvals and account decisions remain with the marketplace.',
  },
]

const platforms = [
  {
    slug: 'amazon-account-management',
    name: 'Amazon',
    sellerPortal: 'Seller Central',
    description: 'Hands-on Amazon marketplace account support for Indian sellers, from product catalogue work to seller cases and routine account operations.',
    emphasis: 'Seller Central catalogue, account health, claims, returns, and operational follow-up.',
  },
  {
    slug: 'flipkart-account-management',
    name: 'Flipkart',
    sellerPortal: 'Flipkart Seller Hub',
    description: 'Practical Flipkart account-management support for sellers who need consistent listing, catalogue, claim, return, and day-to-day operational assistance.',
    emphasis: 'Seller Hub listings, catalogue corrections, account notifications, and case tracking.',
  },
  {
    slug: 'meesho-account-management',
    name: 'Meesho',
    sellerPortal: 'Meesho Supplier Panel',
    description: 'Meesho seller account support that helps organize catalogue updates, operational requests, returns, and recurring supplier-panel tasks.',
    emphasis: 'Supplier-panel catalogue work, operational requests, returns, and account follow-up.',
  },
  {
    slug: 'blinkit-account-management',
    name: 'Blinkit',
    sellerPortal: 'Blinkit partner operations',
    description: 'Support for brands and eligible partners coordinating product information and ongoing operational tasks related to Blinkit.',
    emphasis: 'Product information, partner coordination, operational visibility, and issue follow-up.',
  },
  {
    slug: 'jiomart-account-management',
    name: 'JioMart',
    sellerPortal: 'JioMart seller operations',
    description: 'JioMart marketplace account assistance for sellers who need help maintaining product information and coordinating routine account operations.',
    emphasis: 'Product catalogue upkeep, seller requests, account notifications, and operational coordination.',
  },
  {
    slug: 'swiggy-instamart-account-management',
    name: 'Swiggy Instamart',
    sellerPortal: 'Instamart partner operations',
    description: 'Operational account support for brands and eligible partners managing product information and recurring coordination for Swiggy Instamart.',
    emphasis: 'Product information, partner coordination, operational requests, and issue tracking.',
  },
  {
    slug: 'zepto-account-management',
    name: 'Zepto',
    sellerPortal: 'Zepto partner operations',
    description: 'Zepto account-management support for brands and eligible partners who need help coordinating product information and ongoing operational work.',
    emphasis: 'Product information, partner coordination, operational visibility, and issue follow-up.',
  },
  {
    slug: 'myntra-account-management',
    name: 'Myntra',
    sellerPortal: 'Myntra partner operations',
    description: 'Myntra account-management support for fashion and lifestyle sellers coordinating product catalogue updates and routine marketplace operations.',
    emphasis: 'Fashion catalogue upkeep, product information, partner requests, and operational follow-up.',
  },
  {
    slug: 'ajio-account-management',
    name: 'AJIO',
    sellerPortal: 'AJIO partner operations',
    description: 'AJIO account-management support for fashion and lifestyle sellers coordinating product information, catalogue updates, and recurring operational tasks.',
    emphasis: 'Product catalogue upkeep, partner coordination, account requests, and issue tracking.',
  },
  {
    slug: 'nykaa-account-management',
    name: 'Nykaa',
    sellerPortal: 'Nykaa partner operations',
    description: 'Nykaa account-management support for beauty and lifestyle sellers coordinating product information, catalogue updates, and ongoing operational work.',
    emphasis: 'Product information, catalogue maintenance, partner requests, and operational follow-up.',
  },
]

function createDetails(platform) {
  const { name, sellerPortal, emphasis } = platform
  return {
    hero: {
      eyebrow: `Marketplace Onboarding & Account Management | India`,
      title: `${name} Account Management & Onboarding Services`,
      description: `Launch and manage your ${name} seller operations with practical support from EcomXtra. We help coordinate onboarding preparation, product listings, catalogue updates, seller requests, returns, and ongoing account follow-up while your business retains control of its seller account.`,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
      imageAlt: `${name} marketplace account operations and performance review`,
    },
    overview: {
      title: `A dedicated onboarding and operations partner for your ${name} account`,
      paragraphs: [
        `Starting on ${name} and managing it over time both require consistent operational attention. EcomXtra can help prepare onboarding information and coordinate setup tasks, then support ongoing product information, account notifications, customer-related requests, and operational follow-up, with a focus on ${emphasis.toLowerCase()}`,
        `Our team can support agreed tasks through ${sellerPortal} or the partner channels available to your business. The exact tools and eligibility vary by account and platform, so we confirm the scope with you before work begins. Marketplace approvals, policy decisions, and final account control remain with you and the platform.`,
      ],
    },
    included: {
      title: `What our ${name} account management can cover`,
      intro: `The support plan is tailored to your account and the work you want to delegate. Typical areas include:`,
      items: sharedServiceItems.map(item => ({ ...item })),
    },
    feature: {
      title: `${name} product listing and catalogue support`,
      body: `Accurate, complete product information gives customers a clearer view of what you sell and helps your team maintain a consistent catalogue. EcomXtra can help prepare or update listing content, review available attributes, coordinate image changes, and investigate catalogue issues within the access and tools available to your account.`,
      bullets: [
        'Review titles, descriptions, attributes, and product details for completeness.',
        'Coordinate approved image and content updates with your team.',
        'Track listing errors or catalogue issues and organize follow-up.',
        'Check platform guidance before acting on category-specific requirements.',
      ],
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80',
      imageAlt: `Product catalogue and ecommerce operations for ${name} sellers`,
    },
    benefits: {
      title: `Why sellers work with an account-management partner`,
      intro: `Delegate recurring operational work while keeping decisions and account ownership in your hands.`,
      items: [
        { title: 'More time for your business', description: 'Move agreed routine account tasks off your internal team’s daily list.' },
        { title: 'Consistent follow-through', description: 'Keep listing updates, seller requests, and open issues organized with clear ownership.' },
        { title: 'Better issue visibility', description: 'Review outstanding tasks and platform replies without losing track of next steps.' },
        { title: 'Support matched to your needs', description: 'Choose the operational tasks that fit your catalogue, team, and current account requirements.' },
        { title: 'Seller stays in control', description: 'You retain account ownership and approve important business or policy decisions.' },
      ],
    },
    audience: {
      title: `Who can benefit from ${name} account support?`,
      intro: `A managed account service may suit businesses that sell on ${name} and need reliable help with recurring marketplace work.`,
      items: [
        { title: 'New marketplace sellers', description: `Businesses setting up their ${name} catalogue and learning the recurring seller operations involved.` },
        { title: 'Growing brands', description: 'Teams whose product range or order activity makes routine account follow-up harder to manage internally.' },
        { title: 'Established sellers', description: 'Businesses that want a consistent partner for catalogue maintenance and day-to-day account tasks.' },
        { title: 'Lean in-house teams', description: 'Small teams looking to delegate specific listing, request-tracking, or operational work.' },
        { title: 'Sellers resolving active issues', description: 'Businesses that need help organizing account notifications and preparing follow-up through available platform channels.' },
      ],
    },
    process: {
      title: `How ${name} onboarding and account management works`,
      intro: `Whether you are preparing to start selling or already operating, we agree on access, responsibilities, and communication before work begins.`,
      steps: [
        {
          title: 'Onboarding or account review',
          summary: 'Understand whether you are preparing to launch or need help with an existing seller account.',
          article: `We learn about your ${name} plans, products, current account status, and the support you need. For onboarding, we help organize the information and tasks you may need to prepare, subject to the platform's current eligibility and process. For existing accounts, we review catalogue work, recurring operations, and open issues.`,
        },
        {
          title: 'Scope and operating plan',
          summary: 'Document task ownership, approvals, access requirements, and how updates will be shared.',
          article: 'Before work begins, we agree which tasks EcomXtra may handle, which actions require your approval, how urgent issues are escalated, and how progress is reported. You remain the account owner and decision-maker.',
        },
        {
          title: 'Listing and catalogue operations',
          summary: 'Prepare agreed content updates and organize catalogue or listing follow-up.',
          article: 'Our team works on the approved product-information tasks, checks the fields available to your account, and records issues that need additional input. Any changes with commercial or policy implications are brought to you for approval.',
        },
        {
          title: 'Requests, returns, and issue tracking',
          summary: 'Monitor agreed seller requests and keep next steps visible to the right people.',
          article: 'We help organize eligible seller-support cases, return or refund requests, and related operational follow-up. Responses and outcomes depend on the marketplace, account eligibility, and the information available; we do not promise that the platform will approve a request.',
        },
        {
          title: 'Ongoing monitoring and communication',
          summary: 'Keep recurring tasks and important account updates moving through agreed channels.',
          article: 'We maintain visibility into the tasks included in your plan and share relevant updates with your team. When a matter requires a seller decision or platform action, we make that dependency clear rather than taking an unapproved step.',
        },
        {
          title: 'Reporting and review',
          summary: 'Review completed work, open items, and priorities for the next operating period.',
          article: 'At agreed intervals, we summarize work completed, pending platform responses, and any issues that need your attention. You can then adjust priorities or the service scope based on your business needs.',
        },
      ],
    },
    faq: {
      title: `Frequently asked questions about ${name} account management`,
      items: [
        {
          question: 'What does marketplace account management include?',
          answer: `The scope can include listing and catalogue updates, account notifications, eligible seller-support cases, return/refund workflow tracking, and routine operational reporting. We confirm which tasks apply to your ${name} account before starting.`,
        },
        {
          question: `Can EcomXtra guarantee that ${name} will approve a claim or restore a listing?`,
          answer: 'No. EcomXtra can help organize information and coordinate follow-up through available channels, but marketplace teams make their own decisions. Outcomes and timelines are not guaranteed.',
        },
        {
          question: 'Will I keep ownership and control of my seller account?',
          answer: 'Yes. Your business retains account ownership and remains responsible for credentials, approvals, and important business decisions. Access and permissions should follow the platform’s current security guidance.',
        },
        {
          question: 'Can you help with returns and refund requests?',
          answer: 'We can help monitor and organize eligible return/refund workflows included in the agreed scope. The available actions and final outcomes depend on platform rules, account access, and the specific case.',
        },
        {
          question: 'How do we get started?',
          answer: 'Contact EcomXtra with your marketplace, product range, and the tasks you want to delegate. We will discuss account access, scope, communication, and a suitable operating plan before any work begins.',
        },
      ],
    },
    seo: {
      title: `${name} Account Management Services | EcomXtra`,
      description: `EcomXtra supports Indian ${name} sellers with onboarding, listings, catalogue updates, seller claims, return workflows, and daily operations.`,
    },
  }
}

export const marketplaceServiceDefaults = platforms.map(platform => ({
  slug: platform.slug,
  title: `${platform.name} Account Management Services`,
  description: platform.description,
  category: 'Marketplace Account Management',
  details: createDetails(platform),
}))

export function mergeMarketplaceServiceRows(rows = []) {
  const rowsBySlug = new Map(rows.filter(row => row.slug).map(row => [row.slug, row]))
  const defaultSlugs = new Set(marketplaceServiceDefaults.map(service => service.slug))
  const marketplaceRows = marketplaceServiceDefaults.map(defaultService => {
    const savedService = rowsBySlug.get(defaultService.slug)
    return savedService
      ? { ...defaultService, ...savedService, details: savedService.details || defaultService.details }
      : defaultService
  })
  return [
    ...marketplaceRows,
    ...rows.filter(row => !defaultSlugs.has(row.slug)),
  ]
}

export function getServicePageDetails(service, serviceType = 'management') {
  const defaults = marketplaceServiceDefaults.find(item => item.slug === service?.slug)?.details
  let details
  if (!defaults) {
    details = service?.details?.hero
      ? service.details
      : createDetails({
        name: service?.title || 'Marketplace',
        sellerPortal: 'your seller dashboard',
        emphasis: 'Account operations tailored to your seller account.',
      })
  } else {
    details = {
      ...defaults,
      ...service.details,
      hero: { ...defaults.hero, ...service.details?.hero },
      overview: { ...defaults.overview, ...service.details?.overview },
      included: { ...defaults.included, ...service.details?.included },
      feature: { ...defaults.feature, ...service.details?.feature },
      benefits: { ...defaults.benefits, ...service.details?.benefits },
      audience: { ...defaults.audience, ...service.details?.audience },
      process: { ...defaults.process, ...service.details?.process },
      faq: { ...defaults.faq, ...service.details?.faq },
      seo: { ...defaults.seo, ...service.details?.seo },
    }
  }

  if (serviceType !== 'onboarding') return details

  const platformName = marketplaceServiceDefaults.find(item => item.slug === service.slug)?.title
    .replace(' Account Management Services', '')
    || service.title.replace(' Account Management Services', '').replace(/ Services$/, '')
  return {
    ...details,
    hero: {
      ...details.hero,
      eyebrow: `${platformName} Seller Onboarding Support`,
      title: `${platformName} Seller Onboarding Services`,
      description: `Prepare your ${platformName} marketplace launch with support for seller information, catalogue readiness, setup coordination, and launch planning. Platform eligibility and approval decisions remain with the marketplace.`,
    },
    overview: {
      title: `Get ready to start selling on ${platformName}`,
      paragraphs: [
        `Starting on ${platformName} involves preparing seller information, product data, and operational details for the platform's current process. EcomXtra helps organize these preparations and coordinate agreed setup tasks so your team has a clearer path to launch.`,
        `Requirements and available tools vary by platform and seller. We confirm the scope with you before work begins; marketplace eligibility, approvals, and final account control remain with you and the platform.`,
      ],
    },
    included: {
      title: `What ${platformName} onboarding support can cover`,
      intro: 'Onboarding support is tailored to your business and the platform’s current requirements. Typical preparation areas include:',
      items: [
        { title: 'Seller eligibility and requirement review' },
        { title: 'Seller profile information preparation' },
        { title: 'Product catalogue and listing readiness' },
        { title: 'Document checklist coordination' },
        { title: 'Category and product data checks' },
        { title: 'Fulfilment and operational readiness' },
        { title: 'Launch task and timeline coordination' },
        { title: 'Early issue tracking and handover' },
      ],
    },
    feature: {
      ...details.feature,
      title: `${platformName} seller launch preparation`,
      body: `We help your team organize product information, onboarding tasks, and operational details needed for a considered ${platformName} launch. The exact checklist depends on the platform and your seller profile.`,
      bullets: [
        'Build a practical checklist around the platform’s current requirements.',
        'Prepare product information and catalogue details for review.',
        'Coordinate agreed setup tasks and identify missing inputs.',
        'Keep approval decisions and account access under your control.',
      ],
    },
    benefits: {
      ...details.benefits,
      title: `A clearer path to launching on ${platformName}`,
      intro: 'Get organized support for launch preparation while your business retains ownership and makes the final decisions.',
      items: [
        { title: 'Know what to prepare', description: 'Organize seller, product, and operational inputs into clear next steps.' },
        { title: 'Reduce avoidable gaps', description: 'Review information and catalogue readiness before submitting setup tasks.' },
        { title: 'Keep launch tasks moving', description: 'Coordinate responsibilities and follow-ups with your team.' },
        { title: 'Stay in control', description: 'Your business retains account access and approves important actions.' },
        { title: 'Plan the handover', description: 'Clarify the operational tasks to manage once the account is ready.' },
      ],
    },
    audience: {
      ...details.audience,
      title: `Who can benefit from ${platformName} onboarding support?`,
      intro: `Businesses preparing to launch on ${platformName} can get help organizing requirements, product information, and setup tasks.`,
    },
    process: {
      ...details.process,
      title: `How ${platformName} seller onboarding works`,
      intro: 'We agree on the preparation scope, required inputs, responsibilities, and next steps before coordinating launch tasks.',
      steps: [
        {
          title: 'Launch goals and eligibility review',
          summary: 'Understand your products, seller profile, and intended marketplace launch.',
          article: `We discuss your ${platformName} plans and review the information available about your seller profile and products. Platform eligibility and requirements can vary, and only the marketplace can confirm approval.`,
        },
        {
          title: 'Seller information and checklist',
          summary: 'Organize the information and documents your team may need to prepare.',
          article: 'We help map the platform’s current preparation requirements to the information you provide, identify missing inputs, and coordinate your team’s next steps. You remain responsible for verifying and approving submitted information.',
        },
        {
          title: 'Catalogue and operational readiness',
          summary: 'Prepare agreed product details and consider the operational work needed for launch.',
          article: 'We help organize product data and catalogue tasks and discuss agreed operational readiness items. Platform tools and requirements differ by seller and category, so we confirm applicable tasks with you.',
        },
        {
          title: 'Setup coordination and handover',
          summary: 'Track agreed setup tasks and clarify what happens after the platform review.',
          article: 'We coordinate the agreed follow-ups, make dependencies visible, and help prepare an operational handover. Review timelines and outcomes are determined by the platform and are not guaranteed.',
        },
      ],
    },
    faq: {
      title: `${platformName} seller onboarding FAQs`,
      items: [
        {
          question: `What does ${platformName} seller onboarding support include?`,
          answer: 'Support can include organizing seller information, preparing catalogue details, coordinating agreed setup tasks, and tracking launch preparation. The exact scope depends on your seller profile and the platform’s current requirements.',
        },
        {
          question: `Can EcomXtra guarantee approval to sell on ${platformName}?`,
          answer: 'No. The marketplace determines eligibility, reviews applications, and makes approval decisions. EcomXtra can help organize preparation and follow-up, but outcomes and timelines are not guaranteed.',
        },
        {
          question: 'Who controls the seller account and submitted information?',
          answer: 'Your business retains account ownership and control, reviews information for accuracy, and approves submissions and important actions. Account access should follow the platform’s current security guidance.',
        },
        {
          question: 'Can you help prepare product listings before launch?',
          answer: 'Yes. We can help organize agreed product information and catalogue tasks for review, subject to the fields and tools available for your seller profile and product category.',
        },
        {
          question: 'How do we get started?',
          answer: `Contact EcomXtra with your ${platformName} launch plans, product range, and current preparation status. We will discuss required inputs, responsibilities, and a suitable onboarding support scope.`,
        },
      ],
    },
    seo: {
      ...details.seo,
      title: `${platformName} Seller Onboarding Services | EcomXtra`,
      description: `Prepare your ${platformName} seller launch with onboarding support for seller information, catalogue readiness, setup coordination, and launch planning.`,
    },
  }
}
