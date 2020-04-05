export const getTomorrowEvents = (calendarId : string) : GoogleAppsScript.Calendar.CalendarEvent[] => {
    const calendar : GoogleAppsScript.Calendar.Calendar = CalendarApp.getCalendarById(calendarId)
    const tomorrow : Date = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return calendar.getEventsForDay(tomorrow)
}