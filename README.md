# Shelf Life LIMS

Shelf Life LIMS is a Laboratory Information Management System designed to manage inventory, experiments, and historical data efficiently. The application is built using React, Electron, and Mongoose (MongoDB).

## Core Features

### Inventory Management

- **Add to Inventory**
  - Modal to add new items with fields for Name, Category, Sub-category, Cost of Purchase, Quantity, Current Worth, and Condition.
  
- **Edit Item**
  - Functionality to edit item details and current worth.

- **Delete Item**
  - Restricted to admin users.

### Categories Management

- **Create Category**
  - Admin-only functionality.
  
- **Create Sub-category**
  - Users can create sub-categories linked to existing categories.

### Search Functionality

- Search box to filter items by selected categories or the entire inventory if "All" is selected.

### Experiment Management

- **Add Experiment**
  - Modal with an "Apparatus" field to select items from inventory.

- **Checkout Button**
  - Modal for checking out items with fields for Name of Student/Staff and Matric No/Staff No.
  - List of items with checkboxes for selection and an "All" option.
  - Status buttons for return status ("Returned", "Partial-Return", "Not Returned").
  - Edit icon to modify experiment details.

### History Page

- Records actions related to inventory management, accessible via filters for User, Item Name, Start Date, and End Date.

### Admin Page

- Approve sign-up requests.
- Create categories.
- Archive damaged items and view archived items.
- User menu with logout option.
- Confirmation modals for critical actions.
- Success messages for completed actions.

## Installation

1. Clone the repository.
   ```sh
   git clone https://github.com/yourusername/shelf-life-lims.git
2. Install dependencies.
cd shelf-life-lims
### npm install
3. Run the application.
npm start

## Technologies Used
- React: Frontend library for building the user interface.
- Electron: Framework for building cross-platform desktop apps with JavaScript, HTML, and CSS.
- Mongoose (MongoDB): Object Data Modeling (ODM) library for MongoDB and Node.js.

## Contributing
We welcome contributions to enhance Shelf Life LIMS. Please follow these steps to contribute:
- Fork the repository.
- Create a new branch

### git checkout -b feature-branch
- Make your changes.
- Commit your changes.

### git commit -m 'Add some feature'
Push to the branch.

### git push origin feature-branch
Open a pull request.
