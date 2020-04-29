export const getTomorrowEvents = (calendarId : string) : GoogleAppsScript.Calendar.CalendarEvent[] => {
    const calendar : GoogleAppsScript.Calendar.Calendar = CalendarApp.getCalendarById(calendarId)
    const tomorrow : Date = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return calendar.getEventsForDay(tomorrow)
}

export const getEventsWithin10Minutes = (calendarId : string) : GoogleAppsScript.Calendar.CalendarEvent[] => {
    const calendar : GoogleAppsScript.Calendar.Calendar = CalendarApp.getCalendarById(calendarId)
    const now : Date = new Date()
    const tenMinutesAfter : Date = new Date(now.getTime() + (10 * 60 * 1000))
    const eventArr : GoogleAppsScript.Calendar.CalendarEvent[] =  calendar.getEvents(now, tenMinutesAfter)

    const returnEventArr : GoogleAppsScript.Calendar.CalendarEvent[] = []

    for(let event of eventArr){
        if(now < event.getStartTime() && event.getStartTime() <= tenMinutesAfter){
            returnEventArr.push(event)
        }
    }

    return returnEventArr
}
