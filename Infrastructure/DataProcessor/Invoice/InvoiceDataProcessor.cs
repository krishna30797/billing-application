using BillingApplication.APIModel;
using BillingApplication.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Data
{
    public class InvoiceDataProcessor : IInvoiceProcessor
    {
        private readonly ProductInventoryContext _context;

        public InvoiceDataProcessor(ProductInventoryContext context)
        {
            _context = context;
        }
        public bool CreateInvoice(InvoiceDetails invoiceDetails)
        {
            Invoice invoice = new Invoice();
            invoice.ProductInvoice = new List<Model.ProductInvoice>();
            invoice.FreightCharges = invoiceDetails.FreightCharges;
            invoice.LoadingCharges = invoiceDetails.LoadingCharges;
            invoice.InvoiceDescription = invoiceDetails.InvoiceDescription;
            invoice.NetTotal = invoiceDetails.NetTotal;
            invoice.InvoiceDate = invoiceDetails.InvoiceDate;
            foreach (var product in invoiceDetails.ProductInvoice)
            {
                invoice.ProductInvoice.Add(new Model.ProductInvoice
                {
                    ProductId = product.ProductId,
                    Price = product.Price,
                    Quantity = product.Quantity
                });
            }
            _context.Invoice.Add(invoice);
            _context.SaveChanges();
            return true;
        }
        public bool UpdateInvoice(InvoiceDetails invoiceDetails)
        {
            try
            {


                Invoice invoice = _context.Invoice.Where(w => w.InvoiceId == invoiceDetails.InvoiceId).Include(x => x.ProductInvoice).AsNoTracking().FirstOrDefault();
                invoice.InvoiceId = invoiceDetails.InvoiceId;
                invoice.FreightCharges = invoiceDetails.FreightCharges;
                invoice.LoadingCharges = invoiceDetails.LoadingCharges;
                invoice.InvoiceDescription = invoiceDetails.InvoiceDescription;
                invoice.NetTotal = invoiceDetails.NetTotal;
                invoice.InvoiceDate = invoiceDetails.InvoiceDate;
                foreach (var product in invoiceDetails.ProductInvoice)
                {
                    if (invoice.ProductInvoice.Any(p => p.ProductInvoiceId == product.ProductInvoiceId))
                    {
                        invoice.ProductInvoice.FirstOrDefault(p => p.ProductInvoiceId == product.ProductInvoiceId).ProductId = product.ProductId;
                        invoice.ProductInvoice.FirstOrDefault(p => p.ProductInvoiceId == product.ProductInvoiceId).Price = product.Price;
                        invoice.ProductInvoice.FirstOrDefault(p => p.ProductInvoiceId == product.ProductInvoiceId).Quantity = product.Quantity;

                    }
                    else
                    {
                        invoice.ProductInvoice.Add(new Model.ProductInvoice
                        {
                            ProductId = product.ProductId,
                            Price = product.Price,
                            Quantity = product.Quantity
                        });
                    }

                }
                var ProductInvoiceIds = (from productExisting in invoice.ProductInvoice
                                         join productEdited in invoiceDetails.ProductInvoice on productExisting.ProductInvoiceId equals productEdited.ProductInvoiceId
                                        into productIds
                                         from productId in productIds.DefaultIfEmpty()
                                         where productId == null ? true : (productExisting.ProductInvoiceId != productId.ProductInvoiceId)
                                         select productExisting.ProductInvoiceId).ToList();
                if (ProductInvoiceIds.Count > 0)
                {
                    DeleteProductInvoice(ProductInvoiceIds);
                }
                _context.Invoice.Update(invoice);
                _context.SaveChanges();
                return true;
            }
            catch(DbUpdateConcurrencyException ex)
            {
                ex.Entries.Single().Reload();
                _context.SaveChanges();
                return true;
            }
        }

        public int GetNextInvoiceNumber()
        {
            var result = _context.Invoice.OrderByDescending(i => i.InvoiceId).ToList();
            if (result.Count == 0)
                return 1;
            else
                return result.Take(1).FirstOrDefault().InvoiceId + 1;
        }
        public InvoiceDetails GetInvoiceDetailsById(int id)
        {
            InvoiceDetails invoiceDetails = new InvoiceDetails();
            invoiceDetails.ProductInvoice = new List<APIModel.ProductInvoice>();
            Invoice invoiceData = _context.Invoice.Where(w => w.InvoiceId == id).Include(x => x.ProductInvoice).AsNoTracking().FirstOrDefault();
            if (invoiceData != null)
            {
                invoiceDetails.FreightCharges = invoiceData.FreightCharges;
                invoiceDetails.LoadingCharges = invoiceData.LoadingCharges;
                invoiceDetails.InvoiceDescription = invoiceData.InvoiceDescription;
                invoiceDetails.NetTotal = invoiceData.NetTotal;
                invoiceDetails.InvoiceId = invoiceData.InvoiceId;
                invoiceDetails.InvoiceDate = invoiceData.InvoiceDate;
                foreach (var product in invoiceData.ProductInvoice)
                {
                    invoiceDetails.ProductInvoice.Add(new APIModel.ProductInvoice
                    {
                        ProductId = product.ProductId,
                        ProductCode = _context.Product.Where(p => p.id == product.ProductId).FirstOrDefault()?.ProductCode,
                        ProductDescription = _context.Product.Where(p => p.id == product.ProductId).FirstOrDefault()?.ProductDescription,
                        Price = product.Price,
                        Quantity = product.Quantity,
                        ProductInvoiceId = product.ProductInvoiceId,
                        InvoiceId = invoiceData.InvoiceId
                    });
                }
            }

            return invoiceDetails;
        }

        public List<InvoiceDetails> GetAllInvoiceDetails(DateTime fromDate, DateTime toDate)
        {
            List<InvoiceDetails> lstinvoiceDetails = new List<InvoiceDetails>();
            var invoiceData = _context.Invoice.Include(x => x.ProductInvoice).Where(i => i.InvoiceDate.Date >= fromDate.Date && i.InvoiceDate.Date <= toDate.Date).AsNoTracking();
            foreach (var invoice in invoiceData)
            {
                InvoiceDetails invoiceDetails = new InvoiceDetails();
                invoiceDetails.ProductInvoice = new List<APIModel.ProductInvoice>();
                invoiceDetails.FreightCharges = invoice.FreightCharges;
                invoiceDetails.LoadingCharges = invoice.LoadingCharges;
                invoiceDetails.InvoiceDescription = invoice.InvoiceDescription;
                invoiceDetails.NetTotal = invoice.NetTotal;
                invoiceDetails.InvoiceId = invoice.InvoiceId;
                invoiceDetails.InvoiceDate = invoice.InvoiceDate;
                foreach (var product in invoice.ProductInvoice)
                {
                    invoiceDetails.ProductInvoice.Add(new APIModel.ProductInvoice
                    {
                        ProductId = product.ProductId,
                        ProductCode = _context.Product.Where(p => p.id == product.ProductId).FirstOrDefault()?.ProductCode,
                        ProductDescription = _context.Product.Where(p => p.id == product.ProductId).FirstOrDefault()?.ProductDescription,
                        Price = product.Price,
                        Quantity = product.Quantity,
                        ProductInvoiceId = product.ProductInvoiceId,
                        InvoiceId = invoice.InvoiceId
                    });
                }
                lstinvoiceDetails.Add(invoiceDetails);
            }
            return lstinvoiceDetails;
        }
        public bool DeleteInvoice(int id)
        {
            try
            {
                var result = _context.Invoice.Where(i => i.InvoiceId == id).FirstOrDefault();
                _context.Invoice.Remove(result);
                _context.SaveChanges();
                return true;
            }
            catch (Exception e)
            {

                return false;
            }
        }
        private void DeleteProductInvoice(List<int> productInvoiceId)
        {
            foreach (int i in productInvoiceId)
            {
                var productInvoice = _context.ProductInvoice.FirstOrDefault(p => p.ProductInvoiceId == i);
                _context.ProductInvoice.Remove(productInvoice);
                _context.SaveChanges();
            }
        }
    }
}
