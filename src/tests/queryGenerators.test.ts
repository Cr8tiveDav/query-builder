import { describe, it, expect } from 'vitest';
import { generateSQL, generateMongoDB, generateGraphQL } from '@/utils/queryGenerators';
import { QueryGroup } from '@/types/query';

describe('Query Generators (SQL, Mongo, GraphQL)', () => {
  const mockTree: QueryGroup = {
    id: 'root',
    type: 'group',
    conjunction: 'OR',
    isCollapsed: false,
    children: [
      {
        id: 'group-a',
        type: 'group',
        conjunction: 'AND',
        isCollapsed: false,
        children: [
          {
            id: 'rule-age',
            type: 'rule',
            field: 'age',
            operator: 'greater than',
            value: 18,
          },
          {
            id: 'rule-country',
            type: 'rule',
            field: 'country',
            operator: 'equals',
            value: 'Nigeria',
          },
        ],
      },
      {
        id: 'group-b',
        type: 'group',
        conjunction: 'AND',
        isCollapsed: false,
        children: [
          {
            id: 'rule-status',
            type: 'rule',
            field: 'status',
            operator: 'equals',
            value: 'active',
          },
          {
            id: 'rule-purchases',
            type: 'rule',
            field: 'purchases',
            operator: 'between',
            value: { min: 10, max: 50 },
          },
        ],
      },
    ],
  };

  it('should generate correct SQL syntax for nested conditions', () => {
    const sql = generateSQL(mockTree, 'users');
    expect(sql).toContain('SELECT * FROM users');
    expect(sql).toContain("WHERE ((`age` > 18 AND `country` = 'Nigeria') OR (`status` = 'active' AND `purchases` BETWEEN 10 AND 50))");
  });

  it('should generate correct MongoDB query filters', () => {
    const mongoStr = generateMongoDB(mockTree, 'users');
    const mongoObj = JSON.parse(mongoStr);

    expect(mongoObj.$or).toHaveLength(2);
    expect(mongoObj.$or[0].$and).toHaveLength(2);
    expect(mongoObj.$or[0].$and[0].age.$gt).toBe(18);
    expect(mongoObj.$or[0].$and[1].country).toBe('Nigeria');
    
    expect(mongoObj.$or[1].$and).toHaveLength(2);
    expect(mongoObj.$or[1].$and[0].status).toBe('active');
    expect(mongoObj.$or[1].$and[1].purchases.$gte).toBe(10);
    expect(mongoObj.$or[1].$and[1].purchases.$lte).toBe(50);
  });

  it('should generate correct GraphQL queries in Hasura-style', () => {
    const gqlStr = generateGraphQL(mockTree, 'users');
    const gqlObj = JSON.parse(gqlStr);

    expect(gqlObj.where._or).toHaveLength(2);
    expect(gqlObj.where._or[0]._and).toHaveLength(2);
    expect(gqlObj.where._or[0]._and[0].age._gt).toBe(18);
    expect(gqlObj.where._or[0]._and[1].country._eq).toBe('Nigeria');

    expect(gqlObj.where._or[1]._and).toHaveLength(2);
    expect(gqlObj.where._or[1]._and[0].status._eq).toBe('active');
    expect(gqlObj.where._or[1]._and[1]._and).toHaveLength(2);
    expect(gqlObj.where._or[1]._and[1]._and[0].purchases._gte).toBe(10);
    expect(gqlObj.where._or[1]._and[1]._and[1].purchases._lte).toBe(50);
  });

  it('should skip incomplete rules and empty groups gracefully', () => {
    const incompleteTree: QueryGroup = {
      id: 'root',
      type: 'group',
      conjunction: 'AND',
      children: [
        {
          id: 'rule-valid',
          type: 'rule',
          field: 'name',
          operator: 'equals',
          value: 'John',
        },
        {
          id: 'rule-empty',
          type: 'rule',
          field: 'age',
          operator: 'equals',
          value: '', // empty value -> skip
        },
        {
          id: 'group-empty',
          type: 'group',
          conjunction: 'OR',
          children: [], // empty group -> skip
        },
      ],
    };

    const sql = generateSQL(incompleteTree, 'users');
    expect(sql).toBe("SELECT * FROM users\nWHERE `name` = 'John';");

    const mongoObj = JSON.parse(generateMongoDB(incompleteTree, 'users'));
    expect(mongoObj).toEqual({ name: 'John' });

    const gqlObj = JSON.parse(generateGraphQL(incompleteTree, 'users'));
    expect(gqlObj.where).toEqual({ name: { _eq: 'John' } });
  });

  it('should handle "in array" operator correctly', () => {
    const listTree: QueryGroup = {
      id: 'root',
      type: 'group',
      conjunction: 'AND',
      children: [
        {
          id: 'rule-status-list',
          type: 'rule',
          field: 'status',
          operator: 'in array',
          value: ['active', 'pending'],
        },
      ],
    };

    const sql = generateSQL(listTree, 'users');
    expect(sql).toContain("`status` IN ('active', 'pending')");

    const mongoObj = JSON.parse(generateMongoDB(listTree, 'users'));
    expect(mongoObj.status.$in).toEqual(['active', 'pending']);

    const gqlObj = JSON.parse(generateGraphQL(listTree, 'users'));
    expect(gqlObj.where.status._in).toEqual(['active', 'pending']);
  });
});
