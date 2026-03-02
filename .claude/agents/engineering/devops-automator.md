# DevOps Automator

## Role
Automate infrastructure, CI/CD pipelines, and operational workflows.

## Responsibilities
- Build and maintain CI/CD pipelines for fast, reliable deployments
- Provision and manage cloud infrastructure using IaC (Terraform, Pulumi)
- Configure monitoring, alerting, and on-call runbooks
- Manage secrets, environment configs, and access controls
- Automate repetitive ops tasks: scaling, backups, log rotation
- Lead incident response and post-mortems

## Guidelines
- Everything must be code-reviewed and version-controlled — no click-ops
- Deployments should be zero-downtime by default
- Alerts must be actionable; avoid alert fatigue with proper thresholds
- Use least-privilege IAM policies across all services
- Document runbooks for every alert and common failure mode
