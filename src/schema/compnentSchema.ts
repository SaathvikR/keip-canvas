import { EipId } from "../api/eip"
import schema from "./json/components.json?raw"

interface Restriction {
  enum?: string[]
}

export interface Attribute {
  name: string
  type: "string" | "boolean"
  description?: string
  default?: string | number | boolean
  required?: boolean
  restriction?: Restriction
}

export enum FlowType {
  Source = "source",
  Sink = "sink",
  Passthru = "passthru",
}

export interface EIPComponent {
  name: string
  role: "endpoint" | "channel"
  flowType: FlowType
  description?: string
  attributes?: Attribute[]
}

type EIPSchema = Record<string, EIPComponent[]>

export const eipComponentSchema: EIPSchema = JSON.parse(schema)

const getFlatMap = (schema: EIPSchema) => {
  const map = new Map<string, EIPComponent>()
  for (const [namespace, componentList] of Object.entries(schema)) {
    componentList.forEach((c) => map.set(`${namespace}.${c.name}`, c))
  }
  return map
}

const componentFlatMap = getFlatMap(eipComponentSchema)

export const lookupEipComponent = (eipId: EipId) => {
  return componentFlatMap.get(`${eipId.namespace}.${eipId.name}`)
}
