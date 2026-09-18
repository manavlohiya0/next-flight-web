"use client";

import { useState } from "react";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  ChevronRight,
  ChevronDown,
  Layers,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  desc?: string;
  badge?: string;
  codeSnippet?: string;
  children?: FileNode[];
}

const FILE_STRUCTURE: FileNode[] = [
  {
    name: "app",
    type: "folder",
    children: [
      {
        name: "(auth)",
        type: "folder",
        children: [
          {
            name: "login/page.tsx",
            type: "file",
            badge: "Passkeys + OAuth",
            codeSnippet: `// app/(auth)/login/page.tsx
import { PasskeyAuthForm } from "@/components/auth/passkey-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export default function LoginPage() {
  return (
    <div className="auth-card">
      <h1>Welcome back to NextFlight</h1>
      <PasskeyAuthForm />
      <OAuthButtons providers={["github", "google"]} />
    </div>
  );
}`,
          },
          {
            name: "register/page.tsx",
            type: "file",
            badge: "Auto-Org Provision",
            codeSnippet: `// app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return <RegisterForm autoCreateWorkspace={true} />;
}`,
          },
        ],
      },
      {
        name: "(dashboard)",
        type: "folder",
        children: [
          {
            name: "dashboard/page.tsx",
            type: "file",
            badge: "Multi-Tenant",
            codeSnippet: `// app/(dashboard)/dashboard/page.tsx
import { requireOrgMember } from "@/lib/auth/rbac";
import { MetricsGrid } from "@/components/dashboard/metrics";

export default async function DashboardPage() {
  const org = await requireOrgMember();
  return <MetricsGrid orgId={org.id} />;
}`,
          },
          {
            name: "settings/billing/page.tsx",
            type: "file",
            badge: "Lemon Squeezy",
            codeSnippet: `// app/(dashboard)/settings/billing/page.tsx
import { getSubscriptionStatus } from "@/lib/payments/lemonsqueezy";
import { BillingPortalButton } from "@/components/billing/portal-button";

export default async function BillingSettingsPage() {
  const sub = await getSubscriptionStatus();
  return (
    <div>
      <h3>Subscription: {sub.status}</h3>
      <BillingPortalButton customerId={sub.customerId} />
    </div>
  );
}`,
          },
          {
            name: "settings/team/page.tsx",
            type: "file",
            badge: "RBAC",
            codeSnippet: `// app/(dashboard)/settings/team/page.tsx
import { TeamMemberList } from "@/components/team/member-list";
import { InviteMemberModal } from "@/components/team/invite-modal";

export default async function TeamPage() {
  return (
    <div>
      <TeamMemberList />
      <InviteMemberModal roles={["OWNER", "ADMIN", "MEMBER"]} />
    </div>
  );
}`,
          },
        ],
      },
      {
        name: "api/webhooks/lemonsqueezy/route.ts",
        type: "file",
        badge: "HMAC Signed",
        codeSnippet: `// app/api/webhooks/lemonsqueezy/route.ts
import { verifyWebhookSignature } from "@/lib/payments/lemonsqueezy";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const event = await verifyWebhookSignature(req);
  if (event.name === "order_created") {
    await db.license.create({
      data: {
        userId: event.custom_data.user_id,
        githubHandle: event.custom_data.github_username,
        status: "ACTIVE",
      },
    });
  }
  return new Response("OK", { status: 200 });
}`,
      },
    ],
  },
  {
    name: "components",
    type: "folder",
    children: [
      {
        name: "ui",
        type: "folder",
        children: [
          { name: "button.tsx", type: "file" },
          { name: "dialog.tsx", type: "file" },
          { name: "dropdown.tsx", type: "file" },
          { name: "input.tsx", type: "file" },
        ],
      },
      {
        name: "emails",
        type: "folder",
        children: [
          { name: "welcome-email.tsx", type: "file", badge: "React Email" },
          { name: "magic-link.tsx", type: "file", badge: "React Email" },
        ],
      },
    ],
  },
  {
    name: "lib",
    type: "folder",
    children: [
      {
        name: "auth/rbac.ts",
        type: "file",
        badge: "0-Leak Isolation",
        codeSnippet: `// lib/auth/rbac.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function requireOrgMember() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const member = await db.membership.findFirst({
    where: { userId: session.user.id, orgId: session.orgId },
    include: { organization: true },
  });

  if (!member) throw new Error("Access Denied: Cross-Tenant Guard");
  return member.organization;
}`,
      },
      {
        name: "payments/lemonsqueezy.ts",
        type: "file",
        badge: "Merchant of Record",
        codeSnippet: `// lib/payments/lemonsqueezy.ts
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function generateCheckoutSession(userEmail: string, githubUsername: string) {
  return await createCheckout({
    storeId: process.env.LEMON_SQUEEZY_STORE_ID!,
    variantId: process.env.LEMON_SQUEEZY_VARIANT_ID!,
    checkoutOptions: { email: userEmail },
    customPrice: null,
    checkoutData: { custom: { github_username: githubUsername } },
  });
}`,
      },
    ],
  },
  {
    name: "prisma/schema.prisma",
    type: "file",
    badge: "PostgreSQL",
    codeSnippet: `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  memberships Membership[]
  projects    Project[]
  createdAt   DateTime     @default(now())
}

model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           Role         @default(MEMBER)
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@unique([userId, organizationId])
}

enum Role {
  OWNER
  ADMIN
  MEMBER
}`,
  },
  {
    name: "AGENTS.md",
    type: "file",
    badge: "AI Pair-Programming",
    codeSnippet: `# AGENTS.md — Autonomous AI Engineering Standards
Project: NextFlight Production SaaS Boilerplate

Rule 1: Never alter prisma/schema.prisma without creating a migration.
Rule 2: Every database mutation MUST enforce organizationId scoping from session.
Rule 3: Use Zod v4 schemas for all server action inputs.
Rule 4: Zero hallucinated dependencies; only use packages in package.json.`,
  },
];

export function FileTreeShowcase() {
  const [selectedFile, setSelectedFile] = useState<FileNode>({
    name: "prisma/schema.prisma",
    type: "file",
    badge: "PostgreSQL",
    codeSnippet: `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  memberships Membership[]
  projects    Project[]
  createdAt   DateTime     @default(now())
}

model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           Role         @default(MEMBER)
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@unique([userId, organizationId])
}

enum Role {
  OWNER
  ADMIN
  MEMBER
}`,
  });

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    app: true,
    "(dashboard)": true,
    lib: true,
  });

  const [copied, setCopied] = useState(false);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const handleCopy = () => {
    if (selectedFile.codeSnippet) {
      navigator.clipboard.writeText(selectedFile.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTree = (nodes: FileNode[], depth = 0) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%", maxWidth: "100%" }}>
        {nodes.map((node, i) => {
          if (node.type === "folder") {
            const isOpen = !!expandedFolders[node.name];
            return (
              <div key={i} style={{ width: "100%", maxWidth: "100%" }}>
                <button
                  type="button"
                  onClick={() => toggleFolder(node.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    width: "100%",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    padding: "6px 8px",
                    paddingLeft: `${Math.min(depth * 12 + 8, 32)}px`,
                    background: "transparent",
                    border: "none",
                    borderRadius: "6px",
                    color: "var(--ink-primary)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {isOpen ? <ChevronDown size={14} style={{ flexShrink: 0 }} /> : <ChevronRight size={14} style={{ flexShrink: 0 }} />}
                  {isOpen ? (
                    <FolderOpen size={16} style={{ color: "var(--accent-brass)", flexShrink: 0 }} />
                  ) : (
                    <Folder size={16} style={{ color: "var(--accent-brass)", flexShrink: 0 }} />
                  )}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</span>
                </button>
                {isOpen && node.children && renderTree(node.children, depth + 1)}
              </div>
            );
          }

          const isSelected = selectedFile.name === node.name;
          return (
            <button
              key={i}
              type="button"
              onClick={() => node.codeSnippet && setSelectedFile(node)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "6px",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                padding: "6px 8px",
                paddingLeft: `${Math.min(depth * 12 + 20, 44)}px`,
                background: isSelected ? "var(--bg-card-muted)" : "transparent",
                border: isSelected ? "1px solid var(--border-stone)" : "1px solid transparent",
                borderRadius: "6px",
                color: isSelected ? "var(--ink-primary)" : "var(--ink-secondary)",
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono)",
                cursor: node.codeSnippet ? "pointer" : "default",
                textAlign: "left",
                transition: "all 0.1s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", minWidth: 0, flex: "1 1 auto" }}>
                <FileCode size={14} style={{ color: isSelected ? "var(--brand-forest)" : "var(--ink-muted)", flexShrink: 0 }} />
                <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {node.name}
                </span>
              </div>
              {node.badge && (
                <span
                  style={{
                    fontSize: "0.68rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-subtle)",
                    color: "var(--brand-forest)",
                    border: "1px solid var(--border-stone)",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {node.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="paper-card" style={{ padding: "28px", marginTop: "32px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-forest)", fontSize: "0.82rem", fontWeight: 700, marginBottom: "4px" }}>
            <Layers size={16} />
            <span>Modern Production Codebase</span>
          </div>
          <h3 style={{ fontSize: "1.45rem" }}>Explore the NextFlight File Architecture</h3>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.92rem", marginTop: "4px" }}>
            Built with modular Next.js 15 route groups, clean separation of concerns, and full type-safety.
          </p>
        </div>
        <span
          style={{
            backgroundColor: "var(--bg-card-muted)",
            color: "var(--brand-forest)",
            border: "1px solid var(--border-stone)",
            padding: "5px 12px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.76rem",
            fontWeight: 600,
          }}
        >
          Next.js 15.5 App Router
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "20px",
          backgroundColor: "var(--bg-canvas)",
          border: "1px solid var(--border-stone)",
          borderRadius: "var(--radius-md)",
          padding: "16px",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {/* Left Column: Interactive File Tree */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-stone)",
            borderRadius: "var(--radius-sm)",
            padding: "12px",
            maxHeight: "380px",
            overflowY: "auto",
            overflowX: "hidden",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", paddingBottom: "6px", borderBottom: "1px solid var(--border-stone)" }}>
            Repository Structure
          </div>
          {renderTree(FILE_STRUCTURE)}
        </div>

        {/* Right Column: Code Snippet Viewer */}
        <div
          style={{
            backgroundColor: "#131614",
            border: "1px solid #282E2A",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "380px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 14px",
              backgroundColor: "#0D100E",
              borderBottom: "1px solid #232925",
              fontSize: "0.76rem",
              color: "#9EA6A0",
              fontFamily: "var(--font-mono)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FileCode size={13} style={{ color: "#34D399" }} />
              <span>{selectedFile.name}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: "transparent",
                border: "none",
                color: "#9EA6A0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.72rem",
              }}
            >
              {copied ? <Check size={12} style={{ color: "#34D399" }} /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "14px",
              overflow: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              lineHeight: 1.55,
              color: "#E5E7EB",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <code>{selectedFile.codeSnippet || "// Select a file from the tree to inspect code"}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
