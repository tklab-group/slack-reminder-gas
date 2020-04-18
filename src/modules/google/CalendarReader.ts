export const getTomorrowEvents = (calendarId : string) : GoogleAppsScript.Calendar.CalendarEvent[] => {
    const calendar : GoogleAppsScript.Calendar.Calendar = CalendarApp.getCalendarById(calendarId)
    const tomorrow : Date = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return calendar.getEventsForDay(tomorrow)
}

export const getEventsWithin30Minutes = (calendarId : string) : GoogleAppsScript.Calendar.CalendarEvent[] => {
    const calendar : GoogleAppsScript.Calendar.Calendar = CalendarApp.getCalendarById(calendarId)
    const now : Date = new Date()
    const tenMinutesAfter : Date = new Date(now.getTime() + (30 * 60 * 1000))
    return calendar.getEvents(now, tenMinutesAfter)
}
