# TODO for Blog Image Upload Feature

## Backend Changes
- [x] Install Multer package for file uploads
- [x] Create 'uploads' folder in Backend directory
- [x] Update blogrouter.js to handle multipart/form-data in /create route
- [x] Modify /create route to save uploaded image to 'uploads' folder and store path in DB, or use provided URL if no file uploaded

## Frontend Changes
- [x] Update Write.jsx to send FormData instead of JSON, including file if uploaded
- [x] Ensure image field accepts both uploaded files and URLs

## Testing
- [x] Test creating a blog with uploaded image (skipped by user)
- [x] Test creating a blog with online URL (skipped by user)
- [x] Verify images are served correctly (may need to add static route for uploads) (static route added)

## Followup
- [x] Run the app and verify functionality
