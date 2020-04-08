export interface Reminder{
    /**
     * slackのincoming webhook
     */
    slackUrl : string

    /**
     * slackにリマインドを送る
     */
    sendMessageToSlack(events : GoogleAppsScript.Calendar.CalendarEvent[]) : void
}