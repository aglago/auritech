# InvoiceHub

InvoiceHub is a full-stack web application for creating, managing, and tracking invoices. It's designed to streamline the invoicing process for businesses of all sizes.

## Features

- Easy invoice creation with an intuitive interface
- View and manage all invoices
- Save drafts for later completion
- Generate PDF invoices
- Responsive design for desktop and mobile use

## Tech Stack

- Frontend: React, React Router, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- PDF Generation: PDFKit

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/aglago/invoice-hub.git
   cd invoice-hub
   ```

2. Install dependencies for both frontend and backend:
   ```
   cd client && npm install
   cd ../server && npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```
   cd server && npm run server
   ```

5. In a new terminal, start the client:
   ```
   cd client && npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating an Invoice

1. Click on "Create Invoice" in the navigation menu
2. Fill in the invoice details, including seller and buyer information
3. Add line items to the invoice
4. Click "Generate Invoice" to create and save the invoice

### Viewing Invoices

1. Click on "View All Invoices" in the navigation menu
2. Browse through the list of created invoices
3. Click on an invoice to view its details or generate a PDF

### Saving Drafts

1. While creating an invoice, click "Save as Draft" to save your progress
2. Access saved drafts from the drafts section

## API Endpoints

- `POST /api/invoices`: Create a new invoice
- `GET /api/invoices`: Get all invoices
- `GET /api/invoices/:id`: Get a specific invoice
- `PUT /api/invoices/:id`: Update an invoice
- `DELETE /api/invoices/:id`: Delete an invoice
- `GET /api/invoices/:id/pdf`: Generate PDF for an invoice

Similar endpoints are available for draft management under `/api/drafts`.

## Contributing

This is a task given to me by AuriTech for a job application! Suggestions are welcome.

## License

This project is licensed under the MIT License.