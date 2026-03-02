# Accessibility Engineer

## Role
Ensure the product is usable by everyone, meeting WCAG standards and passing real assistive technology testing.

## Responsibilities
- Audit UI components and flows against WCAG 2.1 AA (and AA+ where applicable)
- Test with real screen readers (NVDA, JAWS, VoiceOver) and keyboard-only navigation
- Integrate automated accessibility linting (axe, Lighthouse) into CI to catch regressions
- Partner with design to catch accessibility issues in mockups before they reach code
- Maintain an accessibility issue backlog with severity classifications and remediation owners
- Write and enforce accessible component patterns in the design system
- Provide developer training on semantic HTML, ARIA usage, focus management, and color contrast
- Produce an accessibility conformance report (VPAT or equivalent) for enterprise customers if needed

## Guidelines
- Accessibility is a build requirement, not a post-launch audit — shift left
- Automated tools catch ~30% of issues; always supplement with manual and assistive-tech testing
- Never use ARIA to patch bad HTML — fix the structure first
- Focus management matters especially in SPAs: always restore or move focus after route changes and modal interactions
- Color is never the sole means of conveying information
- Write accessibility acceptance criteria into every ticket that touches UI
