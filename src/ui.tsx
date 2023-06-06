import { Button, Container, render, Textbox, VerticalSpace, Text, Dropdown, Stack, Toggle } from "@create-figma-plugin/ui"
import { emit, on } from "@create-figma-plugin/utilities"
import { h, JSX } from "preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { downloadJSONImages } from "./events"
import { RequestDesignTitle, ResponseDesignTitle, RequestJSONAndImages, ResponseJSONAndImages} from "./events"

/**
 * figmaPlugin function launches the plugin logic.
 * Check https://yuanqing.github.io/create-figma-plugin/recipes/ for more info on how to handle passing data between the plugin and UI.
 * @returns the plugin's UI HTML with according generated events
 */
function figmaPlugin() {
  /*Definition of two states for the document title and the filename to be saved as strings. This allows us to preserve the value between renders. For more info: https://www.geeksforgeeks.org/what-is-usestate-in-react/ and https://beta.reactjs.org/reference/react/useState*/
  const [documentTitle, setDocumentTitle] = useState<string | null>(null)
  const [jsondropdownValue, setJsonDropdownValue] = useState<string>('Page')
  const [imagesdropdownValue, setImagesDropdownValue] = useState<string>('Page')
  const [toggleValue, setToggleValue] = useState<boolean>(true);
  
  /*zip filename declaration*/
  const filename = `${documentTitle}` 
  const value= `${toggleValue}`
  console.log("toggle", value)

  /*By using this Hook, you tell React that your component needs to do something after render. 
  React will remember the function you passed (we’ll refer to it as our “effect”), 
  and call it later after performing the DOM updates. 
  In this effect, we set the document title, but we could also perform data fetching or call some other imperative API.
  For more info: https://reactjs.org/docs/hooks-effect.html*/
  useEffect(() => {
    on<ResponseDesignTitle>(`responseDesignTitle`, (documentTitle) => {
      setDocumentTitle(documentTitle)
    })
    setTimeout(() => emit<RequestDesignTitle>(`requestDesignTitle`), 200)
  }, [])



  /**
 * Returns a memorized version of the callback that only changes if one of the `inputs` has changed.
 */
  const downloadJSONAndImages = useCallback(() => {
      on<ResponseJSONAndImages>("responseJSON", (json: string, images: Object) => {
        downloadJSONImages(json, images, filename, toggleValue )
      })
      
      setTimeout(() => emit<RequestJSONAndImages>("requestJSON", jsondropdownValue, imagesdropdownValue), 200)
    },
    [jsondropdownValue, imagesdropdownValue, toggleValue, filename]
  )

/*Background colors for the plugin UI*/
const style = { backgroundColor: 'var(--figma-color-bg-hover)' }
const style2 = { backgroundColor: 'var(--figma-color-bg-disabled)' }
const style3 = { backgroundColor: 'var(--figma-color-border-brand-strong)' }

  return (
    <Container  space='medium' style={style}>
      <VerticalSpace space='medium' />
      <div>
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
      <div>
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
        <Stack space="small">
            <div >
              <Toggle onChange={function (event: JSX.TargetedEvent<HTMLInputElement>) {
              setToggleValue(event.currentTarget.checked);
            }} value={toggleValue}>
                <Text>{toggleValue ? 'JSON and Images': 'JSON'}</Text>
              </Toggle>
            </div>
            </Stack>
      <VerticalSpace space='large' />
      <Button style={style3} onClick={downloadJSONAndImages}>
      {"Download"}
      </Button>
      <VerticalSpace space='extraLarge' />
      </div>
    </Container>
  )
}

export default render(figmaPlugin)