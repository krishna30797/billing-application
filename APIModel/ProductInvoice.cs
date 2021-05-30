using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.APIModel
{
    public class ProductInvoice
    {
        public int ProductInvoiceId { get; set; }
        public int  InvoiceId { get; set; }
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductDescription { get; set; }
        public decimal Price  { get; set; }
        public decimal Quantity { get; set; }
    }
}
