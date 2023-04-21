import { SeminarReminder } from "../../../src/modules/slack/SeminarReminder"

describe('SeminarReminder.matchRemainderRegex', () => {
    it('simple', () => {
        expect(SeminarReminder.matchReminderRegex('REMINDER{a}')).toBe(true)
    })
    it('basic', () => {
        expect(SeminarReminder.matchReminderRegex(`REMINDER{
            @m2
            @m1
            @tkobaya
            }`)).toBe(true)
        expect(SeminarReminder.matchReminderRegex(`REMINDER{
            @m2
            @m1
            @tkobaya
            }
            BEFORE_REMIND`)).toBe(true)
    })
    it('with BEFORE_REMIND', () => {
        expect(SeminarReminder.matchReminderRegex(`REMINDER{
            @m2
            @m1
            @tkobaya
            }
            BEFORE_REMIND`)).toBe(true)
    })
})