import axios from "axios";

const API_URL = "https://auritech.onrender.com/api";

export const createInvoice = (invoiceData) => {
  return axios.post(`${API_URL}/invoices`, invoiceData);
};

export const getInvoices = () => {
  return axios.get(`${API_URL}/invoices`);
};

export const getInvoice = (id) => {
  return axios.get(`${API_URL}/invoices/${id}`);
};

export const updateInvoice = (id, invoiceData) => {
  return axios.put(`${API_URL}/invoices/${id}`, invoiceData);
};

export const deleteInvoice = (id) => {
  return axios.delete(`${API_URL}/invoices/${id}`);
};

export const getInvoicePDF = (id) => {
  return axios.get(`${API_URL}/invoices/${id}?format=pdf`, {
    responseType: "blob",
  });
};

export const saveDraft = (draftData) => {
  return axios.post(`${API_URL}/drafts`, draftData);
};


export const getDrafts = () => {
  return axios.get(`${API_URL}/drafts`);
};

export const getDraft = (id) => {
  return axios.get(`${API_URL}/drafts/${id}`);
};

export const updateDraft = (id, draftData) => {
  return axios.put(`${API_URL}/drafts/${id}`, draftData);
};

export const deleteDraft = (id) => {
  return axios.delete(`${API_URL}/drafts/${id}`);
};
