export interface Reminder{
    /**
     * slackのincoming webhook
     */
    slackUrl : string

    /**
     * slackに明日の予定のリマインドを送る
     */
    sendTomorrowRemind(events : GoogleAppsScript.Calendar.CalendarEvent[]) : void
}