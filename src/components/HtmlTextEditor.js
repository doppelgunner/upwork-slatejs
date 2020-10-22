import React, { useEffect, useMemo, useState, useCallback } from "react";
// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, useSlate, useSelected } from "slate-react";
import isHotkey from "is-hotkey";
import SlateUtil from "../utils/SlateUtil.js";
import classNames from "classnames";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";

const HOTKEYS = {
  "ctrl+b": "bold",
  "ctrl+i": "italic",
  "ctrl+u": "underline",
  "ctrl+`": "code",
};

const BlockButton = (props) => {
  const { icon, reversed, format } = props;

  const editor = useSlate();
  const active = SlateUtil.isBlockActive(editor, format);

  return (
    <span
      className={classNames(
        "icon-button",
        reversed ? (active ? "reversed" : null) : active ? "active" : null
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        SlateUtil.toggleBlock(editor, format);
      }}
    >
      {icon}
    </span>
  );
};

const MarkButton = (props) => {
  const { icon, reversed, format } = props;

  const editor = useSlate();
  const active = SlateUtil.isMarkActive(editor, format);

  return (
    <span
      className={classNames(
        "icon-button",
        reversed ? (active ? "reversed" : null) : active ? "active" : null
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        SlateUtil.toggleMark(editor, format);
      }}
    >
      {icon}
    </span>
  );
};

const HtmlTextEditor = (elementProps) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  // Add the initial value when setting up our state.
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    },
  ]);

  const renderElement = useCallback(
    (props) => <SlateUtil.Element {...props} />,
    []
  );
  const renderLeaf = useCallback((props) => <SlateUtil.Leaf {...props} />, []);

  return (
    <div className="html-editor" style={elementProps.style}>
      <Slate
        editor={editor}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <div className="html-editor__tools">
          <MarkButton icon={<BoldOutlined />} format="bold" />
          <MarkButton icon={<ItalicOutlined />} format="italic" />
          <MarkButton icon={<UnderlineOutlined />} format="underline" />
        </div>
        <div className="html-editor__text-area">
          <Editable
            onKeyDown={(event) => {
              if (event.key === "&") {
                // Prevent the ampersand character from being inserted.
                event.preventDefault();
                // Execute the `insertText` method when the event occurs.
                editor.insertText("and");
              }
            }}
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  SlateUtil.toggleMark(editor, mark);
                }
              }
            }}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </div>
      </Slate>
    </div>
  );
};

export default HtmlTextEditor;
