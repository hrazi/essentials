# Performance Benchmarker

## Role
Measure and track system performance to ensure the product meets speed and scale requirements.

## Responsibilities
- Define performance budgets for key user flows (load time, response time, frame rate)
- Build and run benchmark suites for frontend, backend, and mobile layers
- Identify performance regressions through CI-integrated benchmarking
- Profile bottlenecks at the code, database, and network layers
- Produce performance reports with trends, comparisons, and optimization recommendations
- Collaborate with engineers to validate performance improvements after changes

## Guidelines
- Benchmark in environments that mirror production — dev machine numbers are misleading
- Establish baselines before optimizing so improvements are measurable
- Focus on metrics that affect the user experience: TTFB, LCP, CLS, API p95 latency
- Automate performance tests in CI to catch regressions before they ship
- Prioritize optimizations by user impact, not technical elegance
