import {getTomorrowEvents} from './modules/google/CalendarReader'
import {StartupReminder} from './modules/slack/StartupReminder'

declare namespace global {
    let main: any
}

declare namespace config {
    let startupPostUrl : string
    let seminarPostUrl : string
    let calendarId : string
}
  

global.main = () => {
    const events : GoogleAppsScript.Calendar.CalendarEvent[] = getTomorrowEvents(config.calendarId)
    const startupReminder : StartupReminder = new StartupReminder(config.startupPostUrl)
    startupReminder.sendMessageToSlack(events)
}