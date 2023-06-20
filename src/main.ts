import { emit, on, showUI } from "@create-figma-plugin/utilities"
import { nodeToObject } from "@figma-plugin/helpers"
import { RequestDesignTitle, ResponseDesignTitle, RequestJSONAndImages, ResponseJSONAndImages } from "./events"

/* Main function: plugin's (back-end) entry point */
export default function main() {

  /*On function registers an event handler for the given event name (here RequestDesignTitle).*/
  on<RequestDesignTitle>("requestDesignTitle", async function () {
    /* Retrieves the figma page name*/
    const title = figma.root.name
    /*Emit function calls for the event handler of the matching event name in the user interface (here for ResponseDesignTitle)*/
    emit<ResponseDesignTitle>("responseDesignTitle", title)
  })

  /* Retrieves JSON and images data according to the type selected on the UI  */
  on<RequestJSONAndImages>("requestJSON", async function (jsondropdownValue, imagesdropdownValue) {   
    
    /* Declaration of variables */
    let jsonChoice;
    let imageChoice;
    let json;

    /* If loop that will select which type of node we will begin with depending on the UI's selected type*/
    if (jsondropdownValue === 'Everything') {
      /*If the choice on the UI is "Everything", then, the root of the figma's design will be selected*/
      jsonChoice = figma.root;
      /* JSON.stringify converts the javascript values of the root to a JSON string. 
      Here, '\t' is also inserted before every nested object or array to create indentation */
      json = JSON.stringify(nodeToObject(jsonChoice), null, '\t');

    } else if (jsondropdownValue === 'Selection') {
      /*If the choice on the UI is "Selection", then, the selection on the current page of the figma's design will be selected*/
      jsonChoice= figma.currentPage.selection;
      
      /*If the selection is not empty*/
      if (jsonChoice.length >0){

        json = "["+ JSON.stringify(nodeToObject(jsonChoice[0]), null, '\t');

        for (let i = 1; i < jsonChoice.length; i++){
          json += "," + JSON.stringify(nodeToObject(jsonChoice[i]), null, '\t');
        }
        json += "]"

      } else{
        /*otherwise a warning message will be written*/
        json = "You need to select an element to export !!!"
      }
     
    } else {

      /*If the choice on the UI is "Page", then, the current page of the figma's design will be selected*/
      jsonChoice = figma.currentPage;
      json = JSON.stringify(nodeToObject(jsonChoice), null, '\t');

    }

    /*Same is done but this time with images */
    if (imagesdropdownValue === 'Everything') {
      imageChoice = figma.root;
    } else if (imagesdropdownValue === 'Selection') {
      imageChoice = figma.currentPage.selection;
    } else {
      imageChoice = figma.currentPage;
    }
  
    /*Checks if the node is an image: in Figma, an image is a rectangle node with a fill of type "IMAGE"*/
    // @ts-ignore
    const nodeHasImages = (node) => node.type === 'RECTANGLE' && node.fills.some((fill) => fill.type == 'IMAGE');
    
    /*Declaratin of the array that will store our images*/
    // @ts-ignore
    let imagesNode = []

  /*If our selection is rendered as an array ( a selection of several figma's nodes) */
    if (Array.isArray(imageChoice)) {

      for (const node of imageChoice) {
        if (node.findAll) {
          // @ts-ignore
          imagesNode = imagesNode.concat(node.findAll(nodeHasImages));

        } else if (nodeHasImages(node)) {
          
          imagesNode.push(node);
        }
      }
    } else {
      // @ts-ignore
      imagesNode = imagesNode.concat(figma.root.findAll(nodeHasImages));
    }

  /* Declaration of the dictionary that will store our images */
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
    emit<ResponseJSONAndImages>("responseJSON", json, images)   
  })

  /*Enables the rendering of the user interface held in ui.tsx.*/
  showUI({ height:280, width: 300 })
 
}
