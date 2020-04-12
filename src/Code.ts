import {getTomorrowEvents} from './modules/google/CalendarReader'
import {StartupReminder} from './modules/slack/StartupReminder'
import {SeminarReminder} from './modules/slack/SeminarReminder'

declare namespace global {
    let main: any
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
  

global.main = () => {
    const events : GoogleAppsScript.Calendar.CalendarEvent[] = getTomorrowEvents(config.calendarId)
    const startupReminder : StartupReminder = new StartupReminder(config.startupPostUrl)
    startupReminder.sendMessageToSlack(events)

    const seminarReminder : SeminarReminder = new SeminarReminder(config.seminarPostUrl, config.spreadsheetId, config.a1Notion, config.dateIndex, config.speakerIndex)
    seminarReminder.sendMessageToSlack(events)
}