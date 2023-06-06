import { EventHandler } from "@create-figma-plugin/utilities"
import JSZip from "jszip"
import { saveAs } from 'file-saver'
import { nodeToObject } from "@figma-plugin/helpers"

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
export interface RequestJSONAndImages extends EventHandler {
  name: "requestJSON"
  handler: (jsondropdownValue: string, imagesdropdownValue: string) => void
}

/*response signal that brings the JSON data*/
export interface ResponseJSONAndImages extends EventHandler {
  name: "responseJSON"
  handler: (json: string, images: Object) => void
}
 
  export function downloadJSONImages(json: string, dict: Object, documentTitle: string | null, toggleValue: Boolean) {
      
      const zip = new JSZip
     //const folder = zip.folder("Images")
      
     if (toggleValue) {
      for (const each in dict){
        // @ts-ignore
         const blob = new Blob([dict[each]], { type: "image/png"  })
       // @ts-ignore
         zip.file(each+".png", blob)
     }
       // @ts-ignore
       const blob = new Blob([json], { type: "application/json" })
     // @ts-ignore
       zip.file("EXPORT.json", blob)
     } else{
      // @ts-ignore
      const blob = new Blob([json], { type: "application/json" })
      // @ts-ignore
        zip.file("EXPORT.json", blob)
     }
      
    
    zip.generateAsync({type:"blob"}).then(function(content) {saveAs(content,documentTitle+".zip")})
      }
