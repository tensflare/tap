import { z } from "zod";

export const JurisdictionFlagSchema = z.object({
  framework: z.string().min(1),
  obligation: z.string().min(1),
  severity: z.enum(["warning", "violation", "info"]),
  article: z.string().optional(),
  guidance: z.string().optional(),
});

export const JurisdictionEvaluationSchema = z.object({
  evaluated_at: z.string().datetime(),
  frameworks_applied: z.array(z.string()).default([]),
  status: z.enum(["compliant", "warning", "violation", "unknown"]),
  flags: z.array(JurisdictionFlagSchema).default([]),
});

export const ActionRecordSchema = z.object({
  record_id: z.string().min(1),
  mandate_id: z.string().min(1),
  action_type: z.string().min(1),
  timestamp: z.string().datetime(),
  agent_id: z.string().min(1),
  input_hash: z.string().min(1),
  output_hash: z.string().min(1),
  within_mandate: z.boolean().default(true),
  jurisdiction_evaluation: JurisdictionEvaluationSchema.optional(),
  chain_position: z.number().int().min(0),
  prev_record_hash: z.string().nullable().default(null),
  signature: z.string().min(1),
});

export const ScopeReductionSchema = z.object({
  permitted_actions: z.array(z.string()).min(1),
  note: z.string().optional(),
});

export const DelegationHopSchema = z.object({
  hop_id: z.string().min(1),
  parent_mandate_id: z.string().min(1),
  child_mandate_id: z.string().min(1),
  delegating_agent: z.string().min(1),
  receiving_agent: z.string().min(1),
  receiving_org: z.string().min(1),
  scope_reduction: ScopeReductionSchema,
  cross_boundary: z.boolean(),
  boundary_type: z.enum(["organizational", "jurisdictional", "vendor"]),
  timestamp: z.string().datetime(),
  signature: z.string().min(1),
});

export type ActionRecord = z.infer<typeof ActionRecordSchema>;
export type DelegationHop = z.infer<typeof DelegationHopSchema>;
export type JurisdictionEvaluation = z.infer<typeof JurisdictionEvaluationSchema>;
export type JurisdictionFlag = z.infer<typeof JurisdictionFlagSchema>;
export type ScopeReduction = z.infer<typeof ScopeReductionSchema>;
