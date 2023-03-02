import { emit, on, showUI } from "@create-figma-plugin/utilities"
import { nodeToObject } from "@figma-plugin/helpers"
import { RequestDesignTitle, ResponseDesignTitle, RequestJSON, ResponseJSON } from "./events"

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
    For more info: https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/blob/5f3a767/src/helpers/nodeToObject.ts#L14*/
    const json = nodeToObject(figma.root)
    /*JSON.stringify converts the javascript values of the root to a JSON string. Here, '\t' is also inserted before every nested object or array to create indentation*/
    emit<ResponseJSON >("responseJSON", JSON.stringify(json, null, '\t'))
  })

  
  /*Figma ShowUI function, enables the rendering of the user interface. For more info: https://www.figma.com/plugin-docs/api/properties/figma-showui/*/
  showUI({ height: 132, width: 400 })
  
}
