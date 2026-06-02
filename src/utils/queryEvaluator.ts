import { QueryGroup, QueryNode, QueryRule } from "@/types/query";

/**
 * Recursively filters a mock database dataset using the structured visual query tree state.
 */
export const evaluateQuery = (
  tree: QueryGroup,
  dataset: any[]
): any[] => {
  // If the tree is empty or has no children, return the full dataset
  if (!tree.children || tree.children.length === 0) {
    return dataset;
  }

  // Recursive matcher function for a single row record
  const matchesNode = (node: QueryNode, record: any): boolean => {
    if (node.type === "group") {
      const group = node as QueryGroup;
      if (!group.children || group.children.length === 0) {
        return true; // Ignore empty subgroups in record evaluation
      }
      if (group.conjunction === "AND") {
        return group.children.every((child) => matchesNode(child, record));
      } else {
        return group.children.some((child) => matchesNode(child, record));
      }
    }

    if (node.type === "rule") {
      const rule = node as QueryRule;
      const recordValue = record[rule.field];
      const op = rule.operator;
      const ruleValue = rule.value;

      // Skip query execution logic for empty values unless boolean checks are active
      if (
        recordValue === undefined ||
        (op !== "between" &&
          op !== "in array" &&
          rule.field !== "isActive" &&
          rule.field !== "isFeatured" &&
          (ruleValue === "" || ruleValue === undefined || ruleValue === null))
      ) {
        return true;
      }

      switch (op) {
        case "equals": {
          if (typeof recordValue === "boolean") {
            return (
              recordValue === (ruleValue === true || String(ruleValue) === "true")
            );
          }
          return (
            String(recordValue).toLowerCase() ===
            String(ruleValue).toLowerCase()
          );
        }
        case "not equals": {
          if (typeof recordValue === "boolean") {
            return (
              recordValue !== (ruleValue === true || String(ruleValue) === "true")
            );
          }
          return (
            String(recordValue).toLowerCase() !==
            String(ruleValue).toLowerCase()
          );
        }
        case "contains":
          return String(recordValue)
            .toLowerCase()
            .includes(String(ruleValue).toLowerCase());
        case "starts with":
          return String(recordValue)
            .toLowerCase()
            .startsWith(String(ruleValue).toLowerCase());
        case "greater than": {
          // Check if it's a date string
          if (isNaN(Number(recordValue)) && !isNaN(Date.parse(recordValue))) {
            return new Date(recordValue) > new Date(ruleValue);
          }
          return Number(recordValue) > Number(ruleValue);
        }
        case "less than": {
          // Check if it's a date string
          if (isNaN(Number(recordValue)) && !isNaN(Date.parse(recordValue))) {
            return new Date(recordValue) < new Date(ruleValue);
          }
          return Number(recordValue) < Number(ruleValue);
        }
        case "between": {
          // Date bounds check
          if (ruleValue?.start && ruleValue?.end) {
            const startVal = new Date(ruleValue.start).getTime();
            const endVal = new Date(ruleValue.end).getTime();
            const recVal = new Date(recordValue).getTime();
            return recVal >= startVal && recVal <= endVal;
          }
          // Number bounds check
          if (
            ruleValue?.min !== undefined &&
            ruleValue?.max !== undefined &&
            ruleValue?.min !== "" &&
            ruleValue?.max !== ""
          ) {
            const minVal = Number(ruleValue.min);
            const maxVal = Number(ruleValue.max);
            const recVal = Number(recordValue);
            return recVal >= minVal && recVal <= maxVal;
          }
          return true;
        }
        case "in array": {
          if (Array.isArray(ruleValue)) {
            return ruleValue.some(
              (item) =>
                String(item).toLowerCase() === String(recordValue).toLowerCase()
            );
          }
          return false;
        }
        case "regex": {
          try {
            const regex = new RegExp(String(ruleValue), "i");
            return regex.test(String(recordValue));
          } catch (e) {
            return false;
          }
        }
        default:
          return true;
      }
    }

    return true;
  };

  return dataset.filter((record) => matchesNode(tree, record));
};
