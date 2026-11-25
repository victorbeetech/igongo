# S56. Feedback, Complaints & Reviews

[All screens](README.md) · [Module spec](../../modules/56-guest-feedback.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s56-01"></a>S56-01 | Feedback inbox | App, Web | `/guest-feedback/feedback-inbox` | Ratings, complaints and reviews from every channel | Role home | S56-02 Feedback detail, S56-05 Online reviews, S56-06 Feedback reports, S56-07 Feedback settings |
| <a id="s56-02"></a>S56-02 | Feedback detail | App, Web | `/guest-feedback/feedback-detail/:id` | The comment, guest, assigned person and replies | S56-01 Feedback inbox, S56-04 Complaints | D56-01 Assign complaint, D56-02 Resolve complaint |
| <a id="s56-03"></a>S56-03 | Give feedback | App, Public | `/guest-feedback/give-feedback` | Guest rates a stay, meal, visit or service | [S62-10 Track order](62-food-ordering.md#s62-10), [S67-07 Booking detail](67-room-bookings.md#s67-07) | Back only |
| <a id="s56-04"></a>S56-04 | Complaints | App, Web | `/guest-feedback/complaints` | Open complaints with target times | Role home | S56-02 Feedback detail |
| <a id="s56-05"></a>S56-05 | Online reviews | Web | `/guest-feedback/online-reviews` | Google and TripAdvisor reviews with replies | Role home, S56-01 Feedback inbox | Back only |
| <a id="s56-06"></a>S56-06 | Feedback reports | Web | `/guest-feedback/feedback-reports` | Scores by outlet, staff and period | Role home, S56-01 Feedback inbox | Back only |
| <a id="s56-07"></a>S56-07 | Feedback settings | Web | `/guest-feedback/feedback-settings` | Which services ask for feedback, and when; Questions per service; What rating counts as a complaint; Who handles complaints per department | S56-01 Feedback inbox | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d56-01"></a>D56-01 | Assign complaint | Pick who handles it and by when | S56-02 Feedback detail |
| <a id="d56-02"></a>D56-02 | Resolve complaint | Outcome, voucher if any and message to guest | S56-02 Feedback detail |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
