import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateInvoice from "./pages/CreateInvoice";
import ViewInvoice from "./pages/ViewInvoice";
import InvoiceList from "./components/InvoiceList";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateInvoice />} />
          <Route path="/view/:id" element={<ViewInvoice />} />
          <Route path="/invoices" element={<InvoiceList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
