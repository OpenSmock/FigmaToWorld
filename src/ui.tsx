import { Button, Container, render, VerticalSpace, Text, Dropdown, Stack, Toggle } from "@create-figma-plugin/ui"
import { emit, on } from "@create-figma-plugin/utilities"
import { h, JSX } from "preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { downloadJSONImages} from "./events"
import { RequestDesignTitle, ResponseDesignTitle, RequestJSONAndImages, ResponseJSONAndImages } from "./events"

/* figmaToWorldPlugin function launches the plugin logic.*/
function figmaToWorldPlugin() {

  /* Background colors for the plugin UI */
  const style = { backgroundColor: 'var(--figma-color-bg-hover)' }
  const style2 = { backgroundColor: 'var(--figma-color-bg-disabled)' }
  const style3 = { backgroundColor: 'var(--figma-color-border-brand-strong)' }

  /* Definition of states from the document title, UI's dropdowns/toggle values, as well as downloading state. 
  It allows to preserve the value between UI's/back-end messages exchanges.*/

  const [documentTitle, setDocumentTitle] = useState<string | null>(null)
  const [jsondropdownValue, setJsonDropdownValue] = useState<string>('Page')
  const [imagesdropdownValue, setImagesDropdownValue] = useState<string>('Page')
  const [downloadValue, setDownloadValue] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  /* Retrieves the figma design's title and sets it into the variable documentTitle*/

  useEffect(() => { 
    on<ResponseDesignTitle>(`responseDesignTitle`, (documentTitle) => {
      setDocumentTitle(documentTitle)
    })
    setTimeout(() => emit<RequestDesignTitle>(`requestDesignTitle`), 200)
  }, [])

  /* Sends data to the back-end so that the plugin will retrieve the images and json. 
  Then, the download will be launched.*/

  const downloadJSONAndImages = useCallback(() => {
    setDownloading(true)
      on<ResponseJSONAndImages>("responseJSON", (json: string, images: Object) => {
        // @ts-ignore
         downloadJSONImages(json, images, documentTitle, downloadValue)       
      })
      setTimeout(() => emit<RequestJSONAndImages>("requestJSON", jsondropdownValue, imagesdropdownValue), 400)
    },
    [jsondropdownValue, imagesdropdownValue, downloadValue, documentTitle]
  )

/* UI's rendered code */
  return (
    <Container  space='medium' style={style}>
      <VerticalSpace space='medium' />
      <div style={{
        width: '87px',
      }}>
        <Text style={{ marginBottom: 8, fontSize: 20}}>JSON</Text>
        <VerticalSpace space='extraSmall' />
        <Dropdown onChange={function (event: JSX.TargetedEvent<HTMLInputElement>) {
              setJsonDropdownValue(event.currentTarget.value);
            }} options={[{
              value: 'Everything'
            }, {
              value: 'Page'
            }, {
              value: 'Selection'
            }]} value={jsondropdownValue} variant="border" />
      </div>
      <VerticalSpace space='extraLarge' />
      <div style={{
        width: '87px'
      }}>
        <Text style={{ marginBottom: 8, fontSize: 20}}>Images</Text>
        <VerticalSpace space='extraSmall' />
        <Dropdown onChange={function (event: JSX.TargetedEvent<HTMLInputElement>) {
              setImagesDropdownValue(event.currentTarget.value);
            }} options={[{
              value: 'Everything'
            }, {
              value: 'Page'
            }, {
              value: 'Selection'
            }]} value={imagesdropdownValue} variant="border" />
      </div>
      <VerticalSpace space='extraLarge' />
      <div>
        <Text style={{ marginBottom: 8, fontSize: 20}}>Download</Text>
        <VerticalSpace space='extraSmall' />
            <div >
              <Toggle onChange={function (event: JSX.TargetedEvent<HTMLInputElement>) {
              setDownloadValue(event.currentTarget.checked);
            }} value={downloadValue}>
                <Text>{downloadValue ? 'JSON and Images': 'JSON'}</Text>
              </Toggle>
            </div>
      <VerticalSpace space='large' />
      <Button style={style3} onClick={downloadJSONAndImages} disabled={downloading}>
      {downloading ? "Please close plugin and relaunch" : "Download "}
      </Button>
      <VerticalSpace space='extraLarge' />
      </div>
    </Container>
  )
}

export default render(figmaToWorldPlugin)