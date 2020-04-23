import {Reminder} from './Reminder'
import {SlackPayload} from './SlackPayload'
import {makeTomorrowRemindPayload, makeBeforeEventRemindPayload} from './SlackPayloadFactory'
import {BEFORE_EVENT_REGEX} from '../google/TriggerManager'

export class StartupReminder implements Reminder {
    
    static REMIND_REGEX : string = "STARTUP{(.*?)}"

    slackUrl : string

    constructor(slackUrl : string){
        this.slackUrl = slackUrl
    }
    
    sendTomorrowRemind(events : GoogleAppsScript.Calendar.CalendarEvent[]) : void {
        const remindRegex : RegExp = new RegExp(StartupReminder.REMIND_REGEX, 's')
        const remindEventList : GoogleAppsScript.Calendar.CalendarEvent[] = []
        for(let event of events){
            const eventDetail : string = event.getDescription()
            const match = remindRegex.exec(eventDetail)
            if(!match){
                continue
            }
            remindEventList.push(event)
        }

        if(remindEventList.length == 0){
            return
        }

        const slackPayload : SlackPayload = makeTomorrowRemindPayload(remindEventList, remindRegex)
        UrlFetchApp.fetch(this.slackUrl, {
            'method' : 'post',
            'payload' : JSON.stringify(slackPayload)
        })
    }

    sendBeforeEventRemind(events : GoogleAppsScript.Calendar.CalendarEvent[]) : void {
        const reminderRegex : RegExp = new RegExp(StartupReminder.REMIND_REGEX, 's')
        const beforeEventRegex : RegExp = new RegExp(BEFORE_EVENT_REGEX)

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
}
