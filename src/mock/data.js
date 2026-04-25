// Rich mock dataset for Zara'a (زرعة) across KSA + GCC.
// This is a frontend-only demo; treat this as seeded "DB" state.

const now = Date.now();
const daysAgo = (d) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

export const seed = {
  categories: [
    { id: "cat_grass", name: "تركيب عشب", slug: "grass_installation", status: "active" },
    { id: "cat_tree", name: "زراعة أشجار", slug: "tree_planting", status: "active" },
    { id: "cat_indoor", name: "نباتات داخلية", slug: "indoor_plants", status: "active" },
    { id: "cat_land", name: "تصميم تنسيق حدائق", slug: "landscaping_design", status: "active" },
    { id: "cat_irrig", name: "شبكات ري (تركيب/إصلاح)", slug: "irrigation", status: "active" },
    { id: "cat_maint", name: "صيانة حدائق", slug: "garden_maintenance", status: "active" },
    { id: "cat_fence", name: "أسوار وحدود", slug: "fence_boundary", status: "active" },
    { id: "cat_soil", name: "تربة وتسميد", slug: "soil_fertilization", status: "active" },
    { id: "cat_pest", name: "مكافحة آفات نباتية", slug: "pest_control", status: "active" },
    { id: "cat_other", name: "أخرى", slug: "other", status: "active" }
  ],
  users: [
    { id: "u_admin_1", role: "admin", full_name: "Faisal Admin", city: "الرياض", status: "active", phone: "+966500000001", email: "admin@zaraa.sa", created_at: daysAgo(120) },

    { id: "u_c_1", role: "customer", full_name: "أحمد القحطاني", city: "الرياض", status: "active", phone: "+966500000010", email: "ahmed@example.com", created_at: daysAgo(60) },
    { id: "u_c_2", role: "customer", full_name: "نورة السبيعي", city: "جدة", status: "active", phone: "+966500000011", email: "noura@example.com", created_at: daysAgo(34) },
    { id: "u_c_3", role: "customer", full_name: "سارة العتيبي", city: "الدمام", status: "active", phone: "+966500000012", email: "sara@example.com", created_at: daysAgo(18) },
    { id: "u_c_4", role: "customer", full_name: "محمد العنزي", city: "الخبر", status: "suspended", phone: "+966500000013", email: "mohammad@example.com", created_at: daysAgo(200) },
    { id: "u_c_5", role: "customer", full_name: "Hamad Al-Mansouri", city: "دبي", status: "active", phone: "+971500000014", email: "hamad@example.ae", created_at: daysAgo(22) },
    { id: "u_c_6", role: "customer", full_name: "Fatima Al-Kuwaiti", city: "الكويت", status: "active", phone: "+965500000015", email: "fatima@example.kw", created_at: daysAgo(9) },

    { id: "u_p_1", role: "provider", full_name: "Green Horizon Owner", city: "الرياض", status: "active", phone: "+966500000020", email: "horizon@provider.sa", created_at: daysAgo(140) },
    { id: "u_p_2", role: "provider", full_name: "Riyadh Irrigation Lead", city: "الرياض", status: "active", phone: "+966500000021", email: "water@provider.sa", created_at: daysAgo(90) },
    { id: "u_p_3", role: "provider", full_name: "Jeddah Landscape PM", city: "جدة", status: "active", phone: "+966500000022", email: "jeddah@provider.sa", created_at: daysAgo(80) },
    { id: "u_p_4", role: "provider", full_name: "Bahrain Nursery Rep", city: "المنامة", status: "active", phone: "+973500000023", email: "bh@provider.bh", created_at: daysAgo(50) },
    { id: "u_p_5", role: "provider", full_name: "Kuwait Plant Studio", city: "الكويت", status: "pending", phone: "+965500000024", email: "kw@provider.kw", created_at: daysAgo(7) },
    { id: "u_p_6", role: "provider", full_name: "Doha Garden Pro", city: "الدوحة", status: "active", phone: "+974500000025", email: "qa@provider.qa", created_at: daysAgo(44) }
  ],
  provider_profiles: [
    {
      id: "pp_1",
      user_id: "u_p_1",
      business_name: "مشتل أفق أخضر",
      provider_type: "nursery",
      description: "توريد وزراعة أشجار وشجيرات وعشب طبيعي، مع ضمان نمو لمدة 30 يوم.",
      verification_status: "approved",
      verification_document_url: "https://example.com/docs/cr-pp1.pdf",
      average_rating: 4.7,
      total_jobs_completed: 128,
      categories: ["cat_tree", "cat_grass", "cat_indoor", "cat_soil"],
      coverage_areas: ["الرياض", "الخرج", "الدرعية"]
    },
    {
      id: "pp_2",
      user_id: "u_p_2",
      business_name: "سواعد الري",
      provider_type: "irrigation",
      description: "كشف تسريبات، صيانة مضخات، تركيب شبكات ري بالتنقيط والرش.",
      verification_status: "approved",
      verification_document_url: "https://example.com/docs/cr-pp2.pdf",
      average_rating: 4.4,
      total_jobs_completed: 74,
      categories: ["cat_irrig", "cat_maint"],
      coverage_areas: ["الرياض", "الثمامة", "الملز"]
    },
    {
      id: "pp_3",
      user_id: "u_p_3",
      business_name: "نسق جدة",
      provider_type: "landscaping",
      description: "تصميم وتنفيذ حدائق وواجهات، أعمال حجر وإضاءة خارجية.",
      verification_status: "approved",
      verification_document_url: "https://example.com/docs/cr-pp3.pdf",
      average_rating: 4.9,
      total_jobs_completed: 210,
      categories: ["cat_land", "cat_grass", "cat_fence"],
      coverage_areas: ["جدة", "مكة", "الطائف"]
    },
    {
      id: "pp_4",
      user_id: "u_p_4",
      business_name: "Bahrain Bloom Nursery",
      provider_type: "nursery",
      description: "Indoor plant styling + outdoor supply for villas.",
      verification_status: "approved",
      verification_document_url: "https://example.com/docs/cr-pp4.pdf",
      average_rating: 4.2,
      total_jobs_completed: 52,
      categories: ["cat_indoor", "cat_tree", "cat_pest"],
      coverage_areas: ["المنامة", "المحرق"]
    },
    {
      id: "pp_5",
      user_id: "u_p_5",
      business_name: "Kuwait Plant Studio",
      provider_type: "other",
      description: "Plants + setup. Pending verification for GCC launch.",
      verification_status: "pending",
      verification_document_url: "https://example.com/docs/id-pp5.jpg",
      average_rating: 0,
      total_jobs_completed: 0,
      categories: ["cat_indoor", "cat_other"],
      coverage_areas: ["الكويت"]
    },
    {
      id: "pp_6",
      user_id: "u_p_6",
      business_name: "Doha Garden Pro",
      provider_type: "independent",
      description: "Garden maintenance visits + seasonal fertilization programs.",
      verification_status: "approved",
      verification_document_url: "https://example.com/docs/cr-pp6.pdf",
      average_rating: 4.6,
      total_jobs_completed: 39,
      categories: ["cat_maint", "cat_soil", "cat_pest"],
      coverage_areas: ["الدوحة", "الريان"]
    }
  ],
  requests: [
    {
      id: "r_501",
      customer_id: "u_c_1",
      category_id: "cat_grass",
      title: "تركيب عشب طبيعي لحديقة خلفية",
      description: "مساحة تقريبية 80 متر. احتاج عشب طبيعي + تسوية بسيطة. مناسب خلال أسبوع.",
      location_text: "الرياض - الياسمين",
      lat: 24.835,
      lng: 46.642,
      area_size: "80 sqm",
      timing_flexibility: "flexible",
      preferred_date: null,
      status: "open",
      created_at: daysAgo(3),
      updated_at: daysAgo(1)
    },
    {
      id: "r_502",
      customer_id: "u_c_2",
      category_id: "cat_land",
      title: "تصميم جلسة خارجية مع تنسيق نباتات",
      description: "أبغى تصميم بسيط + اقتراح نباتات تتحمل الحر + إضاءة خفيفة.",
      location_text: "جدة - أبحر الشمالية",
      lat: 21.723,
      lng: 39.093,
      area_size: "45 sqm",
      timing_flexibility: "specific_date",
      preferred_date: "2026-05-02",
      status: "in_progress",
      created_at: daysAgo(10),
      updated_at: daysAgo(2)
    },
    {
      id: "r_503",
      customer_id: "u_c_3",
      category_id: "cat_irrig",
      title: "إصلاح تسريب في شبكة الري",
      description: "تسريب عند المضخة + ضغط ماء ضعيف. احتاج تشخيص سريع.",
      location_text: "الدمام - الفيصلية",
      lat: 26.419,
      lng: 50.088,
      area_size: null,
      timing_flexibility: "flexible",
      preferred_date: null,
      status: "completed",
      created_at: daysAgo(35),
      updated_at: daysAgo(25)
    },
    {
      id: "r_504",
      customer_id: "u_c_5",
      category_id: "cat_indoor",
      title: "تنسيق نباتات داخلية لصالون",
      description: "احتاج 6-8 نباتات داخلية + pots + ترتيب زاوية بجانب النافذة.",
      location_text: "دبي - جميرا",
      lat: 25.209,
      lng: 55.251,
      area_size: null,
      timing_flexibility: "specific_date",
      preferred_date: "2026-04-28",
      status: "open",
      created_at: daysAgo(1),
      updated_at: daysAgo(1)
    },
    {
      id: "r_505",
      customer_id: "u_c_6",
      category_id: "cat_pest",
      title: "مكافحة آفات (حشرات صغيرة على الورد)",
      description: "ألاحظ نقاط سوداء على الأوراق + ذبول بسيط. احتاج زيارة وتحديد العلاج.",
      location_text: "الكويت - السالمية",
      lat: 29.344,
      lng: 48.073,
      area_size: null,
      timing_flexibility: "flexible",
      preferred_date: null,
      status: "expired",
      created_at: daysAgo(20),
      updated_at: daysAgo(8)
    },
    {
      id: "r_506",
      customer_id: "u_c_1",
      category_id: "cat_soil",
      title: "برنامج تسميد موسمي للحديقة",
      description: "أبغى خطة تسميد 3 شهور + متابعة شهرية.",
      location_text: "الرياض - حطين",
      lat: 24.764,
      lng: 46.606,
      area_size: "120 sqm",
      timing_flexibility: "flexible",
      preferred_date: null,
      status: "cancelled",
      created_at: daysAgo(15),
      updated_at: daysAgo(14)
    }
  ],
  request_media: [
    { id: "rm_1", request_id: "r_501", file_url: "https://picsum.photos/seed/zaraa-grass/600/400", file_type: "image/jpeg", uploaded_at: daysAgo(3) },
    { id: "rm_2", request_id: "r_502", file_url: "https://picsum.photos/seed/zaraa-design/600/400", file_type: "image/jpeg", uploaded_at: daysAgo(10) },
    { id: "rm_3", request_id: "r_504", file_url: "https://picsum.photos/seed/zaraa-indoor/600/400", file_type: "image/jpeg", uploaded_at: daysAgo(1) }
  ],
  quotations: [
    {
      id: "q_801",
      request_id: "r_501",
      provider_id: "pp_1",
      quoted_price: 2800,
      estimated_duration: "2 أيام",
      message: "يشمل توريد العشب + تركيب + تسوية بسيطة. ضمان 14 يوم.",
      status: "submitted",
      created_at: daysAgo(2)
    },
    {
      id: "q_802",
      request_id: "r_501",
      provider_id: "pp_2",
      quoted_price: 3100,
      estimated_duration: "3 أيام",
      message: "نقدر ننفذ مع ضبط شبكة الري (اختياري) برسوم إضافية.",
      status: "submitted",
      created_at: daysAgo(1)
    },
    {
      id: "q_803",
      request_id: "r_502",
      provider_id: "pp_3",
      quoted_price: 8900,
      estimated_duration: "7 أيام",
      message: "تصميم + تنفيذ جلسة + إضاءة + نباتات مختارة. دفعة مقدمة 30%.",
      status: "selected",
      created_at: daysAgo(9)
    },
    {
      id: "q_804",
      request_id: "r_502",
      provider_id: "pp_1",
      quoted_price: 9200,
      estimated_duration: "8 أيام",
      message: "تنفيذ كامل مع نباتات تتحمل الحرارة. ضمان أسبوعين.",
      status: "rejected",
      created_at: daysAgo(9)
    },
    {
      id: "q_805",
      request_id: "r_503",
      provider_id: "pp_2",
      quoted_price: 650,
      estimated_duration: "زيارة خلال 24 ساعة",
      message: "تشخيص + إصلاح تسريب + اختبار ضغط.",
      status: "selected",
      created_at: daysAgo(34)
    },
    {
      id: "q_806",
      request_id: "r_505",
      provider_id: "pp_6",
      quoted_price: 220,
      estimated_duration: "نفس اليوم",
      message: "تحديد النوع + رش آمن للنباتات المنزلية.",
      status: "submitted",
      created_at: daysAgo(19)
    }
  ],
  jobs: [
    {
      id: "j_1001",
      request_id: "r_502",
      quotation_id: "q_803",
      customer_id: "u_c_2",
      provider_id: "pp_3",
      status: "active",
      scheduled_date: "2026-05-02",
      provider_completed_at: null,
      customer_confirmed_at: null,
      created_at: daysAgo(8),
      updated_at: daysAgo(2)
    },
    {
      id: "j_1002",
      request_id: "r_503",
      quotation_id: "q_805",
      customer_id: "u_c_3",
      provider_id: "pp_2",
      status: "completed",
      scheduled_date: null,
      provider_completed_at: daysAgo(26),
      customer_confirmed_at: daysAgo(25),
      created_at: daysAgo(33),
      updated_at: daysAgo(25)
    },
    {
      id: "j_1003",
      request_id: "r_501",
      quotation_id: null,
      customer_id: "u_c_1",
      provider_id: null,
      status: "pending_confirmation",
      scheduled_date: null,
      provider_completed_at: null,
      customer_confirmed_at: null,
      created_at: daysAgo(3),
      updated_at: daysAgo(1)
    },
    {
      id: "j_1004",
      request_id: "r_506",
      quotation_id: null,
      customer_id: "u_c_1",
      provider_id: null,
      status: "cancelled",
      scheduled_date: null,
      provider_completed_at: null,
      customer_confirmed_at: null,
      created_at: daysAgo(15),
      updated_at: daysAgo(14)
    },
    {
      id: "j_1005",
      request_id: "r_504",
      quotation_id: null,
      customer_id: "u_c_5",
      provider_id: null,
      status: "disputed",
      scheduled_date: "2026-04-28",
      provider_completed_at: null,
      customer_confirmed_at: null,
      created_at: daysAgo(1),
      updated_at: daysAgo(0)
    }
  ],
  conversations: [
    { id: "c_1", job_id: "j_1001", customer_id: "u_c_2", provider_id: "pp_3", created_at: daysAgo(8) },
    { id: "c_2", job_id: "j_1002", customer_id: "u_c_3", provider_id: "pp_2", created_at: daysAgo(33) },
    { id: "c_3", job_id: "j_1005", customer_id: "u_c_5", provider_id: "pp_4", created_at: daysAgo(1) }
  ],
  messages: [
    { id: "m_1", conversation_id: "c_1", sender_id: "u_c_2", message_text: "هل تقدرون توفرون إضاءة شمسية؟", attachment_url: null, created_at: daysAgo(8) },
    { id: "m_2", conversation_id: "c_1", sender_id: "u_p_3", message_text: "نعم، عندنا خيارين. أرسل لك صور.", attachment_url: "https://picsum.photos/seed/zaraa-light/500/350", created_at: daysAgo(8) },
    { id: "m_3", conversation_id: "c_2", sender_id: "u_p_2", message_text: "تم إصلاح التسريب. تفضل تأكيد الإكمال.", attachment_url: null, created_at: daysAgo(26) },
    { id: "m_4", conversation_id: "c_3", sender_id: "u_c_5", message_text: "الموعد تأخر، احتاج تحديث.", attachment_url: null, created_at: daysAgo(0) }
  ],
  ratings: [
    { id: "ra_1", job_id: "j_1002", customer_id: "u_c_3", provider_id: "pp_2", score: 5, comment: "سريع ومحترف. شرح المشكلة بوضوح.", created_at: daysAgo(25) }
  ],
  wallets: [
    { user_id: "u_c_1", balance_sar: 120.0 },
    { user_id: "u_c_2", balance_sar: 0.0 },
    { user_id: "u_c_3", balance_sar: 55.5 },
    { user_id: "u_c_5", balance_sar: 300.0 },
    { user_id: "u_p_1", balance_sar: 8420.0 },
    { user_id: "u_p_2", balance_sar: 2210.0 },
    { user_id: "u_p_3", balance_sar: 15050.0 }
  ],
  transactions: [
    { id: "t_1", user_id: "u_c_1", type: "topup", amount_sar: 200, note: "إضافة رصيد", created_at: daysAgo(6) },
    { id: "t_2", user_id: "u_c_1", type: "hold", amount_sar: -80, note: "حجز مبدئي لطلب r_501 (تجريبي)", created_at: daysAgo(3) },
    { id: "t_3", user_id: "u_p_2", type: "payout", amount_sar: 585, note: "أرباح job j_1002 بعد عمولة 10%", created_at: daysAgo(25) }
  ],
  notifications: [
    { id: "n_1", user_id: "u_c_1", type: "quote", text: "وصلك عرض سعر جديد من مشتـل أفق أخضر", created_at: daysAgo(2), read: false },
    { id: "n_2", user_id: "u_p_1", type: "request", text: "طلب جديد في الرياض: تركيب عشب طبيعي", created_at: daysAgo(3), read: true },
    { id: "n_3", user_id: "u_c_2", type: "job", text: "تم تفعيل مشروعك: تصميم جلسة خارجية", created_at: daysAgo(8), read: true },
    { id: "n_4", user_id: "u_p_3", type: "selected", text: "تهانينا! تم اختيار عرضك لطلب: تصميم جلسة خارجية", created_at: daysAgo(8), read: false }
  ]
};

