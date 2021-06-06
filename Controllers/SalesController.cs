using BillingApplication.APIModel;
using BillingApplication.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillingApplication.Controllers
{
    public class SalesController : ControllerBase
    {
        private readonly ProductInventoryContext _context;
        private readonly ISalesProcessor _salesProcessor;
        public SalesController(ProductInventoryContext context, ISalesProcessor salesProcessor)
        {
            _context = context;
            _salesProcessor = salesProcessor;
        }
        [HttpGet]
        public List<Sales> GetSalesByDate(DateTime fromDate, DateTime toDate)
        {
            try
            {
                return _salesProcessor.GetSalesByDate(fromDate,toDate);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
