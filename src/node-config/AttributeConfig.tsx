import { Information } from "@carbon/icons-react"
import {
    Accordion,
    AccordionItem,
    Form,
    FormLabel,
    Select,
    SelectItem,
    Stack,
    TextInput,
    Toggle,
    Tooltip,
} from "@carbon/react"
import { ReactNode } from "react"

// TODO: Consider unifying with AttributeSchema type
export interface Attribute {
  name: string
  type: "string" | "boolean"
  required: boolean
  description?: string
  default?: string | number | boolean
  allowedValues?: string[]
}

type DescriptionWrapperProps = {
  id: string
  description: string | undefined
  children: ReactNode
}

const AttributeSelectInput = (props: Attribute) => {
  const emptySelect = ""
  const options = props.default
    ? props.allowedValues!
    : [emptySelect, ...props.allowedValues!]

  return (
    <DescriptionTooltipWrapper id={props.name} description={props.description}>
      <Select
        id={props.name}
        labelText={props.name}
        defaultValue={props.default}
        hideLabel={Boolean(props.description)}
      >
        {options.map((item) => (
          <SelectItem key={item} value={item} text={item} />
        ))}
      </Select>
    </DescriptionTooltipWrapper>
  )
}

const AttributeBoolInput = (props: Attribute) => (
  <DescriptionTooltipWrapper id={props.name} description={props.description}>
    <div style={{ display: "block" }}>
      <Toggle
        id={props.name}
        labelText={props.description ? "" : props.name}
        labelA=""
        labelB=""
        defaultToggled={Boolean(props.default)}
        hideLabel={Boolean(props.description)}
      />
    </div>
  </DescriptionTooltipWrapper>
)

const AttributeTextInput = (props: Attribute) => (
  <DescriptionTooltipWrapper id={props.name} description={props.description}>
    <TextInput
      id={props.name}
      labelText={props.name}
      defaultValue={props.default ? String(props.default) : ""}
      hideLabel={Boolean(props.description)}
    />
  </DescriptionTooltipWrapper>
)

// const TextInputWithDescription = (props: Attribute) => {
//   const tooltipDivId = `tooltip-hack-${props.name}`

//   // Workaround for tooltip popover not 'escaping' the side panel boundary.
//   // The side panel requires vertical scrolling and so this does not allow overflow-x to be set to visible.
//   // This workaround detachesuses JS to position the popover dynamically.
//   // Long-term we would be better served by implementing our own Tooltip based on the Popover component,
//   // to have greater control over the underlying DOM elements.
//   const tooltipWorkaroundHandler: React.MouseEventHandler = (e) => {
//     const icon: Element = e.target
//     const tooltipParent = document.getElementById(tooltipDivId)

//     const tooltip = tooltipParent?.getElementsByClassName(
//       "cds--tooltip-content"
//     )[0]

//     const rect = icon.getBoundingClientRect()
//     tooltip.style.left = `${rect.left}px`
//     tooltip.style.top = `${rect.top}px`
//     tooltip.style.position = "fixed"
//   }

//   return (
//     <div id={tooltipDivId}>
//       <FormLabel className="form-input-label">{props.name}</FormLabel>
//       <Tooltip align="top" label={props.description}>
//         <Information onMouseEnter={tooltipWorkaroundHandler} />
//       </Tooltip>
//       <AttributeTextInput {...props} hideLabel />
//     </div>
//   )
// }

const DescriptionTooltipWrapper = (props: DescriptionWrapperProps) => {
  if (!props.description) {
    return props.children
  }

  const tooltipDivId = `tooltip-hack-${props.id}`

  // Workaround for tooltip popover not 'escaping' the side panel boundary.
  // The side panel requires vertical scrolling and so this does not allow overflow-x to be set to visible.
  // This workaround detachesuses JS to position the popover dynamically.
  // Long-term we would be better served by implementing our own Tooltip based on the Popover component,
  // to have greater control over the underlying DOM elements.
  const tooltipWorkaroundHandler: React.MouseEventHandler = (e) => {
    const icon: Element = e.target
    const tooltipParent = document.getElementById(tooltipDivId)

    const tooltip = tooltipParent?.getElementsByClassName(
      "cds--tooltip-content"
    )[0]

    const rect = icon.getBoundingClientRect()
    tooltip.style.left = `${rect.left}px`
    tooltip.style.top = `${rect.top}px`
    tooltip.style.position = "fixed"
  }

  return (
    <div id={tooltipDivId}>
      <FormLabel className="form-input-label">{props.id}</FormLabel>
      <Tooltip align="top" label={props.description}>
        <Information onMouseEnter={tooltipWorkaroundHandler} />
      </Tooltip>
      {props.children}
    </div>
  )
}

const AttributeInput = (props: Attribute) => {
  switch (props.type) {
    case "string":
      if (props.allowedValues) {
        return <AttributeSelectInput {...props} />
      }
      return <AttributeTextInput {...props} />

    case "boolean":
      return <AttributeBoolInput {...props} />

    default:
      console.warn(`unknown type: ${props.type}`)
  }
}

const AttributeConfigForm = (props: { attrs: Attribute[] }) => {
  const required = props.attrs.filter((attr) => attr.required)
  const optional = props.attrs.filter((attr) => !attr.required)

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Accordion isFlush size="lg">
        {required.length ? (
          <AccordionItem title="Required" open>
            <Stack gap={6}>
              {required.map((attr) => (
                <AttributeInput key={attr.name} {...attr} />
              ))}
            </Stack>
          </AccordionItem>
        ) : null}
        {optional.length ? (
          <AccordionItem title="Optional">
            <Stack gap={6}>
              {optional.map((attr) => (
                <AttributeInput key={attr.name} {...attr} />
              ))}
            </Stack>
          </AccordionItem>
        ) : null}
      </Accordion>
    </Form>
  )
}

export default AttributeConfigForm