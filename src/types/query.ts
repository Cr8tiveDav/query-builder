export type LogicalOperator = 'AND' | 'OR';

export interface QueryRule {
  id: string;
  type: 'rule';
  field: string;
  operator: string;
  value: any;
  error?: string;
}

export interface QueryGroup {
  id: string;
  type: 'group';
  conjunction: LogicalOperator;
  children: Array<QueryGroup | QueryRule>;
  isCollapsed?: boolean;
}

export type QueryNode = QueryGroup | QueryRule;

export type SchemaFieldType = 'string' | 'number' | 'date' | 'enum' | 'boolean';

export interface SchemaField {
  name: string;
  label: string;
  type: SchemaFieldType;
  operators: string[];
  options?: string[]; // Used for enums
}

export interface Schema {
  id: string;
  name: string;
  fields: SchemaField[];
}
