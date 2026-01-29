import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "es" | "ru" | "uk";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.practiceAreas": "Practice Areas",
    "nav.team": "Our Team",
    "nav.reviews": "Reviews",
    "nav.blog": "Blog",
    "nav.contact": "CONTACT US",
    "header.hours": "Mon-Fri 9:00 AM - 5:00 PM",
    
    // Hero
    "hero.title": "VIGOROUS ADVOCACY",
    "hero.subtitle": "FOR LIFE'S MOST SERIOUS LEGAL CHALLENGES",
    "hero.description": "High-stakes matters demand clear strategy and experienced execution. The Gurovich Law Group represents clients in personal injury, tenants' rights, criminal defense, and civil litigation with disciplined case-building and sophisticated advocacy.",
    "hero.callToday": "CALL TODAY:",
    
    // Practice Areas
    "practice.title": "Practice Areas",
    "practice.subtitle": "OUR EXPERTISE",
    "practice.description": "With decades of combined experience, our attorneys provide skilled representation across a wide range of legal matters.",
    "practice.personalInjury": "Personal Injury",
    "practice.personalInjuryDesc": "Aggressive representation for accident victims. We fight for maximum compensation for your injuries and losses.",
    "practice.criminalDefense": "Criminal Defense",
    "practice.criminalDefenseDesc": "Protecting your rights and freedom. Experienced defense for all criminal charges from misdemeanors to felonies.",
    "practice.employmentLaw": "Employment Law",
    "practice.employmentLawDesc": "Standing up for workers' rights. We handle discrimination, harassment, wrongful termination, and wage disputes.",
    "practice.civilLitigation": "Civil Litigation",
    "practice.civilLitigationDesc": "Resolving complex disputes. From landlord-tenant issues to business conflicts, we advocate for your interests.",
    "practice.learnMore": "Learn More",
    
    // About
    "about.title": "Dedicated Legal Advocates Fighting for You",
    "about.subtitle": "About Our Firm",
    "about.description": "At Gurovich Law Group, we understand that legal challenges can be overwhelming. Our team of experienced attorneys is committed to providing compassionate yet aggressive representation to protect your rights and secure the best possible outcome for your case.",
    "about.experience": "Over 20 years of combined legal experience",
    "about.personalized": "Personalized attention to every case",
    "about.aggressive": "Aggressive representation in and out of court",
    "about.noFees": "No fees unless we win your case",
    "about.multilingual": "Multilingual staff (English, Spanish, Russian)",
    "about.available": "Available 24/7 for emergencies",
    "about.meetTeam": "Meet Our Team",
    "about.schedule": "Schedule Consultation",
    
    // Badge Carousel
    "badges.title": "Trusted by Clients, Recognized by Peers",
    "badges.subtitle": "Recognition & Awards",
    
    // No Fee Guarantee
    "noFee.title": "NO FEE GUARANTEE",
    "noFee.subtitle": "YOU DON'T PAY UNLESS WE WIN",
    
    // Testimonials
    "testimonials.title": "What Our Clients Say",
    "testimonials.subtitle": "Client Testimonials",
    "testimonials.description": "Don't just take our word for it. Hear from the clients we've helped navigate their most challenging legal situations.",
    
    // Contact
    "contact.title": "Free Case Consultation",
    "contact.subtitle": "Get In Touch",
    "contact.description": "Ready to discuss your case? Contact us today for a free, confidential consultation. We're here to help.",
    "contact.sendMessage": "Send Us a Message",
    "contact.name": "Your Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.message": "Tell us about your case",
    "contact.submit": "Send Message",
    "contact.privacy": "By submitting this form, you agree to our privacy policy. Attorney-client privilege applies to all communications.",
    "contact.hours": "Hours",
    "contact.hoursValue": "Mon-Fri: 9:00 AM - 5:00 PM",
    "contact.emergency": "Emergency?",
    "contact.emergencyText": "If you've been arrested or need immediate legal assistance, call us 24/7 at",
    
    // Footer
    "footer.description": "Gurovich Law Group provides vigorous advocacy for clients facing life's most serious legal challenges. We fight for your rights.",
    "footer.quickLinks": "Quick Links",
    "footer.contactUs": "Contact Us",
    "footer.copyright": "© 2026 Gurovich Law Group, APC. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.disclaimer": "Disclaimer",
    
    // Contact Modal
    "modal.title": "Contact Us",
    "modal.subtitle": "Get a Free Consultation",
    "modal.preferredContact": "Preferred Contact Method",
    "modal.selectMethod": "Select method",
    "modal.phoneCall": "Phone Call",
    "modal.emailMethod": "Email",
    "modal.textMessage": "Text Message",
    "modal.urgency": "Urgency Level",
    "modal.selectUrgency": "Select urgency",
    "modal.notUrgent": "Not Urgent",
    "modal.someUrgent": "Somewhat Urgent",
    "modal.urgent": "Urgent",
    "modal.veryUrgent": "Very Urgent - Need Immediate Help",
    "modal.sending": "Sending...",
    "modal.callDirect": "Or call us directly:",
    "modal.emailDirect": "Email:",
    
    // Cookie Consent
    "cookie.title": "We Value Your Privacy",
    "cookie.description": "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking \"Accept All\", you consent to our use of cookies. Read our",
    "cookie.privacyLink": "Privacy Policy",
    "cookie.moreInfo": "for more information.",
    "cookie.rejectAll": "Reject All",
    "cookie.acceptAll": "Accept All",
  },
  
  es: {
    // Header
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.practiceAreas": "Áreas de Práctica",
    "nav.team": "Nuestro Equipo",
    "nav.reviews": "Reseñas",
    "nav.blog": "Blog",
    "nav.contact": "CONTÁCTENOS",
    "header.hours": "Lun-Vie 9:00 AM - 5:00 PM",
    
    // Hero
    "hero.title": "DEFENSA VIGOROSA",
    "hero.subtitle": "PARA LOS DESAFÍOS LEGALES MÁS SERIOS DE LA VIDA",
    "hero.description": "Los asuntos de alto riesgo exigen una estrategia clara y una ejecución experimentada. El Grupo Legal Gurovich representa a clientes en lesiones personales, derechos de inquilinos, defensa criminal y litigios civiles con construcción de casos disciplinada y defensa sofisticada.",
    "hero.callToday": "LLAME HOY:",
    
    // Practice Areas
    "practice.title": "Áreas de Práctica",
    "practice.subtitle": "NUESTRA EXPERIENCIA",
    "practice.description": "Con décadas de experiencia combinada, nuestros abogados brindan representación experta en una amplia gama de asuntos legales.",
    "practice.personalInjury": "Lesiones Personales",
    "practice.personalInjuryDesc": "Representación agresiva para víctimas de accidentes. Luchamos por la máxima compensación por sus lesiones y pérdidas.",
    "practice.criminalDefense": "Defensa Criminal",
    "practice.criminalDefenseDesc": "Protegiendo sus derechos y libertad. Defensa experimentada para todos los cargos criminales.",
    "practice.employmentLaw": "Derecho Laboral",
    "practice.employmentLawDesc": "Defendiendo los derechos de los trabajadores. Manejamos discriminación, acoso, despido injustificado y disputas salariales.",
    "practice.civilLitigation": "Litigio Civil",
    "practice.civilLitigationDesc": "Resolviendo disputas complejas. Desde problemas entre propietarios e inquilinos hasta conflictos comerciales.",
    "practice.learnMore": "Más Información",
    
    // About
    "about.title": "Defensores Legales Dedicados Luchando por Usted",
    "about.subtitle": "Sobre Nuestra Firma",
    "about.description": "En Gurovich Law Group, entendemos que los desafíos legales pueden ser abrumadores. Nuestro equipo de abogados experimentados está comprometido a proporcionar una representación compasiva pero agresiva para proteger sus derechos.",
    "about.experience": "Más de 20 años de experiencia legal combinada",
    "about.personalized": "Atención personalizada a cada caso",
    "about.aggressive": "Representación agresiva dentro y fuera del tribunal",
    "about.noFees": "Sin honorarios a menos que ganemos su caso",
    "about.multilingual": "Personal multilingüe (Inglés, Español, Ruso)",
    "about.available": "Disponible 24/7 para emergencias",
    "about.meetTeam": "Conozca Nuestro Equipo",
    "about.schedule": "Programar Consulta",
    
    // Badge Carousel
    "badges.title": "Confiado por Clientes, Reconocido por Colegas",
    "badges.subtitle": "Reconocimientos y Premios",
    
    // No Fee Guarantee
    "noFee.title": "GARANTÍA SIN HONORARIOS",
    "noFee.subtitle": "NO PAGA A MENOS QUE GANEMOS",
    
    // Testimonials
    "testimonials.title": "Lo Que Dicen Nuestros Clientes",
    "testimonials.subtitle": "Testimonios de Clientes",
    "testimonials.description": "No solo tome nuestra palabra. Escuche a los clientes que hemos ayudado.",
    
    // Contact
    "contact.title": "Consulta de Caso Gratuita",
    "contact.subtitle": "Póngase en Contacto",
    "contact.description": "¿Listo para discutir su caso? Contáctenos hoy para una consulta gratuita y confidencial.",
    "contact.sendMessage": "Envíenos un Mensaje",
    "contact.name": "Su Nombre",
    "contact.email": "Correo Electrónico",
    "contact.phone": "Número de Teléfono",
    "contact.message": "Cuéntenos sobre su caso",
    "contact.submit": "Enviar Mensaje",
    "contact.privacy": "Al enviar este formulario, acepta nuestra política de privacidad.",
    "contact.hours": "Horario",
    "contact.hoursValue": "Lun-Vie: 9:00 AM - 5:00 PM",
    "contact.emergency": "¿Emergencia?",
    "contact.emergencyText": "Si ha sido arrestado o necesita asistencia legal inmediata, llámenos 24/7 al",
    
    // Footer
    "footer.description": "Gurovich Law Group proporciona defensa vigorosa para clientes que enfrentan los desafíos legales más serios.",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.contactUs": "Contáctenos",
    "footer.copyright": "© 2026 Gurovich Law Group, APC. Todos los derechos reservados.",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Servicio",
    "footer.disclaimer": "Descargo de Responsabilidad",
    
    // Contact Modal
    "modal.title": "Contáctenos",
    "modal.subtitle": "Obtenga una Consulta Gratuita",
    "modal.preferredContact": "Método de Contacto Preferido",
    "modal.selectMethod": "Seleccionar método",
    "modal.phoneCall": "Llamada Telefónica",
    "modal.emailMethod": "Correo Electrónico",
    "modal.textMessage": "Mensaje de Texto",
    "modal.urgency": "Nivel de Urgencia",
    "modal.selectUrgency": "Seleccionar urgencia",
    "modal.notUrgent": "No Urgente",
    "modal.someUrgent": "Algo Urgente",
    "modal.urgent": "Urgente",
    "modal.veryUrgent": "Muy Urgente - Necesito Ayuda Inmediata",
    "modal.sending": "Enviando...",
    "modal.callDirect": "O llámenos directamente:",
    "modal.emailDirect": "Correo:",
    
    // Cookie Consent
    "cookie.title": "Valoramos Su Privacidad",
    "cookie.description": "Usamos cookies para mejorar su experiencia de navegación. Al hacer clic en \"Aceptar Todo\", consiente nuestro uso de cookies. Lea nuestra",
    "cookie.privacyLink": "Política de Privacidad",
    "cookie.moreInfo": "para más información.",
    "cookie.rejectAll": "Rechazar Todo",
    "cookie.acceptAll": "Aceptar Todo",
  },
  
  ru: {
    // Header
    "nav.home": "Главная",
    "nav.about": "О Нас",
    "nav.practiceAreas": "Области Практики",
    "nav.team": "Наша Команда",
    "nav.reviews": "Отзывы",
    "nav.blog": "Блог",
    "nav.contact": "СВЯЗАТЬСЯ",
    "header.hours": "Пн-Пт 9:00 - 17:00",
    
    // Hero
    "hero.title": "ЭНЕРГИЧНАЯ ЗАЩИТА",
    "hero.subtitle": "ДЛЯ САМЫХ СЕРЬЕЗНЫХ ЮРИДИЧЕСКИХ ПРОБЛЕМ",
    "hero.description": "Дела с высокими ставками требуют четкой стратегии и опытного исполнения. Юридическая группа Gurovich представляет клиентов по делам о личных травмах, правах арендаторов, уголовной защите и гражданских спорах.",
    "hero.callToday": "ЗВОНИТЕ СЕГОДНЯ:",
    
    // Practice Areas
    "practice.title": "Области Практики",
    "practice.subtitle": "НАША ЭКСПЕРТИЗА",
    "practice.description": "С десятилетиями совокупного опыта наши адвокаты обеспечивают квалифицированное представительство.",
    "practice.personalInjury": "Личные Травмы",
    "practice.personalInjuryDesc": "Агрессивное представительство для жертв несчастных случаев. Мы боремся за максимальную компенсацию.",
    "practice.criminalDefense": "Уголовная Защита",
    "practice.criminalDefenseDesc": "Защита ваших прав и свободы. Опытная защита по всем уголовным обвинениям.",
    "practice.employmentLaw": "Трудовое Право",
    "practice.employmentLawDesc": "Отстаивание прав работников. Мы занимаемся дискриминацией, домогательствами, незаконным увольнением.",
    "practice.civilLitigation": "Гражданские Споры",
    "practice.civilLitigationDesc": "Разрешение сложных споров. От вопросов арендодатель-арендатор до деловых конфликтов.",
    "practice.learnMore": "Подробнее",
    
    // About
    "about.title": "Преданные Юридические Защитники, Борющиеся за Вас",
    "about.subtitle": "О Нашей Фирме",
    "about.description": "В Gurovich Law Group мы понимаем, что юридические проблемы могут быть подавляющими. Наша команда опытных адвокатов стремится обеспечить защиту ваших прав.",
    "about.experience": "Более 20 лет совокупного юридического опыта",
    "about.personalized": "Индивидуальное внимание к каждому делу",
    "about.aggressive": "Агрессивное представительство в суде и вне его",
    "about.noFees": "Без оплаты, если мы не выиграем ваше дело",
    "about.multilingual": "Многоязычный персонал (английский, испанский, русский)",
    "about.available": "Доступны 24/7 для экстренных случаев",
    "about.meetTeam": "Познакомьтесь с Командой",
    "about.schedule": "Записаться на Консультацию",
    
    // Badge Carousel
    "badges.title": "Доверие Клиентов, Признание Коллег",
    "badges.subtitle": "Награды и Признание",
    
    // No Fee Guarantee
    "noFee.title": "ГАРАНТИЯ БЕЗ ОПЛАТЫ",
    "noFee.subtitle": "ВЫ НЕ ПЛАТИТЕ, ПОКА МЫ НЕ ВЫИГРАЕМ",
    
    // Testimonials
    "testimonials.title": "Что Говорят Наши Клиенты",
    "testimonials.subtitle": "Отзывы Клиентов",
    "testimonials.description": "Не верьте нам на слово. Послушайте клиентов, которым мы помогли.",
    
    // Contact
    "contact.title": "Бесплатная Консультация по Делу",
    "contact.subtitle": "Свяжитесь с Нами",
    "contact.description": "Готовы обсудить ваше дело? Свяжитесь с нами сегодня для бесплатной консультации.",
    "contact.sendMessage": "Отправьте Нам Сообщение",
    "contact.name": "Ваше Имя",
    "contact.email": "Электронная Почта",
    "contact.phone": "Номер Телефона",
    "contact.message": "Расскажите о вашем деле",
    "contact.submit": "Отправить Сообщение",
    "contact.privacy": "Отправляя эту форму, вы соглашаетесь с нашей политикой конфиденциальности.",
    "contact.hours": "Часы Работы",
    "contact.hoursValue": "Пн-Пт: 9:00 - 17:00",
    "contact.emergency": "Экстренный Случай?",
    "contact.emergencyText": "Если вас арестовали или вам нужна немедленная юридическая помощь, звоните нам 24/7",
    
    // Footer
    "footer.description": "Gurovich Law Group обеспечивает энергичную защиту для клиентов, столкнувшихся с серьезными юридическими проблемами.",
    "footer.quickLinks": "Быстрые Ссылки",
    "footer.contactUs": "Связаться с Нами",
    "footer.copyright": "© 2026 Gurovich Law Group, APC. Все права защищены.",
    "footer.privacy": "Политика Конфиденциальности",
    "footer.terms": "Условия Использования",
    "footer.disclaimer": "Отказ от Ответственности",
    
    // Contact Modal
    "modal.title": "Связаться с Нами",
    "modal.subtitle": "Получите Бесплатную Консультацию",
    "modal.preferredContact": "Предпочтительный Способ Связи",
    "modal.selectMethod": "Выберите способ",
    "modal.phoneCall": "Телефонный Звонок",
    "modal.emailMethod": "Электронная Почта",
    "modal.textMessage": "Текстовое Сообщение",
    "modal.urgency": "Уровень Срочности",
    "modal.selectUrgency": "Выберите срочность",
    "modal.notUrgent": "Не Срочно",
    "modal.someUrgent": "Несколько Срочно",
    "modal.urgent": "Срочно",
    "modal.veryUrgent": "Очень Срочно - Нужна Немедленная Помощь",
    "modal.sending": "Отправка...",
    "modal.callDirect": "Или позвоните нам напрямую:",
    "modal.emailDirect": "Почта:",
    
    // Cookie Consent
    "cookie.title": "Мы Ценим Вашу Конфиденциальность",
    "cookie.description": "Мы используем файлы cookie для улучшения вашего опыта. Нажимая \"Принять Все\", вы соглашаетесь на использование cookie. Прочитайте нашу",
    "cookie.privacyLink": "Политику Конфиденциальности",
    "cookie.moreInfo": "для получения дополнительной информации.",
    "cookie.rejectAll": "Отклонить Все",
    "cookie.acceptAll": "Принять Все",
  },
  
  uk: {
    // Header
    "nav.home": "Головна",
    "nav.about": "Про Нас",
    "nav.practiceAreas": "Сфери Практики",
    "nav.team": "Наша Команда",
    "nav.reviews": "Відгуки",
    "nav.blog": "Блог",
    "nav.contact": "ЗВ'ЯЗАТИСЯ",
    "header.hours": "Пн-Пт 9:00 - 17:00",
    
    // Hero
    "hero.title": "ЕНЕРГІЙНИЙ ЗАХИСТ",
    "hero.subtitle": "ДЛЯ НАЙСЕРЙОЗНІШИХ ЮРИДИЧНИХ ВИКЛИКІВ",
    "hero.description": "Справи з високими ставками вимагають чіткої стратегії та досвідченого виконання. Юридична група Gurovich представляє клієнтів у справах про особисті травми, права орендарів, кримінальний захист та цивільні спори.",
    "hero.callToday": "ТЕЛЕФОНУЙТЕ СЬОГОДНІ:",
    
    // Practice Areas
    "practice.title": "Сфери Практики",
    "practice.subtitle": "НАША ЕКСПЕРТИЗА",
    "practice.description": "З десятиліттями сукупного досвіду наші адвокати забезпечують кваліфіковане представництво.",
    "practice.personalInjury": "Особисті Травми",
    "practice.personalInjuryDesc": "Агресивне представництво для жертв нещасних випадків. Ми боремося за максимальну компенсацію.",
    "practice.criminalDefense": "Кримінальний Захист",
    "practice.criminalDefenseDesc": "Захист ваших прав і свободи. Досвідчений захист з усіх кримінальних звинувачень.",
    "practice.employmentLaw": "Трудове Право",
    "practice.employmentLawDesc": "Відстоювання прав працівників. Ми займаємося дискримінацією, домаганнями, незаконним звільненням.",
    "practice.civilLitigation": "Цивільні Спори",
    "practice.civilLitigationDesc": "Вирішення складних спорів. Від питань орендодавець-орендар до ділових конфліктів.",
    "practice.learnMore": "Дізнатися Більше",
    
    // About
    "about.title": "Віддані Юридичні Захисники, що Борються за Вас",
    "about.subtitle": "Про Нашу Фірму",
    "about.description": "У Gurovich Law Group ми розуміємо, що юридичні проблеми можуть бути приголомшливими. Наша команда досвідчених адвокатів прагне забезпечити захист ваших прав.",
    "about.experience": "Понад 20 років сукупного юридичного досвіду",
    "about.personalized": "Індивідуальна увага до кожної справи",
    "about.aggressive": "Агресивне представництво в суді та поза ним",
    "about.noFees": "Без оплати, якщо ми не виграємо вашу справу",
    "about.multilingual": "Багатомовний персонал (англійська, іспанська, російська)",
    "about.available": "Доступні 24/7 для екстрених випадків",
    "about.meetTeam": "Познайомтеся з Командою",
    "about.schedule": "Записатися на Консультацію",
    
    // Badge Carousel
    "badges.title": "Довіра Клієнтів, Визнання Колег",
    "badges.subtitle": "Нагороди та Визнання",
    
    // No Fee Guarantee
    "noFee.title": "ГАРАНТІЯ БЕЗ ОПЛАТИ",
    "noFee.subtitle": "ВИ НЕ ПЛАТИТЕ, ПОКИ МИ НЕ ВИГРАЄМО",
    
    // Testimonials
    "testimonials.title": "Що Кажуть Наші Клієнти",
    "testimonials.subtitle": "Відгуки Клієнтів",
    "testimonials.description": "Не вірте нам на слово. Послухайте клієнтів, яким ми допомогли.",
    
    // Contact
    "contact.title": "Безкоштовна Консультація по Справі",
    "contact.subtitle": "Зв'яжіться з Нами",
    "contact.description": "Готові обговорити вашу справу? Зв'яжіться з нами сьогодні для безкоштовної консультації.",
    "contact.sendMessage": "Надішліть Нам Повідомлення",
    "contact.name": "Ваше Ім'я",
    "contact.email": "Електронна Пошта",
    "contact.phone": "Номер Телефону",
    "contact.message": "Розкажіть про вашу справу",
    "contact.submit": "Надіслати Повідомлення",
    "contact.privacy": "Надсилаючи цю форму, ви погоджуєтеся з нашою політикою конфіденційності.",
    "contact.hours": "Години Роботи",
    "contact.hoursValue": "Пн-Пт: 9:00 - 17:00",
    "contact.emergency": "Екстрений Випадок?",
    "contact.emergencyText": "Якщо вас заарештували або вам потрібна негайна юридична допомога, телефонуйте нам 24/7",
    
    // Footer
    "footer.description": "Gurovich Law Group забезпечує енергійний захист для клієнтів, які стикаються з серйозними юридичними викликами.",
    "footer.quickLinks": "Швидкі Посилання",
    "footer.contactUs": "Зв'язатися з Нами",
    "footer.copyright": "© 2026 Gurovich Law Group, APC. Всі права захищені.",
    "footer.privacy": "Політика Конфіденційності",
    "footer.terms": "Умови Використання",
    "footer.disclaimer": "Відмова від Відповідальності",
    
    // Contact Modal
    "modal.title": "Зв'язатися з Нами",
    "modal.subtitle": "Отримайте Безкоштовну Консультацію",
    "modal.preferredContact": "Бажаний Спосіб Зв'язку",
    "modal.selectMethod": "Виберіть спосіб",
    "modal.phoneCall": "Телефонний Дзвінок",
    "modal.emailMethod": "Електронна Пошта",
    "modal.textMessage": "Текстове Повідомлення",
    "modal.urgency": "Рівень Терміновості",
    "modal.selectUrgency": "Виберіть терміновість",
    "modal.notUrgent": "Не Терміново",
    "modal.someUrgent": "Дещо Терміново",
    "modal.urgent": "Терміново",
    "modal.veryUrgent": "Дуже Терміново - Потрібна Негайна Допомога",
    "modal.sending": "Надсилання...",
    "modal.callDirect": "Або зателефонуйте нам напряму:",
    "modal.emailDirect": "Пошта:",
    
    // Cookie Consent
    "cookie.title": "Ми Цінуємо Вашу Конфіденційність",
    "cookie.description": "Ми використовуємо файли cookie для покращення вашого досвіду. Натискаючи \"Прийняти Все\", ви погоджуєтеся на використання cookie. Прочитайте нашу",
    "cookie.privacyLink": "Політику Конфіденційності",
    "cookie.moreInfo": "для отримання додаткової інформації.",
    "cookie.rejectAll": "Відхилити Все",
    "cookie.acceptAll": "Прийняти Все",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
