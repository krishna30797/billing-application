using BillingApplication.APIModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Data

{
    public class SalesProcessor : ISalesProcessor
    {
        private readonly ProductInventoryContext _context;

        public SalesProcessor(ProductInventoryContext context)
        {
            _context = context;
        }
        public List<Sales> GetSalesByDate(DateTime fromDate, DateTime toDate)
        {
            List<Sales> sales;
            sales = (from invoice in _context.Invoice
                     join productDetail in _context.ProductInvoice on invoice.InvoiceId equals productDetail.InvoiceId
                     where invoice.InvoiceDate.Date >= fromDate.Date && invoice.InvoiceDate.Date <= toDate.Date
                     group productDetail by new { productDetail.ProductId, productDetail.Price } into temp
                     select new
                     {
                         ProductId = temp.Key.ProductId,
                         Price = temp.Key.Price,
                         Quantity = temp.Sum(s => s.Quantity)
                     }
                     into salestemp
                     join product in _context.Product on salestemp.ProductId equals product.id
                     select new Sales
                     {
                         ProductId = salestemp.ProductId,
                         ProductCode = product.ProductCode,
                         ProductDescription = product.ProductDescription,
                         Price = salestemp.Price,
                         Quantity = salestemp.Quantity,
                         TotalSales=Convert.ToDecimal((salestemp.Price * salestemp.Quantity).ToString("F2"))
                     }
                         ).ToList();
            return sales;
        }
    }
}
