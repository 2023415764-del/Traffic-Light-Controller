
/* eslint-disable */

import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ElementTypes } from "./EditableElement_";

let parentPage = null;
let origin = null;

export const EditableContext = createContext({});

export default function withEditableWrapper_(Comp) {
  return function Wrapped(props) {
    const [haveBooted, setHaveBooted] = useState(false);
    const [editModeEnabled, setEditModeEnabled] = useState(false);
    const [selected, setSelected] = useState();
    const [hoveredStack, setHoveredStack] = useState([]);
    const [origin, setOrigin] = useState(null);
    const [overwrittenProps, setOvewrittenProps] = useState({});

    useEffect(() => {
      if (!haveBooted) {
        setHaveBooted(true);
        window.addEventListener("message", (event) => {
          const { type, data } = event.data ?? {};
          switch (type) {
            case "element_editor_enable": {
              setEditModeEnabled(true);
              break;
            }
            case "element_editor_disable": {
              setEditModeEnabled(false);
              break;
            }
            case "override_props": {
              setOvewrittenProps((overwrittenProps) => {
                return {
                  ...overwrittenProps,
                  [data.id]: {
                    ...(overwrittenProps[data.id] ?? {}),
                    ...data.props,
                  },
                };
              });
              break;
            }
          }

          setOrigin(event.origin);
        });
      }
    }, [haveBooted]);

    const postMessageToParent = useCallback(
      (message) => {
        if (origin && window.parent) {
          window.parent.postMessage(message, origin);
        }
      },
      [origin]
    );

    const onElementClick = (props) => {
      setSelected(props.id);
      postMessageToParent({ type: "element_clicked", element: props });
    };

    const hovered = hoveredStack.at(-1);

    const pushHovered = (hovered) => {
      setHoveredStack((hoveredStack) => [
        hovered,
        ...hoveredStack.filter((v) => v !== hovered),
      ]);
    };

    const popHovered = (hovered) => {
      setHoveredStack((hoveredStack) =>
        hoveredStack.filter((v) => v !== hovered)
      );
    };

    return (
      <EditableContext.Provider
        value={{
          attributes: overwrittenProps,
          onElementClick,
          editModeEnabled,
          pushHovered,
          popHovered,
          selected,
          setSelected,
          hovered,
        }}
      >
        <Comp {...props}></Comp>
      </EditableContext.Provider>
    );
  };
}
