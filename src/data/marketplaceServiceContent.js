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
      title: `${name} Account Management Services in India | EcomXtra`,
      description: `EcomXtra supports Indian ${name} sellers with onboarding, listings, catalogue updates, seller claims, return workflows, and day-to-day account operations.`,
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

export function getServicePageDetails(service) {
  const defaults = marketplaceServiceDefaults.find(item => item.slug === service?.slug)?.details
  if (!defaults) {
    if (service?.details?.hero) return service.details
    return createDetails({
      name: service?.title || 'Marketplace',
      sellerPortal: 'your seller dashboard',
      emphasis: 'Account operations tailored to your seller account.',
    })
  }
  return {
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
