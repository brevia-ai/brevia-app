# Tests Cases

Here we provide a list of tests cases (features to test), whenever big refactors are performed.

Perform all test with integrations:

- Brevia
- BEdita

In the following list (BE) means BEdita integration only.

## Auth and Signup

- Login
- Logout
- Password reset (BE)
- Signup (BE)

## Recaptcha

- Enabled (BE)
- Disabled

## Session

- Change language
- Logout and open an internal link to a page that requires auth

## Dashboard

- View dashboard with no data (collections / features)
- View dashboard with data (collections / features)

## Collections

- Create collection
- Access collection and interact with it (make questions to the AI)
- Update collection (title/description)
- Remove collection

## Files

- List files
- Upload file
- Remove question

## Q&A

- List questions
- Create question
- Update question
- Remove question

## Links

- List links
- Create link
- Remove link

## Document metadata

- Edit metadata in files, Q&A, links

## Features

- Create feature [still not available]
- Access feature of type "Analysis" and interact with it
  - Upload and analyze file PDF
  - Upload and analyze file TXT
  - Upload and analyze file ZIP
- Access feature of type "Summary" and interact with it
  - Upload and analyze file: text summary
  - Upload and analyze file: bullet list summary
  - Upload and analyze file: categorize content
- Access feature of type "Transcription" and interact with it (upload and transcribe file)
  - Upload and transcribe file: mp3, mp4, mpeg, mpga, m4a, wav, and webm
