import { Reminder } from "./Reminder"
import { SlackPayload, Field } from "./SlackPayload"
import { makeTomorrowRemindPayload, makeBeforeEventRemindPayload,makeEventTitleField, makeTimeField } from "./SlackPayloadFactory"
import { readSpeaker } from "../google/SpreadsheetReader"

export class SeminarReminder implements Reminder{
    
    static REMIND_REGEX : string = "REMINDER{(.*?)}"
    static SPREADSHEET_REGEX : string = "SPREADSHEET"
    static BEFORE_EVENT_REGEX : string = "BEFORE_REMIND"
    
    slackUrl : string
    spreadsheetId : string
    a1Notion : string
    dateIndexInSpreadsheet : number
    speakerIndexInSpreadsheet : number

    constructor(slackUrl : string, spreadsheetId : string, a1Notion : string, dateIndexInSpreadsheet : number, speakerIndexInSpreadsheet : number){
        this.slackUrl = slackUrl
        this.spreadsheetId = spreadsheetId
        this.a1Notion = a1Notion
        this.dateIndexInSpreadsheet = dateIndexInSpreadsheet
        this.speakerIndexInSpreadsheet = speakerIndexInSpreadsheet
    }

    sendTomorrowRemind(events : GoogleAppsScript.Calendar.CalendarEvent[]) : void {
        const reminderRegex : RegExp = new RegExp(SeminarReminder.REMIND_REGEX, 's')
        const spreadsheetRegex : RegExp = new RegExp(SeminarReminder.SPREADSHEET_REGEX)

        const remindEventArr : GoogleAppsScript.Calendar.CalendarEvent[] = []
        const spreadsheetEventArr : GoogleAppsScript.Calendar.CalendarEvent[] = []

        for(let event of events){
            const eventDetail : string = event.getDescription()
            const remindMatch = reminderRegex.exec(eventDetail)
            if(remindMatch){
                const spreadsheetMatch = spreadsheetRegex.exec(eventDetail)
                if(spreadsheetMatch){
                    spreadsheetEventArr.push(event)
                }else{
                    remindEventArr.push(event)
                }
            }
        }

        if(remindEventArr.length == 0 && spreadsheetEventArr.length == 0){
            return
        }

        const slackPayload : SlackPayload = makeTomorrowRemindPayload(remindEventArr, reminderRegex)
        const addedField : Field[] = this.makeSpreadsheetEventFields(spreadsheetEventArr, reminderRegex)
        slackPayload.attachments[0].fields = slackPayload.attachments[0].fields.concat(addedField)
        UrlFetchApp.fetch(this.slackUrl, {
            'method' : 'post',
            'payload' : JSON.stringify(slackPayload)
        })
    }

    sendBeforeEventRemind(events : GoogleAppsScript.Calendar.CalendarEvent[]) : void{
        const reminderRegex : RegExp = new RegExp(SeminarReminder.REMIND_REGEX, 's')
        const beforeEventRegex : RegExp = new RegExp(SeminarReminder.BEFORE_EVENT_REGEX)

        const remindEventArr : GoogleAppsScript.Calendar.CalendarEvent[] = []
        for(let event of events){
            const eventDetail : string = event.getDescription()
            const remindMatch = reminderRegex.exec(eventDetail)
            const beforeEventMatch = beforeEventRegex.exec(eventDetail)

            if(remindMatch && beforeEventMatch){
                remindEventArr.push(event)
            }
        }

        if(remindEventArr.length == 0){
            return
        }

        const slackPayload : SlackPayload = makeBeforeEventRemindPayload(remindEventArr)
        UrlFetchApp.fetch(this.slackUrl, {
            'method' : 'post',
            'payload' : JSON.stringify(slackPayload)
        })
    }

    /**
     * TODO コードクローン解消
     * @param events 
     * @param reminderRegex 
     */
    makeSpreadsheetEventFields(events : GoogleAppsScript.Calendar.CalendarEvent[], reminderRegex : RegExp) : Field[] {
        const fields : Field[] = []
        
        for(let event of events){
            const eventField : Field = makeEventTitleField(event)
            const timeFiled : Field = makeTimeField(event)
    
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate()+1)
            const speakerArr : string[] = readSpeaker(this.spreadsheetId, tomorrow, this.a1Notion, this.dateIndexInSpreadsheet, this.speakerIndexInSpreadsheet)
            for(let index in speakerArr){
                speakerArr[index] = '<@'+speakerArr[index]+'>'
            }

            const matches : string[] = reminderRegex.exec(event.getDescription())
            const detailField = {
                title : "Detail",
                value : speakerArr.join()+'\n'+matches[1],
                short : false
            }
    
            fields.push(eventField)
            fields.push(timeFiled)
            fields.push(detailField)
        }
        return fields
    }
}