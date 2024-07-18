import { Button, Stack, Tile } from "@carbon/react"
import { Handle, NodeProps, Position } from "reactflow"

import { ServiceId } from "@carbon/react/icons"
import { FlowType, Role } from "../../api/eipSchema"
import { EipFlowNode, EipNodeData } from "../../api/flow"
import { ChildNodeId, EipId } from "../../api/id"
import { lookupEipComponent } from "../../singletons/eipDefinitions"
import getIconUrl from "../../singletons/eipIconCatalog"
import {
  useAppActions,
  useGetChildren,
  useIsChildSelected,
} from "../../singletons/store"
import { toTitleCase } from "../../utils/titleTransform"
import "./nodes.scss"

interface ChildrenIconsProps {
  childrenNames: string[]
  parentNodeId: string
  parentEipId: EipId
}

const defaultNamespace = "integration"

// TODO: Limit handles to the appropriate number of connections
const renderHandles = (flowType: FlowType) => {
  switch (flowType) {
    case "source":
      return <Handle type="source" position={Position.Right}></Handle>
    case "sink":
      return <Handle type="target" position={Position.Left}></Handle>
    case "passthru":
      return (
        <>
          <Handle type="source" position={Position.Right}></Handle>
          <Handle type="target" position={Position.Left}></Handle>
        </>
      )
    default:
      console.error("unhandled FlowType")
  }
}

export const getDimensions = (eipId: EipId, node: EipFlowNode) => {
  if (eipId.name.includes("adapter")) {
    node.height = 128, node.width = 128
  } 
  else if (eipId.name.includes("splitter")) {
    node.height = 106, node.width = 114
  }
  else if (eipId.name.includes("filter")) {
    node.height = 76, node.width = 114
  }
  else if (eipId.name.includes("control")) {
    node.height = 116, node.width = 114
  }
  else if (eipId.name.includes("router")) {
    node.height = 70, node.width = 114
  }
  else if (eipId.name.includes("expression")) {
    node.height = 81, node.width = 100
  }
  else if (eipId.name.includes("script")) {
    node.height = 81, node.width = 69
  }
  else if (eipId.name === ("channel") || eipId.name.includes("activator")) {
    node.height = 89, node.width = 114
  }
  else if (eipId.name === ("wire-tap")) {
    node.height = 75, node.width = 114
  }
  else if (eipId.name === ("aggregator")) {
    node.height = 106, node.width = 114
  }
  else if (eipId.name === ("management")) {
    node.height = 98, node.width = 114
  }
  else if (eipId.name === ("message-history")) {
    node.height = 86, node.width = 114
  }
  else if (eipId.name === ("poller")) {
    node.height = 86, node.width = 99
  }
  else if (eipId.name.includes("interceptor")) {
    node.height = 75, node.width = 114
  }
  else if (eipId.name.includes("config")) {
    node.height = 84, node.width = 85
  }
  else if (eipId.name.includes("barrier")) {
    node.height = 102, node.width = 109
  }
  else if (eipId.name.includes("bridge")) {
    node.height = 62, node.width = 77
  }
  else if (eipId.name.includes("handler")) {
    node.height = 80, node.width = 97
  }
  else if (eipId.name.includes("idempotent")) {
    node.height = 62, node.width = 114
  }
  else if (eipId.name.includes("resequencer")) {
    node.height = 73, node.width = 114
  }
  else if (eipId.name.includes("scatter")) {
    node.height = 87, node.width = 114
  }
  else if (eipId.name.includes("selector")) {
    node.height = 85, node.width = 114
  }
  else if (eipId.name.includes("spel")) {
    node.height = 87, node.width = 94
  }
  else if (eipId.name === ("publish-subscribe-channel")) {
    if (eipId.namespace.includes("jms")) {
      node.height = 99, node.width = 128
    } else if (eipId.namespace.includes("integration")) {
      node.height = 89, node.width = 118
    }
  }
  else if (eipId.name.includes("gateway")) {
    if (eipId.name.includes("tcp") || eipId.namespace.includes("web-services")) {
      node.height = 123, node.width = 128
    } else {
      node.height = 113, node.width = 110
    }
  } else if (eipId.name.includes("transformer")) {
    if (eipId.name.includes("unmarsh") || eipId.name.includes("byte") || eipId.name.includes("file-to-string") || 
        eipId.name.includes("payload")) {
      node.height = 97, node.width = 128
    } else if (eipId.name.includes("xslt") || eipId.name.includes("stream") || (eipId.namespace.includes("integration") && eipId.name.includes("transformer"))) {
      node.height = 87, node.width = 100
    } else if (eipId.name.includes("marshall") || eipId.name.includes("object-to-string")) {
      node.height = 87, node.width = 126
    } else if (eipId.name.includes("syslog") || eipId.name.includes("object-to-map")) {
      node.height = 87, node.width = 120
    } else if (eipId.name.includes("xpath")) {
      node.height = 87, node.width = 105
    }
  } else if (eipId.name.includes("enricher")) {
    if (eipId.namespace.includes("jms") || eipId.namespace.includes("integration")) {
      node.height = 76, node.width = 114
    } else if (eipId.namespace.includes("web-services")) {
      node.height = 86, node.width = 128
    } else if (eipId.namespace.includes("xml")) {
      node.height = 76, node.width = 120
    }
  } else if (eipId.name.includes("factory")) {
    if (eipId.namespace.includes("tcp")) {
      node.height = 91, node.width = 128
    } else if (eipId.namespace.includes("integration")) {
      node.height = 109, node.width = 128
    }
  } else if (eipId.name.includes("claim")) {
    if (eipId.name.includes("check-in")) {
      node.height = 90, node.width = 75
    } else if (eipId.name.includes("check-out")) {
      node.height = 90, node.width = 80
    }
  } 

  return node
}

const getNamespacedTitle = (eipId: EipId) => {
  if (eipId.namespace === defaultNamespace) {
    return toTitleCase(eipId.name)
  }
  return toTitleCase(eipId.namespace) + " " + toTitleCase(eipId.name)
}

const getClassNames = (props: NodeProps<EipNodeData>, role: Role) => {
  const roleClsName =
    role === "channel" ? "eip-channel-node" : "eip-endpoint-node"
  const selectedClsName = props.selected ? "eip-node-selected" : ""
  return ["eip-node", roleClsName, selectedClsName].join(" ")
}

const ChildIconButton = (props: ChildNodeId) => {
  const { updateSelectedChildNode } = useAppActions()
  const selected = useIsChildSelected(props)

  const clsNames = ["child-icon-button"]
  selected && clsNames.push("child-icon-button-focused")

  return (
    <Button
      className={clsNames.join(" ")}
      hasIconOnly
      renderIcon={ServiceId}
      iconDescription={props.name}
      size="sm"
      tooltipPosition="bottom"
      kind="primary"
      onClick={(ev) => {
        ev.stopPropagation()
        updateSelectedChildNode(props)
      }}
    />
  )
}

// TODO: Account for a large number of children to be displayed
// TODO: Create a mapping of children to icons (with a fallback option)
const ChildrenIcons = ({ childrenNames, parentNodeId }: ChildrenIconsProps) => {
  return (
    <Stack className="eip-node-children" orientation="horizontal" gap={2}>
      {childrenNames.map((name) => (
        <ChildIconButton key={name} name={name} parentNodeId={parentNodeId} />
      ))}
    </Stack>
  )
}

// TODO: Consider separating into Endpoint and Channel custom node types
const EipNode = (props: NodeProps<EipNodeData>) => {
  // TODO: clearSelectedChildNode is used in too many different components. See if that can be reduced (or elimnated).
  const { clearSelectedChildNode } = useAppActions()
  const childrenState = useGetChildren(props.id)
  const hasChildren = childrenState.length > 0

  const { data } = props
  const componentDefinition = lookupEipComponent(data.eipId)!
  const handles = renderHandles(componentDefinition.flowType)

  return (
    <Tile
      className={getClassNames(props, componentDefinition.role)}
      onClick={hasChildren ? () => clearSelectedChildNode() : undefined}
    >
      <div>{getNamespacedTitle(data.eipId)}</div>
      <img className="eip-node-image" src={getIconUrl(data.eipId)} />
      <div style={hasChildren ? { paddingBottom: "0.5rem" } : {}}>
        <strong>{data.label}</strong>
      </div>
      {hasChildren && (
        <ChildrenIcons
          childrenNames={childrenState}
          parentNodeId={props.id}
          parentEipId={props.data.eipId}
        />
      )}
      {handles}
    </Tile>
  )
}

export default EipNode
