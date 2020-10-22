import { Editor, Transforms, createEditor, Node } from "slate";
import React from "react";

export default class SlateUtil {
  static LIST_TYPES = Object.freeze(["numbered-list", "bulleted-list"]);

  static toggleBlock(editor, format) {
    const isActive = SlateUtil.isBlockActive(editor, format);
    const isList = SlateUtil.LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) => SlateUtil.LIST_TYPES.includes(n.type),
      split: true,
    });

    Transforms.setNodes(editor, {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    });

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  }

  static toggleMark(editor, format) {
    const isActive = SlateUtil.isMarkActive(editor, format);

    console.log("format", format, isActive);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  }

  static isMarkActive(editor, format) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  }

  static isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === format,
    });

    return !!match;
  }

  static Leaf({ attributes, children, leaf }) {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.code) {
      children = <code>{children}</code>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
  }

  static Element({ attributes, children, element }) {
    switch (element.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }
}
