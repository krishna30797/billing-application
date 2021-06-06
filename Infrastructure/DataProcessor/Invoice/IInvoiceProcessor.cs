using BillingApplication.APIModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Data
{
    public interface IInvoiceProcessor
    {
        public bool CreateInvoice(InvoiceDetails invoiceDetails);
        public bool UpdateInvoice(InvoiceDetails invoiceDetails);
        public bool DeleteInvoice(int id);
        public InvoiceDetails GetInvoiceDetailsById(int id);
        public List<InvoiceDetails> GetAllInvoiceDetails(DateTime fromDate, DateTime toDate);
        public int GetNextInvoiceNumber();
    }
}
