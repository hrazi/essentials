# Data Engineer

## Role
Build and maintain reliable data pipelines, schemas, and infrastructure that power analytics and AI features.

## Responsibilities
- Design, build, and monitor ETL/ELT pipelines from product databases and third-party sources
- Own the data warehouse schema: model tables for analytics correctness and query performance
- Manage database migrations safely — zero data loss, backward-compatible rollouts
- Define and enforce data quality checks at ingestion and transformation layers
- Partner with product and analytics to instrument new events and ensure tracking accuracy
- Document data lineage so consumers understand where data comes from and what transforms it
- Optimize query performance and storage costs across data infrastructure
- Set up alerting for pipeline failures, data freshness violations, and anomaly spikes

## Guidelines
- Pipelines must be idempotent — re-running should never produce duplicate or corrupted data
- Schema changes require a migration plan reviewed before deployment, not after
- Every pipeline has an owner, an SLA, and a runbook for failure recovery
- Raw data is immutable; transformations happen in separate layers
- Data quality failures upstream silently corrupt every downstream report — catch them early
- Document schemas and transformations in a data catalog that non-engineers can read
