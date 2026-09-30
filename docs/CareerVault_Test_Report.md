# CareerVault - Test Report

## 1. Testing Overview

This report documents the testing performed for the CareerVault project, with focus on Analytics, Notifications, and the final integration testing completed by Member 6.

## 2. Analytics Testing

| Test Case                  | Expected Result                        | Actual Result                                              | Status |
| -------------------------- | -------------------------------------- | ---------------------------------------------------------- | ------ |
| Open Analytics page        | Analytics page should load             | Analytics page loaded successfully                         | PASS   |
| Display profile status     | Profile status should be displayed     | Profile displayed as Completed                             | PASS   |
| Display total skills       | Total skills should be displayed       | 3 skills displayed                                         | PASS   |
| Display total applications | Total applications should be displayed | 1 application displayed                                    | PASS   |
| Display total questions    | Total questions should be displayed    | 10 questions displayed                                     | PASS   |
| Display application status | Application counts should be displayed | Applied, Interview, Selected and Rejected counts displayed | PASS   |

## 3. Notification Backend Testing

| Test Case                 | Expected Result                         | Actual Result                      | Status |
| ------------------------- | --------------------------------------- | ---------------------------------- | ------ |
| Create notification       | Notification should be created          | Notification created successfully  | PASS   |
| Get notifications         | Notifications should be returned        | Notification returned successfully | PASS   |
| Get unread count          | Correct unread count should be returned | Unread count returned correctly    | PASS   |
| Mark notification as read | Notification should change to read      | `isRead` changed to `True`         | PASS   |
| Delete notification       | Notification should be deleted          | Notification deleted successfully  | PASS   |

## 4. Notification Frontend Testing

| Test Case                  | Expected Result                         | Actual Result                           | Status |
| -------------------------- | --------------------------------------- | --------------------------------------- | ------ |
| Open Notifications page    | Notifications page should load          | Page loaded successfully                | PASS   |
| Display notification       | Created notification should appear      | Notification appeared in the UI         | PASS   |
| Display unread count       | Unread count should be displayed        | `1 unread` displayed                    | PASS   |
| Mark as Read button        | Button should mark notification as read | Status changed to Read                  | PASS   |
| Unread count after reading | Unread count should decrease            | Unread count disappeared                | PASS   |
| Delete notification        | Notification should be removed          | Notification disappeared                | PASS   |
| Empty notification state   | Empty list should show a message        | `No notifications available.` displayed | PASS   |

## 5. Integration Testing

The notification system was tested from backend to frontend.

The following flow was verified:

```text
PowerShell/API
      ↓
Express Backend
      ↓
MongoDB
      ↓
Notification API
      ↓
React Frontend
      ↓
Notification displayed
```

The complete notification flow worked successfully.

## 6. Analytics and Notification Result

### Analytics

* Analytics API responded successfully.
* Analytics page displayed career statistics.
* Application status counts were displayed correctly.

### Notifications

* Notifications can be created.
* Notifications can be viewed.
* Unread notification count works.
* Notifications can be marked as read.
* Notifications can be deleted.
* React frontend correctly displays notification data.

## 7. Final Testing Status

| Module                | Status |
| --------------------- | ------ |
| Analytics Backend     | PASS   |
| Analytics Frontend    | PASS   |
| Notification Backend  | PASS   |
| Notification API      | PASS   |
| Notification Frontend | PASS   |
| Mark as Read          | PASS   |
| Delete Notification   | PASS   |
| Integration Testing   | PASS   |

## 8. Conclusion

The Analytics and Notification modules assigned to Member 6 were implemented and tested successfully. The notification system was verified through both API testing and browser-based frontend testing. The tested features performed as expected.
