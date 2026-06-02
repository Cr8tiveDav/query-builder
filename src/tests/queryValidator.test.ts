import { describe, it, expect } from "vitest";
import { validateQueryTree } from "@/utils/queryValidator";
import { QueryGroup } from "@/types/query";

describe("queryValidator - validateQueryTree", () => {
  it("should validate a completely valid query tree with no errors", () => {
    const validTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-name",
          type: "rule",
          field: "name",
          operator: "equals",
          value: "John",
        },
        {
          id: "rule-age",
          type: "rule",
          field: "age",
          operator: "greater than",
          value: 18,
        },
      ],
    };

    const errors = validateQueryTree(validTree, "users");
    expect(errors).toEqual({});
  });

  it("should flag empty logic groups", () => {
    const emptyGroupTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "sub-group",
          type: "group",
          conjunction: "OR",
          children: [], // empty subgroup
        },
      ],
    };

    const errors = validateQueryTree(emptyGroupTree, "users");
    expect(errors["sub-group"]).toBeDefined();
    expect(errors["sub-group"]).toContain("Logic group cannot be empty");
  });

  it("should flag rules with empty values", () => {
    const emptyValueTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-empty",
          type: "rule",
          field: "name",
          operator: "equals",
          value: "", // empty
        },
      ],
    };

    const errors = validateQueryTree(emptyValueTree, "users");
    expect(errors["rule-empty"]).toBe("Value is required.");
  });

  it("should validate between operator numeric bounds", () => {
    // 1. Missing inputs
    const incompleteTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-incomplete",
          type: "rule",
          field: "age",
          operator: "between",
          value: { min: "", max: 50 },
        },
      ],
    };
    let errors = validateQueryTree(incompleteTree, "users");
    expect(errors["rule-incomplete"]).toBe("Both Min and Max values are required.");

    // 2. Non-numeric inputs
    const nonNumericTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-non-numeric",
          type: "rule",
          field: "age",
          operator: "between",
          value: { min: "abc", max: "def" },
        },
      ],
    };
    errors = validateQueryTree(nonNumericTree, "users");
    expect(errors["rule-non-numeric"]).toBe("Min and Max values must be valid numbers.");

    // 3. Min > Max bounds
    const invalidBoundsTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-invalid-bounds",
          type: "rule",
          field: "age",
          operator: "between",
          value: { min: 50, max: 20 },
        },
      ],
    };
    errors = validateQueryTree(invalidBoundsTree, "users");
    expect(errors["rule-invalid-bounds"]).toBe("Min value cannot be greater than Max value.");
  });

  it("should validate between operator date bounds", () => {
    // 1. Missing start/end dates
    const incompleteTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-incomplete-date",
          type: "rule",
          field: "createdAt",
          operator: "between",
          value: { start: "", end: "2026-06-02" },
        },
      ],
    };
    let errors = validateQueryTree(incompleteTree, "users");
    expect(errors["rule-incomplete-date"]).toBe("Both Start and End dates are required.");

    // 2. Start date after End date
    const invalidDatesTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-invalid-dates",
          type: "rule",
          field: "createdAt",
          operator: "between",
          value: { start: "2026-06-05", end: "2026-06-02" },
        },
      ],
    };
    errors = validateQueryTree(invalidDatesTree, "users");
    expect(errors["rule-invalid-dates"]).toBe("Start date cannot be after End date.");
  });

  it("should flag empty lists for in array operator", () => {
    const emptyListTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-empty-list",
          type: "rule",
          field: "status",
          operator: "in array",
          value: [], // empty list
        },
      ],
    };

    const errors = validateQueryTree(emptyListTree, "users");
    expect(errors["rule-empty-list"]).toBe("Please add at least one value to the list.");
  });

  it("should check number fields for invalid numbers", () => {
    const invalidNumberTree: QueryGroup = {
      id: "root",
      type: "group",
      conjunction: "AND",
      children: [
        {
          id: "rule-invalid-number",
          type: "rule",
          field: "age",
          operator: "equals",
          value: "not-a-number",
        },
      ],
    };

    const errors = validateQueryTree(invalidNumberTree, "users");
    expect(errors["rule-invalid-number"]).toBe("Value must be a valid number.");
  });
});
