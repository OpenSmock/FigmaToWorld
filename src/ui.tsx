import { Button, Container, render, Textbox, VerticalSpace, Text } from "@create-figma-plugin/ui"
import { emit, on } from "@create-figma-plugin/utilities"
import { h } from "preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { download, downloadImages, getChildrenNodeImage } from "./events"
import { RequestDesignTitle, ResponseDesignTitle, RequestJSON, ResponseJSON, RequestImages, ResponseImages } from "./events"

/**
 * figmaPlugin function launches the plugin logic.
 * Check https://yuanqing.github.io/create-figma-plugin/recipes/ for more info on how to handle passing data between the plugin and UI.
 * @returns the plugin's UI HTML with according generated events
 */
function figmaPlugin() {
  /*Definition of two states for the document title and the filename to be saved as strings. This allows us to preserve the value between renders. For more info: https://www.geeksforgeeks.org/what-is-usestate-in-react/ and https://beta.reactjs.org/reference/react/useState*/
  const [documentTitle, setDocumentTitle] = useState<string | null>(null)
  const [newFileName, setNewFileName] = useState<string | null>(null)
  
  /*filename and defaut filename declaration*/
  const filename = newFileName || ``
  //const defaultFilename= `${documentTitle}`
  const defaultFilename= `EXPORT`
  
  

  /*By using this Hook, you tell React that your component needs to do something after render. 
  React will remember the function you passed (we’ll refer to it as our “effect”), 
  and call it later after performing the DOM updates. 
  In this effect, we set the document title, but we could also perform data fetching or call some other imperative API.
  For more info: https://reactjs.org/docs/hooks-effect.html*/
  useEffect(() => {
    on<ResponseDesignTitle>(`responseDesignTitle`, (documentTitle) => {
      setDocumentTitle(documentTitle)
    })
    emit<RequestDesignTitle>(`requestDesignTitle`)
  }, [])

  console.log('check',documentTitle)
  /**
 * Returns a memorized version of the callback that only changes if one of the `inputs` has changed.
 */
  const downloadJsonFile = useCallback(() => {
      on<ResponseJSON >("responseJSON", (json: string) => {
        download(json, filename, defaultFilename)
      })
      /*delay to allow the loading state to be set. setTimeout() will execute the given input function after the timer is done.*/
      setTimeout(() => emit<RequestJSON>("requestJSON"), 200)
    },
    [filename, defaultFilename]
  )

  const downloadImage = useCallback(() => {
   // on<ResponseImages >("responseImages", (bytesBuffer: ArrayBufferLike, imageHash: string) => {
    on<ResponseImages >("responseImages", (dict : Object) => {
      //downloadImages(bytesBuffer, imageHash)
      
      downloadImages(dict)
    })
    /*delay to allow the loading state to be set. setTimeout() will execute the given input function after the timer is done.*/
    setTimeout(() => emit<RequestImages>("requestImages"), 200)
  },
  []
)
dict : Map<any, any>

/*Background colors for the plugin UI*/
const style = { backgroundColor: 'var(--figma-color-bg-hover)' }
const style2 = { backgroundColor: 'var(--figma-color-bg-disabled)' }
const style3 = { backgroundColor: 'var(--figma-color-border-brand-strong)' }

  return (
    <Container  space='large' style={style}>
      <VerticalSpace space='medium' />
      <div>
        <Text style={{ marginBottom: 8 }}>Filename to be saved</Text>
        <Textbox style={style2}
          onInput={(e) => setNewFileName(e.currentTarget.value)}
          placeholder='filename.json'
          value={filename}
          variant='border'
        />
      </div>
      <VerticalSpace space='large' />
      <Button style={style3} fullWidth onClick={downloadJsonFile}>
        {"Download your design to JSON"}
      </Button>
      <VerticalSpace space='large' />
      <VerticalSpace space='large' />
      <Button style={style3} fullWidth onClick={downloadImage}>
        {"Download your images"}
      </Button>
      <VerticalSpace space='large' />
      
    </Container>
  )
}

export default render(figmaPlugin)