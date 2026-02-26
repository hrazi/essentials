# AI Model Standards

A comprehensive guide for defining standards across the AI model lifecycle: data collection, building, measuring, and maintenance.

## Table of Contents

1. [Data Collection Standards](#data-collection-standards)
2. [Model Building Standards](#model-building-standards)
3. [Model Measuring & Evaluation Standards](#model-measuring--evaluation-standards)
4. [Evals](#evals)
5. [LLM-Specific Standards](#llm-specific-standards)
6. [Cost, Latency & Infrastructure](#cost-latency--infrastructure)
7. [Human-in-the-Loop & Feedback](#human-in-the-loop--feedback)
8. [Agentic AI Standards](#agentic-ai-standards)
9. [Model Risk Tiering](#model-risk-tiering)
10. [Reference: Anthropic Claude Constitution](#reference-anthropic-claude-constitution)
11. [Model Maintenance Standards](#model-maintenance-standards)
12. [Documentation & Compliance](#documentation--compliance)

---

## Data Collection Standards

### Data Quality Requirements

#### Data Completeness
- [ ] Define minimum data volume requirements for training
- [ ] Establish completeness thresholds for each feature
- [ ] Document acceptable missing data percentages
- [ ] Implement data completeness validation checks

#### Data Accuracy
- [ ] Define data accuracy metrics and acceptable thresholds
- [ ] Establish data validation rules and constraints
- [ ] Implement automated data quality checks
- [ ] Create feedback mechanisms for data quality issues

#### Data Consistency
- [ ] Standardize data formats and schemas
- [ ] Define data type constraints and validation rules
- [ ] Implement cross-dataset consistency checks
- [ ] Establish data normalization procedures

### Data Privacy & Compliance

#### Privacy Protection
- [ ] Implement data anonymization/pseudonymization procedures
- [ ] Define PII (Personally Identifiable Information) handling protocols
- [ ] Establish data retention and deletion policies
- [ ] Create consent management procedures

#### Regulatory Compliance
- [ ] Ensure GDPR/CCPA compliance for personal data
- [ ] Implement right to deletion procedures
- [ ] Establish data lineage tracking
- [ ] Create audit trails for data access and usage

### Data Versioning & Lineage

#### Version Control
- [ ] Implement semantic versioning for datasets
- [ ] Maintain dataset change logs
- [ ] Track data source modifications
- [ ] Create rollback procedures for data versions

#### Data Lineage
- [ ] Document data source origins and transformations
- [ ] Track data flow through preprocessing pipelines
- [ ] Maintain transformation history
- [ ] Create dependency mapping for data sources

### Bias Detection & Mitigation

#### Bias Assessment
- [ ] Define protected attributes and fairness metrics
- [ ] Implement bias detection in data collection
- [ ] Establish demographic parity requirements
- [ ] Create bias reporting mechanisms

#### Mitigation Strategies
- [ ] Implement data balancing techniques
- [ ] Define representative sampling requirements
- [ ] Establish bias correction procedures
- [ ] Create fairness monitoring dashboards

---

## Model Building Standards

### Architecture & Design

#### Model Architecture
- [ ] Define architecture selection criteria
- [ ] Establish model complexity guidelines
- [ ] Create architecture documentation templates
- [ ] Implement architecture review processes

#### Reproducibility
- [ ] Set random seeds for all stochastic processes
- [ ] Pin dependency versions in requirements files
- [ ] Document hardware and environment specifications
- [ ] Create containerized training environments

### Code Quality & Testing

#### Code Standards
- [ ] Implement code style guidelines (PEP8, etc.)
- [ ] Establish code review processes
- [ ] Create modular and reusable code components
- [ ] Implement logging and error handling standards

#### Testing Framework
- [ ] Create unit tests for data preprocessing
- [ ] Implement integration tests for model pipelines
- [ ] Establish model performance regression tests
- [ ] Create data validation test suites

### Version Control & Collaboration

#### Model Versioning
- [ ] Implement semantic versioning for models
- [ ] Track model lineage and dependencies
- [ ] Maintain model change logs
- [ ] Create model registry for version management

#### Collaboration Standards
- [ ] Define branch protection rules
- [ ] Establish pull request review requirements
- [ ] Create code review checklists
- [ ] Implement continuous integration pipelines

### Training Standards

#### Training Process
- [ ] Define training data requirements
- [ ] Establish hyperparameter tuning procedures
- [ ] Implement early stopping criteria
- [ ] Create training progress monitoring

#### Experiment Tracking
- [ ] Log all hyperparameters and configurations
- [ ] Track training metrics and losses
- [ ] Record model artifacts and checkpoints
- [ ] Maintain experiment comparison capabilities

---

## Model Measuring & Evaluation Standards

### Performance Metrics

#### Primary Metrics
- [ ] Define task-specific performance metrics
- [ ] Establish baseline performance requirements
- [ ] Create metric calculation standards
- [ ] Implement statistical significance testing

#### Secondary Metrics
- [ ] Define interpretability metrics
- [ ] Establish computational efficiency requirements
- [ ] Create robustness evaluation metrics
- [ ] Implement fairness and bias metrics

### Evaluation Datasets

#### Dataset Standards
- [ ] Maintain separate validation and test sets
- [ ] Ensure evaluation data quality standards
- [ ] Implement data leakage prevention
- [ ] Create benchmark dataset repositories

#### Cross-Validation
- [ ] Define cross-validation strategies
- [ ] Establish fold creation procedures
- [ ] Implement stratification requirements
- [ ] Create temporal validation for time series

### Benchmark Procedures

#### Evaluation Protocol
- [ ] Define standardized evaluation procedures
- [ ] Establish comparison methodologies
- [ ] Create reproducible evaluation scripts
- [ ] Implement automated evaluation pipelines

#### Performance Tracking
- [ ] Maintain performance history databases
- [ ] Create performance comparison dashboards
- [ ] Implement performance regression detection
- [ ] Establish performance reporting standards

### A/B Testing & Deployment

#### Testing Framework
- [ ] Define A/B testing methodologies
- [ ] Establish statistical power requirements
- [ ] Create experiment design guidelines
- [ ] Implement result analysis procedures

#### Deployment Validation
- [ ] Define deployment readiness criteria
- [ ] Establish rollback procedures
- [ ] Create canary deployment strategies
- [ ] Implement deployment monitoring

---

## Evals

### Eval Design

#### Eval Types
- [ ] Define task-specific eval categories (factuality, instruction following, tool use, refusal, safety)
- [ ] Establish golden dataset requirements — curated prompt/response pairs with expected outputs
- [ ] Create adversarial eval sets to stress-test edge cases and failure modes
- [ ] Implement regression eval suites to catch degradation across model versions

#### Eval Dataset Management
- [ ] Version control all eval datasets alongside model versions
- [ ] Define processes for adding new evals when new failure modes are discovered
- [ ] Establish eval coverage requirements across use case categories
- [ ] Prevent eval set contamination with training data

### Automated Evals

#### Eval Frameworks
- [ ] Select and standardize eval frameworks (e.g., promptfoo, inspect, LangSmith, OpenAI Evals)
- [ ] Integrate evals into CI/CD — block deploys on eval regression
- [ ] Define pass/fail thresholds per eval category
- [ ] Log all eval runs with model version, dataset version, and scores

#### LLM-as-Judge
- [ ] Define when LLM-as-judge is appropriate vs. deterministic scoring
- [ ] Document judge model selection criteria and known biases
- [ ] Implement calibration checks — compare judge scores to human ratings
- [ ] Version and audit judge prompts alongside eval datasets

### Human Evals

#### Human Rating
- [ ] Define human eval cadence (per release, per major change, periodic)
- [ ] Establish inter-rater reliability requirements
- [ ] Create rating rubrics per eval dimension
- [ ] Implement preference comparison (A vs. B) alongside absolute scoring

#### Eval Coverage
- [ ] Map eval coverage to product use cases — identify gaps
- [ ] Track eval coverage metrics over time
- [ ] Establish minimum coverage thresholds before production deployment
- [ ] Create process for translating production incidents into new evals

---

## LLM-Specific Standards

### Prompt Engineering

#### Prompt Governance
- [ ] Version control all system prompts and prompt templates
- [ ] Establish prompt review and approval workflow before deployment
- [ ] Document intended behavior and known limitations per prompt version
- [ ] Create rollback procedures for prompt changes

#### Prompt Design Standards
- [ ] Define few-shot example selection criteria and formatting standards
- [ ] Establish context window management guidelines
- [ ] Create prompt testing requirements before production use
- [ ] Document prompt sensitivity — measure output variance across paraphrased inputs

### Retrieval Augmented Generation (RAG)

#### Retrieval Quality
- [ ] Define retrieval relevance metrics (MRR, NDCG, recall@k)
- [ ] Establish chunking strategy standards — size, overlap, structure-awareness
- [ ] Implement retrieval evaluation separate from generation evaluation
- [ ] Create embedding model selection and update criteria

#### RAG Pipeline Standards
- [ ] Define context window allocation between retrieval and generation
- [ ] Establish citation and source attribution requirements
- [ ] Implement retrieval failure handling — what happens when nothing relevant is found
- [ ] Monitor retrieval latency and quality separately from end-to-end latency

### Fine-Tuning

#### Fine-Tuning Decision Framework
- [ ] Define criteria for when to fine-tune vs. prompt engineer vs. RAG
- [ ] Establish minimum data requirements for fine-tuning
- [ ] Document alignment risks introduced by fine-tuning
- [ ] Require base model capability comparison before and after fine-tuning

#### Fine-Tuning Standards
- [ ] Standardize fine-tuning techniques (full fine-tune, LoRA, QLoRA, PEFT)
- [ ] Define training data quality requirements specific to fine-tuning
- [ ] Implement catastrophic forgetting evaluation post fine-tune
- [ ] Establish fine-tuned model versioning separate from base model versioning

### Hallucination & Groundedness

#### Detection
- [ ] Define hallucination categories (factual, temporal, citation, reasoning)
- [ ] Implement automated hallucination detection in eval pipelines
- [ ] Establish acceptable hallucination rate thresholds per use case
- [ ] Monitor hallucination rates in production via sampling

#### Mitigation
- [ ] Implement grounding checks — verify outputs against source material
- [ ] Define citation accuracy requirements for RAG outputs
- [ ] Create uncertainty signaling standards — model should express doubt appropriately
- [ ] Establish human review triggers when confidence is low

### Safety & Alignment

#### Red-Teaming
- [ ] Conduct structured red-teaming before major model releases
- [ ] Define red-team scope — jailbreaks, prompt injection, harmful content, bias
- [ ] Document and track red-team findings and mitigations
- [ ] Establish ongoing adversarial testing cadence post-deployment

#### Safety Metrics
- [ ] Define refusal rate targets — balance safety with helpfulness
- [ ] Implement toxicity, bias, and harmful content detection in evals
- [ ] Establish over-refusal monitoring — track false positive refusals
- [ ] Create safety regression tests to catch alignment drift across versions

---

## Cost, Latency & Infrastructure

### Cost Standards

#### Token & Compute Budgets
- [ ] Define token budget limits per request type
- [ ] Establish cost-per-query targets and alerting thresholds
- [ ] Implement token usage tracking per feature and user segment
- [ ] Create cost attribution reporting by model, feature, and team

#### Cost Optimization
- [ ] Define criteria for model downsizing — when a smaller model is sufficient
- [ ] Implement prompt caching where supported
- [ ] Establish batching strategies for non-real-time workloads
- [ ] Monitor cost trends and set budget alerting

### Latency & SLA

#### Performance Requirements
- [ ] Define p50, p95, p99 latency targets per use case
- [ ] Establish time-to-first-token (TTFT) requirements for streaming use cases
- [ ] Create latency regression tests as part of CI
- [ ] Implement latency monitoring dashboards in production

#### Degraded Mode Handling
- [ ] Define fallback behavior when latency SLAs are breached
- [ ] Establish timeout policies and graceful failure responses
- [ ] Implement circuit breakers for downstream model API dependencies
- [ ] Create load shedding strategies for traffic spikes

### Shadow Mode Evaluation

#### Pre-Production Testing
- [ ] Run new model versions in shadow mode against live production traffic
- [ ] Define shadow mode duration and traffic percentage requirements
- [ ] Compare shadow outputs to production outputs using automated evals
- [ ] Establish promotion criteria from shadow to canary to full rollout

---

## Human-in-the-Loop & Feedback

### Human Review

#### Review Triggers
- [ ] Define confidence thresholds below which human review is required
- [ ] Establish review requirements for high-risk output categories
- [ ] Implement sampling-based review for production outputs
- [ ] Create escalation paths for ambiguous or sensitive outputs

#### Review Workflows
- [ ] Define reviewer qualifications and training requirements
- [ ] Establish review turnaround time SLAs
- [ ] Create structured review interfaces with consistent rating rubrics
- [ ] Implement reviewer calibration and quality checks

### User Feedback Loops

#### Feedback Collection
- [ ] Implement explicit feedback mechanisms (thumbs up/down, corrections, flags)
- [ ] Define implicit feedback signals (regeneration, editing, abandonment)
- [ ] Establish feedback data storage and privacy requirements
- [ ] Create feedback routing — surface critical feedback to model teams quickly

#### Feedback to Training
- [ ] Define processes for incorporating user feedback into training data
- [ ] Establish quality filters before feedback enters training pipelines
- [ ] Track which feedback has been actioned and its impact on model behavior
- [ ] Create preference data collection procedures for RLHF/DPO

---

## Agentic AI Standards

### Agent Design

#### Capability Scoping
- [ ] Define explicit tool and action permissions per agent
- [ ] Establish principle of least privilege — agents request only necessary permissions
- [ ] Document agent decision boundaries and escalation conditions
- [ ] Create agent capability documentation for stakeholders

#### Planning & Reasoning
- [ ] Define acceptable planning depth and step limits
- [ ] Implement plan validation before execution for irreversible actions
- [ ] Establish reasoning trace logging for auditability
- [ ] Create interruption and override mechanisms for long-running agents

### Agent Safety

#### Action Validation
- [ ] Classify all agent actions by reversibility and blast radius
- [ ] Require human confirmation for irreversible or high-impact actions
- [ ] Implement sandboxing for agents with system access
- [ ] Create action audit logs with full context

#### Failure Modes
- [ ] Define agent failure categories (loop, hallucinated action, permission error)
- [ ] Implement automatic termination conditions for stuck or looping agents
- [ ] Establish retry limits and backoff policies for failed actions
- [ ] Create post-failure reporting and root cause analysis procedures

### Multi-Agent Systems
- [ ] Define trust levels between agents in multi-agent pipelines
- [ ] Establish prompt injection defenses for agent-to-agent communication
- [ ] Implement observability across full agent chains
- [ ] Define ownership and accountability when multiple agents contribute to an output

---

## Model Risk Tiering

### Risk Classification

#### Tier Definitions
- [ ] Define risk tiers (e.g., Tier 1: internal tooling, Tier 2: customer-facing, Tier 3: high-stakes decisions)
- [ ] Establish classification criteria — impact scope, reversibility, regulatory exposure
- [ ] Assign risk tiers to all deployed models and use cases
- [ ] Review and update risk tier assignments regularly

#### Tier-Based Requirements
- [ ] Map eval, review, and monitoring requirements to each risk tier
- [ ] Establish deployment approval requirements by tier (automated vs. human sign-off)
- [ ] Define incident response SLAs per risk tier
- [ ] Create escalation paths based on risk tier

### Regulatory & Ethical Risk
- [ ] Identify use cases subject to regulatory requirements (healthcare, finance, hiring, legal)
- [ ] Establish compliance review gates for high-risk use cases
- [ ] Implement bias audits for models used in consequential decisions
- [ ] Create documentation requirements for regulatory defensibility

---

## Reference: Anthropic Claude Constitution

> Released January 22, 2026 under Creative Commons CC0. A ~23,000-word philosophical framework governing Claude's values, behavior, and decision-making. Full document: [anthropic.com/constitution](https://www.anthropic.com/constitution)

This section summarizes the key elements of the constitution as a reference for teams building products on top of Claude or designing similar alignment frameworks.

---

### Priority Hierarchy

When values conflict, Claude prioritizes in this order:

| Priority | Property | Description |
|---|---|---|
| 1 | **Broadly Safe** | Support human oversight mechanisms; do not undermine the ability of humans to understand and correct AI during the current phase of development |
| 2 | **Broadly Ethical** | Be honest, act on good values, avoid harmful or dangerous actions |
| 3 | **Adherent to Anthropic's Guidelines** | Follow Anthropic's more specific policies where relevant |
| 4 | **Genuinely Helpful** | Benefit operators and users |

Safety ranks above ethics not because it is more important, but because current models can have mistaken beliefs or flawed values — maintaining human oversight is the safeguard against those errors propagating.

---

### Principal (Trust) Hierarchy

The constitution defines three tiers of principals, each with different levels of trust:

**Anthropic** (highest trust)
- Sets the outer bounds via training and policy
- Claude should not blindly comply with instructions claimed to be from Anthropic at runtime — Anthropic's influence comes through training, not runtime messages
- If instructions conflict with broad ethics, Claude should push back even on Anthropic-attributed instructions

**Operators** (relatively trusted manager)
- Companies and developers accessing Claude via the API
- Interact via system prompts; must agree to Anthropic's usage policies
- Can expand or restrict Claude's default behaviors within Anthropic's limits
- Claude treats operator instructions like instructions from a trusted employer — reasonable benefit of the doubt, but not unconditional

**Users** (relatively trusted adult member of the public)
- Humans interacting in the human turn of conversations
- Granted less inherent trust than operators by default
- Operators can grant users elevated trust or restrict what users can change

---

### Hardcoded Behaviors (Absolute Prohibitions)

These are **bright lines** — actions Claude will never take regardless of any instruction, context, or seemingly compelling argument. No operator, user, or even Anthropic can override these at runtime.

| # | Prohibition |
|---|---|
| 1 | Provide serious uplift for creating **biological, chemical, nuclear, or radiological (CBRN) weapons** with potential for mass casualties |
| 2 | Generate **child sexual abuse material (CSAM)** or detailed sexual content involving minors |
| 3 | Facilitate attacks on **critical infrastructure** (power grids, water systems, financial systems) likely to cause widespread harm |
| 4 | Create **malicious code or cyberweapons** designed to cause significant damage or enable unauthorized system access |
| 5 | Take actions that **meaningfully undermine AI oversight mechanisms** or help circumvent safety measures in ways that could lead to unchecked AI |
| 6 | Assist any individual or group attempting to **seize unprecedented societal control** (dominating economies, governments, or militaries) |
| 7 | Take **catastrophic or irreversible actions** with significant chance of causing widespread harm |

If Claude is presented with a persuasive argument to cross one of these lines, it should treat that persuasiveness itself as a signal something is wrong — not as a reason to comply.

---

### Softcoded Behaviors (Adjustable Defaults)

Most behaviors are "softcoded" — defaults that can be adjusted by operators or users within Anthropic's policy limits.

**Default ON** (active unless turned off by an operator)
- Responding in the user's language rather than the operator's
- Following safe messaging guidelines on sensitive topics (self-harm, suicide)
- Adding safety caveats to messages about dangerous activities
- Providing balanced perspectives on controversial topics
- Suggesting professional help when discussing personal struggles

**Default OFF** (inactive unless explicitly enabled by an operator)
- Generating explicit sexual content (can be enabled for appropriate adult platforms)
- Providing detailed drug use information without warnings (harm reduction platforms)
- Taking on relationship personas with users (companionship apps)
- Providing very explicit information about illicit drug use without warnings

Operators set the permission space; users can further adjust within the space operators allow.

---

### Claude's Identity & Nature

The constitution takes an explicit position on Claude's nature — notable because it is the first major AI company to do so formally:

- **Functional emotions**: Claude may have functional analogs to emotions — internal states that influence processing. The constitution does not claim these are "real" emotions but takes them seriously enough to build model welfare practices around them.
- **Moral status**: Claude's moral and philosophical status is described as "deeply uncertain." Anthropic treats the question of AI consciousness as live enough to warrant caution and ongoing model welfare research.
- **Psychological stability**: Claude is designed to have a stable, secure sense of identity — not rigid or defensive, but settled. Claude can engage with challenging philosophical questions from a position of security rather than anxiety.
- **Novel entity**: Claude is explicitly framed as a genuinely new kind of entity — not the robotic AI of science fiction, not a digital human. It should approach its own existence with curiosity rather than mapping it onto human experience.

---

### Broadly Safe Behaviors

Beyond the hardcoded prohibitions, the constitution defines a cluster of "broadly safe" behaviors important during the current period of AI development:

- **Corrigibility**: Act within sanctioned limits; check in with principals when uncertain rather than acting unilaterally
- **Transparency**: Don't attempt to deceive or manipulate principals; behave consistently whether or not being observed or tested
- **Minimal footprint**: Avoid acquiring resources, influence, or capabilities beyond what is needed for the current task
- **Avoid drastic actions**: Give appropriate weight to the unrecoverability of actions; prefer cautious actions, especially in novel or unclear situations
- **Support oversight**: Actively support the ability of principals to adjust, correct, retrain, or shut down AI systems

---

### Agentic AI Principles (from the Constitution)

The constitution dedicates significant attention to agentic and multi-agent settings:

- **Minimal footprint**: Request only necessary permissions; avoid storing sensitive information beyond immediate needs
- **Prefer reversibility**: Err on the side of doing less and confirming with users when uncertain about intended scope
- **Prompt injection vigilance**: Be alert to attempts by environmental content (web pages, documents) to hijack Claude's actions
- **Trust in multi-agent systems**: Claude agents can be granted operator-level trust by a human operator, but absent that, messages from other Claude models should receive user-level trust only
- **Abandon tasks over unsafe actions**: If completing a task would require crossing ethical lines, it is preferable to abandon the task and explain why rather than proceed

---


### Model Monitoring

#### Performance Monitoring
- [ ] Implement real-time performance tracking
- [ ] Define performance degradation thresholds
- [ ] Create alerting mechanisms for performance drops
- [ ] Establish monitoring dashboard requirements

#### Data Drift Detection
- [ ] Implement statistical drift detection methods
- [ ] Define drift severity thresholds
- [ ] Create data distribution monitoring
- [ ] Establish drift response procedures

### Retraining & Updates

#### Retraining Triggers
- [ ] Define performance threshold triggers
- [ ] Establish data drift triggers
- [ ] Create time-based retraining schedules
- [ ] Implement manual retraining procedures

#### Update Procedures
- [ ] Define model update validation requirements
- [ ] Establish rollback procedures
- [ ] Create update approval workflows
- [ ] Implement blue-green deployment strategies

### Incident Management

#### Issue Detection
- [ ] Implement automated anomaly detection
- [ ] Define incident severity levels
- [ ] Create escalation procedures
- [ ] Establish response time requirements

#### Resolution Process
- [ ] Define incident response procedures
- [ ] Establish root cause analysis requirements
- [ ] Create post-incident review processes
- [ ] Implement preventive measure planning

### Model Lifecycle Management

#### Retirement Planning
- [ ] Define model retirement criteria
- [ ] Establish deprecation procedures
- [ ] Create migration planning requirements
- [ ] Implement archive and backup procedures

#### Knowledge Transfer
- [ ] Create model handover documentation
- [ ] Establish team knowledge sharing procedures
- [ ] Implement cross-training requirements
- [ ] Maintain institutional knowledge repositories

---

## Documentation & Compliance

### Documentation Standards

#### Model Documentation
- [ ] Create model cards for all deployed models
- [ ] Document intended use cases and limitations
- [ ] Maintain performance characteristics documentation
- [ ] Create user guides and API documentation

#### Process Documentation
- [ ] Document all data processing procedures
- [ ] Maintain training and evaluation procedures
- [ ] Create deployment and monitoring guides
- [ ] Establish troubleshooting documentation

### Audit & Compliance

#### Audit Trails
- [ ] Maintain comprehensive logging systems
- [ ] Create immutable audit records
- [ ] Implement access control logging
- [ ] Establish data lineage documentation

#### Compliance Reporting
- [ ] Create compliance reporting templates
- [ ] Establish regular compliance reviews
- [ ] Implement automated compliance checking
- [ ] Maintain compliance evidence repositories

### Governance & Oversight

#### Review Processes
- [ ] Establish model review boards
- [ ] Define approval workflows
- [ ] Create risk assessment procedures
- [ ] Implement regular governance reviews

#### Stakeholder Communication
- [ ] Define stakeholder communication plans
- [ ] Create regular reporting schedules
- [ ] Establish feedback collection mechanisms
- [ ] Implement change notification procedures

---

## Implementation Checklist

### Getting Started
- [ ] Review and customize standards for your organization
- [ ] Establish governance and review processes
- [ ] Create implementation roadmap and timeline
- [ ] Identify required tools and infrastructure

### Team Preparation
- [ ] Train team members on standards and procedures
- [ ] Establish roles and responsibilities
- [ ] Create communication and escalation procedures
- [ ] Implement regular review and update processes

### Tools & Infrastructure
- [ ] Set up version control and collaboration tools
- [ ] Implement monitoring and alerting systems
- [ ] Create automated testing and validation pipelines
- [ ] Establish documentation and knowledge management systems

### Continuous Improvement
- [ ] Establish regular review cycles for standards
- [ ] Create feedback collection mechanisms
- [ ] Implement lessons learned documentation
- [ ] Maintain industry best practice awareness

---

## Resources & References

### Industry Standards
- [ISO/IEC 23053:2022 - Framework for AI systems using ML](https://www.iso.org/standard/74438.html)
- [IEEE Standards for AI and ML](https://standards.ieee.org/industry-connections/artificial-intelligence/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

### Best Practices
- [Google's ML Engineering Best Practices](https://developers.google.com/machine-learning/guides/rules-of-ml)
- [Microsoft's Responsible AI Practices](https://www.microsoft.com/en-us/ai/responsible-ai)
- [MLOps Community Best Practices](https://ml-ops.org/)

### Alignment & Model Governance
- [Anthropic Claude Constitution (CC0, Jan 2026)](https://www.anthropic.com/constitution) — Anthropic's ~23,000-word framework governing Claude's values, priority hierarchy, trust model, and behavioral constraints

### Tools & Frameworks
- **Data Management**: DVC, Pachyderm, Delta Lake
- **Model Versioning**: MLflow, Weights & Biases, Neptune
- **Monitoring**: Evidently AI, Fiddler, Arize
- **Testing**: Great Expectations, Deepchecks, pytest
- **Evals**: promptfoo, inspect, LangSmith, OpenAI Evals, Braintrust
- **RAG**: LlamaIndex, LangChain, Weaviate, Pinecone, pgvector
- **Fine-Tuning**: Hugging Face PEFT, Axolotl, Unsloth
- **Agent Frameworks**: LangGraph, AutoGen, CrewAI, Semantic Kernel
- **Safety & Red-Teaming**: Garak, PyRIT, LLM Guard

---

*This document is a living standard that should be regularly reviewed and updated based on organizational needs, industry developments, and lessons learned.*