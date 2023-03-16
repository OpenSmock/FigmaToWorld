import { emit, on, showUI } from "@create-figma-plugin/utilities"
import { nodeToObject } from "@figma-plugin/helpers"
import { RequestDesignTitle, ResponseDesignTitle, RequestJSON, ResponseJSON,RequestImages, ResponseImages} from "./events"

/**
 * Main function.
 * This  function is the entry point of the plugin.
 */
export default function main() {

  /*on function registers an event handler for the given event name (here RequestDesignTitle). For more info: https://yuanqing.github.io/create-figma-plugin/utilities/*/
  on<RequestDesignTitle>("requestDesignTitle", async function () {
    /*Gets the figma page name*/
    const title = figma.root.name
    /*emit function calls for the event handler of the matching event name in the user interface (here for ResponseDesignTitle*/
    emit<ResponseDesignTitle>("responseDesignTitle", title)
  })

  on<RequestJSON>("requestJSON", async function () { 
    /*Transforms the figma design root node to an object with an assigned key. If not used we only get the id of the root in the JSON file. 
    For more info: https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/blob/5f3a767/src/helpers/nodeToObject.ts#L14
    https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/blob/5f3a767212da804054dbb97e0c39c161c5b03f22/docs/modules/_nodetoobject_.md*/
    const json = nodeToObject(figma.root)
  
    /*JSON.stringify converts the javascript values of the root to a JSON string. Here, '\t' is also inserted before every nested object or array to create indentation*/
    emit<ResponseJSON >("responseJSON", JSON.stringify(json, null, '\t'))
  })

  on<RequestImages>("requestImages", async function () { 
    //const element= figma.currentPage.selection[0]
    const dict= {}
    for (const element of figma.currentPage.selection){
      // @ts-ignore
      console.log("element", element)
      // @ts-ignore
      const paint=element.fills[0]
      // @ts-ignore
      console.log("paint", paint)
    
      const imageHash = paint.imageHash
      // @ts-ignore
      console.log("imageHash", imageHash)
    // @ts-ignore
      const image = figma.getImageByHash(paint.imageHash)
      // @ts-ignore
      console.log("image", image)
    
        // @ts-ignore
      const bytes = await image.getBytesAsync()
      // @ts-ignore
      console.log("bytes", bytes)

      const bytesBuffer = bytes.buffer
      // @ts-ignore
      dict[imageHash]=bytesBuffer
    }
    console.log("dict", dict)

    emit<ResponseImages >("responseImages", dict)
    //emit<ResponseImages >("responseImages", bytesBuffer, imageHash)
  })


  
  /*Figma ShowUI function, enables the rendering of the user interface. For more info: https://www.figma.com/plugin-docs/api/properties/figma-showui/*/
  showUI({ height: 206, width: 600 })
  
}
