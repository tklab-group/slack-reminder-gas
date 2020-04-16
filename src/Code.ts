import {getTomorrowEvents} from './modules/google/CalendarReader'
import {StartupReminder} from './modules/slack/StartupReminder'
import {SeminarReminder} from './modules/slack/SeminarReminder'

declare namespace global {
    let dayBeforeRemind : any
    let beforeEventRemind : any
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
    console.log("aaaaaa")
    const events : GoogleAppsScript.Calendar.CalendarEvent[] = getTomorrowEvents(config.calendarId)
    const startupReminder : StartupReminder = new StartupReminder(config.startupPostUrl)
    startupReminder.sendTomorrowRemind(events)

    const seminarReminder : SeminarReminder = new SeminarReminder(config.seminarPostUrl, config.spreadsheetId, config.a1Notion, config.dateIndex, config.speakerIndex)
    seminarReminder.sendTomorrowRemind(events)
}

global.beforeEventRemind = () => {

}
