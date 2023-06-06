import { emit, on, showUI } from "@create-figma-plugin/utilities"
import { nodeToObject } from "@figma-plugin/helpers"
import { RequestDesignTitle, ResponseDesignTitle, RequestJSONAndImages, ResponseJSONAndImages} from "./events"
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

  on<RequestJSONAndImages>("requestJSON", async function (jsondropdownValue, imagesdropdownValue) {   
    let jsonChoice;
    let imageChoice;
    let json;

    if (jsondropdownValue === 'Everything') {
      jsonChoice = figma.root;
      json = JSON.stringify(nodeToObject(jsonChoice), null, '\t');
    } else if (jsondropdownValue === 'Selection') {
      jsonChoice= figma.currentPage.selection;
      
      if (jsonChoice.length >0){
        json = JSON.stringify(nodeToObject(jsonChoice[0]), null, '\t');
        for (let i = 1; i < jsonChoice.length; i++){
          json += "," + JSON.stringify(nodeToObject(jsonChoice[i]), null, '\t');}
      } else{
        json = " You need to select an element to export !!!"
      }
     
    } else {
      jsonChoice = figma.currentPage;
      json = JSON.stringify(nodeToObject(jsonChoice), null, '\t');
    }

    console.log("current json choice", jsonChoice)
    if (imagesdropdownValue === 'Everything') {
      imageChoice = figma.root;
    } else if (imagesdropdownValue === 'Selection') {
      imageChoice = figma.currentPage.selection;
    } else {
      imageChoice = figma.currentPage;
    }
    console.log("current image choice", imageChoice)
  
    // @ts-ignore
    const nodeHasImages = (node) => node.type === 'RECTANGLE' && node.fills.some((fill) => fill.type == 'IMAGE');
    //const images= getImages(figma.root);
     // @ts-ignore
    let imagesNode = []

  if (Array.isArray(imageChoice)) {
      for (const node of imageChoice) {
        if (node.findAll) {
          // @ts-ignore
          imagesNode = imagesNode.concat(
            node.findAll(nodeHasImages)
          );
        } else if (nodeHasImages(node)) {
          imagesNode.push(node);
        }
      }
    } else {
      // @ts-ignore
      imagesNode = imagesNode.concat(
        figma.root.findAll(nodeHasImages)
      );
    }

   const images={};
   for (const element of imagesNode){
      // @ts-ignore
      const paint=element.fills[0]
    
      const imageHash = paint.imageHash
    // @ts-ignore
      const image = figma.getImageByHash(paint.imageHash)
        // @ts-ignore
      const bytes = await image.getBytesAsync()
      const bytesBuffer = bytes.buffer
      // @ts-ignore
      images[imageHash]=bytesBuffer
    }
    /*JSON.stringify converts the javascript values of the root to a JSON string. Here, '\t' is also inserted before every nested object or array to create indentation*/
    // @ts-ignore
    emit<ResponseJSON >("responseJSON", json, images)
  })

 
  /*Figma ShowUI function, enables the rendering of the user interface. For more info: https://www.figma.com/plugin-docs/api/properties/figma-showui/*/
  showUI({ height:280, width: 300 })
  
}
