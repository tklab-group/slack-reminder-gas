import {Reminder} from './Reminder'
import {SlackPayload} from './SlackPayload'
import {makeTomorrowRemindPayload, makeBeforeEventRemindPayload} from './SlackPayloadFactory'
import {BEFORE_EVENT_REGEX} from '../google/TriggerManager'

// startup seminarとしてのリマインドを管理する
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
            console.log('No event found as a startup seminar')
            return
        }

        const slackPayload : SlackPayload = makeTomorrowRemindPayload(remindEventList, remindRegex)
        console.log('Slack Payload: ', slackPayload)
        
        let res = UrlFetchApp.fetch(this.slackUrl, {
            'method' : 'post',
            'payload' : JSON.stringify(slackPayload)
        })

        console.log('Sent to Slack')
        console.log('Response Status Code: %d', res.getResponseCode)
        console.log('Response Content: %s', res.getContentText('UTF-8'))
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
            console.log('No event found as a startup seminar')
            return
        }

        const slackPayload : SlackPayload = makeBeforeEventRemindPayload(remindEventArr)
        console.log('Slack Payload: ', slackPayload)
        
        let res = UrlFetchApp.fetch(this.slackUrl, {
            'method' : 'post',
            'payload' : JSON.stringify(slackPayload)
        })

        console.log('Sent to Slack')
        console.log('Response Status Code: %d', res.getResponseCode)
        console.log('Response Content: %s', res.getContentText('UTF-8'))
    }
}
