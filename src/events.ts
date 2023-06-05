import { EventHandler } from "@create-figma-plugin/utilities"
import JSZip from "jszip"
import { saveAs } from 'file-saver'

/*Creation of four different events that inheritate from the EventHandler type*/
/*request signal to get the design title*/
export interface RequestDesignTitle extends EventHandler {
  name: "requestDesignTitle"
  handler: () => void
}

/*response signal that brings the design title*/
export interface ResponseDesignTitle extends EventHandler {
  name: "responseDesignTitle"
  handler: (title: string) => void
}

/*request signal to get the JSON data*/
export interface RequestJSON extends EventHandler {
  name: "requestJSON"
  handler: () => void
}

/*response signal that brings the JSON data*/
export interface ResponseJSON extends EventHandler {
  name: "responseJSON"
  handler: (json: string) => void
}

/*request signal to get the Images data*/
export interface RequestImages extends EventHandler {
  name: "requestImages"
  handler: () => void
}

/*response signal that brings the Images data*/
export interface ResponseImages extends EventHandler {
  name: "responseImages"
 // handler: (bytesBuffer: ArrayBufferLike, imageHash: string) => void
 // @ts-ignore
 handler: (dict: Object) => void
}

/**
 * download function creates an URL containing the data in parameters and downloads it under the provided name
 * @param data The data to write in the file to be downloaded
 * @param filename The name of the file to be downloaded
 */
export function download(data: string, filename: string, defaultFilename: string) {
  /*creates a blob object, which is a file like object of immutable raw data*/
    const blob = new Blob([data], { type: "application/json" })
    /*creates an URL containing the data*/
    const URL = window.URL.createObjectURL(blob)
    /*creates an ancor element*/
    const link = document.createElement("a")
    /*gives to the anchor element's href attribute the URL containing the data*/
    link.href = URL
    /*downloads the link under the filename or by default the document title*/
    link.download = filename || defaultFilename
    /*trigers the click on button event*/
    link.click()
  }


export function downloadImages(dict: Object) {
    const zip = new JSZip
    const folder = zip.folder("Images")

    for (const each in dict){
     // @ts-ignore
      const blob = new Blob([dict[each]], { type: "image/png"  })
      console.log("blob",blob)

    // @ts-ignore
      folder.file(each+".png", blob)
  }
  zip.generateAsync({type:"blob"}).then(function(content) {saveAs(content, "Images.zip")})
    }


    // @ts-ignore
  export async function getChildrenNodeImage({ node, dict }: { node; dict: Object }): Object {
    
    if (node.children === undefined || node.children.length == 0) {
      return dict
    } else { 
      for (const element of node.children){
        if (element.type  === 'RECTANGLE'){
          if(element.fills.type === 'IMAGE'){
          // @ts-ignore
            const paint=element.fills[0]      
            const imageHash = paint.imageHash
            const image = figma.getImageByHash(paint.imageHash)
          // @ts-ignore
            const bytes = await image.getBytesAsync()
            const bytesBuffer = bytes.buffer
          // @ts-ignore
            dict[imageHash]=bytesBuffer
           getChildrenNodeImage({ node: element, dict });
          }
        }  
      }
    }
  }
