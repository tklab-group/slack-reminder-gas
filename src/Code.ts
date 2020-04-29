import {getTomorrowEvents, getEventsWithin10Minutes} from './modules/google/CalendarReader'
import {setBeforeEventTrigger} from './modules/google/TriggerManager'
import {StartupReminder} from './modules/slack/StartupReminder'
import {SeminarReminder} from './modules/slack/SeminarReminder'

declare namespace global {
    let dayBeforeRemind : any
    let beforeEventRemind : any
    let setBeforeRemind: any
}

declare namespace config {
    let startupPostUrl : string
    let seminarPostUrl : string
    let calendarId : string
    let spreadsheetId : string
    let a1Notion : string
    let dateIndex : number
    let speakerIndex : number
}
  

global.dayBeforeRemind = () => {
    const events : GoogleAppsScript.Calendar.CalendarEvent[] = getTomorrowEvents(config.calendarId)
    if(events.length == 0){
        return
    }    

    const startupReminder : StartupReminder = new StartupReminder(config.startupPostUrl)
    startupReminder.sendTomorrowRemind(events)

    const seminarReminder : SeminarReminder = new SeminarReminder(config.seminarPostUrl, config.spreadsheetId, config.a1Notion, config.dateIndex, config.speakerIndex)
    seminarReminder.sendTomorrowRemind(events)
}

global.beforeEventRemind = () => {
    const events : GoogleAppsScript.Calendar.CalendarEvent[] = getEventsWithin10Minutes(config.calendarId)
    if(events.length == 0){
        return
    }
    const startupReminder : StartupReminder = new StartupReminder(config.startupPostUrl)
    startupReminder.sendBeforeEventRemind(events)

    const seminarReminder : SeminarReminder = new SeminarReminder(config.seminarPostUrl, config.spreadsheetId, config.a1Notion, config.dateIndex, config.speakerIndex)
    seminarReminder.sendBeforeEventRemind(events)
}

global.setBeforeRemind = () => {
    const events : GoogleAppsScript.Calendar.CalendarEvent[] = getTomorrowEvents(config.calendarId)
    if(events.length == 0){
        return
    }
    setBeforeEventTrigger(events)
}
