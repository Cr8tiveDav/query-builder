import React from "react";
import { describe, it, expect } from "vitest";
import { highlightSQL, highlightJSON } from "@/components/layout/OutputPreview";

describe("OutputPreview Syntax Highlighting", () => {
  describe("highlightSQL", () => {
    it("should highlight SQL keywords", () => {
      const line = "SELECT * FROM users WHERE";
      const nodes = highlightSQL(line);

      // Helper to find React elements by text
      const findNodeByText = (text: string) =>
        nodes.find(
          (n) => React.isValidElement(n) && n.props.children === text
        ) as React.ReactElement | undefined;

      const selectNode = findNodeByText("SELECT");
      expect(selectNode).toBeDefined();
      expect(selectNode?.props.className).toContain("text-violet-400");
      expect(selectNode?.props.className).toContain("font-bold");

      const fromNode = findNodeByText("FROM");
      expect(fromNode).toBeDefined();
      expect(fromNode?.props.className).toContain("text-violet-400");

      const whereNode = findNodeByText("WHERE");
      expect(whereNode).toBeDefined();
      expect(whereNode?.props.className).toContain("text-violet-400");
    });

    it("should highlight backticked identifiers", () => {
      const line = "WHERE `age` > 18";
      const nodes = highlightSQL(line);

      const findNodeByText = (text: string) =>
        nodes.find(
          (n) => React.isValidElement(n) && n.props.children === text
        ) as React.ReactElement | undefined;

      const ageNode = findNodeByText("`age`");
      expect(ageNode).toBeDefined();
      expect(ageNode?.props.className).toContain("text-sky-400");
      expect(ageNode?.props.className).toContain("font-medium");
    });

    it("should highlight operators and numbers", () => {
      const line = "WHERE age > 18";
      const nodes = highlightSQL(line);

      const findNodeByText = (text: string) =>
        nodes.find(
          (n) => React.isValidElement(n) && n.props.children === text
        ) as React.ReactElement | undefined;

      const opNode = findNodeByText(">");
      expect(opNode).toBeDefined();
      expect(opNode?.props.className).toContain("text-teal-400");
      expect(opNode?.props.className).toContain("font-semibold");

      const numNode = findNodeByText("18");
      expect(numNode).toBeDefined();
      expect(numNode?.props.className).toContain("text-pink-400");
    });

    it("should highlight string literals", () => {
      const line = "WHERE name = 'John'";
      const nodes = highlightSQL(line);

      const findNodeByText = (text: string) =>
        nodes.find(
          (n) => React.isValidElement(n) && n.props.children === text
        ) as React.ReactElement | undefined;

      const strNode = findNodeByText("'John'");
      expect(strNode).toBeDefined();
      expect(strNode?.props.className).toContain("text-emerald-400");
    });
  });

  describe("highlightJSON (MongoDB & GraphQL)", () => {
    it("should highlight regular keys vs operator keys", () => {
      const line = '  "where": { "$and": [] }';
      const nodes = highlightJSON(line);

      const findNodeByText = (text: string) =>
        nodes.find(
          (n) => React.isValidElement(n) && n.props.children === text
        ) as React.ReactElement | undefined;

      const keyNode = findNodeByText('"where"');
      expect(keyNode).toBeDefined();
      expect(keyNode?.props.className).toContain("text-sky-400");
      expect(keyNode?.props.className).toContain("font-semibold");

      const opNode = findNodeByText('"$and"');
      expect(opNode).toBeDefined();
      expect(opNode?.props.className).toContain("text-violet-400");
      expect(opNode?.props.className).toContain("font-bold");
    });

    it("should highlight string values, numbers, and booleans", () => {
      const line = '  "name": "Nigeria", "age": 18, "isActive": true';
      const nodes = highlightJSON(line);

      const findNodeByText = (text: string) =>
        nodes.find(
          (n) => React.isValidElement(n) && n.props.children === text
        ) as React.ReactElement | undefined;

      const strValNode = findNodeByText('"Nigeria"');
      expect(strValNode).toBeDefined();
      expect(strValNode?.props.className).toContain("text-emerald-400");

      const numValNode = findNodeByText("18");
      expect(numValNode).toBeDefined();
      expect(numValNode?.props.className).toContain("text-pink-400");

      const boolValNode = findNodeByText("true");
      expect(boolValNode).toBeDefined();
      expect(boolValNode?.props.className).toContain("text-teal-400");
      expect(boolValNode?.props.className).toContain("font-bold");
    });

    it("should highlight structure brackets and separators", () => {
      const line = '{ "array": [1, 2] }';
      const nodes = highlightJSON(line);

      const findNodeByText = (text: string) =>
        nodes.find(
          (n) => React.isValidElement(n) && n.props.children === text
        ) as React.ReactElement | undefined;

      const openBrace = findNodeByText("{");
      expect(openBrace).toBeDefined();
      expect(openBrace?.props.className).toContain("text-zinc-500");

      const openBracket = findNodeByText("[");
      expect(openBracket).toBeDefined();
      expect(openBracket?.props.className).toContain("text-zinc-500");
    });
  });
});
