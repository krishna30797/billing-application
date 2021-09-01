using BillingApplication.APIModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Model
{
    public class ProductInvoice
    {
        [Key]
        public int ProductInvoiceId { get; set; }
        public int  InvoiceId { get; set; }
        public int ProductId { get; set; }
        public decimal Price  { get; set; }
        public decimal Quantity { get; set; }
        public decimal Nos { get; set; }
        public Units Units { get; set; }
    }
}
