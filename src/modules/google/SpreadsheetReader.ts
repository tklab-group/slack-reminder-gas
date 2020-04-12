export const readSpeaker = (spreadsheetId : string, date : Date, a1Notion : string, dateIndex : number, speakerIndex : number) : string[] => {
    const speakerArr : string[] = []
    const spreadsheet : GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.openById(spreadsheetId)
    // can i write more simple code for ES3?
    const dateStr : string = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0'+date.getDate()).slice(-2)
    const range : GoogleAppsScript.Spreadsheet.Range = spreadsheet.getRange(a1Notion)
    const displayedValueArr : string[][] = range.getDisplayValues()
    for(let row of displayedValueArr){
        if(row[dateIndex].indexOf(dateStr) >= 0){
            speakerArr.push(row[speakerIndex])
        }
    }
    return speakerArr
}