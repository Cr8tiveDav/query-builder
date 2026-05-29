import { QueryGroup, QueryRule, QueryNode } from '@/types/query';
import { SCHEMAS } from './schemas';

// Helper to escape single quotes in SQL strings
const escapeSqlString = (val: string): string => {
  return val.replace(/'/g, "''");
};

// Helper to format values appropriately based on data type
const formatSqlValue = (value: any, type: string, operator: string): string => {
  if (operator === 'between') {
    if (type === 'number') {
      const min = value?.min !== '' ? Number(value.min) : 0;
      const max = value?.max !== '' ? Number(value.max) : 0;
      return `${min} AND ${max}`;
    } else if (type === 'date') {
      return `'${escapeSqlString(value?.start || '')}' AND '${escapeSqlString(value?.end || '')}'`;
    }
  }

  if (operator === 'in array') {
    const arr = Array.isArray(value) ? value : String(value).split(',').map(s => s.trim());
    const formattedElements = arr.map(item => {
      if (type === 'number') {
        const num = Number(item);
        return isNaN(num) ? '0' : String(num);
      }
      return `'${escapeSqlString(String(item))}'`;
    });
    return `(${formattedElements.join(', ')})`;
  }

  if (type === 'number') {
    const num = Number(value);
    return isNaN(num) ? '0' : String(num);
  }
  if (type === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  // String, Enum, Date
  return `'${escapeSqlString(String(value))}'`;
};

// SQL Operator Mapping
const getSqlOperatorAndValue = (rule: QueryRule, fieldType: string): string => {
  const op = rule.operator;
  const val = rule.value;
  const col = `\`${rule.field}\``;

  switch (op) {
    case 'equals':
      return `${col} = ${formatSqlValue(val, fieldType, op)}`;
    case 'not equals':
      return `${col} != ${formatSqlValue(val, fieldType, op)}`;
    case 'contains':
      return `${col} LIKE '%${escapeSqlString(String(val))}%'`;
    case 'starts with':
      return `${col} LIKE '${escapeSqlString(String(val))}%'`;
    case 'greater than':
      return `${col} > ${formatSqlValue(val, fieldType, op)}`;
    case 'less than':
      return `${col} < ${formatSqlValue(val, fieldType, op)}`;
    case 'between':
      return `${col} BETWEEN ${formatSqlValue(val, fieldType, op)}`;
    case 'in array':
      return `${col} IN ${formatSqlValue(val, fieldType, op)}`;
    case 'regex':
      return `${col} REGEXP '${escapeSqlString(String(val))}'`;
    default:
      return `${col} = ${formatSqlValue(val, fieldType, op)}`;
  }
};

/**
 * Generates an SQL WHERE clause from a Query Tree recursively.
 */
export const generateSQL = (node: QueryNode, schemaId: string = 'users'): string => {
  const schema = SCHEMAS.find(s => s.id === schemaId) || SCHEMAS[0];

  const recurse = (n: QueryNode): string => {
    if (n.type === 'rule') {
      const fieldDef = schema.fields.find(f => f.name === n.field);
      if (!fieldDef) return '1=1';
      
      // Skip empty rules in SQL generation unless it is a boolean
      if (fieldDef.type !== 'boolean' && n.operator !== 'between' && (n.value === '' || n.value === undefined || n.value === null)) {
        return '';
      }
      if (n.operator === 'between') {
        if (fieldDef.type === 'number' && (n.value?.min === '' || n.value?.max === '')) return '';
        if (fieldDef.type === 'date' && (!n.value?.start || !n.value?.end)) return '';
      }
      if (n.operator === 'in array' && (!Array.isArray(n.value) || n.value.length === 0)) {
        return '';
      }

      return getSqlOperatorAndValue(n, fieldDef.type);
    }

    if (n.type === 'group') {
      if (!n.children || n.children.length === 0) return '';
      
      const childClauses = n.children
        .map(child => recurse(child))
        .filter(clause => clause !== '');

      if (childClauses.length === 0) return '';
      if (childClauses.length === 1) return childClauses[0];

      return `(${childClauses.join(` ${n.conjunction} `)})`;
    }

    return '';
  };

  const whereClause = recurse(node);
  const tableName = schema.id;
  return `SELECT * FROM ${tableName}${whereClause ? `\nWHERE ${whereClause}` : ''};`;
};

/**
 * Generates MongoDB filter object query from a Query Tree recursively.
 */
export const generateMongoDB = (node: QueryNode, schemaId: string = 'users'): string => {
  const schema = SCHEMAS.find(s => s.id === schemaId) || SCHEMAS[0];

  const recurse = (n: QueryNode): any => {
    if (n.type === 'rule') {
      const fieldDef = schema.fields.find(f => f.name === n.field);
      if (!fieldDef) return null;

      // Skip empty rules
      if (fieldDef.type !== 'boolean' && n.operator !== 'between' && (n.value === '' || n.value === undefined || n.value === null)) {
        return null;
      }
      if (n.operator === 'between') {
        if (fieldDef.type === 'number' && (n.value?.min === '' || n.value?.max === '')) return null;
        if (fieldDef.type === 'date' && (!n.value?.start || !n.value?.end)) return null;
      }
      if (n.operator === 'in array' && (!Array.isArray(n.value) || n.value.length === 0)) {
        return null;
      }

      const fieldName = n.field;
      const op = n.operator;
      const val = fieldDef.type === 'number' && op !== 'between' && op !== 'in array' ? Number(n.value) : n.value;

      switch (op) {
        case 'equals':
          return { [fieldName]: val };
        case 'not equals':
          return { [fieldName]: { $ne: val } };
        case 'contains':
          return { [fieldName]: { $regex: String(val), $options: 'i' } };
        case 'starts with':
          return { [fieldName]: { $regex: `^${String(val)}`, $options: 'i' } };
        case 'greater than':
          return { [fieldName]: { $gt: val } };
        case 'less than':
          return { [fieldName]: { $lt: val } };
        case 'between': {
          if (fieldDef.type === 'number') {
            return {
              [fieldName]: {
                $gte: Number(n.value?.min || 0),
                $lte: Number(n.value?.max || 0),
              },
            };
          } else {
            return {
              [fieldName]: {
                $gte: n.value?.start || '',
                $lte: n.value?.end || '',
              },
            };
          }
        }
        case 'in array':
          return { [fieldName]: { $in: Array.isArray(val) ? val : [val] } };
        case 'regex':
          return { [fieldName]: { $regex: String(val) } };
        default:
          return { [fieldName]: val };
      }
    }

    if (n.type === 'group') {
      if (!n.children || n.children.length === 0) return null;

      const childObjects = n.children
        .map(child => recurse(child))
        .filter(obj => obj !== null);

      if (childObjects.length === 0) return null;
      if (childObjects.length === 1) return childObjects[0];

      const key = n.conjunction === 'AND' ? '$and' : '$or';
      return { [key]: childObjects };
    }

    return null;
  };

  const filterObj = recurse(node) || {};
  return JSON.stringify(filterObj, null, 2);
};

/**
 * Generates GraphQL filters matching Hasura style recursively.
 */
export const generateGraphQL = (node: QueryNode, schemaId: string = 'users'): string => {
  const schema = SCHEMAS.find(s => s.id === schemaId) || SCHEMAS[0];

  const recurse = (n: QueryNode): any => {
    if (n.type === 'rule') {
      const fieldDef = schema.fields.find(f => f.name === n.field);
      if (!fieldDef) return null;

      // Skip empty rules
      if (fieldDef.type !== 'boolean' && n.operator !== 'between' && (n.value === '' || n.value === undefined || n.value === null)) {
        return null;
      }
      if (n.operator === 'between') {
        if (fieldDef.type === 'number' && (n.value?.min === '' || n.value?.max === '')) return null;
        if (fieldDef.type === 'date' && (!n.value?.start || !n.value?.end)) return null;
      }
      if (n.operator === 'in array' && (!Array.isArray(n.value) || n.value.length === 0)) {
        return null;
      }

      const fieldName = n.field;
      const op = n.operator;
      const val = fieldDef.type === 'number' && op !== 'between' && op !== 'in array' ? Number(n.value) : n.value;

      switch (op) {
        case 'equals':
          return { [fieldName]: { _eq: val } };
        case 'not equals':
          return { [fieldName]: { _neq: val } };
        case 'contains':
          return { [fieldName]: { _like: `%${val}%` } };
        case 'starts with':
          return { [fieldName]: { _like: `${val}%` } };
        case 'greater than':
          return { [fieldName]: { _gt: val } };
        case 'less than':
          return { [fieldName]: { _lt: val } };
        case 'between': {
          if (fieldDef.type === 'number') {
            return {
              _and: [
                { [fieldName]: { _gte: Number(n.value?.min || 0) } },
                { [fieldName]: { _lte: Number(n.value?.max || 0) } },
              ],
            };
          } else {
            return {
              _and: [
                { [fieldName]: { _gte: n.value?.start || '' } },
                { [fieldName]: { _lte: n.value?.end || '' } },
              ],
            };
          }
        }
        case 'in array':
          return { [fieldName]: { _in: Array.isArray(val) ? val : [val] } };
        case 'regex':
          return { [fieldName]: { _regex: String(val) } };
        default:
          return { [fieldName]: { _eq: val } };
      }
    }

    if (n.type === 'group') {
      if (!n.children || n.children.length === 0) return null;

      const childObjects = n.children
        .map(child => recurse(child))
        .filter(obj => obj !== null);

      if (childObjects.length === 0) return null;
      if (childObjects.length === 1) return childObjects[0];

      const key = n.conjunction === 'AND' ? '_and' : '_or';
      return { [key]: childObjects };
    }

    return null;
  };

  const filterObj = recurse(node) || {};
  return JSON.stringify({ where: filterObj }, null, 2);
};
