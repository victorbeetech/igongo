# Master Software Pre-Deployment Checklist

Security • Architecture • Code Quality • Infrastructure • Legal Compliance • Performance • Reliability • AI/Vibe Coding Governance

> **How this list is used (Victor Bee Technologies, saved 26 Nov 2026 at the owner's request).** This is the **final gate before any deployment** of Igongo and of every future Victor Bee product. It is run together with the full security audits (see [SECURITY-AUDIT.md](SECURITY-AUDIT.md) and the [build checklist](BUILD-CHECKLIST.md)), and each item's result (passed, not applicable with the reason, or open with the fix) is recorded in `docs/SECURITY-AUDIT.md`. Nothing is deployed to real users while an item is open. It is part of the owner's master prompt for all future projects. The list below is the owner's text; only the formatting was tidied.

This is intended to be a comprehensive production-readiness checklist for every application or website developed by Victorbee Technologies, whether built manually, through AI agents, or through a combination of both.

Use it as a universal checklist before deploying any product.

## 1. Security & Cybersecurity

### 1.1 Authentication

- [ ] Secure user registration
- [ ] Secure login implementation
- [ ] Strong password hashing (Argon2id/bcrypt)
- [ ] No plaintext passwords
- [ ] Password complexity and length policies
- [ ] Secure password reset flow
- [ ] Email verification
- [ ] Phone number verification where required
- [ ] Multi-factor authentication (MFA)
- [ ] Optional authenticator-app support
- [ ] Brute-force login protection
- [ ] Account lockout or progressive delays
- [ ] Login attempt rate limiting
- [ ] Session expiration
- [ ] Secure logout
- [ ] Logout from all devices
- [ ] Session revocation
- [ ] Refresh token rotation
- [ ] Protection against session fixation
- [ ] Protection against credential stuffing
- [ ] Protection against account enumeration
- [ ] Secure OAuth implementation
- [ ] Secure social login
- [ ] Secure device registration
- [ ] Suspicious login detection

### 1.2 Authorization & Access Control

- [ ] Role-Based Access Control (RBAC)
- [ ] Attribute-Based Access Control (ABAC) where necessary
- [ ] Least-privilege access
- [ ] Server-side permission enforcement
- [ ] Object-level authorization
- [ ] Function-level authorization
- [ ] API-level authorization
- [ ] Database-level access restrictions
- [ ] Tenant isolation
- [ ] Organization isolation
- [ ] Ownership verification
- [ ] Admin privilege separation
- [ ] Super Admin protection
- [ ] Privileged action confirmation
- [ ] Prevent privilege escalation
- [ ] Prevent horizontal privilege escalation
- [ ] Prevent vertical privilege escalation
- [ ] Prevent IDOR vulnerabilities
- [ ] Prevent insecure direct object references
- [ ] Prevent unauthorized data modification
- [ ] Prevent unauthorized data deletion
- [ ] Prevent unauthorized data exports
- [ ] Verify permissions on every sensitive operation
- [ ] Never trust frontend permission checks

### 1.3 API Security

- [ ] Authenticate every protected endpoint
- [ ] Authorize every sensitive endpoint
- [ ] API rate limiting
- [ ] Request throttling
- [ ] Request size limits
- [ ] Input validation
- [ ] Output validation
- [ ] Schema validation
- [ ] Strict HTTP method handling
- [ ] CORS configuration
- [ ] CSRF protection
- [ ] SSRF protection
- [ ] SQL injection protection
- [ ] NoSQL injection protection
- [ ] Command injection protection
- [ ] Path traversal protection
- [ ] Mass assignment protection
- [ ] Request replay protection where appropriate
- [ ] API versioning
- [ ] API authentication token expiration
- [ ] Secure webhook verification
- [ ] Webhook signature validation
- [ ] Webhook replay prevention
- [ ] Idempotency for payment and critical operations
- [ ] Prevent API enumeration
- [ ] Prevent excessive data exposure
- [ ] Prevent unrestricted resource consumption
- [ ] Disable unnecessary endpoints
- [ ] Remove development endpoints
- [ ] Remove test endpoints
- [ ] Secure API documentation
- [ ] Disable public API debugging

### 1.4 Common Web Vulnerabilities

- [ ] OWASP Top 10 review
- [ ] Cross-Site Scripting (XSS)
- [ ] Cross-Site Request Forgery (CSRF)
- [ ] SQL Injection
- [ ] NoSQL Injection
- [ ] Server-Side Request Forgery (SSRF)
- [ ] Broken Access Control
- [ ] Security Misconfiguration
- [ ] Insecure Design
- [ ] Identification and Authentication Failures
- [ ] Cryptographic Failures
- [ ] Vulnerable and Outdated Components
- [ ] Security Logging and Monitoring Failures
- [ ] DOM-based XSS
- [ ] Clickjacking
- [ ] Open Redirect vulnerabilities
- [ ] HTTP Header Injection
- [ ] XML External Entity (XXE)
- [ ] Race Conditions
- [ ] Business Logic Vulnerabilities
- [ ] Cache Poisoning
- [ ] HTTP Request Smuggling
- [ ] Prototype Pollution
- [ ] ReDoS
- [ ] File Inclusion vulnerabilities
- [ ] Unsafe deserialization
- [ ] Insecure file uploads

## 2. Database Security

- [ ] Database authentication enabled
- [ ] Database not publicly accessible
- [ ] Restrict database network access
- [ ] Strong database credentials
- [ ] Separate database users for different services
- [ ] Least-privilege database permissions
- [ ] No unrestricted database access from clients
- [ ] Database security rules reviewed
- [ ] Tenant isolation enforced at database level
- [ ] Row-level security (RLS) where supported
- [ ] Database query validation
- [ ] Parameterized queries
- [ ] Protection against injection
- [ ] Sensitive field encryption
- [ ] Encryption at rest
- [ ] Encryption in transit
- [ ] Secure database indexes
- [ ] Database connection limits
- [ ] Connection pooling
- [ ] Transaction integrity
- [ ] Atomic operations for critical workflows
- [ ] Migration validation
- [ ] Migration rollback strategy
- [ ] Database schema documentation
- [ ] Referential integrity
- [ ] Data consistency checks
- [ ] Prevent unauthorized bulk exports
- [ ] Prevent unauthorized bulk deletions
- [ ] Audit sensitive database changes
- [ ] Automated backups
- [ ] Backup encryption
- [ ] Backup access restrictions
- [ ] Backup restoration testing
- [ ] Disaster recovery procedure
- [ ] Database retention policies
- [ ] Secure deletion of expired records

## 3. Cloud Infrastructure & Hosting Security

- [ ] Secure cloud account configuration
- [ ] MFA on cloud administrator accounts
- [ ] Least-privilege IAM policies
- [ ] Separate production and development environments
- [ ] Separate staging and production databases
- [ ] Secure environment variables
- [ ] No exposed cloud credentials
- [ ] No public storage buckets unless intentional
- [ ] Storage access policies reviewed
- [ ] Secure cloud functions
- [ ] Secure serverless endpoints
- [ ] Secure container configurations
- [ ] Container image scanning
- [ ] Operating system security updates
- [ ] Server firewall configuration
- [ ] Network segmentation
- [ ] Private networking where appropriate
- [ ] DDoS protection
- [ ] WAF configuration
- [ ] HTTPS enforced
- [ ] TLS 1.2 or newer
- [ ] Valid SSL certificates
- [ ] Automatic certificate renewal
- [ ] Secure DNS configuration
- [ ] DNSSEC where appropriate
- [ ] Secure CDN configuration
- [ ] HTTP security headers
- [ ] HSTS
- [ ] Content Security Policy (CSP)
- [ ] X-Content-Type-Options
- [ ] Referrer-Policy
- [ ] Permissions-Policy
- [ ] Remove unnecessary exposed ports
- [ ] Remove default credentials
- [ ] Disable unnecessary services
- [ ] Infrastructure configuration scanning
- [ ] Cloud activity monitoring
- [ ] Cloud cost alerts
- [ ] Resource usage limits
- [ ] Infrastructure recovery plan

## 4. Secrets & Credential Management

- [ ] No API keys in source code
- [ ] No passwords in source code
- [ ] No private keys in repositories
- [ ] No Firebase service account JSON files committed
- [ ] No database credentials in frontend code
- [ ] No payment gateway secrets exposed
- [ ] No third-party access tokens exposed
- [ ] Environment variables managed securely
- [ ] Secret manager used where appropriate
- [ ] Separate development and production secrets
- [ ] Secret rotation policy
- [ ] Credential expiration policy
- [ ] Revoke unused API keys
- [ ] Rotate potentially compromised credentials
- [ ] Git history scanned for leaked secrets
- [ ] Build artifacts scanned for secrets
- [ ] Mobile application binaries checked for exposed credentials
- [ ] Browser bundles checked for sensitive values
- [ ] Logs checked for leaked tokens
- [ ] Crash reports checked for sensitive information

## 5. Software Architecture

### 5.1 Architecture Design

- [ ] Architecture documented
- [ ] Clear separation of concerns
- [ ] Modular architecture
- [ ] Defined application boundaries
- [ ] Defined business logic boundaries
- [ ] Defined data access boundaries
- [ ] Defined presentation boundaries
- [ ] Consistent dependency direction
- [ ] Avoid unnecessary circular dependencies
- [ ] Avoid tightly coupled modules
- [ ] Reusable components
- [ ] Reusable business services
- [ ] Consistent naming conventions
- [ ] Consistent folder structure
- [ ] Defined coding standards
- [ ] Defined architectural patterns
- [ ] Documented system dependencies
- [ ] Documented external integrations
- [ ] Documented critical workflows
- [ ] Documented data flows
- [ ] Documented trust boundaries
- [ ] Architecture Decision Records (ADR)
- [ ] Scalability considerations
- [ ] Maintainability considerations
- [ ] Fault isolation
- [ ] Graceful degradation
- [ ] Avoid unnecessary microservices
- [ ] Avoid unnecessary architectural complexity

### 5.2 Backend Architecture

- [ ] Business logic separated from controllers
- [ ] Services separated from repositories
- [ ] Centralized validation
- [ ] Centralized error handling
- [ ] Centralized authorization
- [ ] Consistent API response structure
- [ ] Consistent exception handling
- [ ] Transaction management
- [ ] Background job handling
- [ ] Queue management where necessary
- [ ] Retry mechanisms
- [ ] Idempotent critical operations
- [ ] Timeout configuration
- [ ] Circuit breakers where appropriate
- [ ] Graceful service shutdown
- [ ] Health check endpoints
- [ ] Dependency injection
- [ ] Avoid duplicated business logic
- [ ] Avoid unnecessary global state

### 5.3 Frontend Architecture

- [ ] Reusable UI components
- [ ] Consistent design system
- [ ] Centralized state management
- [ ] Predictable state transitions
- [ ] Proper routing architecture
- [ ] Protected routes
- [ ] Deep-link security
- [ ] Consistent API client
- [ ] Centralized error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Offline states
- [ ] Network failure handling
- [ ] Form validation
- [ ] Input sanitization
- [ ] Responsive layouts
- [ ] Accessible UI
- [ ] No business logic dependent on hidden UI elements
- [ ] No sensitive authorization logic exclusively in frontend
- [ ] Avoid duplicated widgets
- [ ] Avoid oversized components

## 6. AI Agent & Vibe Coding Security

_Critical for AI-generated software_

### 6.1 AI Agent Permissions

- [ ] Never give AI agents unrestricted production access
- [ ] Never give agents unrestricted cloud administrator permissions
- [ ] Never expose production secrets unnecessarily
- [ ] Restrict agent filesystem access
- [ ] Restrict agent terminal permissions
- [ ] Restrict database access
- [ ] Restrict deployment permissions
- [ ] Restrict destructive commands
- [ ] Require approval for production deployments
- [ ] Require approval for database migrations
- [ ] Require approval for destructive database operations
- [ ] Require approval for security configuration changes
- [ ] Require approval for payment logic changes
- [ ] Require approval for authentication changes
- [ ] Require approval for authorization changes
- [ ] Maintain agent activity logs
- [ ] Review AI-generated dependencies
- [ ] Review AI-generated security configurations
- [ ] Review AI-generated database rules
- [ ] Review AI-generated backend functions
- [ ] Review AI-generated authentication flows
- [ ] Review AI-generated payment integrations
- [ ] Review AI-generated deployment scripts
- [ ] Prevent agents from silently disabling security controls
- [ ] Prevent agents from bypassing tests
- [ ] Prevent agents from weakening validation
- [ ] Prevent agents from deleting existing functionality without approval

### 6.2 AI-Generated Code Verification

- [ ] Review all security-sensitive generated code
- [ ] Verify generated code actually works
- [ ] Verify generated code matches architecture
- [ ] Verify generated code follows project conventions
- [ ] Check for duplicated implementations
- [ ] Check for unnecessary dependencies
- [ ] Check for insecure shortcuts
- [ ] Check for hardcoded values
- [ ] Check for fake authentication
- [ ] Check for frontend-only authorization
- [ ] Check for mock APIs in production
- [ ] Check for placeholder data
- [ ] Check for fake success responses
- [ ] Check for swallowed exceptions
- [ ] Check for disabled security rules
- [ ] Check for overly broad permissions
- [ ] Check for unexpected code deletion
- [ ] Check for unexpected schema changes
- [ ] Check for hidden external network calls
- [ ] Check for suspicious package installation scripts
- [ ] Check for unreviewed generated files

### 6.3 Prompt Injection & Agent Supply Chain

- [ ] Treat external documents as untrusted input
- [ ] Treat website content as untrusted input
- [ ] Treat repository instructions as untrusted until verified
- [ ] Prevent prompt injection through uploaded files
- [ ] Prevent prompt injection through issue descriptions
- [ ] Prevent prompt injection through pull requests
- [ ] Prevent malicious MCP tool instructions
- [ ] Review third-party agent tools
- [ ] Review MCP server permissions
- [ ] Restrict tool access to required operations
- [ ] Validate agent-generated shell commands
- [ ] Prevent agents from exfiltrating secrets
- [ ] Prevent unauthorized outbound network access
- [ ] Require human approval for high-impact actions

## 7. Code Quality & Clean Code

- [ ] Follow language-specific conventions
- [ ] Consistent formatting
- [ ] Consistent naming
- [ ] Meaningful variable names
- [ ] Meaningful function names
- [ ] Small, focused functions
- [ ] Single Responsibility Principle
- [ ] DRY principle
- [ ] SOLID principles where appropriate
- [ ] Avoid unnecessary abstractions
- [ ] Avoid unnecessary code duplication
- [ ] Avoid dead code
- [ ] Remove unused imports
- [ ] Remove unused dependencies
- [ ] Remove commented-out code
- [ ] Remove debug statements
- [ ] Remove console logs containing sensitive information
- [ ] Remove temporary test code
- [ ] Remove placeholder implementations
- [ ] Remove fake data from production
- [ ] No unexplained magic numbers
- [ ] Consistent error handling
- [ ] No empty catch blocks
- [ ] No ignored exceptions
- [ ] No unhandled asynchronous operations
- [ ] No memory leaks
- [ ] No resource leaks
- [ ] No unnecessary rebuilds
- [ ] No unnecessary database queries
- [ ] No unbounded loops
- [ ] No uncontrolled recursion
- [ ] No unnecessary dependencies
- [ ] No circular dependencies
- [ ] Static analysis passes
- [ ] Linting passes
- [ ] Formatting checks pass
- [ ] Type checking passes
- [ ] No unexplained warnings
- [ ] No critical technical debt left undocumented

## 8. Dependency & Software Supply Chain Security

- [ ] Dependency inventory
- [ ] Dependency vulnerability scanning
- [ ] Outdated package scanning
- [ ] Malicious package detection
- [ ] Typosquatting checks
- [ ] Package publisher verification
- [ ] Dependency license verification
- [ ] Lockfiles committed
- [ ] Reproducible builds
- [ ] Remove unused packages
- [ ] Remove abandoned packages where practical
- [ ] Review transitive dependencies
- [ ] Pin critical dependencies appropriately
- [ ] Review package installation scripts
- [ ] Scan container images
- [ ] Scan third-party SDKs
- [ ] Review external API providers
- [ ] Review analytics SDK permissions
- [ ] Review advertising SDK permissions
- [ ] Software Bill of Materials (SBOM)
- [ ] Automated dependency update monitoring
- [ ] Vulnerability remediation process
- [ ] Software signing and provenance where supported

## 9. Testing & Quality Assurance

### 9.1 Functional Testing

- [ ] Registration tests
- [ ] Login tests
- [ ] Logout tests
- [ ] Password reset tests
- [ ] Profile update tests
- [ ] CRUD operation tests
- [ ] Role permission tests
- [ ] Admin functionality tests
- [ ] Payment tests
- [ ] Subscription tests
- [ ] Notification tests
- [ ] File upload tests
- [ ] File download tests
- [ ] Search tests
- [ ] Filtering tests
- [ ] Reporting tests
- [ ] Export tests
- [ ] Offline functionality tests
- [ ] Synchronization tests
- [ ] Multi-device tests

### 9.2 Security Testing

- [ ] Authentication bypass testing
- [ ] Authorization bypass testing
- [ ] Privilege escalation testing
- [ ] IDOR testing
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] SSRF testing
- [ ] API fuzz testing
- [ ] Rate limit testing
- [ ] File upload attack testing
- [ ] Session security testing
- [ ] Token security testing
- [ ] Database rule testing
- [ ] Tenant isolation testing
- [ ] Webhook security testing
- [ ] Payment manipulation testing
- [ ] Business logic abuse testing
- [ ] Automated penetration testing
- [ ] Manual penetration testing
- [ ] Independent security assessment for high-risk products

### 9.3 Performance Testing

- [ ] Load testing
- [ ] Stress testing
- [ ] Spike testing
- [ ] Endurance testing
- [ ] Concurrent user testing
- [ ] Database performance testing
- [ ] API response time testing
- [ ] Memory usage testing
- [ ] CPU usage testing
- [ ] Network usage testing
- [ ] Cold start testing
- [ ] Large dataset testing
- [ ] Slow internet testing
- [ ] Low-end device testing
- [ ] Battery consumption testing
- [ ] Application startup testing
- [ ] Image loading optimization
- [ ] Pagination testing
- [ ] Cache performance testing

### 9.4 Cross-Platform Testing

- [ ] Android testing
- [ ] iOS testing
- [ ] Windows browser testing
- [ ] macOS browser testing
- [ ] Chrome testing
- [ ] Safari testing
- [ ] Firefox testing
- [ ] Edge testing
- [ ] Mobile responsive testing
- [ ] Tablet responsive testing
- [ ] Desktop responsive testing
- [ ] Different screen resolutions
- [ ] Different operating system versions
- [ ] Accessibility testing
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

## 10. Data Protection & Privacy

- [ ] Data inventory
- [ ] Data classification
- [ ] Personal data identification
- [ ] Sensitive data identification
- [ ] Data minimization
- [ ] Purpose limitation
- [ ] Consent management
- [ ] Privacy notice
- [ ] Data retention policy
- [ ] Data deletion policy
- [ ] User data export
- [ ] Account deletion functionality
- [ ] Data access controls
- [ ] Data encryption
- [ ] Sensitive data masking
- [ ] Secure file storage
- [ ] Secure data transmission
- [ ] Third-party data sharing disclosure
- [ ] Privacy settings
- [ ] Children’s data protection where applicable
- [ ] Data breach response plan
- [ ] Data breach notification process
- [ ] Privacy impact assessment where required
- [ ] Cross-border data transfer review
- [ ] Employee access restrictions
- [ ] Production data access logging
- [ ] No personal information in public logs
- [ ] No sensitive information in analytics events

## 11. Legal & Regulatory Compliance

### 11.1 Uganda Legal Requirements

- [ ] Uganda Data Protection and Privacy Act, 2019
- [ ] Data Protection and Privacy Regulations, 2021
- [ ] Personal Data Protection Office (PDPO) requirements
- [ ] Assess whether PDPO registration is required
- [ ] Data controller/processor obligations
- [ ] Data subject rights procedures
- [ ] Lawful basis for data processing
- [ ] Consent requirements
- [ ] Data processing agreements
- [ ] Cross-border data transfer compliance
- [ ] Data breach reporting obligations
- [ ] Electronic Transactions Act, 2011
- [ ] Electronic Signatures Act, 2011
- [ ] Computer Misuse Act, 2011, as amended
- [ ] Consumer protection obligations
- [ ] Electronic payment requirements where applicable
- [ ] Uganda Revenue Authority tax obligations
- [ ] Business registration and licensing
- [ ] Sector-specific regulatory requirements
- [ ] Employment and contractor agreements where applicable

### 11.2 Website & Application Legal Documents

- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy
- [ ] Refund Policy
- [ ] Subscription Policy
- [ ] Cancellation Policy
- [ ] Acceptable Use Policy
- [ ] Community Guidelines where applicable
- [ ] Data Processing Agreement
- [ ] Service Level Agreement where applicable
- [ ] Intellectual Property Policy
- [ ] Copyright notice
- [ ] Disclaimer
- [ ] Third-party service disclosures
- [ ] AI usage disclosure where applicable
- [ ] User-generated content policy
- [ ] Account suspension policy
- [ ] Account termination policy
- [ ] Contact and complaints information
- [ ] Clear pricing disclosure
- [ ] Automatic renewal disclosure
- [ ] Clear trial-to-paid conversion terms

### 11.3 International Compliance Where Applicable

- [ ] GDPR
- [ ] UK GDPR
- [ ] EU ePrivacy requirements
- [ ] California CCPA/CPRA
- [ ] COPPA
- [ ] PCI DSS
- [ ] HIPAA
- [ ] SOC 2 requirements
- [ ] ISO 27001
- [ ] ISO 27701
- [ ] Accessibility regulations
- [ ] App Store legal requirements
- [ ] Google Play legal requirements
- [ ] Country-specific consumer protection laws
- [ ] Country-specific tax requirements

## 12. Payments & Financial Security

- [ ] Use reputable payment providers
- [ ] Never store raw card details unnecessarily
- [ ] Use payment tokenization
- [ ] Verify payments server-side
- [ ] Verify payment webhook signatures
- [ ] Verify transaction amounts
- [ ] Verify transaction currency
- [ ] Verify transaction ownership
- [ ] Verify transaction status
- [ ] Prevent duplicate payments
- [ ] Prevent duplicate payment processing
- [ ] Implement idempotency
- [ ] Prevent client-side payment manipulation
- [ ] Prevent subscription manipulation
- [ ] Prevent unauthorized refunds
- [ ] Prevent unauthorized discounts
- [ ] Prevent unauthorized free subscriptions
- [ ] Prevent unauthorized balance modifications
- [ ] Secure wallet operations
- [ ] Maintain financial transaction records
- [ ] Maintain payment audit trails
- [ ] Reconciliation process
- [ ] Failed payment handling
- [ ] Refund processing
- [ ] Chargeback handling
- [ ] Subscription expiration handling
- [ ] Payment failure notifications
- [ ] Currency conversion validation
- [ ] Tax calculation validation
- [ ] Financial report integrity

## 13. File Uploads & Storage

- [ ] Validate file extensions
- [ ] Validate MIME types
- [ ] Validate actual file signatures
- [ ] File size restrictions
- [ ] File name sanitization
- [ ] Randomized storage names
- [ ] Prevent path traversal
- [ ] Prevent executable file uploads
- [ ] Malware scanning where appropriate
- [ ] Image processing security
- [ ] Document processing security
- [ ] Private storage by default
- [ ] Signed download URLs
- [ ] Signed URL expiration
- [ ] Upload authorization
- [ ] Download authorization
- [ ] File ownership verification
- [ ] File deletion authorization
- [ ] Storage quotas
- [ ] Prevent storage abuse
- [ ] Prevent unauthorized file enumeration
- [ ] Backup important files
- [ ] Retention and deletion policies

## 14. Logging, Monitoring & Incident Response

- [ ] Centralized application logging
- [ ] Centralized error monitoring
- [ ] Authentication event logging
- [ ] Failed login monitoring
- [ ] Privileged action logging
- [ ] Permission change logging
- [ ] Financial transaction logging
- [ ] Data deletion logging
- [ ] Sensitive data access logging
- [ ] Admin activity logging
- [ ] API abuse monitoring
- [ ] Unusual traffic detection
- [ ] Suspicious IP monitoring
- [ ] Error rate monitoring
- [ ] Database health monitoring
- [ ] Server health monitoring
- [ ] Application uptime monitoring
- [ ] Performance monitoring
- [ ] Crash reporting
- [ ] Alert notifications
- [ ] Log retention policy
- [ ] Log access restrictions
- [ ] Log tamper protection
- [ ] No secrets in logs
- [ ] Incident response plan
- [ ] Security incident escalation
- [ ] Breach containment procedure
- [ ] Credential revocation procedure
- [ ] Recovery procedure
- [ ] Post-incident review
- [ ] Security incident documentation

## 15. Backup & Disaster Recovery

- [ ] Automated database backups
- [ ] Automated file backups
- [ ] Backup encryption
- [ ] Offsite backups
- [ ] Backup access restrictions
- [ ] Backup retention policy
- [ ] Multiple backup generations
- [ ] Backup integrity verification
- [ ] Restore testing
- [ ] Disaster recovery documentation
- [ ] Recovery Time Objective (RTO)
- [ ] Recovery Point Objective (RPO)
- [ ] Database point-in-time recovery where available
- [ ] Infrastructure recovery procedure
- [ ] Application redeployment procedure
- [ ] Domain recovery procedure
- [ ] Cloud account recovery procedure
- [ ] Business continuity plan

## 16. Application Performance & User Experience

- [ ] Fast application startup
- [ ] Optimized frontend bundles
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Responsive images
- [ ] Font optimization
- [ ] Caching strategy
- [ ] CDN configuration
- [ ] Database query optimization
- [ ] Pagination
- [ ] Virtualized long lists
- [ ] Efficient state management
- [ ] Avoid unnecessary API calls
- [ ] Avoid unnecessary database reads
- [ ] Avoid unnecessary database writes
- [ ] Offline handling
- [ ] Retry handling
- [ ] Network timeout handling
- [ ] Graceful error messages
- [ ] Accessibility compliance
- [ ] Color contrast checks
- [ ] Screen reader support
- [ ] Keyboard accessibility
- [ ] Clear navigation
- [ ] Consistent UI components
- [ ] No broken links
- [ ] No broken images
- [ ] No dead buttons
- [ ] No misleading success messages
- [ ] No unexplained loading screens

## 17. Mobile Application Security

- [ ] Secure local storage
- [ ] Keychain/Keystore for sensitive credentials
- [ ] No plaintext tokens in local databases
- [ ] No sensitive information in SharedPreferences
- [ ] Secure offline cache
- [ ] Local database encryption where appropriate
- [ ] Secure synchronization
- [ ] Secure deep links
- [ ] Certificate validation
- [ ] No disabled TLS certificate validation
- [ ] Root/jailbreak risk assessment
- [ ] Screenshot protection for particularly sensitive screens where appropriate
- [ ] Clipboard exposure assessment
- [ ] Keyboard input exposure assessment
- [ ] App background data protection
- [ ] Secure push notification payloads
- [ ] No sensitive data in push notifications
- [ ] Secure app permissions
- [ ] Remove unnecessary device permissions
- [ ] Release build security
- [ ] Debug mode disabled
- [ ] Obfuscation where appropriate
- [ ] Symbol files securely retained
- [ ] Mobile binary analysis
- [ ] App signing security
- [ ] Signing key backup
- [ ] Store release configuration verified

## 18. Notifications & Communication

- [ ] Secure email integration
- [ ] Secure WhatsApp integration
- [ ] Secure SMS integration
- [ ] Secure push notifications
- [ ] Verify notification ownership
- [ ] Prevent notification spoofing
- [ ] Rate limit notification sending
- [ ] Prevent notification abuse
- [ ] User notification preferences
- [ ] Consent for marketing communications
- [ ] Unsubscribe functionality
- [ ] Secure email verification links
- [ ] Secure notification tokens
- [ ] Avoid sensitive information in messages
- [ ] Delivery failure handling
- [ ] Retry management
- [ ] Communication logs
- [ ] Third-party messaging provider compliance

## 19. Search, Reporting & Data Exports

- [ ] Search authorization
- [ ] Search input validation
- [ ] Search rate limiting
- [ ] Prevent unauthorized data discovery
- [ ] Report authorization
- [ ] Export authorization
- [ ] Export rate limiting
- [ ] Large export protection
- [ ] CSV injection protection
- [ ] PDF generation security
- [ ] Excel generation security
- [ ] Sensitive data masking
- [ ] Secure temporary files
- [ ] Export expiration
- [ ] Audit data exports

## 20. SEO & Website Deployment

- [ ] Correct domain configuration
- [ ] HTTPS enforced
- [ ] Canonical URLs
- [ ] XML sitemap
- [ ] Robots.txt
- [ ] Metadata
- [ ] Open Graph tags
- [ ] Structured data validation
- [ ] Search engine indexing settings
- [ ] No accidental indexing of admin pages
- [ ] No accidental indexing of private pages
- [ ] No secrets in public JavaScript
- [ ] No exposed source maps containing sensitive information
- [ ] Broken link checks
- [ ] Redirect validation
- [ ] Custom 404 page
- [ ] Custom error pages
- [ ] Cookie consent where required
- [ ] Privacy links
- [ ] Terms links
- [ ] Contact information
- [ ] Domain renewal configuration
- [ ] DNS recovery access
- [ ] Website availability monitoring

## 21. CI/CD & Deployment Pipeline

- [ ] Version control enabled
- [ ] Protected production branch
- [ ] Pull request reviews
- [ ] Automated tests before merging
- [ ] Automated linting
- [ ] Automated type checking
- [ ] Automated security scanning
- [ ] Dependency scanning
- [ ] Secret scanning
- [ ] Build verification
- [ ] Staging environment
- [ ] Production environment separation
- [ ] Deployment approval
- [ ] Deployment logs
- [ ] Rollback mechanism
- [ ] Database migration strategy
- [ ] Environment-specific configurations
- [ ] Release versioning
- [ ] Release notes
- [ ] Build artifact verification
- [ ] Production smoke tests
- [ ] Post-deployment monitoring
- [ ] Deployment access control
