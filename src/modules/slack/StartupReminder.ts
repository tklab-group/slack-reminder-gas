import {Reminder} from './Reminder'
import {SlackPayload} from './SlackPayload'
import {makeSlackPayload} from './SlackPayloadFactory'

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

        const slackPayload : SlackPayload = makeSlackPayload(remindEventList, remindRegex)
        UrlFetchApp.fetch(this.slackUrl, {
            'method' : 'post',
            'payload' : JSON.stringify(slackPayload)
        })
    }
}
