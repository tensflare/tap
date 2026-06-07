import { describe, it, expect } from "vitest";
import { MandateSchema } from "./mandate.js";
import { ActionRecordSchema, DelegationHopSchema } from "./action-record.js";

const validMandate = {
  mandate_id: "mnd_01j_test123",
  version: "1.0",
  agent_id: "agt_01j_test456",
  agent_name: "Contract Review Agent",
  issuing_principal: {
    entity: "org_01j_test789",
    human_id: "usr_01j_testabc",
    role: "General Counsel",
  },
  scope: {
    permitted_actions: ["read_contract", "flag_risk"],
    forbidden_actions: ["sign_contract"],
    permitted_data_classes: ["contract_document"],
    max_delegation_depth: 2,
    resource_bounds: ["matter:M-2026-001"],
  },
  jurisdiction_context: {
    deploying_org_jurisdiction: "NG",
    operating_jurisdictions: ["NG", "GB"],
    regulatory_frameworks: ["EU_AI_ACT"],
  },
  validity: {
    issued_at: "2026-06-06T09:00:00Z",
    expires_at: "2026-06-06T17:00:00Z",
    single_use: false,
  },
  signature: "ed25519:abc123signature",
  issuer_public_key: "ed25519:pubkey123",
};

describe("MandateSchema", () => {
  it("parses a valid mandate", () => {
    const result = MandateSchema.parse(validMandate);
    expect(result.mandate_id).toBe("mnd_01j_test123");
    expect(result.version).toBe("1.0");
    expect(result.issuing_principal.role).toBe("General Counsel");
  });

  it("rejects missing required fields", () => {
    expect(() => MandateSchema.parse({})).toThrow();
  });

  it("rejects missing agent_id", () => {
    expect(() =>
      MandateSchema.parse({ ...validMandate, agent_id: undefined }),
    ).toThrow();
  });

  it("rejects empty mandate_id", () => {
    expect(() =>
      MandateSchema.parse({ ...validMandate, mandate_id: "" }),
    ).toThrow();
  });

  it("applies defaults for optional fields", () => {
    const minimal = {
      ...validMandate,
      scope: { permitted_actions: ["read"] },
    };
    const result = MandateSchema.parse(minimal);
    expect(result.scope.forbidden_actions).toEqual([]);
    expect(result.scope.max_delegation_depth).toBe(0);
    expect(result.validity.single_use).toBe(false);
  });
});

describe("ActionRecordSchema", () => {
  const validAction = {
    record_id: "act_01j_test123",
    mandate_id: "mnd_01j_test456",
    action_type: "generate_summary",
    timestamp: "2026-06-06T11:23:44Z",
    agent_id: "agt_01j_test789",
    input_hash: "sha256:abc123",
    output_hash: "sha256:def456",
    within_mandate: true,
    chain_position: 1,
    prev_record_hash: null,
    signature: "ed25519:signature",
  };

  it("parses a valid action record", () => {
    const result = ActionRecordSchema.parse(validAction);
    expect(result.record_id).toBe("act_01j_test123");
    expect(result.chain_position).toBe(1);
    expect(result.prev_record_hash).toBeNull();
  });

  it("rejects invalid action_type", () => {
    expect(() =>
      ActionRecordSchema.parse({ ...validAction, action_type: "" }),
    ).toThrow();
  });

  it("accepts optional jurisdiction_evaluation", () => {
    const withEval = {
      ...validAction,
      jurisdiction_evaluation: {
        evaluated_at: "2026-06-06T11:23:44Z",
        frameworks_applied: ["EU_AI_ACT_ART12"],
        status: "compliant",
        flags: [],
      },
    };
    const result = ActionRecordSchema.parse(withEval);
    expect(result.jurisdiction_evaluation?.status).toBe("compliant");
  });
});

describe("DelegationHopSchema", () => {
  const validHop = {
    hop_id: "hop_01j_test123",
    parent_mandate_id: "mnd_01j_parent",
    child_mandate_id: "mnd_02j_child",
    delegating_agent: "agt_01j_agent_a",
    receiving_agent: "agt_02j_agent_b",
    receiving_org: "org_02j_other",
    scope_reduction: {
      permitted_actions: ["generate_summary"],
      note: "Narrowed scope",
    },
    cross_boundary: true,
    boundary_type: "organizational",
    timestamp: "2026-06-06T11:30:00Z",
    signature: "ed25519:signature",
  };

  it("parses a valid delegation hop", () => {
    const result = DelegationHopSchema.parse(validHop);
    expect(result.hop_id).toBe("hop_01j_test123");
    expect(result.cross_boundary).toBe(true);
    expect(result.boundary_type).toBe("organizational");
  });

  it("rejects invalid boundary_type", () => {
    expect(() =>
      DelegationHopSchema.parse({ ...validHop, boundary_type: "invalid" }),
    ).toThrow();
  });
});
