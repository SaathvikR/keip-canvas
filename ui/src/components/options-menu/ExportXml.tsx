import { OverflowMenuItem } from "@carbon/react"
import { OverflowMenuItemProps } from "@carbon/react/lib/components/OverflowMenuItem/OverflowMenuItem"
import { forwardRef } from "react"

// Placeholder for planned export to Spring Integration XML feature.
const ExportXml = forwardRef<HTMLElement>(
  (props: OverflowMenuItemProps, ref) => {
    return <OverflowMenuItem {...props} ref={ref} itemText="Export XML" />
  }
)

ExportXml.displayName = "ExportXml"

export default ExportXml
