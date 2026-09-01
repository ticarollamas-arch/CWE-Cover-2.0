import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  Eye, 
  Code, 
  Globe, 
  Lock, 
  ShieldCheck
} from 'lucide-react';

interface ParsedFinding {
  title: string;
  target: string;
  cwe: string;
  severity: 'Crítica' | 'Alta' | 'Média' | 'Baixa' | 'Info';
  confidence: number;
  description: string;
  stepsToReproduce: string[];
  pocCurl: string;
  headers: string[];
  impact: string;
  remediation: string;
  references: string[];
}

const TEMPLATES: { id: string; name: string; cwe: string; severity: 'Crítica' | 'Alta' | 'Média' | 'Baixa' | 'Info'; markdown: string }[] = [
  {
    id: 'cwe-693-csp',
    name: 'CWE-693: Missing CSP & Clickjacking (English)',
    cwe: 'CWE-693',
    severity: 'Média',
    markdown: `# Missing Content-Security-Policy & Clickjacking Protection

**Target:** https://example.com/login
**CWE:** CWE-693 (Protection Mechanism Failure)
**Severity:** Medium
**Confidence:** 0.95

### Description
The web application does not implement crucial defensive HTTP security response headers, specifically missing Content-Security-Policy (CSP) and X-Frame-Options (or frame-ancestors directive). This leaves authenticated user workflows susceptible to UI redressing (Clickjacking) and unauthorized script execution.

### Steps to Reproduce
1. Send an HTTP GET request to the target endpoint:
\`\`\`bash
curl -I -s -X GET "https://example.com/login" -H "User-Agent: Mozilla/5.0"
\`\`\`
2. Inspect the HTTP response headers.
3. Observe the total absence of \`Content-Security-Policy\` and \`X-Frame-Options\`.
4. Host a local proof-of-concept HTML file embedding the login page within an \`<iframe>\`.

### PoC / Raw Response Headers
\`\`\`http
HTTP/1.1 200 OK
Date: Thu, 27 Aug 2026 18:00:00 GMT
Server: nginx/1.24.0
Content-Type: text/html; charset=UTF-8
Connection: keep-alive
X-Powered-By: PHP/8.2.14
\`\`\`

### Impact
An attacker can frame the sensitive authentication or profile page in an invisible iframe on a malicious website, tricking authenticated users into clicking concealed action buttons (Clickjacking).

### Remediation
1. Implement a robust \`Content-Security-Policy\` header with \`frame-ancestors 'self'\` or authorized origins.
2. Add \`X-Frame-Options: DENY\` or \`SAMEORIGIN\` for legacy browser compatibility.
3. Ensure \`Strict-Transport-Security\` (HSTS) with \`includeSubDomains\` is enforced.

### References
- https://cwe.mitre.org/data/definitions/693.html
- https://owasp.org/www-project-secure-headers/`
  },
  {
    id: 'cwe-200-env',
    name: 'CWE-200: Environment File Leak (.env / .git)',
    cwe: 'CWE-200',
    severity: 'Alta',
    markdown: `# Information Exposure through Exposed .env Configuration File

**Target:** https://api.example.com/.env
**CWE:** CWE-200 (Information Exposure)
**Severity:** High
**Confidence:** 1.0

### Description
During passive endpoint enumeration with cwe-discover, the public root was found exposing the configuration file \`.env\`. The file discloses production database credentials, AWS access keys, and internal API tokens in plaintext.

### Steps to Reproduce
1. Execute a passive HTTP GET request against the exposed configuration file:
\`\`\`bash
curl -i -s "https://api.example.com/.env"
\`\`\`
2. Verify that the response returns HTTP status \`200 OK\` with \`text/plain\` content.
3. Observe live configuration variables: \`DB_PASSWORD\`, \`JWT_SECRET\`, and \`AWS_SECRET_KEY\`.

### PoC / Raw Evidence
\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 342

DB_HOST=10.0.4.12
DB_USER=root
DB_PASSWORD=RedactedSuperSecret123!
JWT_SECRET=b79f82c091ad4683
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
\`\`\`

### Impact
Complete compromise of backend infrastructure, unauthorized read/write database access, and potential lateral movement across cloud services.

### Remediation
1. Immediately restrict public access to hidden files (\`.*\` like \`.env\`, \`.git\`, \`.env.backup\`) in the web server configuration.
2. Revoke and rotate all leaked API keys, tokens, and database passwords immediately.`
  },
  {
    id: 'cwe-22-traversal',
    name: 'CWE-22: Path Traversal with Soft-404 Analysis',
    cwe: 'CWE-22',
    severity: 'Alta',
    markdown: `# Path Traversal Risk & Sensitive Backup Archive Exposure

**Target:** https://app.example.com/download?file=..%2F..%2Fetc%2Fpasswd
**CWE:** CWE-22 (Improper Limitation of a Pathname)
**Severity:** High
**Confidence:** 0.85

### Description
Passive parameter inspection and archive verification identified potential path traversal sequences and unlinked backup archives (\`backup.tar.gz\`, \`config.php.bak\`). The target does not enforce canonical path validation before retrieving file streams.

### Steps to Reproduce
1. Send an HTTP request targeting the download parameter:
\`\`\`bash
curl -s -X GET "https://app.example.com/download?file=../../../../etc/passwd" -H "Accept: text/plain"
\`\`\`
2. Check for differential responses compared to standard 404 pages (eliminating Soft-404 false positives).
3. Validate that standard system account entries (\`root:x:0:0...\`) are returned.

### PoC Evidence
\`\`\`text
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
\`\`\`

### Impact
Arbitrary file read on the operating system, disclosure of source code, configuration files, and authentication hashes.

### Remediation
1. Do not pass user-supplied file paths directly to filesystem operations.
2. Use hardcoded allowlists of permitted file identifiers (e.g., UUIDs or database IDs).
3. Use path canonicalization and verify base directories.`
  },
  {
    id: 'cwe-352-csrf',
    name: 'CWE-352: CSRF in Password Change Endpoint',
    cwe: 'CWE-352',
    severity: 'Média',
    markdown: `# Cross-Site Request Forgery (CSRF) in Password Reset Action

**Target:** https://example.com/account/change-password
**CWE:** CWE-352 (Cross-Site Request Forgery)
**Severity:** Medium
**Confidence:** 0.90

### Description
The form action located at \`/account/change-password\` accepts \`POST\` requests without validating an anti-CSRF token or verifying the \`SameSite\` cookie attribute on authentication session cookies.

### Steps to Reproduce
1. Login to an active user session on \`example.com\`.
2. Inspect the HTTP POST form sent when updating passwords:
\`\`\`http
POST /account/change-password HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Cookie: session_id=f48b99120a...

new_password=HackerPwned123&confirm_password=HackerPwned123
\`\`\`
3. Notice there is no \`csrf_token\` parameter in the payload or custom header.

### Impact
An attacker can force authenticated users to modify their account password simply by visiting a malicious webpage, leading to complete account takeover.

### Remediation
1. Implement unique, cryptographically random Anti-CSRF tokens per session / request (Synchronizer Token Pattern).
2. Set \`SameSite=Lax\` or \`SameSite=Strict\` on all session cookies.`
  },
  {
    id: 'blank',
    name: 'Custom / Blank Markdown Note',
    cwe: 'CWE-693',
    severity: 'Média',
    markdown: `# Security Finding Title

**Target:** https://target.com/path
**CWE:** CWE-200
**Severity:** Medium
**Confidence:** 0.9

### Description
Detailed description of the security observation, header missing, or passive discovery finding.

### Steps to Reproduce
1. Execute curl command:
\`\`\`bash
curl -I "https://target.com"
\`\`\`
2. Analyze the output response.

### Impact
Explain the confidentiality, integrity, or availability risk to the application and its users.

### Remediation
Specific technical steps required by developers to fix this issue.`
  }
];

export default function ReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('cwe-693-csp');
  const [rawInput, setRawInput] = useState<string>(TEMPLATES[0].markdown);
  const [outputFormat, setOutputFormat] = useState<'hackerone' | 'bugcrowd' | 'executive' | 'html' | 'json' | 'csv'>('hackerone');
  const [reportLang, setReportLang] = useState<'en' | 'pt'>('en');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  // Parse raw English markdown text on the fly without any API
  const parsed = useMemo<ParsedFinding>(() => {
    const text = rawInput;

    const titleMatch = text.match(/^#\s+(.+)$/m) || text.match(/Title:\s*(.+)$/im);
    const title = titleMatch ? titleMatch[1].trim() : 'Passive Reconnaissance Finding';

    const targetMatch = text.match(/\*\*Target:\*\*\s*(.+)$/im) || text.match(/Target:\s*([^\n\r]+)/i) || text.match(/https?:\/\/[^\s"'`<>]+/i);
    const target = targetMatch ? targetMatch[1]?.trim() || targetMatch[0] : 'https://target-example.com';

    const cweMatch = text.match(/(CWE-\d+)/i) || text.match(/\*\*CWE:\*\*\s*([^\n\r]+)/i);
    const cwe = cweMatch ? (cweMatch[1]?.toUpperCase() || 'CWE-693') : 'CWE-693';

    let severity: 'Crítica' | 'Alta' | 'Média' | 'Baixa' | 'Info' = 'Média';
    const sevMatch = text.match(/\*\*Severity:\*\*\s*([^\n\r]+)/i) || text.match(/Severity:\s*([^\n\r]+)/i);
    if (sevMatch) {
      const s = sevMatch[1].toLowerCase();
      if (s.includes('crit') || s.includes('p1')) severity = 'Crítica';
      else if (s.includes('high') || s.includes('alta') || s.includes('p2')) severity = 'Alta';
      else if (s.includes('med') || s.includes('p3')) severity = 'Média';
      else if (s.includes('low') || s.includes('baixa') || s.includes('p4')) severity = 'Baixa';
      else if (s.includes('info') || s.includes('p5')) severity = 'Info';
    }

    const confMatch = text.match(/Confidence:\s*([\d.]+)/i) || text.match(/\*\*Confidence:\*\*\s*([\d.]+)/i);
    const confidence = confMatch ? parseFloat(confMatch[1]) : 0.90;

    const extractSection = (headingRegex: RegExp, nextHeadingsRegex: RegExp): string => {
      const start = text.search(headingRegex);
      if (start === -1) return '';
      const afterStart = text.slice(start);
      const matchStart = afterStart.match(headingRegex);
      if (!matchStart) return '';
      const contentStart = matchStart[0].length;
      const rest = afterStart.slice(contentStart);
      const nextMatch = rest.search(nextHeadingsRegex);
      if (nextMatch === -1) return rest.trim();
      return rest.slice(0, nextMatch).trim();
    };

    const nextSectionRegex = /(?:^###?\s+|\n###?\s+)/m;

    const descRaw = extractSection(/###?\s+(?:Description|Descrição|Overview|Summary)/i, nextSectionRegex);
    const description = descRaw || 'Passive inspection revealed anomalies in response headers and exposed assets.';

    const stepsRaw = extractSection(/###?\s+(?:Steps to Reproduce|Passos para Reproduzir|Reproduction Steps)/i, nextSectionRegex);
    const stepsToReproduce = stepsRaw
      ? stepsRaw.split(/\n(?=\d+\.|\-|\*)/).map(s => s.trim()).filter(Boolean)
      : [
          `Execute passive reconnaissance scan against ${target}`,
          `Inspect the HTTP response headers and structure.`,
          `Verify the lack of defensive mitigation mechanisms.`
        ];

    const pocMatch = text.match(/```(?:bash|sh|http|text)?\n([\s\S]*?)```/);
    const pocCurl = pocMatch ? pocMatch[1].trim() : `curl -I -s "${target}"`;

    const impactRaw = extractSection(/###?\s+(?:Impact|Impacto|Business Impact)/i, nextSectionRegex);
    const impact = impactRaw || 'Allows attackers to bypass standard defensive constraints or expose sensitive context.';

    const remRaw = extractSection(/###?\s+(?:Remediation|Remediação|Mitigation|Mitigação|How to Fix|Fix)/i, nextSectionRegex);
    const remediation = remRaw || 'Configure modern defensive HTTP headers and restrict unauthorized public asset paths.';

    const refLines = (text.match(/https?:\/\/[^\s"'`<>]+/g) || [])
      .filter(u => u.includes('cwe.mitre.org') || u.includes('owasp.org') || u.includes('hackerone.com') || u.includes('portswigger.net'));
    const references = refLines.length > 0 ? Array.from(new Set(refLines)) : [
      'https://cwe.mitre.org/data/definitions/693.html',
      'https://owasp.org/www-project-secure-headers/'
    ];

    return {
      title,
      target,
      cwe,
      severity,
      confidence,
      description,
      stepsToReproduce,
      pocCurl,
      headers: ['Server: Nginx', 'Content-Type: text/html'],
      impact,
      remediation,
      references
    };
  }, [rawInput]);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    const t = TEMPLATES.find(x => x.id === id);
    if (t) {
      setRawInput(t.markdown);
    }
  };

  const getSeverityData = (sev: string) => {
    switch (sev) {
      case 'Crítica': return { cvss: '9.0 - 10.0', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', scoreBase: 9.5, h1: 'Critical' };
      case 'Alta': return { cvss: '7.0 - 8.9', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', scoreBase: 7.5, h1: 'High' };
      case 'Média': return { cvss: '4.0 - 6.9', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', scoreBase: 5.0, h1: 'Medium' };
      case 'Baixa': return { cvss: '0.1 - 3.9', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', scoreBase: 2.5, h1: 'Low' };
      default: return { cvss: '0.0', color: 'text-slate-400 bg-slate-800 border-slate-700', scoreBase: 1.0, h1: 'None' };
    }
  };

  const sevData = getSeverityData(parsed.severity);
  const calculatedRisk = (sevData.scoreBase * parsed.confidence).toFixed(2);

  const watermarkStamp = includeWatermark 
    ? `\n\n---\n> **Marca d'Água Oficial:** Suite gerada por cwe-discover (Carol Lamas • CyberHuntLab) — https://cwe-discover.cyberhuntlab.com.br` 
    : '';

  // Generate output texts
  const generatedReport = useMemo(() => {
    const isEn = reportLang === 'en';

    if (outputFormat === 'hackerone') {
      if (isEn) {
        return `## Summary
${parsed.description}

## Vulnerability Details
- **Target Asset:** \`${parsed.target}\`
- **Vulnerability Category:** ${parsed.cwe} (${parsed.title})
- **Severity Rating:** ${sevData.h1} (${parsed.severity})
- **Risk Score (cwe-discover formula):** ${calculatedRisk} (Severity ${sevData.scoreBase} × Confidence ${parsed.confidence})

## Steps to Reproduce
${parsed.stepsToReproduce.map((s, idx) => `${idx + 1}. ${s.replace(/^\d+\.\s*/, '')}`).join('\n')}

### Proof of Concept (PoC) & Evidence
\`\`\`bash
${parsed.pocCurl}
\`\`\`

## Impact
${parsed.impact}

## Remediation / Recommended Fix
${parsed.remediation}

## References
${parsed.references.map(r => `- ${r}`).join('\n')}${watermarkStamp}`;
      } else {
        return `## Resumo Executivo
${parsed.description}

## Detalhes da Vulnerabilidade
- **Alvo / Ativo:** \`${parsed.target}\`
- **Classificação CWE:** ${parsed.cwe} (${parsed.title})
- **Severidade:** ${parsed.severity} (CVSS: ${sevData.cvss})
- **Risk Score Calculado:** ${calculatedRisk} (Base ${sevData.scoreBase} × Confiança ${parsed.confidence})

## Passos para Reproduzir
${parsed.stepsToReproduce.map((s, idx) => `${idx + 1}. ${s.replace(/^\d+\.\s*/, '')}`).join('\n')}

### Prova de Conceito (PoC) & Requisição
\`\`\`bash
${parsed.pocCurl}
\`\`\`

## Impacto
${parsed.impact}

## Medidas Corretivas Recomendadas
${parsed.remediation}

## Referências Técnicas
${parsed.references.map(r => `- ${r}`).join('\n')}${watermarkStamp}`;
      }
    }

    if (outputFormat === 'bugcrowd') {
      return `**Vulnerability Title:** ${parsed.cwe} - ${parsed.title}
**Target URL:** ${parsed.target}
**VRT Classification:** Server Security Misconfiguration > ${parsed.cwe}
**Bugcrowd Priority:** ${parsed.severity === 'Crítica' ? 'P1' : parsed.severity === 'Alta' ? 'P2' : parsed.severity === 'Média' ? 'P3' : 'P4'}

### Description & Background
${parsed.description}

### Reproduction Steps
${parsed.stepsToReproduce.join('\n')}

### Proof of Concept Command
\`\`\`bash
${parsed.pocCurl}
\`\`\`

### Impact Assessment
${parsed.impact}

### Remediation Guidance
${parsed.remediation}${watermarkStamp}`;
    }

    if (outputFormat === 'executive') {
      return `# SECURITY ASSESSMENT REPORT: ${parsed.title.toUpperCase()}

**Document Version:** 1.0  
**Assessment Type:** Passive Attack Surface Analysis (Zero-Payload Inspection)  
**Evaluated Target:** ${parsed.target}  
**Date:** ${new Date().toISOString().split('T')[0]}  

---

## 1. Executive Summary
During the non-intrusive security analysis of **${parsed.target}**, a vulnerability categorized under **${parsed.cwe}** was detected with a severity rating of **${parsed.severity}**. 

The calculated Risk Score for this asset is **${calculatedRisk}/10.0**, considering a detection confidence factor of **${(parsed.confidence * 100).toFixed(0)}%**.

## 2. Technical Finding Details
| Parameter | Evaluated Value |
|:---|:---|
| **Vulnerability Class** | ${parsed.cwe} |
| **Title** | ${parsed.title} |
| **Severity / CVSS Range** | ${parsed.severity} (${sevData.cvss}) |
| **Detection Confidence** | ${parsed.confidence} |
| **Asset / URL** | \`${parsed.target}\` |

### 2.1 Description
${parsed.description}

### 2.2 Proof of Concept & Verification
To verify the finding independently, execute the following request:

\`\`\`bash
${parsed.pocCurl}
\`\`\`

## 3. Threat & Impact Modeling
${parsed.impact}

## 4. Corrective Action Plan
${parsed.remediation}

## 5. Security References
${parsed.references.map(r => `- [${r}](${r})`).join('\n')}${watermarkStamp}`;
    }

    if (outputFormat === 'html') {
      return `<!DOCTYPE html>
<html lang="${reportLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${parsed.cwe} Security Report - ${parsed.title}</title>
  <style>
    :root { color-scheme: dark; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #090d16; color: #e2e8f0; line-height: 1.6; padding: 24px 16px; max-width: 900px; margin: 0 auto; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-family: monospace; font-weight: bold; }
    .badge-high { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .card { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    pre { background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; overflow-x: auto; color: #34d399; font-family: monospace; font-size: 12px; }
    h1 { color: #f8fafc; font-size: 20px; margin-top: 0; }
    h2 { color: #38bdf8; font-size: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 6px; margin-top: 20px; }
    .footer { text-align: center; font-size: 11px; color: #64748b; margin-top: 30px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
      <span class="badge badge-high">${parsed.cwe} • ${parsed.severity.toUpperCase()}</span>
      <span style="font-family:monospace; font-size:12px; color:#94a3b8;">Risk Score: <strong>${calculatedRisk}</strong></span>
    </div>
    <h1>${parsed.title}</h1>
    <p><strong>Target:</strong> <code>${parsed.target}</code></p>
    
    <h2>Description</h2>
    <p>${parsed.description.replace(/\n/g, '<br>')}</p>

    <h2>Steps to Reproduce</h2>
    <ol>
      ${parsed.stepsToReproduce.map(s => `<li>${s.replace(/^\d+\.\s*/, '')}</li>`).join('')}
    </ol>

    <h2>Proof of Concept (PoC)</h2>
    <pre><code>${parsed.pocCurl}</code></pre>

    <h2>Impact</h2>
    <p>${parsed.impact.replace(/\n/g, '<br>')}</p>

    <h2>Remediation</h2>
    <p>${parsed.remediation.replace(/\n/g, '<br>')}</p>
  </div>
  <div class="footer">Marca d'Água: Gerado via cwe-discover (Carol Lamas • CyberHuntLab)</div>
</body>
</html>`;
    }

    if (outputFormat === 'json') {
      return JSON.stringify({
        schema_version: '1.0',
        generated_at: new Date().toISOString(),
        tool: 'cwe-discover',
        watermark: includeWatermark ? 'CyberHuntLab • Carol Lamas • https://cwe-discover.cyberhuntlab.com.br' : undefined,
        finding: {
          title: parsed.title,
          cwe: parsed.cwe,
          target: parsed.target,
          severity: parsed.severity,
          severity_score_base: sevData.scoreBase,
          confidence: parsed.confidence,
          risk_score: parseFloat(calculatedRisk),
          description: parsed.description,
          steps_to_reproduce: parsed.stepsToReproduce,
          poc_command: parsed.pocCurl,
          impact: parsed.impact,
          remediation: parsed.remediation,
          references: parsed.references
        }
      }, null, 2);
    }

    if (outputFormat === 'csv') {
      const sanitize = (s: string) => `"${s.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      return `cwe,title,target,severity,confidence,risk_score,description,impact,remediation,watermark\n${sanitize(parsed.cwe)},${sanitize(parsed.title)},${sanitize(parsed.target)},${sanitize(parsed.severity)},${parsed.confidence},${calculatedRisk},${sanitize(parsed.description)},${sanitize(parsed.impact)},${sanitize(parsed.remediation)},"CyberHuntLab/Carol Lamas"`;
    }

    return '';
  }, [parsed, outputFormat, reportLang, sevData, calculatedRisk, watermarkStamp, includeWatermark]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      hackerone: 'md',
      bugcrowd: 'md',
      executive: 'md',
      html: 'html',
      json: 'json',
      csv: 'csv'
    };
    const ext = extensions[outputFormat] || 'txt';
    const mimeTypes: Record<string, string> = {
      md: 'text/markdown',
      html: 'text/html',
      json: 'application/json',
      csv: 'text/csv'
    };

    const blob = new Blob([generatedReport], { type: mimeTypes[ext] || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cwe_discover_report_${parsed.cwe.toLowerCase()}_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="gerador-relatorio" className="py-10 sm:py-16 bg-slate-950 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] sm:text-xs font-mono text-emerald-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GERADOR DE RELATÓRIOS • 100% LOCAL & SEM API</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-mono">
              Gerador de Relatórios Bug Bounty
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Cole anotações em <strong>Markdown em inglês ou português</strong>. O parser integrado gera submissões prontas para <strong>HackerOne</strong>, <strong>Bugcrowd</strong>, <strong>HTML</strong> e <strong>Markdown Executivo</strong>.
            </p>
          </div>

          {/* Privacy Pill & Watermark Option */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 cursor-pointer">
              <input 
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="rounded accent-emerald-500 w-3.5 h-3.5"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Marca d'Água CyberHuntLab</span>
            </label>

            <div className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>100% Local</span>
            </div>
          </div>
        </div>

        {/* Template Selector Bar */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 sm:mb-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-3">
            <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Modelos Rápidos Pré-configurados:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReportLang(reportLang === 'en' ? 'pt' : 'en')}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono transition flex items-center gap-1"
                title="Alternar idioma de saída"
              >
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>Idioma: <strong className="text-emerald-400 uppercase">{reportLang}</strong></span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2">
            {TEMPLATES.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-left text-xs font-mono border transition flex items-center justify-between gap-2 ${
                  selectedTemplate === tmpl.id
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-bold shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="truncate">
                  <span className="text-slate-200 block truncate text-xs">{tmpl.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${
                  tmpl.severity === 'Alta' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  {tmpl.cwe}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dual Pane: Input Editor vs Generated Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* Left Column: Markdown Input */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Entrada em Markdown</span>
                </div>
                <button
                  onClick={() => setRawInput('')}
                  className="text-[11px] font-mono text-slate-500 hover:text-rose-400 transition"
                >
                  Limpar
                </button>
              </div>

              <div className="p-2 sm:p-3">
                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  className="w-full h-56 sm:h-80 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
                  placeholder="Cole seu rascunho de relatório aqui..."
                />
              </div>

              {/* Detected Metrics Bar */}
              <div className="px-3.5 py-2 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-slate-400">
                <span>CWE: <strong className="text-cyan-400">{parsed.cwe}</strong></span>
                <span>Severidade: <strong className={sevData.color.split(' ')[0]}>{parsed.severity}</strong></span>
                <span>Risk Score: <strong className="text-amber-400">{calculatedRisk}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Output Formats & Preview */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <div className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              
              {/* Output Control Tabs */}
              <div className="px-3 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: 'hackerone', label: 'HackerOne' },
                    { id: 'bugcrowd', label: 'Bugcrowd' },
                    { id: 'executive', label: 'Executivo' },
                    { id: 'html', label: 'HTML' },
                    { id: 'json', label: 'JSON' },
                    { id: 'csv', label: 'CSV' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setOutputFormat(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition shrink-0 ${
                        outputFormat === tab.id
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono transition flex items-center gap-1"
                    title="Copiar relatório"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono transition flex items-center gap-1"
                    title="Baixar arquivo"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Baixar</span>
                  </button>
                </div>
              </div>

              {/* Output Content Area */}
              <div className="p-3 sm:p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[260px] sm:min-h-[350px] max-h-[500px] overflow-y-auto selection:bg-emerald-500 selection:text-slate-950">
                <pre className="whitespace-pre-wrap break-words font-mono text-[11px] sm:text-xs">
                  {generatedReport}
                </pre>
              </div>

              {/* Official Watermark Badge in Output Footer */}
              <div className="px-3.5 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Marca d'Água: CyberHuntLab • Carol Lamas</span>
                </div>
                <span className="text-cyan-400">cwe-discover</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
