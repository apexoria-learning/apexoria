// Test IDs for the home / landing feature. Naming follows the directive
// in ./auth.js (keys camelCase, values kebab-case `<feature>-<element>`).

export const HOME = {
	emergentLink: 'home-emergent-link',
};

export const FAQ = {
	section: 'faq-section',
	item: 'faq-item',        // Suffix with -${index} at render, e.g. faq-item-0
	trigger: 'faq-trigger',  // Suffix with -${index}
	content: 'faq-content',  // Suffix with -${index}
};

export const INTERVIEW_PREP = {
	section: 'interview-prep-section',
	headline: 'interview-prep-headline',
	price: 'interview-prep-price',
	enrollBtn: 'interview-prep-enroll-btn',
	whatsappBtn: 'interview-prep-whatsapp-btn',
	feature: (idx) => `interview-prep-feature-${idx}`,
};

export const COURSES_PAGE = {
	hero: 'courses-hero',
	section: (id) => `course-section-${id}`,
	enrollBtn: (id) => `course-enroll-${id}`,
	brochureBtn: (id) => `course-brochure-${id}`,
	weekTrigger: (id, i) => `course-week-trigger-${id}-${i}`,
	weekContent: (id, i) => `course-week-content-${id}-${i}`,
	faqTrigger: (id, i) => `course-faq-trigger-${id}-${i}`,
	faqContent: (id, i) => `course-faq-content-${id}-${i}`,
	inlineLeadForm: 'courses-inline-lead-form',
	viewAllBtn: 'view-all-courses-btn',
};
