import { Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@carbon/react"

import { ReactNode } from "react"

interface ConfigurationTabProps {
  hasAttributes: boolean
  hasChildren: boolean
  attributesForm: React.ReactNode
  childrenForm: React.ReactNode
}

// Workaround for 'TabList' component not filtering out null-like children.
const getTabs = (hasAttributes: boolean, hasChildren: boolean) => {
  const tabList = [] as ReactNode[]
  hasAttributes && tabList.push(<Tab key="attributes">Attributes</Tab>)
  hasChildren && tabList.push(<Tab key="children">Children</Tab>)
  return tabList
}

// Workaround for 'TabPanels' component not filtering out null-like children.
const getTabPanels = ({
  hasAttributes,
  hasChildren,
  attributesForm,
  childrenForm,
}: ConfigurationTabProps) => {
  const tabPanels = [] as ReactNode[]
  hasAttributes &&
    tabPanels.push(
      <TabPanel key="attributes" className="side-panel-unpadded-container">
        {attributesForm}
      </TabPanel>
    )
  hasChildren &&
    tabPanels.push(<TabPanel key="children">{childrenForm}</TabPanel>)
  return tabPanels
}

const ConfigurationInputTabs = (props: ConfigurationTabProps) => (
  <Stack gap={4}>
    <Tabs>
      <TabList aria-label="Attributes/children toggle" contained fullWidth>
        {getTabs(props.hasAttributes, props.hasChildren)}
      </TabList>
      <TabPanels>{getTabPanels(props)}</TabPanels>
    </Tabs>
  </Stack>
)

export default ConfigurationInputTabs
