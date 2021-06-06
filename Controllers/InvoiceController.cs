using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BillingApplication.Model;
using BillingApplication.Data;
using BillingApplication.APIModel;

namespace BillingApplication.Controllers
{
    public class InvoiceController : ControllerBase
    {
        private readonly ProductInventoryContext _context;
        private readonly IInvoiceProcessor _invoiceDataProcessor;
        public InvoiceController(ProductInventoryContext context, IInvoiceProcessor invoiceDataProcessor)
        {
            _context = context;
            _invoiceDataProcessor = invoiceDataProcessor;
        }

        // GET: Invoice
        public List<InvoiceDetails> GetAllInvoiceDetails(DateTime fromDate, DateTime toDate)
        {
            try
            {
                return _invoiceDataProcessor.GetAllInvoiceDetails(fromDate,toDate);
            }
            catch(Exception e)
            {
                throw e;
            }
        }

        // GET: Invoice/Details/5
        public InvoiceDetails GetInvoiceById(int id)
        {
            try
            {
                var invoice = _invoiceDataProcessor.GetInvoiceDetailsById(id);
                return invoice;
            }
            catch (Exception e)
            {
                throw e;
            }
;
        }

        [HttpPost]
        public bool CreateInvoice([FromBody] InvoiceDetails invoice)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = _invoiceDataProcessor.CreateInvoice(invoice);
                    return result;
                }
                else{
                    return false;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        [HttpPost]
        public bool EditInvoice([FromBody] InvoiceDetails invoice)
        {

            if (ModelState.IsValid)
            {
                try
                {
                   return _invoiceDataProcessor.UpdateInvoice(invoice);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
               
            }
            return false;
        }

        // POST: Invoice/Delete/5
        [HttpDelete]
        public bool DeleteInvoice(int id)
        {
            var result = _invoiceDataProcessor.DeleteInvoice(id);
            return result;
        }

        private bool InvoiceExists(int id)
        {
            return _context.Invoice.Any(e => e.InvoiceId == id);
        }
        [HttpGet]
        public int GetNextInvoiceNumber()
        {
            return _invoiceDataProcessor.GetNextInvoiceNumber();
        }
    }
}
