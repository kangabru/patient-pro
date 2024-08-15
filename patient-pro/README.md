# Patient Pro

Care for your patients with cutting-edge technology.

## Setup

Setup Postgres

- Update `/config/database.yml` to customise postgres credentials.
- The default config uses `postgres` for the username and password.
- The default table name is `patient_pro_development`.

Setup rails and node

```bash
cd patient-pro/
bundle install
rake db:setup

cd patient-pro/clients/admin/
npm install
```

Run rails tests

```bash
cd patient-pro/
rails test
```

## Run

Run the Rails server

```bash
cd patient-pro/
rails server
```

Run the Vite server

```bash
cd patient-pro/clients/admin/
npm run dev
```

Open [http://localhost:3001](http://localhost:3001/)

## Features

Try out the following features:

- Open the UI to see the Patients screen.
- Click on a Patient's name to view the record.
- Click 'Edit' to edit the record.
  - You can delete records from here too.
  - Try enter invalid data (such as a bad phone number) to test field validation.
- Click 'Add Patient' to create a new Patient.
- Search patients by first or last name by typing in the search bar and pressing enter.
- Try use the page in mobile view.

Bonus features

- Click the Bell icon to see notifications. These are reset when you refesh the page.
- Have a look at the custom fields.
  - These are: 'Last Visit', 'Appointments', 'Documents', and 'Calls & Emails'.
  - These are generated client-side that act as demo fields.
  - These are intended to simulate how Patients might link to and use other entities.

Inactive Features

- Some buttons and pages are visible but don't actually work. These are intended as ideas for demo purposes.
- These include links on the side bar, the 'Sort' and 'View' buttons, and the 'Quick Actions' in the edit popup.

## Implementation Notes

Prefixed IDs

- One design criteria I had was that I didn't want to expose the primary keys of the Patients model. I like Stripe's approach to IDs (see [Designing APIs for humans](https://dev.to/stripe/designing-apis-for-humans-object-ids-3o5a)) and thought it would be a nice chance to try it out.
- In that blog they referred to the [`prefixed_ids`](https://github.com/excid3/prefixed_ids/) gem to implement something similar. It exposes a UUID that's human readble (like `pat_3ZgpRyOJam` for Patients) without having to setup a UUID primary key or external ID column.
- The gem works great and converts between internal and external IDs seemlessly.
