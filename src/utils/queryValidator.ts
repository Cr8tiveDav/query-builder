import { QueryGroup, QueryNode, QueryRule } from "@/types/query";
import { SCHEMAS } from "./schemas";

/**
 * Recursively validates a visual query tree against field types and operators.
 * Returns a dictionary mapping node IDs to their respective validation error messages.
 */
export const validateQueryTree = (
  tree: QueryGroup,
  schemaId: string
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const schema = SCHEMAS.find((s) => s.id === schemaId) || SCHEMAS[0];

  const traverse = (node: QueryNode) => {
    if (node.type === "group") {
      if (!node.children || node.children.length === 0) {
        errors[node.id] = "Logic group cannot be empty. Add a rule or subgroup.";
      } else {
        node.children.forEach(traverse);
      }
    } else if (node.type === "rule") {
      const rule = node as QueryRule;
      const fieldDef = schema.fields.find((f) => f.name === rule.field);
      if (!fieldDef) {
        errors[rule.id] = "Invalid field selected.";
        return;
      }

      const val = rule.value;
      const op = rule.operator;

      if (op === "between") {
        if (fieldDef.type === "number") {
          const min = val?.min;
          const max = val?.max;
          if (
            min === undefined ||
            min === null ||
            min === "" ||
            max === undefined ||
            max === null ||
            max === ""
          ) {
            errors[rule.id] = "Both Min and Max values are required.";
          } else {
            const minNum = Number(min);
            const maxNum = Number(max);
            if (isNaN(minNum) || isNaN(maxNum)) {
              errors[rule.id] = "Min and Max values must be valid numbers.";
            } else if (minNum > maxNum) {
              errors[rule.id] = "Min value cannot be greater than Max value.";
            }
          }
        } else if (fieldDef.type === "date") {
          const start = val?.start;
          const end = val?.end;
          if (!start || !end) {
            errors[rule.id] = "Both Start and End dates are required.";
          } else {
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              errors[rule.id] = "Start and End must be valid dates.";
            } else if (startDate > endDate) {
              errors[rule.id] = "Start date cannot be after End date.";
            }
          }
        }
      } else if (op === "in array") {
        if (!Array.isArray(val) || val.length === 0) {
          errors[rule.id] = "Please add at least one value to the list.";
        }
      } else if (fieldDef.type === "boolean") {
        // Boolean values (checkbox true/false) are always inherently valid.
      } else {
        // General text/number/date inputs
        if (val === undefined || val === null || val === "") {
          errors[rule.id] = "Value is required.";
        } else if (fieldDef.type === "number") {
          const num = Number(val);
          if (isNaN(num)) {
            errors[rule.id] = "Value must be a valid number.";
          }
        } else if (fieldDef.type === "date") {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            errors[rule.id] = "Value must be a valid date.";
          }
        }
      }
    }
  };

  traverse(tree);
  return errors;
};
