
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.APIModel
{
    public class InvoiceDetails
    {
        public int InvoiceId { get; set; }
        public string InvoiceDescription { get; set; }
        public DateTime InvoiceDate { get; set; }
        public List<ProductInvoice> ProductInvoice { get; set; }
        public decimal Total { get; set; }
        public decimal FreightCharges { get; set; }
        public decimal LoadingCharges { get; set; }
        public decimal NetTotal { get; set; }
    }
}
