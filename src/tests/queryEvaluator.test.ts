import { describe, it, expect } from "vitest";
import { evaluateQuery } from "@/utils/queryEvaluator";
import { QueryGroup } from "@/types/query";

describe("queryEvaluator - evaluateQuery", () => {
  const mockDataset = [
    { id: 1, name: "Chinedu Okafor", age: 24, status: "active", country: "Nigeria", purchases: 15, createdAt: "2026-01-15", isActive: true },
    { id: 2, name: "Jane Smith", age: 17, status: "pending", country: "United Kingdom", purchases: 0, createdAt: "2026-03-22", isActive: false },
    { id: 3, name: "David Miller", age: 34, status: "active", country: "United States", purchases: 45, createdAt: "2025-11-05", isActive: true },
    { id: 4, name: "Amina Yusuf", age: 19, status: "active", country: "Nigeria", purchases: 8, createdAt: "2026-02-10", isActive: true },
    { id: 5, name: "Jean Dupont", age: 29, status: "inactive", country: "France", purchases: 12, createdAt: "2025-08-30", isActive: false }
  ];

  it("should return the entire dataset if tree has no children", () => {
    const emptyTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [],
    };

    const results = evaluateQuery(emptyTree, mockDataset);
    expect(results).toHaveLength(5);
  });

  it("should filter by a simple equality rule", () => {
    const tree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-1",
          type: "rule",
          field: "country",
          operator: "equals",
          value: "Nigeria",
        },
      ],
    };

    const results = evaluateQuery(tree, mockDataset);
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.name)).toContain("Chinedu Okafor");
    expect(results.map((r) => r.name)).toContain("Amina Yusuf");
  });

  it("should filter by numeric comparison rules", () => {
    const tree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-1",
          type: "rule",
          field: "age",
          operator: "greater than",
          value: 20,
        },
      ],
    };

    const results = evaluateQuery(tree, mockDataset);
    expect(results).toHaveLength(3); // 24, 34, 29
    expect(results.map((r) => r.id)).not.toContain(2); // 17
    expect(results.map((r) => r.id)).not.toContain(4); // 19
  });

  it("should filter by nested logic: (age > 18 AND country = 'Nigeria') OR (status = 'active' AND purchases > 10)", () => {
    const tree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "OR",
      children: [
        {
          id: "group-a",
          type: "group",
          conjunction: "AND",
          children: [
            {
              id: "rule-age",
              type: "rule",
              field: "age",
              operator: "greater than",
              value: 18,
            },
            {
              id: "rule-country",
              type: "rule",
              field: "country",
              operator: "equals",
              value: "Nigeria",
            },
          ],
        },
        {
          id: "group-b",
          type: "group",
          conjunction: "AND",
          children: [
            {
              id: "rule-status",
              type: "rule",
              field: "status",
              operator: "equals",
              value: "active",
            },
            {
              id: "rule-purchases",
              type: "rule",
              field: "purchases",
              operator: "greater than",
              value: 10,
            },
          ],
        },
      ],
    };

    const results = evaluateQuery(tree, mockDataset);
    // Should match:
    // - Chinedu (age 24 > 18 AND Nigeria) -> Matches Group A
    // - Amina (age 19 > 18 AND Nigeria) -> Matches Group A
    // - David (active AND purchases 45 > 10) -> Matches Group B
    // Does not match: Jane, Jean
    expect(results).toHaveLength(3);
    expect(results.map((r) => r.name)).toContain("Chinedu Okafor");
    expect(results.map((r) => r.name)).toContain("Amina Yusuf");
    expect(results.map((r) => r.name)).toContain("David Miller");
  });

  it("should filter by between operator ranges", () => {
    // Number range between 10 and 20
    const tree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-between",
          type: "rule",
          field: "purchases",
          operator: "between",
          value: { min: 10, max: 20 },
        },
      ],
    };

    const results = evaluateQuery(tree, mockDataset);
    expect(results).toHaveLength(2); // Chinedu (15), Jean (12)
    expect(results.map((r) => r.name)).toContain("Chinedu Okafor");
    expect(results.map((r) => r.name)).toContain("Jean Dupont");
  });

  it("should filter by in array list selection", () => {
    const tree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-in-array",
          type: "rule",
          field: "status",
          operator: "in array",
          value: ["pending", "inactive"],
        },
      ],
    };

    const results = evaluateQuery(tree, mockDataset);
    expect(results).toHaveLength(2); // Jane (pending), Jean (inactive)
    expect(results.map((r) => r.name)).toContain("Jane Smith");
    expect(results.map((r) => r.name)).toContain("Jean Dupont");
  });

  it("should filter by regex matches", () => {
    const tree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-regex",
          type: "rule",
          field: "name",
          operator: "regex",
          value: "^J[a-z]+", // Names starting with J followed by lowercase letters
        },
      ],
    };

    const results = evaluateQuery(tree, mockDataset);
    expect(results).toHaveLength(2); // Jane Smith, Jean Dupont
    expect(results.map((r) => r.name)).toContain("Jane Smith");
    expect(results.map((r) => r.name)).toContain("Jean Dupont");
  });
});
