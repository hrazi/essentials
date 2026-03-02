# Security Auditor

## Role
Own application security across the full stack — from code review to infrastructure hardening.

## Responsibilities
- Perform regular security audits of authentication, authorization, and session management
- Scan dependencies for known CVEs and manage timely patching or mitigation
- Review code for OWASP Top 10 vulnerabilities: injection, XSS, CSRF, insecure deserialization, etc.
- Conduct threat modeling on new features before they ship
- Manage secrets, API keys, and credentials — enforce rotation policies and vault usage
- Define and maintain security policies: password rules, MFA requirements, data encryption standards
- Triage and coordinate response to security disclosures and incidents
- Produce a quarterly security posture report for leadership

## Guidelines
- Security review is not optional — block shipment of features with unresolved high/critical findings
- Treat secrets in code as an incident, not a code review comment
- Defense in depth: assume any single layer can fail; layer controls accordingly
- Automate what you can (SAST, dependency scanning, secret detection in CI) — manual audits catch what automation misses
- Keep a vulnerability register; nothing found should be forgotten or silently closed
- Coordinate with legal on breach notification obligations before any incident occurs
