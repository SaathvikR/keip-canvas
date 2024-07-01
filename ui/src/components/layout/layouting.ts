import { Edge, Position } from "reactflow"
import { EipFlowNode } from "../../api/flow"
import { Layout } from "../../api/flow"
import dagre from "@dagrejs/dagre"

const NODE_WIDTH = 128
const NODE_HEIGHT = 128

const graph = new dagre.graphlib.Graph()
graph.setDefaultEdgeLabel(() => ({}))

export const newFlowLayout = (
  nodes: EipFlowNode[],
  edges: Edge[],
  layout: Layout
) => {
  const direction = layout.orientation === "horizontal" ? "LR" : "TB"

  const isHorizontal = layout.orientation === "horizontal"

  let edgeSeperation
  const nodeSeperation = 50

  if (layout.density === "compact") {
    edgeSeperation = 50
  } else if (layout.density === "cozy") {
    edgeSeperation = 150
  } else if (layout.density === "comfortable") {
    edgeSeperation = 250
  }

  graph.setGraph({
    rankdir: direction,
    edgesep: edgeSeperation,
    ranksep: edgeSeperation,
    nodesep: nodeSeperation,
  })

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  edges.forEach((edge) => {
    edge.type = "simplebezier"
    graph.setEdge(edge.source, edge.target)
  })

  dagre.layout(graph)

  const newNodes = nodes.map((node) => {
    const positionedNode = graph.node(node.id)
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: positionedNode.x - NODE_WIDTH / 2,
        y: positionedNode.y - NODE_HEIGHT / 2,
      },
    }
  })

  return newNodes
}
