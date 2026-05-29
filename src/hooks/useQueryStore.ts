import { create } from 'zustand';
import { QueryGroup, QueryRule, QueryNode, Schema, SchemaField, LogicalOperator } from '@/types/query';
import { SCHEMAS } from '@/utils/schemas';

// Helper to generate a unique short ID
export const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper to get default value for a field
export const getDefaultValueForField = (field: SchemaField, operator: string): any => {
  if (operator === 'between') {
    if (field.type === 'number') return { min: '', max: '' };
    if (field.type === 'date') {
      const today = new Date().toISOString().split('T')[0];
      return { start: today, end: today };
    }
  }
  
  if (operator === 'in array') {
    return [];
  }

  switch (field.type) {
    case 'number':
      return '';
    case 'date':
      return new Date().toISOString().split('T')[0];
    case 'enum':
      return field.options && field.options.length > 0 ? field.options[0] : '';
    case 'boolean':
      return true;
    case 'string':
    default:
      return '';
  }
};

// Helper to create a default rule
export const createDefaultRule = (schema: Schema): QueryRule => {
  const defaultField = schema.fields[0];
  const defaultOperator = defaultField.operators[0];
  return {
    id: generateId(),
    type: 'rule',
    field: defaultField.name,
    operator: defaultOperator,
    value: getDefaultValueForField(defaultField, defaultOperator),
  };
};

// Helper to create a default root group
export const createDefaultGroup = (schema: Schema): QueryGroup => {
  return {
    id: 'root',
    type: 'group',
    conjunction: 'AND',
    children: [createDefaultRule(schema)],
    isCollapsed: false,
  };
};

export interface HistoryEntry {
  id: string;
  timestamp: number;
  schemaId: string;
  schemaName: string;
  sql: string;
  resultCount: number;
  queryTree: QueryGroup;
}

export interface PresetQuery {
  id: string;
  name: string;
  schemaId: string;
  description: string;
  queryTree: QueryGroup;
}

interface QueryStoreState {
  currentSchema: Schema;
  queryTree: QueryGroup;
  history: HistoryEntry[];
  presets: PresetQuery[];
  setSchema: (schemaId: string) => void;
  addRule: (parentId: string) => void;
  addGroup: (parentId: string) => void;
  removeNode: (nodeId: string) => void;
  updateRule: (ruleId: string, updates: Partial<QueryRule>) => void;
  updateGroupConjunction: (groupId: string, conjunction: LogicalOperator) => void;
  toggleGroupCollapse: (groupId: string) => void;
  moveNode: (nodeId: string, targetGroupId: string, newIndex: number) => void;
  resetQuery: () => void;
  loadQuery: (tree: QueryGroup) => void;
  addHistoryEntry: (sql: string, resultCount: number) => void;
  clearHistory: () => void;
  saveAsPreset: (name: string, description: string) => void;
  deletePreset: (presetId: string) => void;
}

const DEFAULT_PRESETS: PresetQuery[] = [
  {
    id: 'preset-active-nigerians',
    name: 'Active Users in Nigeria',
    schemaId: 'users',
    description: 'Find active users from Nigeria aged 18 and older',
    queryTree: {
      id: 'root',
      type: 'group',
      conjunction: 'AND',
      isCollapsed: false,
      children: [
        {
          id: 'rule-country',
          type: 'rule',
          field: 'country',
          operator: 'equals',
          value: 'Nigeria',
        },
        {
          id: 'rule-age',
          type: 'rule',
          field: 'age',
          operator: 'greater than',
          value: 18,
        },
        {
          id: 'rule-status',
          type: 'rule',
          field: 'status',
          operator: 'equals',
          value: 'active',
        }
      ]
    }
  },
  {
    id: 'preset-high-value-products',
    name: 'Premium Books or Clothing',
    schemaId: 'products',
    description: 'Electronics or Books/Clothing released recently that are highly rated and priced above $50',
    queryTree: {
      id: 'root',
      type: 'group',
      conjunction: 'AND',
      isCollapsed: false,
      children: [
        {
          id: 'rule-price',
          type: 'rule',
          field: 'price',
          operator: 'greater than',
          value: 50,
        },
        {
          id: 'rule-rating',
          type: 'rule',
          field: 'rating',
          operator: 'greater than',
          value: 4,
        },
        {
          id: 'group-category',
          type: 'group',
          conjunction: 'OR',
          isCollapsed: false,
          children: [
            {
              id: 'rule-cat-books',
              type: 'rule',
              field: 'category',
              operator: 'equals',
              value: 'books',
            },
            {
              id: 'rule-cat-clothing',
              type: 'rule',
              field: 'category',
              operator: 'equals',
              value: 'clothing',
            }
          ]
        }
      ]
    }
  },
  {
    id: 'preset-error-logs',
    name: 'Critical Logs (Errors/Warnings)',
    schemaId: 'logs',
    description: 'System log errors or warnings from service APIs with status codes in the 500 range',
    queryTree: {
      id: 'root',
      type: 'group',
      conjunction: 'AND',
      isCollapsed: false,
      children: [
        {
          id: 'group-levels',
          type: 'group',
          conjunction: 'OR',
          isCollapsed: false,
          children: [
            {
              id: 'rule-level-err',
              type: 'rule',
              field: 'level',
              operator: 'equals',
              value: 'error',
            },
            {
              id: 'rule-level-warn',
              type: 'rule',
              field: 'level',
              operator: 'equals',
              value: 'warn',
            }
          ]
        },
        {
          id: 'rule-status-code',
          type: 'rule',
          field: 'statusCode',
          operator: 'between',
          value: { min: 500, max: 599 },
        }
      ]
    }
  }
];

export const useQueryStore = create<QueryStoreState>((set, get) => ({
  currentSchema: SCHEMAS[0],
  queryTree: createDefaultGroup(SCHEMAS[0]),
  history: [],
  presets: DEFAULT_PRESETS,

  setSchema: (schemaId: string) => {
    const selectedSchema = SCHEMAS.find(s => s.id === schemaId) || SCHEMAS[0];
    set({
      currentSchema: selectedSchema,
      queryTree: createDefaultGroup(selectedSchema),
    });
  },

  addRule: (parentId: string) => {
    const nextTree = JSON.parse(JSON.stringify(get().queryTree)) as QueryGroup;
    const currentSchema = get().currentSchema;
    
    const findAndAdd = (group: QueryGroup): boolean => {
      if (group.id === parentId) {
        group.children.push(createDefaultRule(currentSchema));
        return true;
      }
      for (const child of group.children) {
        if (child.type === 'group') {
          if (findAndAdd(child)) return true;
        }
      }
      return false;
    };

    findAndAdd(nextTree);
    set({ queryTree: nextTree });
  },

  addGroup: (parentId: string) => {
    const nextTree = JSON.parse(JSON.stringify(get().queryTree)) as QueryGroup;
    const currentSchema = get().currentSchema;
    
    const findAndAdd = (group: QueryGroup): boolean => {
      if (group.id === parentId) {
        group.children.push({
          id: generateId(),
          type: 'group',
          conjunction: 'AND',
          isCollapsed: false,
          children: [createDefaultRule(currentSchema)],
        });
        return true;
      }
      for (const child of group.children) {
        if (child.type === 'group') {
          if (findAndAdd(child)) return true;
        }
      }
      return false;
    };

    findAndAdd(nextTree);
    set({ queryTree: nextTree });
  },

  removeNode: (nodeId: string) => {
    // Cannot delete the root node
    if (nodeId === 'root') return;
    
    const nextTree = JSON.parse(JSON.stringify(get().queryTree)) as QueryGroup;

    const findAndRemove = (group: QueryGroup): boolean => {
      const idx = group.children.findIndex(child => child.id === nodeId);
      if (idx !== -1) {
        group.children.splice(idx, 1);
        return true;
      }
      for (const child of group.children) {
        if (child.type === 'group') {
          if (findAndRemove(child)) return true;
        }
      }
      return false;
    };

    findAndRemove(nextTree);
    set({ queryTree: nextTree });
  },

  updateRule: (ruleId: string, updates: Partial<QueryRule>) => {
    const nextTree = JSON.parse(JSON.stringify(get().queryTree)) as QueryGroup;
    const schema = get().currentSchema;

    const findAndUpdate = (group: QueryGroup): boolean => {
      for (let i = 0; i < group.children.length; i++) {
        const child = group.children[i];
        if (child.type === 'rule' && child.id === ruleId) {
          const rule = child as QueryRule;
          
          // Check if field is changing
          if (updates.field && updates.field !== rule.field) {
            const newField = schema.fields.find(f => f.name === updates.field) || schema.fields[0];
            const defaultOperator = newField.operators[0];
            
            rule.field = newField.name;
            rule.operator = defaultOperator;
            rule.value = getDefaultValueForField(newField, defaultOperator);
            rule.error = undefined;
          } else if (updates.operator && updates.operator !== rule.operator) {
            // Operator is changing, reset value defaults accordingly (e.g. standard value vs between min/max)
            const currentField = schema.fields.find(f => f.name === rule.field) || schema.fields[0];
            rule.operator = updates.operator;
            rule.value = getDefaultValueForField(currentField, updates.operator);
            rule.error = undefined;
            if (updates.value !== undefined) {
              rule.value = updates.value;
            }
          } else {
            // Standard update
            Object.assign(rule, updates);
          }
          return true;
        } else if (child.type === 'group') {
          if (findAndUpdate(child as QueryGroup)) return true;
        }
      }
      return false;
    };

    findAndUpdate(nextTree);
    set({ queryTree: nextTree });
  },

  updateGroupConjunction: (groupId: string, conjunction: LogicalOperator) => {
    const nextTree = JSON.parse(JSON.stringify(get().queryTree)) as QueryGroup;

    const findAndUpdate = (group: QueryGroup): boolean => {
      if (group.id === groupId) {
        group.conjunction = conjunction;
        return true;
      }
      for (const child of group.children) {
        if (child.type === 'group') {
          if (findAndUpdate(child)) return true;
        }
      }
      return false;
    };

    findAndUpdate(nextTree);
    set({ queryTree: nextTree });
  },

  toggleGroupCollapse: (groupId: string) => {
    const nextTree = JSON.parse(JSON.stringify(get().queryTree)) as QueryGroup;

    const findAndUpdate = (group: QueryGroup): boolean => {
      if (group.id === groupId) {
        group.isCollapsed = !group.isCollapsed;
        return true;
      }
      for (const child of group.children) {
        if (child.type === 'group') {
          if (findAndUpdate(child)) return true;
        }
      }
      return false;
    };

    findAndUpdate(nextTree);
    set({ queryTree: nextTree });
  },

  moveNode: (nodeId: string, targetGroupId: string, newIndex: number) => {
    if (nodeId === 'root') return; // Cannot move the root group
    const nextTree = JSON.parse(JSON.stringify(get().queryTree)) as QueryGroup;
    let nodeToMove: QueryNode | null = null;

    // 1. Recursive helper to find and extract the node from its parent
    const extractNode = (group: QueryGroup): boolean => {
      const idx = group.children.findIndex(child => child.id === nodeId);
      if (idx !== -1) {
        nodeToMove = group.children.splice(idx, 1)[0];
        return true;
      }
      for (const child of group.children) {
        if (child.type === 'group') {
          if (extractNode(child)) return true;
        }
      }
      return false;
    };

    extractNode(nextTree);

    if (!nodeToMove) return; // Node not found

    // 2. Recursive helper to insert the node into the target group
    const insertNode = (group: QueryGroup): boolean => {
      if (group.id === targetGroupId) {
        // Prevent nesting a group inside itself or any circular structure
        if (nodeToMove?.type === 'group') {
          const isDescendant = (parent: QueryGroup, possibleChildId: string): boolean => {
            if (parent.id === possibleChildId) return true;
            for (const child of parent.children) {
              if (child.type === 'group') {
                if (isDescendant(child, possibleChildId)) return true;
              }
            }
            return false;
          };
          if (isDescendant(nodeToMove, targetGroupId)) {
            // Re-insert into root to prevent loss if invalid
            nextTree.children.push(nodeToMove);
            return true;
          }
        }
        
        const indexToInsert = Math.max(0, Math.min(newIndex, group.children.length));
        group.children.splice(indexToInsert, 0, nodeToMove!);
        return true;
      }
      for (const child of group.children) {
        if (child.type === 'group') {
          if (insertNode(child)) return true;
        }
      }
      return false;
    };

    insertNode(nextTree);
    set({ queryTree: nextTree });
  },

  resetQuery: () => {
    set({ queryTree: createDefaultGroup(get().currentSchema) });
  },

  loadQuery: (tree: QueryGroup) => {
    set({ queryTree: tree });
  },

  addHistoryEntry: (sql: string, resultCount: number) => {
    const schema = get().currentSchema;
    const newEntry: HistoryEntry = {
      id: generateId(),
      timestamp: Date.now(),
      schemaId: schema.id,
      schemaName: schema.name,
      sql,
      resultCount,
      queryTree: JSON.parse(JSON.stringify(get().queryTree)),
    };
    set({
      history: [newEntry, ...get().history.slice(0, 49)], // Limit history to last 50 queries
    });
  },

  clearHistory: () => {
    set({ history: [] });
  },

  saveAsPreset: (name: string, description: string) => {
    const schema = get().currentSchema;
    const newPreset: PresetQuery = {
      id: `custom-preset-${generateId()}`,
      name,
      schemaId: schema.id,
      description,
      queryTree: JSON.parse(JSON.stringify(get().queryTree)),
    };
    set({
      presets: [...get().presets, newPreset],
    });
  },

  deletePreset: (presetId: string) => {
    set({
      presets: get().presets.filter(p => p.id !== presetId),
    });
  },
}));
