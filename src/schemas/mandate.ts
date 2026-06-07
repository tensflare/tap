import { z } from "zod";

export const IssuingPrincipalSchema = z.object({
  entity: z.string().min(1),
  human_id: z.string().min(1),
  role: z.string().min(1),
});

export const ScopeSchema = z.object({
  permitted_actions: z.array(z.string()).min(1),
  forbidden_actions: z.array(z.string()).default([]),
  permitted_data_classes: z.array(z.string()).default([]),
  max_delegation_depth: z.number().int().min(0).default(0),
  resource_bounds: z.array(z.string()).default([]),
});

export const JurisdictionContextSchema = z.object({
  deploying_org_jurisdiction: z.string().min(1),
  operating_jurisdictions: z.array(z.string()).min(1),
  regulatory_frameworks: z.array(z.string()).default([]),
});

export const ValiditySchema = z.object({
  issued_at: z.string().datetime(),
  expires_at: z.string().datetime(),
  single_use: z.boolean().default(false),
});

export const MandateSchema = z.object({
  mandate_id: z.string().min(1),
  version: z.string().default("1.0"),
  agent_id: z.string().min(1),
  agent_name: z.string().min(1),
  issuing_principal: IssuingPrincipalSchema,
  scope: ScopeSchema,
  jurisdiction_context: JurisdictionContextSchema,
  validity: ValiditySchema,
  signature: z.string().min(1),
  issuer_public_key: z.string().min(1),
});

export type Mandate = z.infer<typeof MandateSchema>;
export type IssuingPrincipal = z.infer<typeof IssuingPrincipalSchema>;
export type Scope = z.infer<typeof ScopeSchema>;
export type JurisdictionContext = z.infer<typeof JurisdictionContextSchema>;
export type Validity = z.infer<typeof ValiditySchema>;
