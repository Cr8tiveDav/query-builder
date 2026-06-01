import { describe, it, expect, beforeEach } from 'vitest';
import { useQueryStore } from '@/hooks/useQueryStore';
import { SCHEMAS } from '@/utils/schemas';

describe('useQueryStore State Actions', () => {
  beforeEach(() => {
    // Reset state before each test
    useQueryStore.getState().setSchema('users');
    useQueryStore.getState().resetQuery();
  });

  it('should initialize with users schema and a default rule in root group', () => {
    const state = useQueryStore.getState();
    expect(state.currentSchema.id).toBe('users');
    expect(state.queryTree.id).toBe('root');
    expect(state.queryTree.type).toBe('group');
    expect(state.queryTree.conjunction).toBe('AND');
    expect(state.queryTree.children).toHaveLength(1);
    expect(state.queryTree.children[0].type).toBe('rule');
    expect(state.queryTree.children[0].field).toBe('name');
  });

  it('should support switching schemas', () => {
    const store = useQueryStore.getState();
    store.setSchema('products');
    
    const updatedState = useQueryStore.getState();
    expect(updatedState.currentSchema.id).toBe('products');
    expect(updatedState.queryTree.children).toHaveLength(1);
    expect(updatedState.queryTree.children[0].field).toBe('title');
  });

  it('should add rules and groups to parent groups recursively', () => {
    const store = useQueryStore.getState();
    
    // Add rule to root
    store.addRule('root');
    let tree = useQueryStore.getState().queryTree;
    expect(tree.children).toHaveLength(2);
    expect(tree.children[1].type).toBe('rule');

    // Add group to root
    store.addGroup('root');
    tree = useQueryStore.getState().queryTree;
    expect(tree.children).toHaveLength(3);
    expect(tree.children[2].type).toBe('group');

    const innerGroupId = tree.children[2].id;

    // Add rule to inner group
    store.addRule(innerGroupId);
    tree = useQueryStore.getState().queryTree;
    const innerGroup = tree.children[2] as any;
    expect(innerGroup.children).toHaveLength(2); // Initial default rule + added rule
  });

  it('should update rules and reset values when field changes', () => {
    const store = useQueryStore.getState();
    const ruleId = store.queryTree.children[0].id;

    // Update rule value
    store.updateRule(ruleId, { value: 'Nigeria' });
    let rule = useQueryStore.getState().queryTree.children[0] as any;
    expect(rule.value).toBe('Nigeria');

    // Switch field to age (type number, default operator equals, value reset to default number value "")
    store.updateRule(ruleId, { field: 'age' });
    rule = useQueryStore.getState().queryTree.children[0] as any;
    expect(rule.field).toBe('age');
    expect(rule.operator).toBe('equals');
    expect(rule.value).toBe('');
  });

  it('should update group conjunction', () => {
    const store = useQueryStore.getState();
    store.updateGroupConjunction('root', 'OR');
    
    const tree = useQueryStore.getState().queryTree;
    expect(tree.conjunction).toBe('OR');
  });

  it('should delete nodes recursively but prevent deleting the root', () => {
    const store = useQueryStore.getState();
    const ruleId = store.queryTree.children[0].id;

    // Attempt to delete root
    store.removeNode('root');
    expect(useQueryStore.getState().queryTree).not.toBeNull();

    // Delete the only rule
    store.removeNode(ruleId);
    expect(useQueryStore.getState().queryTree.children).toHaveLength(0);
  });

  it('should move nodes inside the tree (drag-and-drop support)', () => {
    const store = useQueryStore.getState();
    
    // Set up: root contains rule1, group1 (which contains rule2)
    const rule1Id = store.queryTree.children[0].id;
    store.addGroup('root');
    
    let tree = useQueryStore.getState().queryTree;
    const group1Id = tree.children[1].id;
    const rule2Id = (tree.children[1] as any).children[0].id;

    // Move rule1 into group1 at index 1
    store.moveNode(rule1Id, group1Id, 1);

    tree = useQueryStore.getState().queryTree;
    expect(tree.children).toHaveLength(1); // rule1 moved
    expect(tree.children[0].id).toBe(group1Id); // group1 remains
    
    const group1 = tree.children[0] as any;
    expect(group1.children).toHaveLength(2);
    expect(group1.children[0].id).toBe(rule2Id);
    expect(group1.children[1].id).toBe(rule1Id);
  });
});
