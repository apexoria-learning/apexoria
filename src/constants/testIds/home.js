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
