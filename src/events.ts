import { EventHandler } from "@create-figma-plugin/utilities"
import JSZip from "jszip"

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

/*request signal to get the JSON and Images data*/
export interface RequestJSONAndImages extends EventHandler {
  name: "requestJSON"
  handler: (jsondropdownValue: string, imagesdropdownValue: string) => void
}

/*response signal that brings the JSON and Images data*/
export interface ResponseJSONAndImages extends EventHandler {
  name: "responseJSON"
  handler: (json: string, images: Object) => void
}

/*Functions to download the JSON and Images data in a zip file*/
  export async function downloadJSONImages(json: string, dict: Object, documentTitle: string | null, toggleValue: Boolean, isdone: Boolean) {
    //Creation of a zip
    const zip = new JSZip

    //If the choice on the UI is JSON and Images => download of json + images  
     if (toggleValue) {

      //Adding of the Images data to the zip
      for (const each in dict){
        // @ts-ignore
        const blob = new Blob([dict[each]], { type: "image/png"  })
        // @ts-ignore
        zip.file(each+".png", blob)
      }

      //Adding of the JSON data to the zip
        const blob = new Blob([json], { type: "application/json" })
        zip.file("EXPORT.json", blob)
        
     } else {
      //Adding of the JSON data to the zip
      const blob = new Blob([json], { type: "application/json" })
      zip.file("EXPORT.json", blob)
     }

      // Zip download
     const blob = await zip.generateAsync({type:"blob"})
     const URL = window.URL.createObjectURL(blob)
     const a = document.createElement("a")
     a.href = URL
     a.download = documentTitle+".zip"
     a.click()
     window.URL.revokeObjectURL(URL)


  }


