# S31. Bonuses & Rewards

[All screens](README.md) · [Module spec](../../modules/31-bonuses-rewards.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s31-01"></a>S31-01 | My rewards | App | `/bonuses-rewards/my-rewards` | Cash bonuses and buffet access earned | Role home | S31-04 Buffet passes |
| <a id="s31-02"></a>S31-02 | Give reward | App, Web | `/bonuses-rewards/give-reward` | Pick people, type (cash or buffet) and reason | S31-03 Rewards list | D31-01 Confirm reward |
| <a id="s31-03"></a>S31-03 | Rewards list | App, Web | `/bonuses-rewards/rewards-list` | Rewards given, by person, department and type | Role home | S31-02 Give reward, S31-05 Reward rules |
| <a id="s31-04"></a>S31-04 | Buffet passes | App, Kiosk | `/bonuses-rewards/buffet-passes` | Staff buffet access passes and their use | S31-01 My rewards | D31-02 Use buffet pass |
| <a id="s31-05"></a>S31-05 | Reward rules | Web | `/bonuses-rewards/reward-rules` | Types, limits and approvals | S31-03 Rewards list | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d31-01"></a>D31-01 | Confirm reward | Confirm reward and who is told | S31-02 Give reward |
| <a id="d31-02"></a>D31-02 | Use buffet pass | Tap card to use a buffet reward | S31-04 Buffet passes |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
